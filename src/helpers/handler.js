import {merge} from 'ramda'
import BezierEasing from "bezier-easing"
import {timestamp} from './timestamp'

const SCROLL_DURATION = 300

let privateState = {
  isDragging: false,
  isAnimating: false,
  previousScreen: 0,
  nextScreen: 0,
  offsetX: 0,
}

let loop = () => {}

function currentScreen({offsetX, width, totalScreens}) {
  const current = Math.round(offsetX / width)
  return Math.max(0, Math.min(totalScreens - 1, current))
}

function chooseNextScreen({velocity, offsetX, width, previousScreen, totalScreens}) {

  const actualCurrentScreen = currentScreen({offsetX, width, totalScreens})
  if (actualCurrentScreen !== previousScreen) return actualCurrentScreen
  privateState.nextScreen = actualCurrentScreen

  const THRESHOLD = 1
  const aboveThreshold = Math.abs(velocity) >= THRESHOLD
  const direction = Math.sign(velocity)


  if (aboveThreshold && direction === 1) privateState.nextScreen--
  if (aboveThreshold && direction === -1) privateState.nextScreen++

  return Math.max(0, Math.min(totalScreens - 1, privateState.nextScreen))
}

function setupScrolling(state, nextScreen) {
  const startTime = timestamp()
  const endTime = startTime + SCROLL_DURATION

  // TODO consider choosing an easing function based on the initalVelocity
  const bezierFunction = BezierEasing(0.25, 0.37, 0.5, 1)
  const startPosition = state.offsetX
  const endPosition = nextScreen * state.width

  state.startPosition = startPosition
  state.endPosition = endPosition
  state.isAnimating = true
  state.easingFunction = (now) => {
    const bezierInput = Math.max(0, Math.min(1, (now - startTime) / (endTime - startTime)))
    const r = bezierFunction.get(bezierInput)
    return r * (endPosition - startPosition) + startPosition
  }
}

export function animationLoop () {

  loop = () => {

    if (privateState.isAnimating) {
      privateState.offsetX = privateState.easingFunction(timestamp())
      // Stop animating if animation has ended and position has settled
      if (privateState.offsetX === privateState.endPosition) {
        privateState.isAnimating = false
      }
    }
    this.setState(privateState)
    requestAnimationFrame(() => loop())
  }

  requestAnimationFrame(() => loop())
}

function mergeState() {
  return merge(...arguments)
}

export function handler({distance, isDragging, velocity}) {
  const initializeScroll = privateState.isDragging && !isDragging
  const initializeDrag = !privateState.isDragging && isDragging

  // Update privateState based on finger move
  if (distance) {
    privateState.offsetX += distance
    privateState.isDragging = isDragging
    privateState.velocity = velocity
  }

  if (!privateState.isDragging && !privateState.isAnimating) {
    privateState.previousScreen = currentScreen(mergeState(this.state, privateState))
  }

  // Finger has touched the screen since last event so stop scrolling
  if (initializeDrag) {
    // Stop animating if new drag action starts
    privateState.isAnimating = false
  }

  // Finger has moved off the screen since last event so scroll to next position
  if (initializeScroll) {
    privateState = mergeState(this.state, privateState)
    setupScrolling(privateState, chooseNextScreen(privateState))
  }

}