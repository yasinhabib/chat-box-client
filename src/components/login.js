import React, { Component } from 'react'
import axios from 'axios'
import { sessionToken } from 'redux/actions/session'
import { sessionUser } from 'redux/actions/session'
import httpRequest from 'plugin/httprequest'

class Login extends Component {
    constructor(props){
        super(props)

        this.state = {
            email: null,
            password: null,
        }
    }

    onValueChanged = (e) => {
        console.log(e)
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    login = async (e) => {
        var result = await axios.post(process.env.REACT_APP_BACKEND+'login',this.state)

        this.props.store.dispatch(sessionToken(result.data.token))

        var user = await httpRequest(process.env.REACT_APP_BACKEND,this.props.store,'get-current-user')

        this.props.store.dispatch(sessionUser(user))

        window.location.href = "/"
    }

    handleKeyDown = (event) => {
        if (event.key === 'Enter') {
          this.login()
        }
    }

    render() {
        return (
            <div className="container d-flex align-items-center justify-content-center vh-100 vw-100">
                <div style={{width: '300px'}}>
                    <h1>Please Sign In</h1>
                    <label for="inputEmail" class="sr-only">Email address</label>
                    <input type="email" class="form-control" placeholder="Email address" name="email" value={this.state.email} onChange={this.onValueChanged} />
                    <label for="inputPassword" class="sr-only">Password</label>
                    <input type="password" class="form-control" placeholder="Password" name="password" value={this.state.password} onKeyDown={this.handleKeyDown} onChange={this.onValueChanged}/>
                    <button class="btn btn-lg btn-primary btn-block mt-2" type="button" onClick={this.login.bind(this)}>Sign in</button>
                </div>
            </div>
        )
    }
}

export default Login