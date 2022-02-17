/*
 * action types
 */

export const SESSION_TOKEN = 'SESSION_TOKEN'
export const SESSION_USER = 'SESSION_USER'
/*
 * action creators
 */

export function sessionToken(token) {
  return { type: SESSION_TOKEN, token }
}
export function sessionUser(user){
  return { type: SESSION_USER, user}
}