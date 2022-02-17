// import React from 'react'
import axios from 'axios'
import { formatDate, objectMap } from 'plugin/helper';

const getRequest = async (beckendserver,store,url, data, oldData = false) => {
    try {
        let result = await axios.get(beckendserver+url+data,{ 
            headers: { 
                Authorization: 'Bearer '+store.getState().sessionToken 
            } 
        })
        
        if(oldData){
            return result
        }
        return result.data
    } catch (error) {
        errorHandling(error,oldData)
    }
}

const postRequest = async (beckendserver,store,url, data, oldData) => {
    try {
        if(!Array.isArray(data.values)){
            data.values = objectMap(data.values, v => v instanceof Date ? formatDate(v) : v)
        }

        let result = await axios.post(beckendserver+url,data.values, {
            headers: {
                Authorization: 'Bearer '+store.getState().sessionToken 
            }
        })
        
        if(typeof oldData === 'function'){
            return oldData(result)
        }
        return result.data
    } catch (error) {
        errorHandling(error,oldData)
    }
}

const putRequest = async (beckendserver,store,url, data, oldData) => {
    try {
        let dataWillUpdated = oldData;

        data.values = objectMap(data.values, v => v instanceof Date ? formatDate(v) : v)
        
        Object.entries(data.values).forEach(entry => {
            let key = entry[0];
            let value = entry[1];

            dataWillUpdated[key] = value
        });
        
        let result = await axios.put(beckendserver+url,dataWillUpdated, {
            headers: {
                Authorization: 'Bearer '+store.getState().sessionToken 
            }
        })
        
        return result.data
    } catch (error) {
        errorHandling(error,oldData)
    }
}

const deleteRequest = async (beckendserver,store,url, data, oldData) => {
    try {
        let result = await axios.delete(beckendserver+url+'/'+data, {
            headers: {
                Authorization: 'Bearer '+store.getState().sessionToken 
            }
        })
        
        return result.data
    } catch (error) {
        errorHandling(error,oldData)
    }
}

const errorHandling = (error,oldData) => {
    if(error.response && error.response.data.status !== 401){
        var response = error.response
        var responseData = response.data || {}

        if(responseData.errorKey === 'procidexists'){
            responseData.title = 'Proses approval untuk data ini masih belum selesai, harap cek daftar pemeriksaan/persetujuan'
        }

        let type = 'error'
        let text = 'Error Code : '+responseData.status+' '+responseData.title

        if(typeof oldData === 'function'){
            return oldData(error.response)
        }

        // notify({ message: text, width: 'AUTO', shading: true, position:{at: 'center', my: 'center', of: window} }, type, 600);
        throw text
    }
}

export function httpRequest (backendserver,store,url, method, data, oldData){
    method = method || 'GET';
    data = data || {};

    // let beckendserver = process.env.REACT_APP_BACKEND

    if(method === 'GET') {        
        data = typeof data === 'object' ? '' : data

        return getRequest(backendserver,store,url, data, oldData)
    }

    if(method === 'POST'){
        return postRequest(backendserver,store,url, data, oldData)
    }

    if(method === 'PUT'){
        return putRequest(backendserver,store,url, data, oldData)
    }

    if(method === 'DELETE'){
        return deleteRequest(backendserver,store,url, data, oldData)
    }
}

export default httpRequest
