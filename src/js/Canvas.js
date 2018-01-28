import Particle from './Particle'

export default class Canvas {
  constructor(particles = 50) {
    this.canvas = document.getElementById('canvas')
    this.canvas.setAttribute('width', this.canvas.clientWidth)
    this.canvas.setAttribute('height', this.canvas.clientHeight)
    this.canvas.style.width = ''
    this.canvas.style.height = ''

    this.defaultMousePosition = { x: -1000, y: -1000 }
    this.mousePosition = this.defaultMousePosition
    this.mouseOnCanvas = false

    this.canvas.addEventListener('mousemove', e => this.updateMousePosition(e))
    this.canvas.addEventListener('mouseleave', () => this.mouseLeave())
    window.addEventListener('resize', () => this.resize())

    this.ctx = this.canvas.getContext('2d')
    this.particleImage = new Image()
    this.particleImage.src = 'heart.svg'

    this.particles = new Array(particles)
      .fill(true)
      .map(_ => new Particle(this.ctx, this.boundaries, this.particleImage))
    this.particlePositions = new Array(this.particles.length)

    this.draw()
  }

  get boundaries() {
    return {
      x: this.canvas.width,
      y: this.canvas.height,
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    const distancesFromMouse = this.particleDistancesFromMouse()
    this.particlePositions = this.particles.map((particle, i) =>
      particle.step(distancesFromMouse[i])
    )

    window.requestAnimationFrame(() => this.draw())
  }

  particleDistancesFromMouse() {
    return this.particlePositions.map(position => {
      const deltaX = Math.abs(this.mousePosition.x - position.x)
      const deltaY = Math.abs(this.mousePosition.y - position.y)

      return Math.sqrt(deltaX ** 2 + deltaY ** 2)
    })
  }

  updateMousePosition(e) {
    const rect = this.canvas.getBoundingClientRect()

    this.mousePosition = {
      x: e.pageX - rect.left,
      y: e.pageY - rect.top,
    }
  }

  mouseLeave() {
    this.mousePosition = this.defaultMousePosition
  }

  resize() {
    this.canvas.setAttribute('width', this.canvas.clientWidth)
    this.canvas.setAttribute('height', this.canvas.clientHeight)

    this.particles.forEach(particle =>
      particle.updateBoundaries(this.boundaries)
    )
  }
}
