import {merge} from 'ramda'

const privateState = {
  isDragging: false,
  isAnimating: false,
  totalScreens: 0,
  nextScreen: 0,
  offsetX: 0,
}

let loop = () => {}

function currentScreen({offsetX, width, totalScreens}) {
  const current = Math.round(-1 * offsetX / width)
  return Math.max(0, Math.min(totalScreens - 1, current))
}

function chooseNextScreen({velocity, offsetX, width, lastScreen, totalScreens}) {

  const actualCurrentScreen = currentScreen({offsetX, width, totalScreens})
  if (actualCurrentScreen !== lastScreen) return actualCurrentScreen

  privateState.nextScreen = lastScreen

  const THRESHOLD = 1
  const aboveThreshold = Math.abs(velocity) >= THRESHOLD
  const direction = Math.sign(velocity)


  if (aboveThreshold && direction === 1) nextScreen--
  if (aboveThreshold && direction === -1) nextScreen++

  console.log(Math.max(0, Math.min(totalScreens - 1, nextScreen)), "nextScreen")

  return Math.max(0, Math.min(totalScreens - 1, nextScreen))
}

export function animationLoop () {

  loop = () => {
    this.setState(privateState)
    requestAnimationFrame(() => loop())
  }

  requestAnimationFrame(() => loop())
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
    privateState.lastScreen = currentScreen(privateState)
  }

  // Finger has touched the screen since last event so stop scrolling
  if (initializeDrag) {
    // Stop animating if new drag action starts
    privateState.isAnimating = false
  }

  // Finger has moved off the screen since last event so scroll to next position
  if (initializeScroll) {
    const nextScreen = chooseNextScreen(merge(privateState, this.state))
    console.log(nextScreen, "nextScreen")
    //setupScrolling(privateState, nextScreen, velocity)
  }

}