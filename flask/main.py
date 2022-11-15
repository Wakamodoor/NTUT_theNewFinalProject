from flask import Flaskapp = Flask(__name__)
@app.route(‘/’, methods=[‘GET’])
def root():
    return “Hello world”
if __name__==”__main__”:
    app.run()
    
# from flask import Flask

# app = Flask(__name__)

# @app.route("/")
# def hello_world():
#     return "<p>Hello, World!</p>"


# @app.route('/')
# def index():
#     return 'Index Page'

# @app.route('/hello')
# def hello():
#     return 'Hello, Flask'

# @app.route('/about/',["GET"])
# def hello():
#     return 'about Flask'

