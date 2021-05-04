from functools import reduce
from flask import Flask, request, jsonify, send_from_directory, send_file
import os, sys, random, string, traceback
from pymongo import MongoClient

from werkzeug.utils import secure_filename

SCRIPT_DIR = os.path.dirname(os.path.abspath(os.path.realpath(__file__)))
UPLOAD_FOLDER = os.path.join(SCRIPT_DIR, "uploads")
if os.path.exists(UPLOAD_FOLDER) is False:
    os.mkdir(UPLOAD_FOLDER)

app = Flask(__name__)

mongo_client = MongoClient('mongodb://localhost:27017/')
database = mongo_client['labelimages']
labelfiles = database['labelfiles']

def uniquify_filename(filename):
    filename = secure_filename(filename)
    fn, ext = os.path.splitext(filename)

    filename = fn + "_" + "".join(random.sample(string.ascii_lowercase, 8)) + ext
    cursor = labelfiles.find({'unique_filename': filename})
    while cursor.count() > 0:
        filename = fn + "_" + random.sample(string.ascii_lowercase, 8) + ext
        cursor = labelfiles.find({'unique_filename': filename})
    return filename


@app.route("/upload-images", methods=['POST'])
def upload_images():
    print("Received upload request", len(request.files))
    for key in request.files.keys():
        fileobj = request.files[key]
        print("File name: ", fileobj.filename)
        filename = uniquify_filename(fileobj.filename)
        fileobj.save(os.path.join(UPLOAD_FOLDER, filename))
        labelfiles.insert({'userfilename': fileobj.filename, 'unique_filename': filename})
    return jsonify({'status': 'OK', 'msg': 'Upload request received'})


@app.route("/get-thumbnails", methods=["GET"])
def get_thumbnails():
    imgrefs = []
    cursor = labelfiles.find({})
    for rec in cursor:
        print(rec)
        imgrefs.append(rec.unique_filename)
    return jsonify(imgrefs)

