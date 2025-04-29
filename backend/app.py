from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import uuid
import base64
from PIL import Image
from io import BytesIO
import time
from ecg_model import predict_ecg_condition  
app = Flask(__name__)
CORS(app)  
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
ANALYSIS_HISTORY = []
@app.route('/api/health', methods=['GET'])
def health_check():
    """Simple health check endpoint"""
    return jsonify({"status": "healthy"})
@app.route('/api/analyze', methods=['POST'])
def analyze_ecg():
    """Accepts an ECG image and returns a prediction result"""
    try:
        image = None
        if request.is_json:
            data = request.get_json(silent=True)
            if data and 'image_data' in data:
                image_data = data['image_data']
                if 'base64,' in image_data:
                    image_data = image_data.split('base64,')[1]
                image_bytes = base64.b64decode(image_data)
                image = Image.open(BytesIO(image_bytes))
        elif 'image' in request.files:
            file = request.files['image']
            image = Image.open(file.stream)
        if not image:
            return jsonify({"error": "No valid image provided"}), 400
        image_id = str(uuid.uuid4())
        image_path = os.path.join(UPLOAD_FOLDER, f"{image_id}.png")
        image.save(image_path)
        time.sleep(2)
        prediction_result = predict_ecg_condition(image_path)
        return jsonify(prediction_result)
    except Exception as e:
        return jsonify({"error": f"Failed to analyze ECG image: {str(e)}"}), 500
@app.route('/api/history', methods=['GET'])
def get_history():
    """Returns mock or saved analysis history"""
    return jsonify(ANALYSIS_HISTORY)
@app.route('/api/history', methods=['POST'])
def save_analysis():
    """Adds a new analysis result to history"""
    try:
        data = request.get_json()
        required_fields = ['prediction', 'confidence', 'risk', 'thumbnailUrl']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400
        new_item = {
            'id': str(uuid.uuid4()),
            'date': time.strftime('%Y-%m-%dT%H:%M:%S'),
            'prediction': data['prediction'],
            'confidence': data['confidence'],
            'risk': data['risk'],
            'thumbnailUrl': data['thumbnailUrl']
        }
        ANALYSIS_HISTORY.insert(0, new_item)
        return jsonify(new_item)
    except Exception as e:
        return jsonify({"error": f"Failed to save history: {str(e)}"}), 500
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)