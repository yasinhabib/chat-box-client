import React, { Component } from 'react'
import Stomp from 'plugin/stomp';
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route } from "react-router-dom";

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
          </Router>
        </Provider>
      </div>
    )
  }
}

export default App