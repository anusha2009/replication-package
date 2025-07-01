from sentence_transformers import SentenceTransformer

embedder = SentenceTransformer("BAAI/bge-small-en-v1.5") 

def embed_text(text_chunk: str):
    return embedder.encode(text_chunk).tolist()
