from modules.prompts import qa_extraction_prompt
from modules.llm_client import query_openwebui
from modules.query_engine import retrieve_relevant_chunks, construct_prompt
from modules.storage import save_quality_attributes
from modules.embeddings import embed_text
import re
import json

def extract_quality_attributes() -> dict:
    context_chunks = retrieve_relevant_chunks("quality attributes, requirements")
    prompt = qa_extraction_prompt.format()
    full_prompt = construct_prompt(prompt, context_chunks)
    response = query_openwebui(full_prompt, "qa")
    try:
        match = re.search(r"\[\s*{.*?}\s*\]", response, re.DOTALL)
        if not match:
            raise ValueError("No valid JSON array found in response")

        json_str = match.group(0)
        attributes = json_str

        save_quality_attributes(attributes)
        return attributes

    except Exception as e:
        return {"error": str(e), "raw_response": response, "json": attributes}