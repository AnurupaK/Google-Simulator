from flask import Flask, render_template, request, jsonify
import os
import sys
from werkzeug.utils import secure_filename
app = Flask(__name__, template_folder="../Frontend/templates", static_folder="../Frontend/static")
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'AI_Service')))
from ai_response import get_whisper, get_llm_response, get_pdfDocument,create_db,create_chain,get_llm_response_pdf
from AI_urlResponse import process_url
from gemini_response import process_image_with_gemini



@app.route('/')
def home():
    return render_template('index.html')


@app.route('/api/get_voice_response_from_whisper', methods=['POST'])
def voice_response():
    if request.content_type == 'application/octet-stream':
        audio_data = request.data
        audio_file_path = 'temp_audio.wav'
        
        # Save the audio data to a temporary file
        with open(audio_file_path, 'wb') as f:
            f.write(audio_data)
        
        # Get transcription from Whisper
        transcription_text = get_whisper(audio_file_path)
        
        # Get LLM response using the transcription
        response = get_llm_response(transcription_text)
        print("User voice:",transcription_text)
        print(response)
        
        return jsonify({ "User_Voice":transcription_text,"Bot_Voice": response})
    else:
        return jsonify({"error": "Invalid Content type"}), 400
  
  
  
@app.route('/api/get_text_response_from_llm', methods=['POST'])
def text_response():
    data = request.get_json()
    user_message = data.get('message')
    response = get_llm_response(user_message)
    print(response)
        
    return jsonify({"BotTxt": response})


@app.route('/api/get_pdf_response_from_llm', methods=['POST'])
def generate_response_pdf():
    
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    

    file = request.files['file']
    print(file)
    base_dir = os.path.dirname(os.path.abspath(__file__))
    knowledge_base_path = os.path.join(base_dir, '../uploads')  
    os.makedirs(knowledge_base_path, exist_ok=True)

    filename = secure_filename(file.filename)
    file_path = os.path.join(knowledge_base_path, filename)

    try:
        file.save(file_path)
    except Exception as e:
        print("File can't be saved",e)
    
    
    document = get_pdfDocument("../uploads")
    if(document):
        vector  = create_db(document)
        chain = create_chain(vectorstore=vector)
        
        user_input = "Analyze the entire data of the pdf and give detailed overview"
        response = get_llm_response_pdf(user_input,chain)
        print(response)
        os.remove(file_path)
            
        return jsonify({'botResTxt': response})
    else:
        response = "Sorry, no pdf uploaded"
        return jsonify({'botResTxt': response})
    
    
@app.route('/api/get_url_response_from_llm', methods=['POST'])
def generate_response_url():
    data = request.get_json()
    url_input = data.get('url')
    print(url_input)
    user_input = "Analyze the entire context and give detailed overview"
    
    
    response = process_url(url_input, user_input)

    if(response):
         return jsonify({'BotUrl':response})
    else:
        response = "The url couldn't be read"
        return jsonify({'BotUrl':response})

@app.route("/api/get_image_response_from_llm", methods=['POST'])
def generate_response_image():
    file = request.files['file']
    print(file)
    
    file_path = "temp_uploaded_image.jpeg"
    file.save(file_path)
    
    try:
        response_text = process_image_with_gemini(file_path)
    except Exception as e:
        return jsonify({'error': f'Failed to process image: {str(e)}'}), 500
    finally:
        # Clean up temporary file
        if os.path.exists(file_path):
            os.remove(file_path)
            
    print(response_text)
    
    return jsonify({'botImgResTxt':response_text})
    
if   __name__=="__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
    
    
    
