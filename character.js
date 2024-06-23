let heroDetail = [
    {
        Name: 'Idle',
        w: 530,
        h: 450
    },
    {
        Name: 'Run',
        w: 630,
        h: 450
    },
    {
        Name: 'Hurt',
        w: 530,
        h: 470
    },
    {
        Name: 'Shoot',
        w: 550,
        h: 500
    }
]


// window.onload = function () {



class HeroAnimation {
    constructor({ width, height, motion, picNum }) {
        this.width = width
        this.height = height
        this.motion = motion
        this.picNum = picNum
        this.picW = 630;
        this.picH = 450;
        this.canvas;
        this.c;
        this.frameRate = 0;
        this.face = 1
        this.slowMo = 5
    }
    create() {
        this.canvas = document.createElement('canvas')
        this.canvas.width = this.width
        this.canvas.height = this.height
        // document.body.appendChild(this.canvas)
        this.canvas.style.border = '1px solid black'
        this.c = this.canvas.getContext('2d')
    }
    update() {
        this.draw()
    }
    draw() {
        if (this.face == 1) {
            this.c.drawImage(getImage(`img/Hero/${this.motion}/${this.motion}_${this.picNum}.png`), 0, 0, this.picW, this.picH, 0, 0, this.canvas.width, this.canvas.height)
        } else {
            this.c.save()
            this.c.translate(this.width, 0)
            this.c.scale(-1, 1)
            this.c.drawImage(getImage(`img/Hero/${this.motion}/${this.motion}_${this.picNum}.png`), 0, 0, this.picW, this.picH, 0, 0, this.canvas.width, this.canvas.height)
            this.c.restore()
        }

    }

    startAnimation() {
        requestAnimationFrame(this.startAnimation.bind(this))
        this.c.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.update();
        if (this.frameRate % this.slowMo === 0) {
            if (this.motion == 'Idle') {
                this.slowMo = 5
                if (parseInt(this.picNum) < 9) {
                    this.picNum = `00${parseInt(this.picNum) + 1}`
                } else if (parseInt(this.picNum) < 11) {
                    this.picNum = `0${parseInt(this.picNum) + 1}`
                } else {
                    this.picNum = `000`
                }
            } else if (this.motion == 'Run') {
                this.slowMo = 5
                if (parseInt(this.picNum) < 9) {
                    this.picNum = `00${parseInt(this.picNum) + 1}`
                } else if (parseInt(this.picNum) < 13) {
                    this.picNum = `0${parseInt(this.picNum) + 1}`
                } else {
                    this.picNum = `000`
                }
            } else if (this.motion == 'Shoot') {
                this.slowMo = 1
                if (parseInt(this.picNum) < 9) {
                    this.picNum = `00${parseInt(this.picNum) + 1}`
                } else if (parseInt(this.picNum) < 14) {
                    this.picNum = `0${parseInt(this.picNum) + 1}`
                } else {
                    this.picNum = `000`
                }
            } else if (this.motion == 'Hurt') {
                this.slowMo = 5
                if (parseInt(this.picNum) < 9) {
                    this.picNum = `00${parseInt(this.picNum) + 1}`
                } else {
                    this.picNum = `000`
                }
            } else if (this.motion == 'Death') {
                this.slowMo = 5
                if (parseInt(this.picNum) < 9) {
                    this.picNum = `00${parseInt(this.picNum) + 1}`
                } else if (parseInt(this.picNum) < 14) {
                    this.picNum = `0${parseInt(this.picNum) + 1}`
                } else {
                    this.picNum = `000`
                }
            } else if (this.motion == 'Jump Start') {
                this.slowMo = 5
                if (parseInt(this.picNum) < 9) {
                    this.picNum = `00${parseInt(this.picNum) + 1}`
                } else {
                    this.picNum = `000`
                }
            } else if (this.motion == 'Jump On Air') {
                this.slowMo = 10
                this.picNum = '000'
            } else if (this.motion == 'Jump Fall') {
                this.slowMo = 10
                this.picNum = '000'
            }
        }
        this.frameRate++;
    }
}

