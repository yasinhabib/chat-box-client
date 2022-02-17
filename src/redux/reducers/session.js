import {
  SESSION_TOKEN,
  SESSION_ROLE,
  SESSION_USER
} from '../actions/session'

export function sessionToken(state=[], action){
  switch(action.type){
    case SESSION_TOKEN:
      return action.token;
    default: 
      return state
  }
}
export function sessionUser(state=[], action){
  switch(action.type){
    case SESSION_USER:
      return action.user;
    default: 
      return state
  }
}

export default sessionToken