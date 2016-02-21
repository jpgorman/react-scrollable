import React from "react"
import CSSModules from "react-css-modules"
import styles from "./_touchable.scss"

let lastEvent = null
let prevEvent = null
let isDragging = false

function getPageX(e) {
  if (e) {
    const event = e.nativeEvent || e
    return event.pageX === undefined ? event.touches[0].pageX : event.pageX
  }
}

function getDistance() {
  if (lastEvent && prevEvent) {
    const dx = prevEvent.pageX - lastEvent.pageX
    return dx
  }
}

function getVelocity() {
  if (lastEvent && prevEvent) {
    const dt = prevEvent.timeStamp - lastEvent.timeStamp
    const dx = prevEvent.pageX - lastEvent.pageX
    return dx / dt
  }
}

function getMeta() {
  return {
    distance: getDistance(),
    velocity: getVelocity(),
    isDragging,
  }
}

function addToEventStack(event) {
  if (lastEvent) prevEvent = lastEvent
  lastEvent = {
    timeStamp: event.timeStamp,
    pageX: getPageX(event),
  }
}

function clearEventStack() {
  lastEvent = null
  prevEvent = null
}

class Touchable extends React.Component {

  constructor(props) {
    super(props)
    this.bindEvents = this.bindEvents.bind(this)
    this.removeEvents = this.removeEvents.bind(this)
    this.onDragStart = this.onDragStart.bind(this)
    this.onDragEnd = this.onDragEnd.bind(this)
    this.onDrag = this.onDrag.bind(this)
  }

  shouldComponentUpdate(nextProps) {
    const {width, height} = this.props
    return nextProps.width !== width || nextProps.height !== height
  }

  onDrag(event) {
    const {handler} = this.props
    addToEventStack(event)
    handler(getMeta())
  }

  onDragStart() {
    this.bindEvents()
    clearEventStack()
    isDragging = true
  }

  onDragEnd() {
    const {handler} = this.props
    isDragging = false
    handler(getMeta())
    this.removeEvents()
  }

  bindEvents() {
    document.addEventListener("mousemove", this.onDrag)
    document.addEventListener("mouseup", this.onDragEnd)
    document.addEventListener("touchmove", this.onDrag)
    document.addEventListener("touchend", this.onDragEnd)
  }

  removeEvents() {
    document.removeEventListener("mousemove", this.onDrag)
    document.removeEventListener("mouseup", this.onDragEnd)
    document.removeEventListener("touchmove", this.onDrag)
    document.removeEventListener("touchend", this.onDragEnd)
  }

  render() {

    const {width, height} = this.props

    return (
      <div
        style = {{
          width,
          height,
        }}
        styleName = "touchable"
        onTouchStart = {this.onDragStart}
        onMouseDown = {this.onDragStart}
       />
    )
  }
}

Touchable.propTypes = {
  handler: React.PropTypes.func.isRequired,
  width: React.PropTypes.number.isRequired,
  height: React.PropTypes.number.isRequired,
}

export default CSSModules(Touchable, styles);