class Enemy1 {
    constructor({ width, height, motion, picNum }) {
        this.width = width
        this.height = height
        this.motion = motion
        this.picNum = picNum
        this.canvas;
        this.c;
        this.frameRate = 0;
        this.face = 1
        this.slowMo = 5
        this.name = 'Enemy1'
    }
    create() {
        this.canvas = document.createElement('canvas')
        this.canvas.width = this.width
        this.canvas.height = this.height
        // document.body.appendChild(this.canvas)
        this.canvas.style.border = '1px solid black'
        this.c = this.canvas.getContext('2d')
    }
    update() {
        this.draw()
    }
    draw() {
        if (this.face == 1) {
            this.c.drawImage(getImage(`img/Zombie/${this.motion}${this.picNum}.png`), 0, 0, this.canvas.width, this.canvas.height)
        } else {
            this.c.save()
            this.c.translate(this.width, 0)
            this.c.scale(-1, 1)
            this.c.drawImage(getImage(`img/Zombie/${this.motion}${this.picNum}.png`), 0, 0, this.canvas.width, this.canvas.height)
            this.c.restore()
        }

    }

    startAnimation() {
        requestAnimationFrame(this.startAnimation.bind(this))
        this.c.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.update();
        if (this.frameRate % this.slowMo === 0) {
            if (this.motion == 'Idle') {
                this.slowMo = 5
                if (this.picNum < 4) {
                    this.picNum = this.picNum + 1
                } else {
                    this.picNum = 1
                }
            } else if (this.motion == 'Run') {
                this.slowMo = 5
                if (this.picNum < 10) {
                    this.picNum = this.picNum + 1
                } else {
                    this.picNum = 5
                }
            } else if (this.motion == 'Attack') {
                this.slowMo = 15
                if (this.picNum < 6) {
                    this.picNum = this.picNum + 1
                } else {
                    this.picNum = 1
                }
            } else if (this.motion == 'Hurt') {
                this.slowMo = 10
                if (this.picNum < 5) {
                    this.picNum = this.picNum + 1
                } else {
                    this.picNum = 1
                }
            } else if (this.motion == 'Dead') {
                this.slowMo = 10
                if (this.picNum < 8) {
                    this.picNum = this.picNum + 1
                } else {
                    this.picNum = 1
                }
            } else if (this.motion == 'Walk') {
                this.slowMo = 5
                if (this.picNum < 6) {
                    this.picNum = this.picNum + 1
                } else {
                    this.picNum = 1
                }
            } else if (this.motion == 'Jump') {
                this.slowMo = 5
                if (this.picNum < 7) {
                    this.picNum = this.picNum + 1
                } else {
                    this.picNum = 1
                }
            }
        }
        this.frameRate++;
    }
}


class Enemy2 {
    constructor({ width, height, motion, picNum }) {
        this.width = width
        this.height = height
        this.motion = motion
        this.picNum = picNum
        this.canvas;
        this.c;
        this.frameRate = 0;
        this.face = 1
        this.slowMo = 5
        this.name = 'Enemy2'
        this.image1 = getImage(`img/Bird/flying BirdFly.png`)
        this.image2 = getImage(`img/Bird/flying BirdAttack.png`)
    }
    create() {
        this.canvas = document.createElement('canvas')
        this.canvas.width = this.width
        this.canvas.height = this.height
        // document.body.appendChild(this.canvas)
        this.canvas.style.border = '1px solid black'
        this.c = this.canvas.getContext('2d')
    }
    update() {
        this.draw()
    }
    draw() {
        if (this.face == 1) {
            if (this.motion == 'Fly') {
                this.c.drawImage(this.image1, 0 + this.image1.width / 2 * this.picNum, 0, this.image1.width / 2, this.image1.height, 0, 0, this.canvas.width, this.canvas.height)
            } else {
                this.c.drawImage(this.image2, 0 + this.image2.width / 5 * this.picNum, 0, this.image2.width / 5, this.image2.height, 0, 0, this.canvas.width, this.canvas.height)
            }
        } else {
            this.c.save()
            this.c.translate(this.width, 0)
            this.c.scale(-1, 1)
            if (this.motion == 'Fly') {
                this.c.drawImage(this.image1, 0 + this.image1.width / 2 * this.picNum, 0, this.image1.width / 2, this.image1.height, 0, 0, this.canvas.width, this.canvas.height)
            } else {
                this.c.drawImage(this.image2, 0 + this.image2.width / 5 * this.picNum, 0, this.image2.width / 5, this.image2.height, 0, 0, this.canvas.width, this.canvas.height)
            }
            this.c.restore()
        }
    }

