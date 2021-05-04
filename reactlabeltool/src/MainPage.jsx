import React from 'react';
import FileUpload from './FileUpload';
import ImageRepository from './ImageRepository';

export default function MainPage() {
    return (
        <div>
            <ImageRepository/>
            <FileUpload/>
        </div>
    );
}

