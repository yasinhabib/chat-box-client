import { Component } from 'react';
import Protobuf from 'protobufjs';

var messageList = [];

class ProtobufLib extends Component {
    constructor(protobufFile){
        super(protobufFile);
        this.protobufFile = protobufFile
    }

    loadProto = async (key,lookup) => {
        var ProtoProcess = await  Protobuf.load(this.protobufFile)
        
        messageList[key] = ProtoProcess.lookupType(lookup);
        
        return messageList[key] 
    }

    unload(key){
        messageList.splice(key);
    }

    encode(key,payload){
        var objects = messageList[key].toObject(payload, {
            enums: Number,  // enums as string names
            longs: Number,  // longs as strings (requires long.js)
            bytes: Array,  // bytes as base64 encoded strings
            defaults: false, // includes default values
            arrays: false,   // populates empty arrays (repeated fields) even if defaults=false
            objects: false,  // populates empty objects (map fields) even if defaults=false
            oneofs: false    // includes virtual oneof fields set to the present field's name
        });

        var errMsg = messageList[key].verify(objects);
        

        if (errMsg)
            throw Error(errMsg);

        // Create a new message
        var message = messageList[key].create(payload); // or use .fromObject if conversion is necessary

        // Encode a message to an Uint8Array (browser) or Buffer (node)
        var buffer = messageList[key].encode(message).finish();

        return buffer;
    }

    decode(key,message){
        var prevvalue = '';
        var index = 0;
        for (var _i = 0; _i < message.length; _i++) {
            if(message[_i] === 10){
                if(message[_i] === prevvalue){
                    index = _i;
                } 
            }

            prevvalue = message[_i];
        }
        
        if(index != 0){
            var cleanedMessage = message.slice(index+1);
        }else{
            var cleanedMessage = message;
        }

        var decodedMessage = this.cleanDecode(key,message);

        return decodedMessage;
    }

    cleanDecode(key,message){
        var decodedMessage = messageList[key].decode(message);

        decodedMessage = messageList[key].toObject(decodedMessage, {
            enums: Number,  // enums as string names
            longs: Number,  // longs as strings (requires long.js)
            bytes: Array,  // bytes as base64 encoded strings
            defaults: false, // includes default values
            arrays: false,   // populates empty arrays (repeated fields) even if defaults=false
            objects: false,  // populates empty objects (map fields) even if defaults=false
            oneofs: false  
        });

        return decodedMessage;
    }

    render(){
        return null
    }
}

export default ProtobufLib;