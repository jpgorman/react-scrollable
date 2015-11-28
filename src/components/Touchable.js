import React, { Component, PropTypes } from 'react'

const maxStackLength = 50

let eventStack = []
let isDragging = false
let xOffset = 0;

function getMeta() {
  return {
    distance: getDistance(),
    isDragging,
  }
}

function getPageX(e) {
  if (e) {
    const event = e.nativeEvent || e
    return event.pageX === undefined ? event.touches[0].pageX : event.pageX
  }
}

function getDistance() {

  if (eventStack.length > 0) {
    const previous = eventStack[eventStack.length - 2]
    const last = eventStack[eventStack.length - 1]
    const dx = getPageX(previous) - getPageX(last)
    return dx
  }
}

function addToEventStack(event) {
  if (eventStack.length >= maxStackLength) eventStack.shift()
  eventStack.push(event)
}

function clearEventStack() {
  eventStack = []
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

  onDrag(event){
    const {handler} = this.props
    addToEventStack(event)
    handler(getMeta().distance)
  }

  onDragStart(event) {
    this.bindEvents()
    clearEventStack()
    isDragging = true
  }

  onDragEnd(event) {
    isDragging = false
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
    return (
      <div
        id = "touchable"
        onTouchStart = {this.onDragStart}
        onMouseDown = {this.onDragStart}
       />
    )
  }
}

Touchable.propTypes = {
  handler: React.PropTypes.func.isRequired,
}
