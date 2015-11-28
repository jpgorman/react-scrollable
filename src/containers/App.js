import {repeat} from 'ramda'
import React, { Component, PropTypes } from 'react'
import TodoList from '../components/TodoList'
import Touchable from '../components/Touchable'
import './_App.scss'

const visibleTodos = repeat({
  text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud.',
}, 6)

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {offSetX: 0};
    this.handler = this.handler.bind(this)
  }

  handler(distance){
    if(Math.abs(distance) > 0) {
      const offSetX = this.state.offSetX + Math.round(distance)
      this.setState({
        offSetX: offSetX
      })
    }
  }

  render() {
    const {offSetX} = this.state
    return (
      <div>
        <Touchable handler = {this.handler} />
        <TodoList
          offSetX = {offSetX}
          todos={visibleTodos} />
      </div>
    )
  }
}

// Wrap the component to inject dispatch and state into it
export default App
