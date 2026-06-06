from flask import Flask, request, send_from_directory, jsonify
import os
import uuid

app = Flask(__name__)
UPLOAD_FOLDER = 'storage'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Ensure the upload directory exists
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    extension = file.filename.split('.')[-1]
    filename = f"{uuid.uuid4()}.{extension}"
    file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    
    # URL structure: http://localhost:PORT/uploads/filename
    return jsonify({'filename': filename}), 201

@app.route('/uploads/<filename>', methods=['GET'])
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
