import React, { useState } from 'react';
import FileUpload from './FileUpload';
import ImageRepository from './ImageRepository';
import Annotator from './Annotator';

export default function MainPage() {
    const [repoShown, setRepoShown] = useState(true);
    const annotator = <Annotator toggleDisplay={toggleDisplay}/>;

    function toggleDisplay() {
        console.log("Toggling display");
        setRepoShown(!repoShown);
    }

    if (repoShown == true) {
        return (
            <div>
                <FileUpload/>
                <ImageRepository toggleDisplay={toggleDisplay} annotator={annotator}/>
            </div>
        );
    } else {
        return (
            <div> { annotator } </div>
        )
    }
}

