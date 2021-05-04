import React from 'react';
import axios from 'axios';

export default function ImageRepository() {
    function showRepository(imgrefs) {
        return (
            <div>
                {
                    imgrefs.map((imgref, i) => {
                        return <img src={imgref} key="{i}" alt="thumbnail"/>
                    })
                }
            </div>  
        );
    }
    
    axios
        .get(
            "http://localhost:4000/get-thumbnails"
        )
        .then((resp) => {
            return showRepository(resp.imgrefs);  
        });

    return (
        <div>Repository of all images</div>
    );
}