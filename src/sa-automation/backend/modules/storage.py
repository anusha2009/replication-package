import chromadb
import os
import json

QA_FILE = os.path.join("data", "qa_data.json")
DESIGN_DECISIONS_FILE = "data/design_decisions.json"

chroma_client = chromadb.PersistentClient(path="./chromadb_store")

collection = chroma_client.get_or_create_collection(name="sa_chunks")

def store_chunk(chunk_text, embedding, metadata):
    chunk_id = metadata["chunk_id"]
    collection.add(
        documents=[chunk_text],
        embeddings=[embedding],
        metadatas=[metadata],
        ids=[chunk_id]
    )

def list_all_chunks():
    results = collection.get(include=["metadatas", "documents"], limit=1000)
    return [
        {
            "chunk_id": id,
            "metadata": metadata,
            "text": doc
        }
        for id, metadata, doc in zip(results["ids"], results["metadatas"], results["documents"])
    ]

def save_quality_attributes(attributes: str):
    os.makedirs("data", exist_ok=True)

    if os.path.exists(QA_FILE):
        with open(QA_FILE, "r") as f:
            try:
                data = json.load(f)
            except json.JSONDecodeError:
                data = []
    else:
        data = []

    try:
        data_new = json.loads(attributes)
    except json.JSONDecodeError as e:
        print("Failed to parse attributes:", e)
        return

    if not isinstance(data_new, list):
        print("Parsed attributes are not a list.")
        return

    data.extend(data_new)

    with open(QA_FILE, "w") as f:
        json.dump(data, f, indent=2)

def save_design_decisions(attributes: str):
    os.makedirs("data", exist_ok=True)

    if os.path.exists(DESIGN_DECISIONS_FILE):
        with open(DESIGN_DECISIONS_FILE, "r") as f:
            try:
                data = json.load(f)
            except json.JSONDecodeError:
                data = []
    else:
        data = []

    try:
        data_new = json.loads(attributes)
    except json.JSONDecodeError as e:
        print("Failed to parse attributes:", e)
        return

    if not isinstance(data_new, list):
        print("Parsed attributes are not a list.")
        return

    data.extend(data_new)

    with open(DESIGN_DECISIONS_FILE, "w") as f:
        json.dump(data, f, indent=2)

def save_validated_quality_attributes(qa_data: str):
    with open(QA_FILE, "w", encoding="utf-8") as f:
        f.write(qa_data)

def get_validated_quality_attributes() -> str:
    if not os.path.exists(QA_FILE):
        return "[]"
    with open(QA_FILE, "r", encoding="utf-8") as f:
        return f.read()

def save_validated_design_decisions(design_decisions: str):
    with open(DESIGN_DECISIONS_FILE, "w", encoding="utf-8") as f:
        f.write(design_decisions)

def get_validated_design_decisions() -> str:
    if not os.path.exists(DESIGN_DECISIONS_FILE):
        return "[]"
    with open(DESIGN_DECISIONS_FILE, "r", encoding="utf-8") as f:
        return f.read()