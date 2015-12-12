import React, { Component, PropTypes } from 'react'

export default class Screen extends Component {

  construct(element) {
    this._currentElement = element
  }

  mountComponent(rootID, transaction, context) {
    this.update({}, this._currentElement.props, context)
  }

  unmountComponent() {
    // noop
  }

  receiveComponent(nextElement, transaction, context) {
    this.update(this._currentElement.props, nextElement.props, context)
  }

  getColor(screenOffsetX, totalWidth) {
    const start = [2, 53, 53]
    const end = [1, 165, 184]
    const proportion = Math.max(0, Math.min(1, screenOffsetX / totalWidth))
    const values = start.map((a, i) => {
      const b = end[i]
      return Math.round(proportion * (b - a) + a)
    })
    return `rgba(${values[0]}, ${values[1]}, ${values[2]}, 1)`
  }

  update(prevProps, nextProps, context) {
    const { ctx } = context
    const {
      offsetX,
      screenOffsetX,
      width,
      height,
      fillStyle
    } = nextProps

    ctx.beginPath()
    ctx.fillStyle = this.getColor(screenOffsetX, width * 3)
    ctx.fillRect(screenOffsetX - offsetX,0,width, height)
  }
}

Screen.contextTypes = {
  ctx: PropTypes.object,
}
