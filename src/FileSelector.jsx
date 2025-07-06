import React, { useState } from "react";
import { FileUploader } from "react-drag-drop-files";

import Peer from 'peerjs';

const PEERJS_DEFAULT_ID = 'p2p-file-transfer'; // 既定の受信側のPeer IDを指定

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

    const connectToPeer = () => {
        console.log('connectToPeer()');

        // ここでPEERJS_DEFAULT_IDに接続する処理を実装
        let peer = new Peer(generatePeerId());
        console.log({ peer });

        peer.on('open', function (id) {
            console.log('peer.on open', 'My peer ID is: ' + id);

            try {
                // PEERJS_DEFAULT_IDに接続を試みる
                let conn = peer.connect(PEERJS_DEFAULT_ID);
                console.log({ conn });

                conn.on('open', function () {
                    console.log('conn.on open');

                    // Receive messages
                    conn.on('data', function (data) {
                        console.log('conn.on data');

                        console.log('Received', data);
                    });
                });

                conn.on('error', function (err) {
                    console.log('conn.on error', err.type);
                });

            } catch (error) {
                console.error({ error });
            }
        });
    };

    const startWaiting = () => {
        console.log('startWaiting()');

        let peer = new Peer(PEERJS_DEFAULT_ID);
        console.log({ peer });

        peer.on('open', function (id) {
            console.log('peer.on open', 'My peer ID is: ' + id);
        });

        peer.on('connection', function (conn) {
            console.log('peer.on connection', conn);
            conn.on('data', function (data) {
                console.log(data);
            });
        });

        peer.on('error', function (error) {
            switch (error.type) {
                case 'unavailable-id':
                    console.debug(`The id ${PEERJS_DEFAULT_ID} is taken.`);
                    try {
                        // PEERJS_DEFAULT_IDが既に使用されている場合の処理
                        peer.destroy();
                        peer = null;
                        console.log('peer.destroy()');

                        // 既存のPeerに接続を試みる
                        connectToPeer();
                    } catch (error) {
                        console.error({ error });
                    }

                    break;
                default:
                    console.log('conn.on error', error.type);
            }
        });
    };

    React.useEffect(() => {
        // useEffectが2回実行されるのを防ぐためのフラグ
        // React 18のStrictModeではuseEffectが2回実行されるため
        let firstRun = true;
        if (firstRun) {
            // 初回のみ実行
            startWaiting();

            console.log('Initialized');
        }

        return () => {
            firstRun = false;
        };
    }, []);

    return (
        <FileUploader handleChange={handleChange} name="file" />
    );
}

export default FileSelector;