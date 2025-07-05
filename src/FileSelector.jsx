import React, { useState } from "react";
import { FileUploader } from "react-drag-drop-files";

import Peer from 'peerjs';

function generatePeerId() {
    // 利用する文字は、形が似ていたり、音が似ているものを除いて定義
    const letters = 'AFHJKLRSUVWXYZ345678';
    const len = 4;

    let generated = '';
    for (var i = 0; i < len; i++) {
        generated += letters.charAt(Math.floor(Math.random() * letters.length));
    }

    return generated;
};

function FileSelector() {
    const [file, setFile] = useState(null);
    const handleChange = (file) => {
        setFile(file);
        console.log({ file })
    };

    React.useEffect(() => {
        const peer = new Peer(generatePeerId());
        peer.on('open', function (id) {
            console.log('My peer ID is: ' + id);
        });

        console.log('Initialized');
    }, []);

    return (
        <FileUploader handleChange={handleChange} name="file" />
    );
}

export default FileSelector;