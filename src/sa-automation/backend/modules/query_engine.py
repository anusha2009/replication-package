from sentence_transformers import SentenceTransformer
import chromadb

embedding_model = SentenceTransformer("BAAI/bge-small-en-v1.5")
chroma_client = chromadb.PersistentClient(path="./chromadb_store")
collection = chroma_client.get_or_create_collection(name="sa_chunks")

def retrieve_relevant_chunks(user_query, top_k=5):
    query_embedding = embedding_model.encode(user_query).tolist()

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k,
        include=["documents", "metadatas"]
    )

    retrieved_chunks = []
    for doc, meta in zip(results["documents"][0], results["metadatas"][0]):
        retrieved_chunks.append({"text": doc, "metadata": meta})

    return retrieved_chunks

def construct_prompt(task_instruction, context_chunks):
    context = "\n\n".join([f"[Chunk {i+1}]\n{c['text']}" for i, c in enumerate(context_chunks)])

    prompt = f"""You are a software architecture evaluation assistant helping assess sustainability.

                Task: {task_instruction}

                You are given the following document chunks:
                {context}

                Based on the task and the above context, provide your structured response below.

                """
    return prompt

