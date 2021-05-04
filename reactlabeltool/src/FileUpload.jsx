import React from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './FileUpload.css';

export default function FileUpload() {
    var fileobjects = [];

    function handleSelection(event) {
        for (let i = 0; i < event.target.files.length; i++) {
            fileobjects.push(event.target.files[i]);
        }
    }

    function uploadFiles() {
        const formData = new FormData();
        for (let i = 0; i < fileobjects.length; i++) {
            formData.append(`files[${i}]`, fileobjects[i]);
        }
        
        axios
            .post(
                "http://localhost:4000/upload-images",
                formData, {
                    headers: {
                        'content-type': 'multipart/form-data'
                    }
                })
            .then((resp) => {
                console.log("file upload response: ", resp);
            });
    }

    return (
        <div id="upload-file">
            <input type="file" id="files" multiple="multiple" hidden="hidden" onChange={handleSelection}/>
            <label className="btn" htmlFor="files">Select files</label><br/>
            <label className="btn" onClick={uploadFiles}>Upload Files</label>
        </div>
    )
}
