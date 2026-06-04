import io
import logging
from fastapi import UploadFile

logger = logging.getLogger(__name__)

# Supported MIME types
SUPPORTED_TEXT = {
    'text/plain', 'text/csv', 'text/html', 'text/markdown',
    'application/json', 'application/xml', 'text/xml',
    'application/x-python', 'text/x-python',
}
SUPPORTED_PDF = {'application/pdf'}
SUPPORTED_DOCX = {
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
}
SUPPORTED_IMAGE = {'image/png', 'image/jpeg', 'image/gif', 'image/webp'}

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB


async def extract_text_from_file(file: UploadFile) -> dict:
    """
    Extract text content from an uploaded file.
    Returns dict with keys: filename, content_type, extracted_text, is_image, image_bytes
    """
    content = await file.read()
    
    if len(content) > MAX_FILE_SIZE:
        return {
            "filename": file.filename,
            "content_type": file.content_type,
            "extracted_text": f"[File '{file.filename}' exceeds the 10MB size limit]",
            "is_image": False,
            "image_bytes": None,
        }

    mime = (file.content_type or '').lower()
    result = {
        "filename": file.filename,
        "content_type": mime,
        "extracted_text": "",
        "is_image": False,
        "image_bytes": None,
    }

    try:
        if mime in SUPPORTED_PDF:
            result["extracted_text"] = _extract_pdf(content)
        elif mime in SUPPORTED_DOCX:
            result["extracted_text"] = _extract_docx(content)
        elif mime in SUPPORTED_IMAGE:
            result["is_image"] = True
            result["image_bytes"] = content
            result["extracted_text"] = f"[Image: {file.filename}]"
        elif mime in SUPPORTED_TEXT or file.filename.endswith(('.py', '.js', '.jsx', '.ts', '.tsx', '.css', '.html', '.md', '.txt', '.json', '.csv', '.xml', '.yaml', '.yml', '.env', '.sql', '.sh', '.bat', '.log', '.cfg', '.ini', '.toml')):
            result["extracted_text"] = content.decode('utf-8', errors='replace')
        else:
            # Try to read as text anyway
            try:
                result["extracted_text"] = content.decode('utf-8', errors='strict')
            except UnicodeDecodeError:
                result["extracted_text"] = f"[Unsupported file type: {mime or 'unknown'} for '{file.filename}']"
    except Exception as e:
        logger.error(f"Error extracting text from {file.filename}: {e}")
        result["extracted_text"] = f"[Error reading file '{file.filename}': {str(e)}]"

    return result


def _extract_pdf(content: bytes) -> str:
    """Extract text from PDF bytes."""
    from PyPDF2 import PdfReader
    reader = PdfReader(io.BytesIO(content))
    pages = []
    for i, page in enumerate(reader.pages):
        text = page.extract_text()
        if text and text.strip():
            pages.append(f"--- Page {i+1} ---\n{text.strip()}")
    return "\n\n".join(pages) if pages else "[PDF file contained no extractable text]"


def _extract_docx(content: bytes) -> str:
    """Extract text from DOCX bytes."""
    from docx import Document
    doc = Document(io.BytesIO(content))
    paragraphs = [p.text for p in doc.paragraphs if p.text.strip()]
    return "\n\n".join(paragraphs) if paragraphs else "[DOCX file contained no extractable text]"
