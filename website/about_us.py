from flask import Blueprint, render_template

about_us = Blueprint('about_us', __name__)

@about_us.route('/about_us')
def aboutus():
    return render_template("about_us.html")