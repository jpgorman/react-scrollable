export default class Timeline {

  constructor() {
    this.timeline = new Map()
    this.hashId = 0
  }

  add (animation) {
    const timestamp = this.hashId++
    const animationHash = {
      id : timestamp,
      animation,
    }
    this.timeline.set(timestamp, animationHash)
    return timestamp
  }

  runWith (fn) {
    this.timeline.forEach((item) => fn(item.animation))
  }

  listAll () {
    return this.timeline.entries()
  }

  remove (animationId) {
    if (this.timeline.has(animationId)) {
      this.timeline.delete(animationId)
    }
    return this.timeline
  }
}
