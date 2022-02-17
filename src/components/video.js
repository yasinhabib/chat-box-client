import React, { Component } from 'react'
import Webcam from "react-webcam";
import {blobToBase64} from 'plugin/helper'

class Video extends Component {
    constructor(props){
        super(props)

        this.state = {
            capturing: false
        }

        this.recordedChunks = []

        this.videoConstraints = {
            width: 1280,
            height: 720,
            facingMode: "user",
        };

        this.webCamRef = React.createRef()
        this.mediaRecorderRef = null

        this.stomp = this.props.stomp
    }

    startCapture = () => {
        this.setState({
            capturing: true
        })
        
        this.mediaRecorderRef = new MediaRecorder(this.webCamRef.current.stream, {
            mimeType: 'video/webm;codecs="avc1"',
        });
        
        this.mediaRecorderRef.ondataavailable = (e) => {
            this.handleDataAvailable(e.data)
        }
        this.mediaRecorderRef.start(100);
    }

    handleDataAvailable = async (data) => {
        console.log(data)
        if (data.size > 0) {
            var database64 = await blobToBase64(data)

            console.log(database64)

            this.stomp.publish({
                destination: '/exchange/chat.video',
                body: database64
            });
        }
    }

    stopCapture = () => {
        this.mediaRecorderRef.stop();
        this.setState({
            capturing: false
        })
    }

    handleDownload =() => {
        const {recordedChunks} = this.state

        if (recordedChunks.length) {
          const blob = new Blob(recordedChunks, {
            type: 'video/webm; codecs="avc1.42000a"'
          });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          document.body.appendChild(a);
          a.style = "display: none";
          a.href = url;
          a.download = "react-webcam-stream-capture.mp4";
          a.click();
          window.URL.revokeObjectURL(url);

          this.setState({
              recordedChunks: []
          })
        }
    }

    render() {
        return (
            <>
                <Webcam audio={true} ref={this.webCamRef} mirrored={true}/>

                {this.state.capturing ? (
                    <button onClick={this.stopCapture}>Stop Capture</button>
                ) : (
                    <button onClick={this.startCapture}>Start Capture</button>
                )}
            </>
        )
    }
}

export default Video