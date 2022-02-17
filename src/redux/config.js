import { combineReducers } from 'redux'
import { createStore } from 'redux';

//reducers
import {sessionUser, sessionToken} from './reducers/session'

function saveToLocalStorage(state){
    try {
        const serializedState = JSON.stringify(state)
        localStorage.setItem('state',serializedState)
    } catch (e) {
        console.log(e)
    }
}

function loadFromLocalStorage() {
    try {
        const serializedState = localStorage.getItem('state')
        if(serializedState === null) return undefined
        return JSON.parse(serializedState)
    } catch (e) {
        console.log(e)
        return undefined
    }   
}

const persistedState = loadFromLocalStorage()

const rootReducer  = combineReducers({
    sessionToken,
    sessionUser,
  })

const store = createStore(
    rootReducer,
    persistedState
)

store.subscribe(() => saveToLocalStorage(store.getState()))

export default store