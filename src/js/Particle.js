function randomValue(min, max) {
  return Math.random() * (max - min) + min
}

function randomSpeed(max = 0.7) {
  const modifier = Math.random() > 0.5 ? 1 : -1
  return modifier * Math.max(Math.random() * max, 0.3)
}

function randomPosition(max = 0) {
  return Math.floor(randomValue(0, max))
}

function randomSize(min = 10, max = 20) {
  return Math.floor(randomValue(min, max))
}

export default class Particle {
  constructor(ctx, boundaries, image) {
    this.ctx = ctx
    this.boundaries = boundaries
    this.x = randomPosition(boundaries.x)
    this.y = randomPosition(boundaries.y)
    this.vx = randomSpeed()
    this.vy = randomSpeed()
    this.size = randomSize()
    this.image = image

    this.baseOpacity = 0.3
    this.opacity = this.baseOpacity

    this.draw()
  }

  step(distanceFromMouse) {
    this.distanceFromMouse = distanceFromMouse
    this.x += this.vx
    this.y += this.vy

    if (this.x > this.boundaries.x || this.x < -20) {
      this.vx = -this.vx
      this.x += this.vx * 2
    }

    if (this.y > this.boundaries.y || this.y < -20) {
      this.vy = -this.vy
      this.y += this.vy * 2
    }

    this.updateOpacity()
    this.draw()

    return { x: this.x, y: this.y }
  }

  updateOpacity() {
    if (this.targetOpacity() > this.opacity) {
      this.opacity += 0.01
    } else {
      this.opacity -= 0.01
    }
  }

  targetOpacity() {
    const minDistance = 250
    const extraOpacity =
      (minDistance - this.distanceFromMouse ** 2 / minDistance) /
      (minDistance * 2)
    return 0.3 + Math.max(0, extraOpacity)
  }

  draw() {
    const globalAlpha = this.ctx.globalAlpha
    if (globalAlpha !== this.opacity) this.ctx.globalAlpha = this.opacity
    this.ctx.drawImage(this.image, this.x, this.y, this.size, this.size)
    if (globalAlpha !== this.opacity) this.ctx.globalAlpha = globalAlpha
  }

  updateBoundaries(boundaries) {
    this.boundaries = boundaries
  }
}
