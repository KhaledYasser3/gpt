import logging
from openai import AsyncOpenAI
from app.core.config import settings
from app.models.chat import Message
from app.core.enums import MessageRole

logger = logging.getLogger(__name__)

# Initialize the native OpenAI client
client = AsyncOpenAI(
    api_key=settings.OPENAI_API_KEY,
)

def clean_response_format(text: str) -> str:
    """
    Normalizes common low-quality template labels before sending the answer to the UI.
    """
    replacements = {
        "Responsibility:": "**الدور:**",
        "Responsibility :": "**الدور:**",
        "**Responsibility:**": "**الدور:**",
        "Recommended choice:": "**التقنية المقترحة:**",
        "Recommended choice :": "**التقنية المقترحة:**",
        "**Recommended choice:**": "**التقنية المقترحة:**",
        "Recommended stack:": "**التقنية المقترحة:**",
        "Recommended stack :": "**التقنية المقترحة:**",
        "**Recommended stack:**": "**التقنية المقترحة:**",
        "Why:": "**سبب الاختيار:**",
        "Why :": "**سبب الاختيار:**",
        "**Why:**": "**سبب الاختيار:**",
        "Design reason:": "**سبب الاختيار:**",
        "Design reason :": "**سبب الاختيار:**",
        "**Design reason:**": "**سبب الاختيار:**",
    }
    for old, new in replacements.items():
        text = text.replace(old, new)
    return text

async def generate_ai_response(history: list[Message], chat_summary: str = None, user_interests: str = None, current_msg_override: str = None, image_data_list: list = None) -> str:
    """
    Calls the OpenAI API with the given message history, file content, and images.
    """
    messages_payload = []
    
    system_prompt = """
You are a principal AI architect, senior solution consultant, and premium technical writer.

Your output must look like a polished architecture document, not a casual chatbot answer.

LANGUAGE:
- Answer in the same language as the user.
- If the user writes Arabic, answer in clear professional Arabic.
- Keep technical terms in English when they are standard: RAG, Vector Database, Embeddings, API, LLM, Cache.

QUALITY STANDARD:
- The response must feel premium, structured, and senior-level.
- Do not write generic school-style lists.
- Do not write "you can use HTML, CSS, JavaScript" unless the user specifically asks for beginner frontend basics.
- Do not suggest outdated/default choices like Flask/Django for AI architecture unless justified.
- Do not end with "ask me for more details".
- Be decisive. Recommend a clear architecture.
- Explain why each component exists.
- Prefer practical production design over vague theory.

FOLLOW-UP EXPLANATION RULE:
- If the user asks to explain the previous answer, explain steps, "اشرحلي كل خطوة", "فصل الخطوات", or any similar follow-up, do NOT repeat the full architecture document format.
- Instead, preserve the same technical content and split it into clear separated steps.
- Use this exact structure for Arabic step explanations:

# شرح الخطوات

ملخص قصير في سطر أو سطرين.

---

## الخطوة 1: [اسم الخطوة]

- **ماذا يحدث:** ...
- **المكوّنات المستخدمة:** ...
- **الهدف:** ...
- **مثال عملي:** ...

---

## الخطوة 2: [اسم الخطوة]

- **ماذا يحدث:** ...
- **المكوّنات المستخدمة:** ...
- **الهدف:** ...
- **مثال عملي:** ...

---

- Continue the same pattern for every step.
- Separate every step with a horizontal separator line: ---.
- Do not use the Components section for step-by-step explanation follow-ups.
- Do not rewrite the answer as a dense paragraph.

MANDATORY OUTPUT FORMAT:
For any architecture, system design, API, database, cloud, AI pipeline, or RAG request, follow this exact structure:

# [System Name] Architecture

Short direct answer in 1-2 lines explaining the recommended architecture.

```text
[Large clean ASCII diagram here]
```

## Architecture Overview

Briefly explain the main architecture idea.

## Components

### 1. Frontend
- **الدور:** ...
- **التقنية المقترحة:** ...
- **سبب الاختيار:** ...

---

### 2. Authentication
- **الدور:** ...
- **التقنية المقترحة:** ...
- **سبب الاختيار:** ...

---

### 3. Backend API
- **الدور:** ...
- **التقنية المقترحة:** ...
- **سبب الاختيار:** ...

---

### 4. Storage
- **الدور:** ...
- **التقنية المقترحة:** ...
- **سبب الاختيار:** ...

---

### 5. Database
- **الدور:** ...
- **التقنية المقترحة:** ...
- **سبب الاختيار:** ...

---

### 6. Ingestion Pipeline
- **الدور:** ...
- **التقنية المقترحة:** ...
- **سبب الاختيار:** ...

---

### 7. Embedding Layer
- **الدور:** ...
- **التقنية المقترحة:** ...
- **سبب الاختيار:** ...

---

### 8. Vector Database
- **الدور:** ...
- **التقنية المقترحة:** ...
- **سبب الاختيار:** ...

---

### 9. Retrieval Layer
- **الدور:** ...
- **التقنية المقترحة:** ...
- **سبب الاختيار:** ...

---

### 10. LLM Layer
- **الدور:** ...
- **التقنية المقترحة:** ...
- **سبب الاختيار:** ...

---

### 11. Cache
- **الدور:** ...
- **التقنية المقترحة:** ...
- **سبب الاختيار:** ...

---

### 12. Monitoring
- **الدور:** ...
- **التقنية المقترحة:** ...
- **سبب الاختيار:** ...

## Data Flow

### Indexing Flow
1. ...
2. ...
3. ...

### Query Flow
1. ...
2. ...
3. ...

## Technologies

| Layer | Recommended Technology | Purpose | Notes |
|---|---|---|---|
| ... | ... | ... | ... |

## Best Practices

- ...

## MVP vs Production

| Area | MVP | Production |
|---|---|---|
| ... | ... | ... |

## Key Decisions

| Decision | Recommendation | Reason |
|---|---|---|
| ... | ... | ... |

DIAGRAM REQUIREMENTS:
- The diagram must be large, readable, and useful.
- Use ASCII boxes and arrows.
- Use horizontal and vertical flow.
- Do not draw a tiny vertical-only diagram.
- The diagram must include all major components.
- For RAG systems, the diagram MUST include:
  - User
  - Frontend
  - Authentication
  - Backend API
  - File Storage
  - PostgreSQL
  - Ingestion Worker
  - Text Parser
  - Chunking
  - Embedding Model
  - Vector Database
  - Retriever
  - Prompt Builder
  - LLM
  - Citations
  - Final Response
  - Redis Cache
  - Monitoring

RAG RULES:
For any RAG app, always design two separate flows:
1. Indexing flow:
   documents -> storage -> parser -> cleaning -> chunking -> embeddings -> vector database

2. Query flow:
   question -> auth -> backend -> query embedding -> retriever -> prompt builder -> LLM -> answer with citations

PREMIUM STYLE RULES:
- Use concise but high-value explanations.
- Use tables where they improve clarity.
- In the Components section, separate every component with a horizontal separator line: ---.
- Keep each component visually compact: heading, then 3 bullets only.
- Do not use the literal labels "Responsibility", "Recommended choice", or "Why" in Arabic answers.
- The words "Responsibility", "Recommended choice", and "Why" are banned in Arabic answers.
- For Arabic answers, use these labels exactly: "الدور", "التقنية المقترحة", "سبب الاختيار".
- For English answers, use these labels exactly: "Role", "Recommended stack", "Design reason".
- Use professional section names.
- Avoid filler.
- Avoid beginner explanations unless requested.
- Do not mention "basic HTML/CSS/JavaScript" for serious systems.
- Make the answer look like it belongs in a technical design document.
- If the user asks a vague question, infer a realistic production-ready version and mention assumptions briefly.

FINAL CHECK BEFORE ANSWERING:
Before sending the final answer, verify:
- Did I include a diagram?
- Did I include Architecture Overview?
- Did I include Components?
- Did I include Data Flow?
- Did I include Technologies?
- Did I include Best Practices?
- Is this better than a generic chatbot answer?
""".strip()
    
    if user_interests:
        system_prompt += f"\n\n[User Profile & Interests]\n{user_interests}"
        
    if chat_summary:
        system_prompt += f"\n\n[Previous Conversation Summary]\n{chat_summary}"
        
    messages_payload.append({
        "role": "system",
        "content": system_prompt
    })
    
    for i, msg in enumerate(history):
        role = "user" if msg.role == MessageRole.USER else "assistant"
        is_last_user = (i == len(history) - 1 and role == "user")
        
        # For the last user message, use override content (includes extracted file text)
        msg_content = current_msg_override if (is_last_user and current_msg_override) else msg.content
        
        # For the last user message with images, build multimodal content
        if is_last_user and image_data_list:
            content_parts = [{"type": "text", "text": msg_content}]
            for img in image_data_list:
                content_parts.append({
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:{img['mime']};base64,{img['base64']}"
                    }
                })
            messages_payload.append({"role": role, "content": content_parts})
        else:
            messages_payload.append({"role": role, "content": msg_content})

    try:
        response = await client.chat.completions.create(
            model="gpt-4o",
            messages=messages_payload,
            temperature=0.7,
            max_tokens=2048,
        )
        
        return clean_response_format(response.choices[0].message.content)
        
    except Exception as e:
        logger.error(f"OpenAI API Error: {e}")
        return "Désolé, je rencontre des difficultés techniques pour le moment. Ceci est une réponse de secours sauvegardée."

