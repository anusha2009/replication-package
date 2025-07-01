import requests

def query_openwebui(prompt, schema_type, model="llama3.1:8b"):
    api_url = "https://nebula.cs.vu.nl/api/chat/completions"
    
    headers = {
        'Authorization': f'Bearer {'sk-3a943a51b6b944f9865bab3634bf2cf8'}',
        'Content-Type': 'application/json'
    }

    if schema_type == "qa":
        schema = {
            "quality_attributes": [
                {
                    "quality_attribute": "string",
                    "description": "string",
                    "stimulus": "string",
                    "stimulus_source": "string",
                    "response": "string",
                    "response_measure": "string",
                    "environment": "string",
                    "artifact": "string",
                    "sustainability_dimension": ["string"]
                }
            ]
        }
    elif schema_type == "add":
        schema = {
            "design_decisions": [
                {
                    "decision": "string",
                    "rationale": "string",
                    "design_rule": "string",
                    "constraint": "string",
                    "impacted_quality_attributes": ["string"],
                    "description": "string"
                }
            ]
        }
    else:
        raise ValueError("Unknown schema_type")

    payload = {
        "messages": [
            {"role": "user", "content": prompt}
        ],
        "model": model,
        "stream": False,
        "response_format": {
            "type": "json_schema",
            "json_schema": schema
        }
    }

    try:
        response = requests.post(api_url, headers=headers, json=payload)
        response.raise_for_status()
        return response.json()['choices'][0]['message']['content']
    except Exception as e:
        return f"[LLM ERROR]: {e}"
