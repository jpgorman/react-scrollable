import React, { Component, PropTypes } from 'react'
import {makePlanet} from './helpers/make-planet'
import R from 'ramda'

const planetFactory = R.curry(function(rotation, orbitWidth, planetWidth, total, list){
  const mapIndexed = R.addIndex(R.map)
  return mapIndexed((val, idx) => makePlanet(rotation, orbitWidth, planetWidth, idx, total))(list)
})

let rotation = 0

function generatePlanets(planets, orbitWidth, planetWidth) {
  rotation += 0.001
  return R.converge(
   planetFactory(rotation, orbitWidth, planetWidth),
   [R.length, R.identity]
  )(planets)
}

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
      fillStyle,
      animationParam,
    } = nextProps

    const leftOffset = screenOffsetX - offsetX
    const centerXOffset = leftOffset + width * 0.5
    const centerYOffset = height * 0.5
    const ratioFromCenter = animationParam > 0.5 ? 2 * (1 - animationParam) : 2 * animationParam
    let message = "Hello World"
    const fontSize = 48

    const planets = [
      "hsbc",
      "natwest",
      "halifax",
      "rbs",
      "natwest",
      "halifax",
      "rbs",
      "rbs",
    ]
    const orbitWidth = width * 0.5
    const planetWidth = 20

    if (animationParam == 0){
      message = "center"
    }

    ctx.beginPath()
    ctx.fillStyle = this.getColor(screenOffsetX, width * 3)
    ctx.fillRect(leftOffset,0,width, height)

    generatePlanets(planets, orbitWidth, planetWidth).map((planet) => {
      let {left, top} = planet

      left += centerXOffset - orbitWidth / 2
      top += centerYOffset - orbitWidth / 2

      ctx.beginPath();
      ctx.arc(left, top, planetWidth, 0, 2 * Math.PI, false);
      ctx.fillStyle =`rgba(255, 255, 255, ${ratioFromCenter})`
      ctx.fill();
    })

    ctx.font = `${fontSize}px verdana, sans-serif`
    ctx.fillStyle = `rgba(255, 255, 255, ${ratioFromCenter})`
    ctx.textAlign = "start"
    ctx.textBaseline = "middle"
    ctx.fillText(message, centerXOffset - (ctx.measureText(message).width / 2), centerYOffset)
  }
}

Screen.contextTypes = {
  ctx: PropTypes.object,
}
