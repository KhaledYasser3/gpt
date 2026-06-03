import logging
from openai import AsyncOpenAI
from app.core.config import settings
from app.models.chat import Message
from app.core.enums import MessageRole

logger = logging.getLogger(__name__)

# Initialize the Groq client via OpenAI SDK
client = AsyncOpenAI(
    base_url="https://api.groq.com/openai/v1",
    api_key=settings.GROQ_API_KEY,
)

async def generate_ai_response(history: list[Message]) -> str:
    """
    Calls the Groq API with the given message history.
    """
    messages_payload = []
    
    # Optional: Add a system prompt
    messages_payload.append({
        "role": "system",
        "content": "You are a helpful, smart, and concise AI assistant. You communicate in the same language as the user. Use Markdown for formatting."
    })
    
    for msg in history:
        # Convert app MessageRole enum to string role
        role = "user" if msg.role == MessageRole.USER else "assistant"
        messages_payload.append({
            "role": role,
            "content": msg.content
        })

    try:
        response = await client.chat.completions.create(
            model="llama-3.1-8b-instant",  # Updated model
            messages=messages_payload,
            temperature=0.7,
            max_tokens=2048,
        )
        
        return response.choices[0].message.content
        
    except Exception as e:
        logger.error(f"Groq API Error: {e}")
        return "Désolé, je rencontre des difficultés techniques pour le moment. Ceci est une réponse de secours sauvegardée."
