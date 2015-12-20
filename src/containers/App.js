import {mergeAll} from 'ramda'
import React, { Component, PropTypes } from 'react'
import TodoList from '../components/TodoList'
import Touchable from '../components/Touchable'
import Canvas from '../components/Canvas'
import Screen from '../components/Screen'
import Timeline from '../components/helpers/timeline'
import {handler, animationLoop} from '../helpers/handler'
import './_App.scss'

const timeline = new Timeline()

const aniamtion1 = timeline.add((ctx) => {
  ctx.beginPath()
  ctx.fillStyle = "red"
  ctx.fillRect(100,100,200, 200)
})
const aniamtion2 = timeline.add((ctx) => {
  ctx.beginPath()
  ctx.fillStyle = "blue"
  ctx.fillRect(0,0,200, 200)
})

const TOTALSCREENS = 3

function getDimensions () {
  return {
    height: Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0),
    width: Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0),
  }
}

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      offsetX: 0,
      width: 0,
      height: 0,
      totalScreens: TOTALSCREENS,
    };
    this.handler = handler.bind(this)
    this.animationLoop = animationLoop.bind(this)
    this.setDimensions = this.setDimensions.bind(this)
  }

  setDimensions() {
    this.setState(mergeAll([].concat(this.state, getDimensions())))
  }

  componentWillMount() {
    this.setDimensions()
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.setDimensions)
  }

  componentDidMount() {
    window.addEventListener("resize", this.setDimensions)
    this.animationLoop()
  }

  render() {
    const {width, height, offsetX} = this.state
    return width === 0 ? (<div>Loading...</div>) : (
      <div
        style = {{
          width,
          height,
        }}
        >
        <Touchable
          width = {width}
          height = {height}
          handler = {this.handler} />
        <Canvas
          offsetX = {offsetX}
          width = {width}
          height = {height}>
          <Screen timeline = {timeline} />
        </Canvas>
      </div>
    )
  }
}

// Wrap the component to inject dispatch and state into it
export default App
