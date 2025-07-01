import fitz
import docx
import pytesseract
from PIL import Image
import io
import re

def parse_pdf(file_path):
    doc = fitz.open(file_path)
    text = ""
    for page in doc:
        text += page.get_text()
        for img in page.get_images():
            base_image = doc.extract_image(img[0])
            image_bytes = base_image["image"]
            image = Image.open(io.BytesIO(image_bytes))
            text += pytesseract.image_to_string(image)
    return text

def parse_docx(file_path):
    doc = docx.Document(file_path)
    return "\n".join([para.text for para in doc.paragraphs])

def parse_document(file_path):
    if file_path.endswith(".pdf"):
        return parse_pdf(file_path)
    elif file_path.endswith(".docx"):
        return parse_docx(file_path)
    else:
        raise Exception("Unsupported file type")

def semantic_chunk_text(text, max_words=200):
    chunks = []
    current_chunk = []

    def word_count(s):
        return len(s.split())

    parts = re.split(r'(\n\s*\n|(?=^#{1,6}\s))', text, flags=re.MULTILINE)

    for part in parts:
        part = part.strip()
        if not part:
            continue
        if word_count(" ".join(current_chunk) + " " + part) > max_words:
            if current_chunk:
                chunks.append(" ".join(current_chunk))
                current_chunk = [part]
            else:
                chunks.append(part)
        else:
            current_chunk.append(part)

    if current_chunk:
        chunks.append(" ".join(current_chunk))

    return chunks
