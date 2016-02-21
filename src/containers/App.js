import {mergeAll} from "ramda"
import React, { Component } from "react"
import CSSModules from "react-css-modules"
import Touchable from "../components/Touchable"
import Canvas from "../components/Canvas"
import Screen from "../components/Screen"
import Timeline from "../components/helpers/timeline"
import {handler, animationLoop} from "../helpers/handler"
import styles from "./_App.scss"
import TWEEN from "tween.js"

const timeline1 = new Timeline()
const timeline2 = new Timeline()


let isInView = false
let isComplete = false
const aniamtion1 = timeline1.add((ctx, props) => {
  const {centerXOffset, centerYOffset, ratioFromCenter} = props
  const circumference = 2 * Math.PI
  const radius = 200

  const position = {
    x: 0,
    y: 0,
    opacity: 0,
  }

  if (ratioFromCenter === 1 && !isInView) {
    isInView = true
    isComplete = false

    new TWEEN.Tween(position)
    .to({ x: centerXOffset, y: centerYOffset, opacity: 1}, 1000)
    .onUpdate(function() {

      ctx.beginPath()
      ctx.arc(position.x, position.y, radius, 0, circumference, false)
      ctx.fillStyle = `rgba(255, 255, 255, ${position.opacity})`
      ctx.fill()

      // console.log("tween1", this.x, this.y);
    })
    .onComplete(function() {
      isComplete = true
    })
    .easing(TWEEN.Easing.Elastic.InOut)
    .start()

  } else if (ratioFromCenter !== 1 && isInView) {
    isInView = false
  }

  if (isComplete && isInView) {
    ctx.beginPath()
    ctx.arc(centerXOffset, centerYOffset, radius, 0, circumference, false)
    ctx.fillStyle = `rgba(255, 255, 255, 1)`
    ctx.fill()
  }

  TWEEN.update()
})

const aniamtion2 = timeline2.add((ctx, props) => {
  const {centerXOffset, centerYOffset, ratioFromCenter} = props
  const dimensions = {
    width: 200,
    height: 200,
  }
  ctx.beginPath()
  ctx.fillStyle = `rgba(255, 255, 255, ${ratioFromCenter})`
  ctx.fillRect(
    centerXOffset - dimensions.width / 2,
    centerYOffset - dimensions.height / 2,
    dimensions.width, dimensions.height
  )
})

const TOTALSCREENS = 2

function getDimensions() {
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
    }

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
          <Screen timeline = {timeline1} />
          <Screen timeline = {timeline2} />
        </Canvas>
      </div>
    )
  }
}

// Wrap the component to inject dispatch and state into it
export default CSSModules(App, styles)
