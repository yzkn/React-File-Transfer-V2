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
        const peer = new Peer(generatePeerId());
        console.log({ peer });

        peer.on('open', function (id) {
            console.log('peer.on open', 'My peer ID is: ' + id);

            try {
                // PEERJS_DEFAULT_IDに接続を試みる
                const conn = peer.connect(PEERJS_DEFAULT_ID);
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
                    switch (err.type) {
                        case 'negotiation-failed':
                            try {
                                // PEERJS_DEFAULT_IDに接続できなかった場合は、自分が受信側(PEERJS_DEFAULT_ID)として待機する
                                conn.close();
                                console.log('conn.close()');

                                peer.destroy();
                                console.log('peer.destroy()');

                                waitForSender();
                            } catch (error) {
                                console.error({ error });
                            }

                            break;
                        default:
                            console.log('conn.on error', err.type);
                    }
                });

            } catch (error) {
                console.error({ error });
            }
        });
    };

    const waitForSender = () => {
        console.log('waitForSender()');

        // 受信側として待機する処理を実装
        try {
            const peer = new Peer(PEERJS_DEFAULT_ID);
            console.log('waitForSender()', peer);

            peer.on('open', function (id) {
                console.log('waitForSender()', 'peer.on open');

                console.log('waitForSender()', 'My peer ID is: ' + id);

                //
                var peer2 = new Peer('777');
                console.log('peer2', peer2);
                var conn2 = peer.connect(id);
                console.log('conn2', conn2);
                // on open will be launch when you successfully connect to PeerServer
                conn2.on('open', function () {
                    // here you have conn.id
                    conn2.send('hi!');
                });
                //
            });

            peer.on('connection', function (conn) {
                console.log('waitForSender()', 'peer.on connection');

                conn.on('data', function (data) {
                    console.log('waitForSender()', 'conn.on data');

                    console.log('waitForSender()', data);
                });
            });
        } catch (error) {
            console.error('waitForSender()', error);
        }
    };

    React.useEffect(() => {
        // useEffectが2回実行されるのを防ぐためのフラグ
        // React 18のStrictModeではuseEffectが2回実行されるため
        let firstRun = true;
        if (firstRun) {
            // 初回のみ実行
            connectToPeer();

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