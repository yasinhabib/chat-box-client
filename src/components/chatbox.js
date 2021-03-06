import React, { Component } from 'react'
import httpRequest from 'plugin/httprequest'
import {formatDefaultDate} from 'plugin/helper'
import ProtobufLib from 'plugin/protobuflib'

class Chatbox extends Component {
    constructor(props){
        super(props)

        this.state = {
            users: [],
            selectedUser: 0,
            selectedUserName: '',
            chats: [],
            message: ''
        }

        this.stomp = this.props.stomp

        this.ObjectProto = null
    }

    componentDidMount = async () => {
        var users = await httpRequest(process.env.REACT_APP_BACKEND,this.props.store,'get-all-users')

        if(users.status){
            window.location.href = '/login'
        }else{
            this.setState({
                users: users
            })
        }

        let ObjectProtoFile = '/proto/chatmessage.proto';
        this.ObjectProto = new ProtobufLib(ObjectProtoFile);
    }

    componentDidUpdate = (prevProp,prevState) => {
        if(prevState.chats !== this.state.chats){
            this.scrollToBottom(document.getElementById('chat-container'))
        }   
    }

    selectPerson = (e) => {
        var selectedUser = this.state.users.find(value => value.id === parseInt(e.target.value))
        this.setState({
            selectedUser: e.target.value,
            selectedUserName: selectedUser.name
        })
    }

    loadChat = async (e) => {
        var chats = await httpRequest(process.env.REACT_APP_BACKEND,this.props.store,`get-all-chats/${this.state.selectedUser}`)

        let messageKey = 'listMessage'
        let lookup = 'chatmessage.listMessage'

        var protoListMessage =  await this.ObjectProto.loadProto(messageKey,lookup)

        if(protoListMessage){
            if(chats.length > 0){
                let result = this.ObjectProto.decode(messageKey,chats);
                this.setState({
                    chats: result.message
                })
            }
        }

        this.ObjectProto.unload(messageKey);
        
        this.stomp.stompClient.subscribe(`/exchange/chat.message/${this.state.selectedUser}`,async (message) => {
            let messageKey = 'postMessage'
            let lookup = 'chatmessage.postMessage'

            var protoPostMessage =  await this.ObjectProto.loadProto(messageKey,lookup)
            if(protoPostMessage){
                let result = this.ObjectProto.decode(messageKey,message.binaryBody);
                
                var isSender = result.userId === this.props.store.getState().sessionUser.id ? true : false
    
                this.setState({
                    chats: [
                        ...this.state.chats,
                        {
                            userId: result.userId,
                            message: result.message,
                            targetUserId: result.targetUserId,
                            createdAt: new Date(),
                            isSender: isSender,
                        }
                    ]
                })
            }
            this.ObjectProto.unload(messageKey);
        });
    }

    message = (e) => {
        this.setState({
            message: e.target.value,
        })
    }

    sendChat = async (e) => {
        var message = {
            userId: this.props.store.getState().sessionUser.id,
            message: this.state.message,
            targetUserId: parseInt(this.state.selectedUser),
        }

        let messageKey = 'postMessage'
        let lookup = 'chatmessage.postMessage'

        var protoPostMessage =  await this.ObjectProto.loadProto(messageKey,lookup)
        if(protoPostMessage){
            let result = this.ObjectProto.encode(messageKey,message);
    
            this.stomp.publish({destination: '/exchange/chat.message', binaryBody: result});
            this.setState({
                message: ''
            })
    
        }
        this.ObjectProto.unload(messageKey);
    }

    scrollToBottom = (element) => {
        var scrollInterval;
        var stopScroll;
    
        scrollInterval = setInterval(function () {
            element.scrollTop = element.scrollHeight;
        }, 50);
    
        stopScroll = setInterval(function () {
            clearInterval(scrollInterval);
        }, 100);
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <h1>Chat</h1>
                        <span>List Pengguna</span>
                        <div className="d-flex flex-row">
                            <select className="form-control" onChange={this.selectPerson.bind(this)} style={{width: '80%'}} defaultValue={this.state.selectedUser}>
                                <option value="0">-</option>
                                {
                                    this.state.users.map((value,index) => {
                                        return <option key={index} value={value.id}>{value.name}</option>
                                    })
                                }
                            </select>
                            <button type="button" className="btn btn-primary btn-sm ml-2" style={{width: '20%'}} onClick={this.loadChat.bind(this)}>
                                Chat
                            </button>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="border rounded mt-3 d-flex flex-column overflow-auto" style={{height: 'calc(100vh - 500px)'}} id="chat-container">
                            <div className="d-block m-4">
                                {
                                    this.state.chats.map((value,index) => {
                                        var side = value.isSender ? 'S' : 'R' 
                                        var username = side === 'S' ? 'Me' : this.state.selectedUserName
                                        return  <div className={`d-flex flex-column ${side === 'R' ? 'align-items-start' : 'align-items-end'}`}>
                                                    <span>{username}</span>
                                                    <div className={`alert alert-secondary ${side === 'R' ? 'text-left' : 'text-right'} mb-0`} style={{width: '30%'}} role="alert">
                                                        {value.message}
                                                    </div>   
                                                    <span className="mb-3">{formatDefaultDate(value.createdAt)}</span> 
                                                </div>
                                    })
                                }
                            </div>
                        </div>
                        <div className="d-flex mt-3">
                            <textarea className="form-control" rows={5} onChange={this.message.bind(this)} style={{width: '80%'}} value={this.state.message}></textarea>
                            <button type="button" className="btn btn-primary btn-sm ml-2" style={{width: '20%'}} onClick={this.sendChat.bind(this)}>
                                Chat
                            </button>   
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Chatbox