import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './FileUpload.css';
import config from './config';

export default function FileUpload() {
    const [files, setFiles] = useState([]);
    const [count, setCount] = useState(0);

    function handleSelection(event) {
        setFiles(event.target.files);
        setCount(event.target.files.length);
    }

    function uploadFiles() {
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append(`files[${i}]`, files[i]);
        }
        
        axios
            .post(
                config.server_url + "/upload-images",
                formData, {
                    headers: {
                        'content-type': 'multipart/form-data'
                    }
                })
            .then((resp) => {
                window.location.reload(true);
            });
    }

    return (
        <div id="upload-file">
            No. of files selected: {count} &nbsp;
            <input type="file" id="files" multiple="multiple" hidden="hidden" onChange={handleSelection}/>
            <label className="btn" htmlFor="files">Select files</label>
            <label className="btn" onClick={uploadFiles}>Upload Files</label>
        </div>
    )
}
