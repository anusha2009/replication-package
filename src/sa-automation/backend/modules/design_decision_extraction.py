from modules.prompts import design_decision_extraction_prompt
from modules.llm_client import query_openwebui
from modules.query_engine import retrieve_relevant_chunks, construct_prompt
from modules.storage import save_design_decisions
import json
import re

def extract_design_decisions() -> list[str]:
    context_chunks = retrieve_relevant_chunks("architecture, design decisions, decisions")
    prompt = design_decision_extraction_prompt.format()
    full_prompt = construct_prompt(prompt, context_chunks)
    response = query_openwebui(full_prompt, "add")
    try:
        match = re.search(r"\[\s*{.*?}\s*\]", response, re.DOTALL)
        if not match:
            raise ValueError("No valid JSON array found in response")

        json_str = match.group(0)
        attributes = json_str

        save_design_decisions(attributes)
        return attributes

    except Exception as e:
        return {"error": str(e), "raw_response": response}

