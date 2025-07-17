from flask import Flask

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'helloBxtch'

    from .home import home
    from .about_us import about_us
    from .chatbot import chatbot

    app.register_blueprint(chatbot, url_prefix='/')
    app.register_blueprint(home, url_prefix='/')
    app.register_blueprint(about_us, url_prefix='/')

    return app