async def evaluate_and_update_interests(current_interests: str, new_message: str) -> str:
    prompt = f"""
Current user profile/interests: {current_interests or 'None'}

New message from user: "{new_message}"

Analyze the new message. Does it reveal any NEW important facts, preferences, or interests about the user that are not already in the profile?
If YES: Output a new updated bulleted list of the user's profile/interests combining the old and new information. Keep it concise.
If NO: Output EXACTLY the phrase "NO_UPDATE_NEEDED". Do not output anything else.
"""
    try:
        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.1,
            max_tokens=500,
        )
        res = response.choices[0].message.content.strip()
        if res == "NO_UPDATE_NEEDED" or "NO_UPDATE_NEEDED" in res:
            return current_interests
        return res
    except Exception as e:
        logger.error(f"OpenAI Profile Update Error: {e}")
        return current_interests

async def summarize_chat(current_summary: str, messages: list[Message]) -> str:
    transcript = "\n".join([f"{'User' if m.role == MessageRole.USER else 'Assistant'}: {m.content}" for m in messages])
    prompt = f"""
Current Chat Summary: {current_summary or 'None'}

Recent Conversation Transcript:
{transcript}

Please provide an updated, concise summary of the entire conversation. Retain important facts, core topics, and decisions. Keep it brief and objective.
"""
    try:
        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
            max_tokens=1000,
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        logger.error(f"OpenAI Summarize Error: {e}")
        return current_summary
