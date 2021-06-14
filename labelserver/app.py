from functools import reduce
from flask import Flask, request, jsonify, send_from_directory, send_file
from flask_cors import CORS
import os, sys, random, string, traceback
from pymongo import MongoClient
import cv2

from werkzeug.utils import secure_filename

SCRIPT_DIR = os.path.dirname(os.path.abspath(os.path.realpath(__file__)))

UPLOAD_ROOT_FOLDER = os.path.join(SCRIPT_DIR, "uploads")
if os.path.exists(UPLOAD_ROOT_FOLDER) is False:
    os.mkdir(UPLOAD_ROOT_FOLDER)

UPLOAD_IMAGE_FOLDER = os.path.join(SCRIPT_DIR, "uploads", "image")
if os.path.exists(UPLOAD_IMAGE_FOLDER) is False:
    os.mkdir(UPLOAD_IMAGE_FOLDER)

UPLOAD_THUMB_FOLDER = os.path.join(SCRIPT_DIR, "uploads", "thumb")
if os.path.exists(UPLOAD_THUMB_FOLDER) is False:
    os.mkdir(UPLOAD_THUMB_FOLDER)

app = Flask(__name__)
CORS(app)

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

        filepath = os.path.join(UPLOAD_IMAGE_FOLDER, filename)
        fileobj.save(filepath)

        thumbpath = os.path.join(UPLOAD_THUMB_FOLDER, filename)
        img = cv2.imread(filepath)
        h, w, _ = img.shape
        nw = 240
        nh = h * nw // w 
        thumb = cv2.resize(img, (nw, nh))
        cv2.imwrite(thumbpath, thumb)

        labelfiles.update(
            {'userfilename': fileobj.filename},
            {
                'userfilename': fileobj.filename, 
                'unique_filename': filename,
                'image_path': filepath, 
                'thumb_path': thumbpath, 
                'annotated': False
            },
            upsert=True
        )
    return jsonify({'status': 'OK', 'msg': 'Upload request received'})


@app.route("/get-thumbnails", methods=["GET"])
def get_thumbnails():
    imgrefs = []
    cursor = labelfiles.find({})
    for rec in cursor:
        print(rec)
        imgrefs.append({"img": f"/thumbnail/{rec['unique_filename']}", "name": rec['userfilename']})
    return jsonify({'imgrefs': imgrefs})


@app.route("/thumbnail/<uniquefilename>")
def render_thumbnail(uniquefilename):
    cursor = labelfiles.find({'unique_filename': uniquefilename})
    if cursor.count() > 0:
        print("Returning one file")
        imgrec = cursor[0]
        return send_file(imgrec['thumb_path'])
    else:
        print("Returning invalid file")
        return send_file(os.path.join(UPLOAD_ROOT_FOLDER, "invalid.jpg"))



