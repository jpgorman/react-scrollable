import React, { Component, PropTypes } from 'react'

export default class Canvas extends Component {

  constructor(props) {
    super(props)

    this._canvas = document.createElement("canvas")
    this._ctx = this._canvas.getContext("2d")
    this.state = {}
  }

  componentDidMount() {
    this.refs.canvas.appendChild(this._canvas)
    this.updateSize(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.updateSize(nextProps)
  }

  getChildContext() {
      return {
        ctx: this._ctx,
      }
  }

  updateSize(props) {

    const {width, height} = props
    // const deviceDisplayScale = window.devicePixelRatio || 1
    const deviceDisplayScale = 1

    // render more pixels! (for retina displays)
    this._canvas.width = width * deviceDisplayScale
    this._canvas.height = height * deviceDisplayScale

    // scale the canvas back down to the proper size and we should get
    // a higher pixel density
    this._canvas.style.width = width
    this._canvas.style.height = height

    // we need a new 2d context after changing the backing size
    this._ctx = this._canvas.getContext("2d")
    this._ctx.scale(deviceDisplayScale, deviceDisplayScale)

    this.forceUpdate()
  }

  componentWillUpdate(nextProps, nextState) {
    this._canvas.getContext("2d").clearRect(0, 0, this._canvas.width, this._canvas.height)
  }

  render() {

    const {width, height, offsetX} = this.props
    let screenNumber = 0

    return (
      <div
        ref="canvas"
        id="wrapper"
        style = {{width, height}}>
        {React.Children.map(this.props.children, (child) => {
          const screenOffsetX = width * screenNumber++
          const {props} = child
          return React.cloneElement(child, {
            width,
            height,
            offsetX,
            screenNumber,
            screenOffsetX,
            props,
          })
        })}
      </div>
    )
  }
}

Canvas.displayName = "Canvas"
Canvas.childContextTypes = {
  ctx: PropTypes.object,
}
Canvas.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  children: PropTypes.node,
}
