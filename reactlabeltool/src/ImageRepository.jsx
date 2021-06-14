import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import config from './config';
import './ImageRepository.css';

export default function ImageRepository(props) {
    var [imgrefs, setImgrefs] = useState([]);

    function handleClick(imgref) {
        props.toggleDisplay();
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
            <div className="imgrepo">
                {
                    imgrefs.map((imgref) => {
                        let url = config.server_url + "/" + imgref.img
                        return (
                            <div className="imgdisplay" key={imgref.img}>
                                <img src={url} alt={imgref.img} onClick={handleClick}/>
                                <span className="imgname">{imgref.name}</span>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    );
}

ImageRepository.propTypes = {
    toggleDisplay: PropTypes.func
};
