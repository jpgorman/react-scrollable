import React, { Component, PropTypes } from 'react'

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

export default class Touchable extends React.Component {

  constructor(props) {
    super(props)
    this.bindEvents = this.bindEvents.bind(this)
    this.removeEvents = this.removeEvents.bind(this)
    this.onDragStart = this.onDragStart.bind(this)
    this.onDragEnd = this.onDragEnd.bind(this)
    this.onDrag = this.onDrag.bind(this)
  }

  shouldComponentUpdate() {
    return false
  }

  onDrag(event){
    const {handler} = this.props
    addToEventStack(event)
    handler(getMeta())
  }

  onDragStart(event) {
    this.bindEvents()
    clearEventStack()
    isDragging = true
  }

  onDragEnd(event) {
    const {handler} = this.props
    isDragging = false
    handler(getMeta())
    this.removeEvents()
  }

  bindEvents(event) {
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

    const {width} = this.props

    return (
      <div
        style = {{
          width
        }}
        id = "touchable"
        onTouchStart = {this.onDragStart}
        onMouseDown = {this.onDragStart}
       />
    )
  }
}

Touchable.propTypes = {
  handler: React.PropTypes.func.isRequired,
  width: React.PropTypes.number.isRequired,
}
