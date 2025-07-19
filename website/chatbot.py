from flask import Blueprint, render_template, request, jsonify, session
import uuid
from openai import OpenAI
import base64
import markdown

chatbot = Blueprint('chatbot', __name__)

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key="OPENROUTER_API_KEY"
)

conversations = {}

@chatbot.route('/chatbot', methods=['GET', 'POST'])
def chat():
    return render_template("chatbot.html")


@chatbot.route('/chatbot-response', methods=['POST'])
def handle_chat():
    """Process user input and generate chatbot responses."""

    # ✅ FIX: assign `data` first
    data = request.json if request.is_json else request.form
    model = data.get('model', 'nvidia/llama-3.1-nemotron-ultra-253b-v1:free')  # Default if not provided

    session_id = session.get('session_id')
    if not session_id or session_id not in conversations:
        session_id = str(uuid.uuid4())
        session['session_id'] = session_id
        conversations[session_id] = []

    messages = conversations[session_id]
    text = data.get('text', '').strip()
    image_file = request.files.get('image')

    content = []
    if text:
        content.append({"type": "text", "text": text})

    if image_file:
        image_data = image_file.read()
        image_b64 = base64.b64encode(image_data).decode('utf-8')
        image_url = f"data:{image_file.mimetype};base64,{image_b64}"
        content.append({
            "type": "image_url",
            "image_url": {"url": image_url}
        })

    if not content:
        return jsonify({'error': 'Empty message'}), 400

    messages.append({"role": "user", "content": content})

    try:
        completion = client.chat.completions.create(
            model=model,
            messages=messages
        )

        bot_response = completion.choices[0].message.content

        # Convert Markdown to HTML
        bot_response_html = markdown.markdown(
            bot_response,
            extensions=['extra', 'sane_lists']
        )

        messages.append({"role": "assistant", "content": [{"type": "text", "text": bot_response}]})
        conversations[session_id] = messages[-10:]

        return jsonify({'response': bot_response_html})

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': 'Failed to get response'}), 500


# --- Speech recognition endpoint ---
@chatbot.route('/speech-to-text', methods=['POST'])
def speech_to_text():
    """Accepts an audio file and returns recognized text."""
    audio_file = request.files.get('audio')
    if not audio_file:
        return jsonify({'error': 'No audio file provided'}), 400

    try:
        transcript = client.audio.transcriptions.create(
            file=audio_file,
            model="whisper-1"
        )
        text = transcript.text.strip()
        return jsonify({'text': text})
    except Exception as e:
        print(f"Speech recognition error: {str(e)}")
        return jsonify({'error': 'Speech recognition failed'}), 500
