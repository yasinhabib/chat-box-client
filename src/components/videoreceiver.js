import React, { Component } from 'react'
import {b64ToBlob, base64ToBlob, formatUploadFileData} from 'plugin/helper'
import ReactPlayer from 'react-player'

export default class VideoReceiver extends Component {
    constructor(props){
        super(props)

        this.videoRef = React.createRef()
        this.stomp = this.props.stomp

        this.recordedChunks = []

        this.myMediaSource = null
        this.videoSourceBuffer = null
        this.updating = false
        this.started = false

        this.mimeCodec = 'video/mp4; codecs="avc1"'
    }

    componentDidMount = () => {
        console.log(this.recordedChunks)
        this.initVideo()
        this.loadDataVideo()

    }

    initVideo = () => {
        this.myMediaSource = new MediaSource();
        const url = URL.createObjectURL(this.myMediaSource);

        this.videoRef.current.src = url;

        this.myMediaSource.addEventListener('sourceopen', () => {
            this.videoSourceBuffer = this.myMediaSource.addSourceBuffer(this.mimeCodec);
            
            this.videoSourceBuffer.addEventListener('error', (e) => {
                console.log(e)
            });
            
            this.videoSourceBuffer.addEventListener('updateend',() => {
                // console.log(this.myMediaSource.readyState)
                // console.log('updated')
                this.updating = false

                // this.myMediaSource.endOfStream();

                // const video = document.querySelector("video");
                // video.play()
            })
        })


        // this.loadDataVideo()

    }

    loadDataVideo = () => {
        this.stomp.watch({ destination: `/exchange/chat.video/*`}).subscribe((message) => {
            const splittedBase64 = formatUploadFileData(message.body)
            this.encodeData(splittedBase64)
        });
    }

    encodeData = (splittedBase64) => {
        console.log(splittedBase64)
        var blobData = b64ToBlob(splittedBase64.base64data,splittedBase64.mime)
        this.recordedChunks = [...this.recordedChunks,blobData]


        // this.playVideo()
    }

    playVideo = async () => {
        if (this.recordedChunks.length) {
            const blob = new Blob(this.recordedChunks, {
                type: this.mimeCodec
            });

            console.log(blob)
            if(blob.size > 1){
                if(!this.updating){
                    this.recordedChunks = []
                    this.updating = true
                    const vidBuff = await blob.arrayBuffer()
                    this.videoSourceBuffer.appendBuffer(vidBuff);
                }
            }
        }
    }

    handleDownload = (e) => {
        e.preventDefault()
        this.playVideo()

        // this.fetchAB('/assets/frag_bunny.mp4',(data) => {
        //     console.log(data)
        //     this.videoSourceBuffer.appendBuffer(data)
        // })

        // const video = document.querySelector("video");
        // this.videoRef.current.play();
        // if (this.recordedChunks.length) {
        //     const blob = new Blob(this.recordedChunks, {
        //         type: "video/mp4"
        //     });
    
        //     const video = document.querySelector("video");
        //     const url = URL.createObjectURL(blob);
        //     video.src = url
        //     video.load()
        //     video.play()
        // }
    }

    fetchAB (url, cb) {
        var xhr = new XMLHttpRequest;
        xhr.open('get', url);
        xhr.responseType = 'arraybuffer';
        xhr.onload = function () {
          cb(xhr.response);
        };
        xhr.send();
      };

    render() {
        return (
            <div> 
                <video controls autoPlay ref = {this.videoRef}></video>
                <button type="button" onClick={this.handleDownload.bind(this)}>Download</button>
            </div>
        )
    }
}
