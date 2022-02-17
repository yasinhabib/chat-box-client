import React, { Component } from 'react'
import Stomp from 'plugin/stomp';
import Login from './components/login';
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route } from "react-router-dom";
import Chatbox from 'components/chatbox';
import Video from 'components/video';
import VideoReceiver from 'components/videoreceiver';

class App extends Component {
  constructor(props){
    super(props)

    this.stomp = null
  }

  componentWillMount(){
    let wslib  = new Stomp();
    this.stomp = wslib.connect();
  }
  
  render() {
    return (
      <div className="App">
        <Provider store={this.props.store}>
          <Router>
            <Route exact path="/login" component={(props) => <Login {...props} store={this.props.store} />}/>
            <Route exact path="/" component={(props) => <Chatbox {...props} store={this.props.store} stomp={this.stomp}/>}/>
            <Route exact path="/video" component={(props) => <Video {...props} store={this.props.store} stomp={this.stomp}/>}/>
            <Route exact path="/video-receiver" component={(props) => <VideoReceiver {...props} store={this.props.store} stomp={this.stomp}/>}/>
          </Router>
        </Provider>
      </div>
    )
  }
}

export default App