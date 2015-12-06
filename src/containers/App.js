import {repeat} from 'ramda'
import React, { Component, PropTypes } from 'react'
import TodoList from '../components/TodoList'
import Touchable from '../components/Touchable'
import {handler, animationLoop} from '../helpers/handler'
import './_App.scss'

const visibleTodos = repeat({
  text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud.',
}, 6)


const WIDTH = 320

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      offsetX: 0,
      width: WIDTH,
      totalScreens: visibleTodos.length,
    };
    this.handler = handler.bind(this)
    this.animationLoop = animationLoop.bind(this)
  }

  componentDidMount() {
    this.animationLoop()
  }

  render() {
    const {offsetX} = this.state
    return (
      <div>
        <Touchable
          width = {WIDTH}
          handler = {this.handler} />
        <TodoList
          width = {WIDTH}
          offsetX = {offsetX}
          todos={visibleTodos} />
      </div>
    )
  }
}

// Wrap the component to inject dispatch and state into it
export default App