    startAnimation() {
        requestAnimationFrame(this.startAnimation.bind(this))
        this.c.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.update();
        if (this.frameRate % this.slowMo === 0) {
            if (this.motion == 'Fly') {
                this.slowMo = 5
                if (this.picNum < 1) {
                    this.picNum++
                } else {
                    this.picNum = 0
                }
            } else if (this.motion == 'Attack') {
                this.slowMo = 10
                if (this.picNum < 4) {
                    this.picNum++
                } else {
                    this.picNum = 0
                }
            }
        }
        this.frameRate++;
    }
}

class Drone {
    constructor() {
        this.width = 100
        this.height = 100
        this.motion = 'Idle'
        this.picNum = 0
        this.canvas;
        this.c;
        this.frameRate = 0;
        this.face = 1
        this.slowMo = 5
        this.image = getImage(`img/Drones/1 Drones/3/${this.motion}.png`)
        this.picw = this.image.width / 4
        this.pich = this.image.height
    }
    create() {
        this.canvas = document.createElement('canvas')
        this.canvas.width = this.width
        this.canvas.height = this.height
        // document.body.appendChild(this.canvas)
        this.canvas.style.border = '1px solid black'
        this.c = this.canvas.getContext('2d')
    }
    update() {
        this.draw()
    }
    draw() {
        if (this.face == 1) {
            this.c.drawImage(this.image, 0 + (this.picw * this.picNum), 0, this.picw, this.pich, 0, 0, this.canvas.width, this.canvas.height)
        } else {
            this.c.save()
            this.c.translate(this.width, 0)
            this.c.scale(-1, 1)
            this.c.drawImage(this.image, 0 + (this.picw * this.picNum), 0, this.picw, this.pich, 0, 0, this.canvas.width, this.canvas.height)
            this.c.restore()
        }

    }

    startAnimation() {
        requestAnimationFrame(this.startAnimation.bind(this))
        this.c.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.update();
        if (this.frameRate % this.slowMo === 0) {
            if (this.motion == 'Idle') {
                this.slowMo = 5
                if (this.picNum < 3) {
                    this.picNum = this.picNum + 1
                } else {
                    this.picNum = 0
                }
            }
        }
        this.frameRate++;
    }
}

class Inventory {
    constructor({ width, height }) {
        this.width = width
        this.height = height
        this.canvas;
        this.c;
        this.life = 100
        this.picNum = 1
        this.frameRate = 0
    }

    createCanvas() {
        this.canvas = document.createElement('canvas')
        this.canvas.width = this.width
        this.canvas.height = this.height
        // document.body.appendChild(this.canvas)
        this.canvas.style.border = '1px solid black'
        this.c = this.canvas.getContext('2d')
    }

    updateLife() {
        this.drawLife()
    }

    drawLife() {
        this.c.drawImage(LifeExilir, 0 + (LifeExilir.width / 10) * (parseInt((100 - this.life) / 10)), 0, LifeExilir.width / 10, LifeExilir.height, 0, 0, this.canvas.width, this.canvas.height)
    }

    startAnimation() {
        requestAnimationFrame(this.startAnimation.bind(this))
        this.c.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.updateLife()
        this.frameRate++;
    }
}

let LifeExilir = getImage('img/Life.png')

function getImage(imageSrc) {
    let image = new Image();
    image.src = imageSrc;
    return image;
}






// let hero = new HeroAnimation({width:600,height:600,motion:'Jump Start',picNum:'000'})
// hero.create()
// hero.face = 1
// hero.startAnimation()

// let obs = new ObstracleAnimation({width: 600,height: 600})
// obs.create()
// obs.startAnimation()

// let en = new Enemy2({
//     width: 600, height: 600, motion: 'Attack', picNum: 1
// })
// en.create()
// en.face = -1
// en.startAnimation()

// let inventory = new Inventory({width: 600,height: 600})
// inventory.life = true
// inventory.createCanvas()
// inventory.startAnimation()



// let en = new Drone()
// en.create()
// en.startAnimation()

export { HeroAnimation }
export { Enemy1 }
export { Enemy2 }
export { Drone }
export { Inventory }


// }
