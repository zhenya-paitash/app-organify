class Cursor {
  constructor(options) {
    this.options = options
    this.work = false
    this.lock = false
    this.lockRotate = false
    this.event = null
    this.animate = false
    this.waitFirstMove = true

    this.$cursor = null
    this.$circle = null
    this.$content = null
    this.pos = { x: 0, y: 0 }
    this.mouse = { x: -100, y: -100 }

    this.size = 1
    this.squeeze = 0.2
    this.acceleration = 200
    this.speed = 0.1

    this.init()
  }

  init() {
    // ? Create cursor DOM element
    this.$cursor = document.createElement('div')
    this.$circle = document.createElement('div')
    this.$content = document.createElement('div')
    this.$cursor.id = 'cursor'
    this.$circle.classList = 'cursor__circle'
    this.$content.classList = 'cursor__content'
    // ? Add element to DOM
    document.body.appendChild(this.$cursor)
    this.$cursor.appendChild(this.$circle)
    this.$cursor.appendChild(this.$content)
    // ? Set default props
    const { mixBlendMode } = getComputedStyle(this.$cursor)
    const { height, width, backgroundColor, opacity } = getComputedStyle(this.$circle)
    this.default = {
      squeeze: this.squeeze,
      mixBlendMode,
      backgroundColor,
      height,
      heightNum: +height.slice(0, -2),
      width,
      widthNum: +width.slice(0, -2),
      opacity,
    }
    // ? Bind and run
    this.$circle.style.height = 0
    this.$circle.style.width = 0
    this.work = true
    this.bind()
    this.render()
  }

  bind() {
    document.addEventListener('mousemove', this.updatePos.bind(this))
    // document.addEventListener('scroll', this.updatePosLock.bind(this))
    document.addEventListener('scroll', e => {
      if (this.lock && this.event) {
        const { offsetLeft, offsetTop, offsetHeight, offsetWidth } = this.event.target
        const padding = getComputedStyle(this.event.target).getPropertyValue('padding')
        const center = {
          x: offsetLeft + offsetWidth / 2 - this.event.view.pageXOffset,
          y: offsetTop + offsetHeight / 2 - this.event.view.pageYOffset + (padding.slice(0, -2) / 2 || 0),
        }
        this.mouse.x = center.x - (center.x - this.event.clientX) / 10
        this.mouse.y = center.y - (center.y - this.event.clientY) / 10
      }
      // this.updateCursor(e)
      // this.updateCursor.call(this.event)
    })

    const data_cursor_color = document.querySelectorAll('[dot-color]')
    const data_cursor_scale = document.querySelectorAll('[dot-scale]')
    const data_cursor_content = document.querySelectorAll('[dot-content]')
    const data_cursor_exclusion = document.querySelectorAll('[dot-exclusion]')
    const data_cursor_hide = document.querySelectorAll('[dot-hide]')
    const data_cursor_girth = document.querySelectorAll('[dot-girth]')
    const data_cursor_stick = document.querySelectorAll('[dot-stick]')

    data_cursor_color.forEach(el => {
      el.addEventListener('mouseenter', e => {
        const attr = e.target?.getAttribute('dot-color')
        this.$circle.setAttribute('color', attr)
      })
      el.addEventListener('mouseleave', e => {
        const attr = e.toElement?.getAttribute('dot-color')
        this.$circle.setAttribute('color', attr || '')
      })
    })

    data_cursor_scale.forEach(el => {
      el.addEventListener('mouseenter', e => {
        const attr = e.target?.getAttribute('dot-scale')
        this.$circle.style.height = this.default.heightNum * attr + 'px'
        this.$circle.style.width = this.default.widthNum * attr + 'px'
        const newSqueeze = this.default.squeeze / attr
        this.squeeze = newSqueeze < 0.1 ? 0.1 : newSqueeze
      })
      el.addEventListener('mouseleave', e => {
        const attr = e.toElement?.getAttribute('dot-scale') || 1
        this.$circle.style.height = this.default.heightNum * attr + 'px'
        this.$circle.style.width = this.default.widthNum * attr + 'px'
        const newSqueeze = this.default.squeeze / attr
        this.squeeze = newSqueeze < 0.1 ? 0.1 : newSqueeze
      })
    })

    data_cursor_content.forEach(el => {
      el.addEventListener('mouseenter', e => {
        const attr = e.target?.getAttribute('dot-content')
        this.$content.setAttribute('content', attr)
        this.$content.classList.add('--visible')
      })
      el.addEventListener('mouseleave', e => {
        const attr = e.toElement?.getAttribute('dot-content')
        this.$content.setAttribute('content', attr || '')
        this.$content.classList.remove(!attr && '--visible')
      })
    })

    data_cursor_exclusion.forEach(el => {
      el.addEventListener('mouseenter', e => {
        this.$cursor.classList.add('--exclusion')
      })
      el.addEventListener('mouseleave', e => {
        const attr = e.toElement?.getAttribute('dot-exclusion')
        this.$cursor.classList.remove(!attr && '--exclusion')
      })
    })

    data_cursor_hide.forEach(el => {
      el.addEventListener('mouseenter', e => {
        this.$circle.style.height = 0
        this.$circle.style.width = 0
      })
      el.addEventListener('mouseleave', e => {
        const isHide = e.toElement?.getAttribute('dot-hide')
        if (isHide) return
        // TODO: SCALE

        const attr = e.toElement?.getAttribute('dot-scale')
        this.$circle.style.height = this.default.height
        this.$circle.style.width = this.default.width
      })
    })

    data_cursor_girth.forEach(el => {
      el.addEventListener('mouseenter', e => {
        // const { clientX, clientY, pageX, pageY } = e
        // const { height, width, borderRadius, offsetTop, offsetLeft, offsetHeight, offsetWidth } = getComputedStyle(
        //   e.target
        // )
        const { height, width, borderRadius } = getComputedStyle(e.target)
        this.event = e
        this.lock = true
        this.lockRotate = true

        this.$circle.style.height = height
        this.$circle.style.width = width
        this.$circle.style.borderRadius = borderRadius
        this.$circle.style.opacity = 0.1
      })
      el.addEventListener('mouseleave', e => {
        this.event = null
        this.lock = false
        this.$circle.style.height = ''
        this.$circle.style.width = ''
        this.animate = true

        this.lockRotate = false
        this.$circle.style.borderRadius = ''
        this.$circle.style.opacity = ''
        this.animate = false
        // setTimeout(() => {
        //   this.lockRotate = false
        //   this.$circle.style.borderRadius = ''
        //   this.$circle.style.opacity = ''
        //   this.animate = false
        // }, 300)

        // this.$circle.style.borderRadius = ''
        // this.$circle.style.opacity = ''
      })
    })

    data_cursor_stick.forEach(el => {
      el.addEventListener('mouseenter', e => {
        // const { clientX, clientY, pageX, pageY } = e
        // const { height, width, borderRadius, offsetTop, offsetLeft, offsetHeight, offsetWidth } = getComputedStyle(
        //   e.target
        // )
        this.event = e
        this.lock = true
        // this.$circle.style.height = '64px'
        // this.$circle.style.width = '64px'
      })
      el.addEventListener('mouseleave', e => {
        // const attr = e.toElement?.getAttribute('dot-hide')
        this.event = null
        this.lock = false
        // this.$circle.style.height = ''
        // this.$circle.style.width = ''
        // this.$circle.style.borderRadius = ''
        // this.$circle.style.opacity = ''
      })
    })
  }

  render() {
    console.log('render')
    if (!this.work) return
    this.updateCursorCircle()
    requestAnimationFrame(this.render.bind(this))
  }

  updatePos(event) {
    const { clientX: x, clientY: y } = event
    // if (this.lock && this.event) return this.updatePosLock(x, y)
    if (this.lock && this.event) {
      const { offsetLeft, offsetTop, offsetHeight, offsetWidth } = this.event.target
      const padding = getComputedStyle(this.event.target).getPropertyValue('padding')
      const center = {
        // x: offsetLeft + offsetWidth / 2 - this.event.view.pageXOffset,
        // y: offsetTop + offsetHeight / 2 - this.event.view.pageYOffset + (padding.slice(0, -2) / 2 || 0),
        x: offsetLeft + offsetWidth / 2 - this.event.view.pageXOffset,
        y: offsetTop + offsetHeight / 2 - this.event.view.pageYOffset,
      }
      this.mouse.x = center.x - (center.x - x) / 10
      this.mouse.y = center.y - (center.y - y) / 10
      // this.mouse.x = center.x - (center.x - x) / 5
      // this.mouse.y = center.y - (center.y - y) / 5
      return
    }

    this.mouse.x = x
    this.mouse.y = y

    if (this.waitFirstMove) {
      this.pos.x = x
      this.pos.y = y
      // TODO: or scale
      this.$circle.style.height = this.default.height
      this.$circle.style.width = this.default.width
      this.waitFirstMove = false
    }
  }

  // updatePosLock(x, y) {
  //   if (!this.lock || !this.event) return

  //   const { offsetLeft, offsetTop, offsetHeight, offsetWidth } = this.event.target
  //   const padding = getComputedStyle(this.event.target).getPropertyValue('padding')
  //   const targetCenter = {
  //     x: offsetLeft + offsetWidth / 2 - this.event.view.pageXOffset,
  //     y: offsetTop + offsetHeight / 2 - this.event.view.pageYOffset + (padding.slice(0, -2) / 2 || 0),
  //   }

  //   this.mouse.x = targetCenter.x - (targetCenter.x - x || this.event.clientX) / 10
  //   this.mouse.y = targetCenter.y - (targetCenter.y - y || this.event.clientY) / 10
  // }

  updateCursorCircle() {
    const diffX = Math.round(this.mouse.x - this.pos.x)
    const diffY = Math.round(this.mouse.y - this.pos.y)
    this.pos.x += diffX * this.speed
    this.pos.y += diffY * this.speed
    const translate = `translate3d(${this.pos.x}px, ${this.pos.y}px, 0)`
    this.$cursor.style.transform = translate

    if (this.lockRotate) {
      this.$circle.style.transform = `scale(1,1)`
      return
    }

    const angle = this._getAngle(diffX, diffY)
    const squeeze = this._getSqueeze(diffX, diffY)
    const rotate = `rotate(${angle}deg)`
    const scale = `scale(${this.size + squeeze}, ${this.size - squeeze})`
    this.$circle.style.transform = rotate + scale
  }

  _getAngle(diffX, diffY) {
    return (Math.atan2(diffY, diffX) * 180) / Math.PI
  }

  _getSqueeze(diffX, diffY) {
    const distance = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2))
    return Math.min(distance / this.acceleration, this.squeeze)
  }
}

const cursor = new Cursor()
