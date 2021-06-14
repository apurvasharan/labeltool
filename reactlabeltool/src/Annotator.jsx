import React from 'react';
import PropTypes from 'prop-types';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Annotator (props) {

    return (
        <div>
            <label className="btn" onClick={props.toggleDisplay}>Show Repository</label>
            <label>{props.imgref}</label>
        </div>
    )
}

Annotator.propTypes = {
    toggleDisplay: PropTypes.func,
    imgref: PropTypes.string
}