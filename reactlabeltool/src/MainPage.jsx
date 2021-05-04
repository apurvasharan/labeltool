import React, { useState } from 'react';
import FileUpload from './FileUpload';
import ImageRepository from './ImageRepository';

export default function MainPage() {
    const [showrepo, setShowRepo] = useState(true);

    function showAnnotator(){
        setShowRepo(false);
    }

    if (showrepo == true) {
        return (
            <div>
                <FileUpload/>
                <ImageRepository onChange={showAnnotator}/>
            </div>
        );
    } else {
        return (
            <div>
                Show annotator
            </div>
        )
    }
}

