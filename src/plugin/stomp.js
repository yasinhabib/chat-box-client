import { Component } from 'react'
import { RxStomp } from '@stomp/rx-stomp';

var username = process.env.REACT_APP_RABBITMQ_USERNAME;
var password = process.env.REACT_APP_RABBITMQ_PASSWORD;
var host = process.env.REACT_APP_RABBITMQ_HOST;

export default class Stomp extends Component {
    constructor(props){
        super(props)

        this.stomp = null
    }

    connect = () =>{
        this.stomp = new RxStomp();
        this.stomp.configure({
                    brokerURL: host,
                    forceBinaryWSFrames: true,
                    connectHeaders: {
                    login: username,
                    passcode: password
                    },
                    debug: (str) => {
                        console.log(str);
                    },
                    reconnectDelay: 5000,
                    heartbeatIncoming: 30000,
                    heartbeatOutgoing: 30000
                });   

        this.stomp.activate();

        // this.stomp.stompClient.configure({
        //     onConnect : (e) => {
        //         console.log(e)
        //     }
        // })

        return this.stomp
    }

    render() {
        return null
    }
}
