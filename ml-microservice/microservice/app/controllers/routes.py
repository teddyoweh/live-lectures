from flask import render_template, Blueprint, request,send_from_directory
from app.controllers.base import prcoess_transcript,generate_roadmap,ask_video
from flask_cors import CORS,cross_origin

blueprint = Blueprint('pages', __name__)


################
#### routes ####
################


@blueprint.route('/')
def home():
    return {'message': 'Welcome to the microservice'}

@blueprint.route('/process_transcript', methods=['POST'])
@cross_origin(origin='*',headers=['Authorization', 'Content-Type', 'Accept','Access-Control-Allow-Origin'])
def process_transcript():
    text = request.json.get('text')
    body = request.json.get('body')
    response = prcoess_transcript(text,str(body))
    return response


@blueprint.route('/upload_video', methods=['POST'])
@cross_origin(origin='*',headers=['Authorization', 'Content-Type', 'Accept','Access-Control-Allow-Origin'])

def upload_file():
    print('uploading file')
    if 'video' not in request.files:
        return 'No file part'

    file = request.files['video']
    if file.filename == '':
        return 'No selected file'

    # You can now process the file as per your requirement
    # For example, save it to disk
    file.save('uploaded_video.mp4')

    return 'File uploaded successfully'


@blueprint.route('/roadmap', methods=['POST'])
@cross_origin(origin='*',headers=['Authorization', 'Content-Type', 'Accept','Access-Control-Allow-Origin'])
def rdmp():
    text = request.json.get('text')
    print(text)
    response = generate_roadmap(text)
    return response

@blueprint.route('/ask_video', methods=['POST'])
@cross_origin(origin='*',headers=['Authorization', 'Content-Type', 'Accept','Access-Control-Allow-Origin'])
def rdask_videop():
    text = request.json.get('text')
    print(text)
    response = ask_video(text)
    return response


@blueprint.route('/videos/<path:filename>')
@cross_origin(origin='*',headers=['Authorization', 'Content-Type', 'Accept','Access-Control-Allow-Origin'])
def get_video(filename):
     return send_from_directory('videos', filename)
 
 
 
