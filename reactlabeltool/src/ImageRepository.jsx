import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from './config';
import './ImageRepository.css';

export default function ImageRepository(props) {
    const [imgrefs, setImgrefs] = useState([]);

    function handleClick() {
        // props.onChange();
    }

    useEffect(() => {
        axios
            .get(
                config.server_url + "/get-thumbnails"
            )
            .then((resp) => {
                console.log(resp.data.imgrefs);
                setImgrefs(resp.data.imgrefs);
            });
    }, []);

    return (
        <div>
            {
                imgrefs.map((imgref) => {
                    let url = config.server_url + "/" + imgref
                    return <img src={url} key={imgref} alt={imgref} onClick={handleClick}/>
                })
            }
        </div>
    );
}
