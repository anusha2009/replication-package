from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import os
import uuid
import json
from modules.ingestion import parse_document, semantic_chunk_text
from modules.embeddings import embed_text
from modules.storage import store_chunk, list_all_chunks, get_validated_quality_attributes, save_validated_quality_attributes, get_validated_design_decisions, save_validated_design_decisions
from modules.query_engine import retrieve_relevant_chunks, construct_prompt
from modules.llm_client import query_openwebui
from modules.qa_extraction import extract_quality_attributes
from modules.design_decision_extraction import extract_design_decisions

app = Flask(__name__)

@app.route("/sis/calculate", methods=["POST"])
def calculate_sis():
    input_data = request.get_json()
    try:
        scores = {}
        for option, directions in input_data['dmatrices'].items():
            total_score = 0
            for direction, matrix in directions.items():
                for src_qa, targets in matrix.items():
                    for tgt_qa, impact in targets.items():
                        if impact == "-" or tgt_qa not in input_data['priorities']:
                            continue
                        try:
                            impact_val = int(impact)
                            weight = input_data['priorities'][tgt_qa]
                            total_score += impact_val * weight
                        except ValueError:
                            continue
            scores[option] = total_score
        return jsonify({"sis_scores": scores})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/upload/", methods=["POST"])
def upload_document():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    filename = secure_filename(file.filename)
    save_path = os.path.join("uploaded_docs", filename)
    file.save(save_path)

    text = parse_document(save_path)
    chunks = semantic_chunk_text(text)

    for idx, chunk in enumerate(chunks):
        embedding = embed_text(chunk)
        metadata = {"chunk_id": str(uuid.uuid4()), "source_doc": filename, "chunk_idx": idx}
        store_chunk(chunk, embedding, metadata)

    return jsonify({"message": f"{filename} parsed and stored", "chunks": len(chunks)})

@app.route("/list-chunks", methods=["GET"])
def list_chunks():
    return jsonify(list_all_chunks())

@app.route("/qa/extract", methods=["POST"])
def extract_qa_endpoint():
    return jsonify({"quality_attributes": extract_quality_attributes()})

@app.route("/design/extract", methods=["POST"])
def extract_design_decision_endpoint():
    return jsonify({"design_decisions": extract_design_decisions()})

@app.route("/qa/validated", methods=["GET"])
def fetch_validated_quality_attributes():
    try:
        data = get_validated_quality_attributes()
        return jsonify(json.loads(data))
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/qa/validated", methods=["POST"])
def update_validated_quality_attributes():
    try:
        payload = request.get_json()
        save_validated_quality_attributes(json.dumps(payload, indent=2))
        return jsonify({"status": "success"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/design-decisions/validated", methods=["GET"])
def fetch_validated_design_decisions():
    try:
        data = get_validated_design_decisions()
        return jsonify(json.loads(data))
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/design-decisions/validated", methods=["POST"])
def update_validated_design_decisions():
    try:
        payload = request.get_json()
        save_validated_design_decisions(json.dumps(payload, indent=2))
        return jsonify({"status": "success"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
