from app import create_app
from flask import request
from flask_cors import CORS, cross_origin
app = create_app('config.development')

@app.before_request
def log_request_info():
    print("Incoming Request:")
    print(f"Method: {request.method}")
    print(f"Path: {request.path}")
    print(f"Headers: {request.headers}")
    print(f"Body: {request.get_data()}")



cors = CORS(app)

if __name__ == '__main__':
    app.run(host='0.0.0.0',port=5555)