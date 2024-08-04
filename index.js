import { floorPlatform, floorPlatform2, verticalPlatform2, verticalPlatform } from './collision.js'
import { HeroAnimation, Enemy1, Enemy2, Drone, Inventory } from './character.js'

window.onload = function () {
    let myDiv = document.createElement('div')
    myDiv.style.display = 'flex'
    myDiv.style.width = '600px'
    myDiv.style.height = '600px'
    myDiv.style.alignItems = 'center'
    myDiv.style.justifyContent = 'center'
    myDiv.style.border = '1px solid white'
    document.body.appendChild(myDiv)

    let label = document.createElement('label')
    label.setAttribute('for', 'name')
    label.textContent = 'Enter Your Name: '
    label.style.color = 'white'
    label.style.fontSize = '40px'
    myDiv.appendChild(label)

    let text = document.createElement('input')
    text.type = 'text'
    text.style.backgroundColor = 'white'
    text.style.height = '30px'
    text.style.width = '98%'
    text.style.color = 'red'
    text.style.fontWeight = '600'
    text.style.fontSize = '20px'
    label.appendChild(text)

    let myName = ''
    let submit = document.createElement('button')
    submit.textContent = 'Submit'
    submit.style.width = '100px'
    submit.style.height = '50px'
    submit.style.color = 'red'
    submit.style.backgroundColor = 'black'
    submit.style.border = '1px solid red'
    submit.style.position = 'absolute'
    submit.style.top = '60%'
    submit.className = 'submits'
    submit.style.fontSize = '20px'
    submit.addEventListener('mouseover', () => {
        submit.style.backgroundColor = 'red'
        submit.style.color = 'black'
    })
    submit.addEventListener('mouseout', () => {
        submit.style.backgroundColor = 'black'
        submit.style.color = 'red'
    })
    submit.addEventListener('click', () => {
        if (text.value != '') {
            localStorage.setItem(text.value, 0)
            myName = text.value
            startGame()
            document.body.removeChild(myDiv)
        } else {
            text.style.border = '2px solid red'
        }
    })
    myDiv.appendChild(submit)

    let canvas = document.createElement('canvas')
    document.body.appendChild(canvas)
    canvas.hidden = true
    canvas.width = 1024
    canvas.height = 576

    const scaledCanvas = {
        w: canvas.width / 2,
        h: canvas.height / 2
    }

    let c = canvas.getContext('2d')
    const gravity = 0.1

    let score = 0;

    class Sprite {
        constructor({ position, imgSrc }) {
            this.position = position
            this.image = new Image()
            this.image.src = imgSrc
            this.loaded = false
            this.image.onload = () => {
                this.loaded = true
                this.width = this.image.width
                this.height = this.image.height
            }
        }

        draw() {
            if (!this.image) return
            c.drawImage(
                this.image,
                this.position.x,
                this.position.y,
                this.width,
                this.height)
        }

        update() {
            this.draw()
        }
    }

    let background = new Sprite({
        position: {
            x: 0,
            y: 0
        },
        imgSrc: 'tileset image/backgrnd.png'
    })


    const camera = {
        position: {
            x: 0,
            y: -background.image.height + scaledCanvas.h
        }
    }


    addEventListener('keydown', (e) => {
        if (isRunning) {
            if (e.key == 'a' || e.key == 'A') {
                keys.left.pressed = true
            } else if (e.key == 'd' || e.key == 'D') {
                keys.right.pressed = true
            } else if (e.key == 'w' || e.key == 'W') {
                player.velocity.y = -4
            } else if (e.key == 'f' || e.key == 'F') {
                keys.attack.pressed = true
            } else if (e.key == 'i' || e.key == 'I') {
                let inventory = document.getElementById('inventory')
                if (inventory.style.animation == '') {
                    inventory.style.animation = 'inventory .6s ease-in 0s forwards';
                } else if (inventory.style.animation == '0.6s ease-in 0s 1 normal forwards running inventory') {
                    inventory.style.animation = 'inventory2 .6s ease-out 0s forwards';
                } else if (inventory.style.animation == '0.6s ease-out 0s 1 normal forwards running inventory2') {
                    inventory.style.animation = 'inventory .6s ease-in 0s forwards';
                }
            } else if (e.key == 'p' || e.key == 'P') {
                if (isRunning) {
                    cancelAnimationFrame(gameId)
                    isRunning = false
                } else {
                    isRunning = true
                    animate()
                }
            }
        }
    })
    addEventListener('keyup', (e) => {
        if (isRunning) {
            if (e.key == 'a' || e.key == 'A') {
                keys.left.pressed = false
            } else if (e.key == 'd' || e.key == 'D') {
                keys.right.pressed = false
            } else if (e.key == 'f' || e.key == 'F') {
                player.attack()
                keys.attack.pressed = false
            }
        }
    })

    document.getElementById('table').addEventListener('click', (e) => {
        let powerUps;
        if (e.target.tagName == 'TD') {
            powerUps = e.target.textContent;
        } else if (e.target.parentNode.tagName == 'TD') {
            powerUps = e.target.parentNode.textContent;
        }
        if (powerUps == 'Life Essence') {
            if (player.life <= (lifeNo.length * 100) && player.life > ((lifeNo.length * 100) - 100)) {
                player.life = lifeNo.length * 100;
            } else {
                player.life += 100;
            }
        }
        if (powerUps == 'Bazooka Rocket Launcher') {
            if (player.weapon == 'bazooka-rocket-launcher') {
                player.weapon = 'None'
            } else {
                player.weapon = 'bazooka-rocket-launcher'
            }
        }
    })



    class Blocks {
        constructor({ position, floorPlatformArr, floorPlatformArr2 }) {
            this.position = position
            this.width = 50
            this.height = 50
            this.velocity = {
                x: 0,
                y: 1
            }
            this.floorPlatformArr = floorPlatformArr
            this.floorPlatformArr2 = floorPlatformArr2
            this.life = 100
            this.face = 1
            this.image1 = new Image()
            this.image1.src = 'img/Blocks 2.png'
            this.image2 = new Image()
            this.image2.src = 'img/Blocks 3.png'
        }

        draw() {
            if (this.face == 1) {
                c.drawImage(this.image1, 60 + 350 * ((100 - this.life) / 10), 80, 235, 210, this.position.x, this.position.y, this.width, this.height)
            } else {
                c.drawImage(this.image2, 78 + 350 * ((this.life) / 10), 80, 235, 210, this.position.x, this.position.y, this.width, this.height)
            }
        }

        update() {
            this.draw()
            if (this.life > 0) {
                this.checkOtherBlocks()
                this.checkForVerticalCollision()
            } else {
                this.die()
            }
        }

        checkOtherBlocks() {
            let obs = false
            for (let i = 0; i < blocks.length; i++) {
                if (blocks[i] != this) {
                    if (Collision({
                        object1: this,
                        object2: blocks[i]
                    })) {
                        if (this.position.y + this.height - 10 < blocks[i].position.y) {
                            obs = true
                            this.position.y = blocks[i].position.y - this.height
                            break;
                        }
                    }
                }
            }
            if (!obs) {
                this.applyGravity()
            } else {
                this.velocity.y = 0
            }
        }

        die() {
            blocks.splice(blocks.indexOf(this), 1)
        }


        applyGravity() {
            this.velocity.y += gravity
            this.position.y += this.velocity.y
            this.position.x += this.velocity.x
        }

        checkForVerticalCollision() {
            let flpt1 = ArrayCollision({
                object1: this,
                object2: this.floorPlatformArr
            })

            if (flpt1 != null) {
                if (this.velocity.y > 0) {
                    this.velocity.y = 0
                    this.position.y = flpt1.position.y - this.height - 0.01
                }
                if (this.velocity.y < 0) {
                    this.velocity.y = 0
                    this.position.y = flpt1.position.y + flpt1.width + 0.01
                }
            }

            let flpt2 = ArrayCollision({
                object1: this,
                object2: this.floorPlatformArr2
            })

            if (flpt2 != null) {
                if (this.velocity.y > 0) {
                    this.velocity.y = 0
                    this.position.y = flpt2.position.y - this.height - 0.01
                }
                if (this.velocity.y < 0) {
                    this.velocity.y = 0
                    this.position.y = flpt2.position.y + flpt2.width + 0.01
                }
            }
        }
    }

    class Player {
        constructor({ position, floorPlatformArr, verticalPlatformArr, floorPlatformArr2, verticalPlatformArr2 }) {
            this.position = position
            this.width = 35
            this.height = 35
            this.velocity = {
                x: 0,
                y: 1
            }
            this.currentSpite = 'Idle'
            this.floorPlatformArr = floorPlatformArr
            this.floorPlatformArr2 = floorPlatformArr2
            this.verticalPlatformArr = verticalPlatformArr
            this.verticalPlatformArr2 = verticalPlatformArr2
            this.createHero = new HeroAnimation({ width: 100, height: 100, motion: 'Idle', picNum: '000' })
            this.createHero.create()
            this.createHero.startAnimation()
            this.cameraBox = {
                position: {
                    x: this.position.x,
                    y: this.position.y,
                },
                width: 200,
                height: 80
            }
            this.offset = 0
            this.hitbox = {
                position: {
                    x: this.position.x,
                    y: this.position.y
                },
                width: 10,
                height: 10,
            }
            this.frameRate = 0
            this.life = 300
            this.weapon = 'None'
            this.bazooka_rocket_launcher = new AttackWeapons({
                name: 'bazooka-rocket-launcher'
            })
        }

        draw() {
            c.drawImage(this.createHero.canvas, this.position.x, this.position.y, this.width, this.height)
        }

        update() {



            this.ensureCamera()
            this.updateCamerabox()
            this.updateHitbox()
            this.updateWeapons()
            this.draw()
            this.updateHitbox()
            this.checkForHorizontalCollision()
            this.applyGravity()
            this.updateHitbox()
            this.checkForVerticalCollision()
            this.updateLifeAnimation()
            if (this.life <= 0) {
                this.switchSprite('Death')
                if (this.createHero.picNum == '013') {
                    cancelAnimationFrame(gameId)



                    c.fillStyle = '#ff9a3c'
                    c.fillRect(Math.abs(camera.position.x) + 100, Math.abs(camera.position.y) + 100, 100, 150)
                    c.fillStyle = '#222831'
                    c.fillText('User ' + myName, Math.abs(camera.position.x) + 130, Math.abs(camera.position.y) + 130)
                    c.fillText('Score: ' + score, Math.abs(camera.position.x) + 140, Math.abs(camera.position.y) + 150)
                    c.fillStyle = '#f96d00'
                    c.fillRect(Math.abs(camera.position.x) + 220, Math.abs(camera.position.y) + 50, 200, 200)
                    c.fillStyle = '#393e46'
                    c.font = "20px serif";
                    c.fillText('Leaderboard', Math.abs(camera.position.x) + 280, Math.abs(camera.position.y) + 70)
                    c.font = "5px serif";




                    let scr = localStorage.getItem(myName)
                    if (scr < score) {
                        localStorage.setItem(myName, score)
                    }
                    let leader = []
                    for (let i = 0; i < localStorage.length; i++) {
                        let user = localStorage.key(i)
                        let user_score = parseInt(localStorage.getItem(user))
                        leader.push({
                            name: user,
                            distance: user_score
                        })
                    }
                    sortArray(leader, 0, leader.length - 1)
                    for (let i = 0; i < 20; i++) {
                        if (i <= leader.length && leader[i] != undefined) {
                            c.fillText(`${i + 1}. ${leader[leader.length - 1 - i].name}   ${leader[leader.length - 1 - i].distance}`, Math.abs(camera.position.x) + 225, Math.abs(camera.position.y) + 80 + 8 * i)
                        } else {
                            break;
                        }
                    }
                }
            }

            this.frameRate++;
        }

        updateWeapons() {
            if (this.weapon == 'bazooka-rocket-launcher') {
                this.bazooka_rocket_launcher.update()
            }
        }

        updateLifeAnimation() {
            if (this.life > 0) {
                let dummy = this.life
                let last = false
                for (let i = 0; i < lifeNo.length; i++) {
                    if (dummy >= 100 && !last) {
                        lifeNo[i].lifeObj.life = 100
                        c.drawImage(lifeNo[i].animateCanvas, Math.abs(camera.position.x) + 10 + 30 * i, Math.abs(camera.position.y) + 20, 20, 20)
                        dummy -= 100;
                    } else if (dummy >= 0) {
                        if (!last) {
                            lifeNo[i].lifeObj.life = dummy
                            last = true
                        } else {
                            lifeNo[i].lifeObj.life = 10
                        }
                        c.drawImage(lifeNo[i].animateCanvas, Math.abs(camera.position.x) + 10 + 30 * i, Math.abs(camera.position.y) + 20, 20, 20)
                    }
                }
            }
        }

        attack() {
            if (this.frameRate % 10 === 0) {
                if (this.weapon == 'None') {
                    if (this.createHero.face == -1) {
                        bullets.push(new Bullet({
                            position: {
                                x: this.hitbox.position.x,
                                y: this.hitbox.position.y,
                            },
                            velocity: {
                                x: -3,
                                y: 0
                            },
                            width: 20,
                            height: 20,
                            bulletNum: '01L',
                            damage: 15
                        }))
                    } else {
                        bullets.push(new Bullet({
                            position: {
                                x: this.hitbox.position.x,
                                y: this.hitbox.position.y,
                            },
                            velocity: {
                                x: 3,
                                y: 0
                            },
                            width: 20,
                            height: 20,
                            bulletNum: '01',
                            damage: 15
                        }))
                    }
                } else if (this.weapon == 'bazooka-rocket-launcher') {
                    this.bazooka_rocket_launcher.attack()
                }

            }
        }


        updateHitbox() {
            this.hitbox = {
                position: {
                    x: this.position.x + 5,
                    y: this.position.y
                },
                width: 18,
                height: 35,
            }
        }

        ensureCamera() {
            const cameraRightSide = this.cameraBox.position.x + this.cameraBox.width + this.velocity.x
            const cameraLeftSife = this.cameraBox.position.x + this.velocity.x
            const cameraUpSide = this.cameraBox.position.y + this.cameraBox.height
            const cameraDownSide = this.cameraBox.position.y


            if (cameraLeftSife < Math.abs(camera.position.x) && cameraLeftSife >= 0) {
                camera.position.x -= this.velocity.x;
            }

            if (cameraRightSide > Math.abs(camera.position.x) + scaledCanvas.w && cameraRightSide <= background.image.width) {
                camera.position.x -= this.velocity.x;
            }

            if (cameraDownSide < Math.abs(camera.position.y) && this.velocity.y < 0 && camera.position.y < 0) {
                camera.position.y -= this.velocity.y;
            }

            if (cameraUpSide > Math.abs(camera.position.y) + scaledCanvas.h && this.velocity.y > 0 && camera.position.y > -background.image.height) {
                camera.position.y -= this.velocity.y;
            }
        }


        updateCamerabox() {
            this.cameraBox = {
                position: {
                    x: this.position.x - 80,
                    y: this.position.y - 25
                },
                width: 190,
                height: 80
            }
        }

        checkHorizontalCanvasCollision() {
            if (this.hitbox.position.x + this.velocity.x <= 0) {
                this.velocity.x = 0
            } else if (this.hitbox.position.x + this.velocity.x + this.hitbox.width >= background.image.width) {
                this.velocity.x = 0
            }
        }

        checkVerticalCanvasCollision() {
            if (this.hitbox.position.y + this.velocity.y <= 0) {
                this.velocity.y = 0
            } else if (this.hitbox.position.y + this.velocity.y + this.hitbox.height >= background.image.height) {
                this.velocity.y = 0
            }
        }

        switchSprite(key) {
            if (this.currentSpite != key) {
                this.currentSpite = key
                this.createHero.motion = key
                this.createHero.picNum = '000'
            }
        }

        checkForVerticalCollision() {
            for (let i = 0; i < this.floorPlatformArr.length; i++) {
                const floor = this.floorPlatformArr[i]
                if (Collision({
                    object1: this.hitbox,
                    object2: floor
                })) {
                    if (this.velocity.y > 0) {
                        this.velocity.y = 0
                        this.position.y = floor.position.y - this.hitbox.height - 0.01
                        break;
                    }
                    if (this.velocity.y < 0) {
                        this.velocity.y = 0
                        this.position.y = floor.position.y + floor.width + 0.01
                        break;
                    }
                }
            }
            for (let i = 0; i < this.floorPlatformArr2.length; i++) {
                const floor = this.floorPlatformArr2[i]
                if (Collision({
                    object1: this.hitbox,
                    object2: floor
                })) {
                    if (this.velocity.y > 0) {
                        this.velocity.y = 0
                        this.position.y = floor.position.y - this.hitbox.height - 0.01
                        break;
                    }
                    if (this.velocity.y < 0) {
                        this.velocity.y = 0
                        this.position.y = floor.position.y + floor.width + 0.01
                        break;
                    }
                }
            }

            for (let i = 0; i < blocks.length; i++) {
                const block = blocks[i]
                if (Collision({
                    object1: this.hitbox,
                    object2: block
                })) {
                    if (this.velocity.y > 0) {
                        this.velocity.y = 0
                        this.position.y = block.position.y - this.hitbox.height - 0.01
                        break;
                    }
                    if (this.velocity.y < 0) {
                        this.velocity.y = 0
                        this.position.y = block.position.y + block.width + 0.01
                        break;
                    }
                }
            }

            for (let i = 0; i < this.verticalPlatformArr.length; i++) {
                const verticalPlat = this.verticalPlatformArr[i];
                if (Collision({
                    object1: this.hitbox,
                    object2: verticalPlat
                })) {
                    if (this.velocity.y > 0) {
                        this.velocity.y = 0
                        this.position.y = verticalPlat.position.y - this.hitbox.height - 0.01
                    }
                }
            }
            for (let i = 0; i < this.verticalPlatformArr2.length; i++) {
                const verticalPlat = this.verticalPlatformArr2[i];
                if (Collision({
                    object1: this.hitbox,
                    object2: verticalPlat
                })) {
                    if (this.velocity.y > 0) {
                        this.velocity.y = 0
                        this.position.y = verticalPlat.position.y - this.hitbox.height - 0.01
                    }
                }
            }
        }
        checkForHorizontalCollision() {
            for (let i = 0; i < this.floorPlatformArr.length; i++) {
                const floor = this.floorPlatformArr[i];
                if (Collision({
                    object1: this.hitbox,
                    object2: floor
                })) {
                    if (this.velocity.x > 0) {
                        this.velocity.x = 0
                        this.position.x = floor.position.x - this.hitbox.width - 0.01
                    }
                    if (this.velocity.x < 0) {
                        this.velocity.x = 0
                        this.position.x = floor.position.x + 0.01
                    }
                    break;
                }
            }

            for (let i = 0; i < this.verticalPlatformArr.length; i++) {
                const verticalPlat = this.verticalPlatformArr[i];
                if (this.hitbox.position.y + this.hitbox.height >= verticalPlat.position.y &&
                    this.hitbox.position.y <= verticalPlat.position.y + verticalPlat.height &&
                    this.hitbox.position.x + this.velocity.x + this.hitbox.width >= verticalPlat.position.x &&
                    this.hitbox.position.x + this.velocity.x <= verticalPlat.position.x + verticalPlat.width) {
                    this.velocity.x = 0
                    break;
                }
            }

            for (let i = 0; i < blocks.length; i++) {
                const block = blocks[i];
                if (this.hitbox.position.y + this.hitbox.height >= block.position.y &&
                    this.hitbox.position.y <= block.position.y + block.height &&
                    this.hitbox.position.x + this.velocity.x + this.hitbox.width >= block.position.x &&
                    this.hitbox.position.x + this.velocity.x <= block.position.x + block.width) {
                    this.velocity.x = 0
                    break;
                }
            }
        }

        applyGravity() {
            this.velocity.y += gravity
            this.position.y += this.velocity.y
            this.position.x += this.velocity.x
        }
    }

    class Enemy {
        constructor({ position, floorPlatformArr, floorPlatformArr2, enemyAnim }) {
            this.position = position
            this.width = 30
            this.height = 30
            this.velocity = {
                x: 0,
                y: 1
            }
            this.floorPlatformArr = floorPlatformArr
            this.floorPlatformArr2 = floorPlatformArr2
            this.originalMotion = enemyAnim.motion
            this.enemyAnim = enemyAnim
            this.enemyAnim.create()
            this.enemyAnim.startAnimation()
            this.senseRange = {
                position: {
                    x: this.position.x,
                    y: this.position.y,
                },
                width: 100,
                height: 80
            }
            this.willBlockStopMe = false
            this.life = 100
            this.distance = this.position.x + this.width / 2 - player.hitbox.x - player.hitbox.width / 2;
            this.frameRate = 0
        }

        draw() {
            c.drawImage(this.enemyAnim.canvas, this.position.x, this.position.y, this.width, this.height)
        }

        update() {
            if (this.life > 0) {
                this.distance = Math.abs(this.position.x + this.width / 2 - player.hitbox.position.x - player.hitbox.width / 2)
                this.attackPlayer()
                this.updateSense()
                this.checkForVerticalCollision()
                if (this.enemyAnim.name != 'Enemy2') {
                    this.applyGravity()
                }
                this.position.x += this.velocity.x
            } else {
                this.die()
            }
            this.draw()
            this.frameRate++
        }

        die() {
            this.velocity.x = 0
            if (this.enemyAnim.name == 'Enemy1') {
                this.switchSprite('Dead')
                if (this.enemyAnim.picNum === 8) {
                    score++
                    enemies.splice(enemies.indexOf(this), 1)
                }
            } else if (this.enemyAnim.name == 'Enemy2') {
                score++
                enemies.splice(enemies.indexOf(this), 1)
            }

        }

        switchSprite(key) {
            if (this.enemyAnim.motion != key) {
                this.enemyAnim.motion = key
                this.enemyAnim.picNum = 1
            }
        }

        blocksCollision() {
            for (let i = 0; i < blocks.length; i++) {
                if (Collision({
                    object1: this,
                    object2: blocks[i]
                })) {
                    return blocks[i]
                }
            }
            return 'false'
        }

        attackPlayer() {
            if (this.enemyAnim.name != 'Enemy2') {
                if (player.hitbox.position.x + player.hitbox.width < this.position.x) {
                    this.enemyAnim.face = -1

                    let blockCollided = this.blocksCollision()
                    if (blockCollided != 'false' && player.hitbox.position.x < blockCollided.position.x + blockCollided.width && this.position.x + this.width > blockCollided.position.x + blockCollided.width) {
                        this.velocity.x = 0
                        blockCollided.face = this.enemyAnim.face
                        this.switchSprite('Attack')
                        if (this.frameRate % 100 === 0) {
                            blockCollided.life -= 10
                        }
                    } else {
                        this.switchSprite(this.originalMotion)
                        if (this.originalMotion == 'Walk') {
                            this.velocity.x = -.5
                        } else if (this.originalMotion == 'Run') {
                            this.velocity.x = -1
                        } else if (this.originalMotion == 'Fly') {
                            this.velocity.x = -1.5
                            this.position.y = Math.abs(camera.position.y) + 20
                        }
                    }
                } else if (player.hitbox.position.x > this.position.x + this.width) {
                    this.enemyAnim.face = 1
                    let blockCollided = this.blocksCollision()
                    if (blockCollided != 'false' && player.hitbox.position.x > blockCollided.position.x + blockCollided.width && this.position.x + this.width < blockCollided.position.x + blockCollided.width) {
                        this.velocity.x = 0
                        this.switchSprite('Attack')
                        blockCollided.face = this.enemyAnim.face
                        if (this.frameRate % 100 === 0) {
                            blockCollided.life -= 10
                        }
                    } else {
                        this.switchSprite(this.originalMotion)
                        if (this.originalMotion == 'Walk') {
                            this.velocity.x = .5
                        } else if (this.originalMotion == 'Run') {
                            this.velocity.x = 1
                        } else if (this.originalMotion == 'Fly') {
                            this.velocity.x = 1.5
                            this.position.y = Math.abs(camera.position.y) + 20
                        }
                    }
                } else {
                    if (Collision({
                        object1: player.hitbox,
                        object2: this
                    })) {
                        this.switchSprite('Attack')
                        this.velocity.x = 0
                        if (this.frameRate % 15 === 0) {
                            player.life -= 10
                        }
                    }
                }
            } else if (this.enemyAnim.name == 'Enemy2') {
                if (player.hitbox.position.x + player.hitbox.width + 100 < this.position.x) {
                    this.enemyAnim.face = -1

                    let blockCollided = this.blocksCollision()
                    if (blockCollided != 'false' && player.hitbox.position.x < blockCollided.position.x + blockCollided.width && this.position.x + this.width > blockCollided.position.x + blockCollided.width) {
                        this.velocity.x = 0
                        this.switchSprite('Attack')
                        if (this.frameRate % 100 === 0) {
                            blockCollided.life -= 10
                        }
                    } else {
                        this.switchSprite(this.originalMotion)
                        if (this.originalMotion == 'Walk') {
                            this.velocity.x = -.5
                        } else if (this.originalMotion == 'Run') {
                            this.velocity.x = -1
                        } else if (this.originalMotion == 'Fly') {
                            this.velocity.x = -1.5
                            this.position.y = Math.abs(camera.position.y) + 20
                        }
                    }
                } else if (player.hitbox.position.x - 100 > this.position.x + this.width) {
                    this.enemyAnim.face = 1
                    let blockCollided = this.blocksCollision()
                    if (blockCollided != 'false' && player.hitbox.position.x > blockCollided.position.x + blockCollided.width && this.position.x + this.width < blockCollided.position.x + blockCollided.width) {
                        this.velocity.x = 0
                        this.switchSprite('Attack')
                        if (this.frameRate % 100 === 0) {
                            blockCollided.life -= 10
                        }
                    } else {
                        this.switchSprite(this.originalMotion)
                        if (this.originalMotion == 'Walk') {
                            this.velocity.x = .5
                        } else if (this.originalMotion == 'Run') {
                            this.velocity.x = 1
                        } else if (this.originalMotion == 'Fly') {
                            this.velocity.x = 1.5
                            this.position.y = Math.abs(camera.position.y) + 20
                        }
                    }
                } else {
                    this.velocity.x = 0
                    this.switchSprite('Attack')
                    if (this.frameRate % 15 === 0) {
                        let xDistance = player.hitbox.position.x + player.width / 2 - this.position.x - this.width / 2
                        let yDistance = player.hitbox.position.y + player.height / 2 - this.position.y - this.height / 2
                        let angle = Math.atan2(yDistance, xDistance)
                        enemyBullets.push(new EnemyBullet({
                            position: {
                                x: this.position.x + 10,
                                y: this.position.y - 10
                            },
                            velocity: {
                                x: 3 * Math.cos(angle),
                                y: 3 * Math.sin(angle)
                            },
                            width: 20,
                            height: 20,
                            bulletNum: '03',
                            damage: 15
                        }))
                    }
                }
            }
        }

        updateSense() {
            this.senseRange = {
                position: {
                    x: this.position.x - 170,
                    y: this.position.y - 80,
                },
                width: 400,
                height: 120
            }
        }

        checkForVerticalCollision() {
            this.floorPlatformArr.forEach(floor => {
                if (Collision({
                    object1: this,
                    object2: floor
                })) {
                    if (this.velocity.y > 0) {
                        this.velocity.y = 0
                        this.position.y = floor.position.y - this.height - 0.01
                    }
                }
            });
            this.floorPlatformArr2.forEach(floor => {
                if (Collision({
                    object1: this,
                    object2: floor
                })) {
                    if (this.velocity.y > 0) {
                        this.velocity.y = 0
                        this.position.y = floor.position.y - this.height - 0.01
                    }
                }
            });
        }

        applyGravity() {
            this.velocity.y += gravity
            this.position.y += this.velocity.y
        }
    }

    class FloorPlatform {
        constructor({ position }) {
            this.position = position
            this.width = 16
            this.height = 16
        }

        draw() {
            c.fillStyle = 'rgba(255,0,0,0.5)'
            c.fillRect(this.position.x, this.position.y, this.width, this.height)
        }

        update() {
            this.draw()
        }
    }

    class VerticalPlatform {
        constructor({ position }) {
            this.position = position
            this.width = 16
            this.height = 16
        }

        draw() {
            c.fillStyle = 'rgba(0,255,0,0.5)'
            c.fillRect(this.position.x, this.position.y, this.width, this.height)
        }

        update() {
            this.draw()
        }
    }

    class Bullet {
        constructor({ position, velocity, width, height, bulletNum, gravityApply = 0, damage = 10 }) {
            this.position = position
            this.velocity = velocity
            this.width = width
            this.height = height
            this.image = new Image()
            this.bulletNum = bulletNum
            this.image.src = `img/Lasers/${this.bulletNum}.png`
            this.gravityApply = gravityApply
            this.damage = damage
        }

        update() {
            this.position.x += this.velocity.x
            this.position.y += this.velocity.y
            this.velocity.y += this.gravityApply
            this.draw()
            this.checkHorizontalCanvasCollision()
            this.checkForEnemiesCollision()
        }

        draw() {
            c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
        }

        checkHorizontalCanvasCollision() {
            if ((this.position.x + this.velocity.x <= 0) || (this.position.x + this.velocity.x + this.width >= background.image.width) || (this.position.y + this.width >= background.image.height) || (this.position.y <= 0)) {
                bullets.splice(bullets.indexOf(this), 1)
            }
        }

        checkForEnemiesCollision() {
            for (let i = 0; i < enemies.length; i++) {
                if (Collision({
                    object1: this,
                    object2: enemies[i]
                })) {
                    enemies[i].life -= this.damage
                    bullets.splice(bullets.indexOf(this), 1)
                }
            }
        }
    }

    function Collision({ object1, object2 }) {

        return (
            object1.position.y + object1.height >= object2.position.y &&
            object1.position.y <= object2.position.y + object2.height &&
            object1.position.x + object1.width >= object2.position.x &&
            object1.position.x <= object2.position.x + object2.width
        )
    }

    function ArrayCollision({ object1, object2 }) {
        for (let i = 0; i < object2.length; i++) {
            const obj = object2[i]
            if (Collision({
                object1: object1,
                object2: obj
            })) {
                return obj
            }
        }
        return null
    }

    function checkEnemies() {
        sortArray(enemies, 0, enemies.length - 1)
    }

    function sortArray(arr, l, r) {
        if (l >= r) {
            return;
        }
        let m = l + parseInt((r - l) / 2);
        sortArray(arr, l, m);
        sortArray(arr, m + 1, r);
        sortA(arr, l, m, r);
    }

    function sortA(arr, l, m, r) {
        let n1 = m - l + 1;
        let n2 = r - m;

        let L = new Array(n1);
        let R = new Array(n2);

        for (var i = 0; i < n1; i++)
            L[i] = arr[l + i];
        for (var j = 0; j < n2; j++)
            R[j] = arr[m + 1 + j];


        let i1 = 0;
        let j1 = 0;
        let k1 = l;
        while (i1 < n1 && j1 < n2) {
            if (L[i1].distance <= R[j1].distance) {
                arr[k1] = L[i1];
                i1++;
            }
            else {
                arr[k1] = R[j1];
                j1++;
            }
            k1++;
        }
        while (i1 < n1) {
            arr[k1] = L[i1];
            i1++;
            k1++;
        }
        while (j1 < n2) {
            arr[k1] = R[j1];
            j1++;
            k1++;
        }
    }


    class FlyingObject {
        constructor() {
            this.droneAnim = new Drone()
            this.droneAnim.create()
            this.droneAnim.startAnimation()
            this.frameRate = 0
        }

        draw() {
            c.drawImage(this.droneAnim.canvas, player.position.x, player.position.y - 20, 20, 20)
        }

        update() {
            this.attackEnemy()
            this.draw()
            this.frameRate++
        }

        attackEnemy() {
            if (enemies.length != 0 && this.frameRate % 10 == 0) {
                this.droneAnim.face = enemies[0].enemyAnim.face * (-1)
                let xDistance = enemies[0].position.x + enemies[0].width / 2 - player.position.x - 10
                let yDistance = enemies[0].position.y + enemies[0].height / 2 - player.position.y + 10
                let angle = Math.atan2(yDistance, xDistance)
                bullets.push(new Bullet({
                    position: {
                        x: player.position.x + 10,
                        y: player.position.y - 10
                    },
                    velocity: {
                        x: 3 * Math.cos(angle),
                        y: 3 * Math.sin(angle)
                    },
                    width: 10,
                    height: 5,
                    bulletNum: '06'
                }))
            }
        }
    }

    class AttackWeapons {
        constructor({ name }) {
            this.name = name
            this.frameRate = 0
            this.image1 = new Image()
            this.image1.src = 'img/Guns/bazooka-rocket-launcher.png'
            this.image2 = new Image()
            this.image2.src = 'img/Guns/bazooka-rocket-launcherL.png'
        }

        draw() {
            if (this.name == 'bazooka-rocket-launcher') {
                if (player.createHero.face == -1) {
                    c.drawImage(this.image2, player.hitbox.position.x - 15, player.hitbox.position.y - 5, 60, 50)
                } else {
                    c.drawImage(this.image1, player.hitbox.position.x - 15, player.hitbox.position.y - 5, 60, 50)
                }
            }
        }

        update() {
            this.draw()
        }

        attack() {
            this.frameRate++
            if (this.frameRate % 2 === 0) {
                if (player.createHero.face == -1) {
                    bullets.push(new Bullet({
                        position: {
                            x: player.hitbox.position.x + 10,
                            y: player.hitbox.position.y + 10
                        },
                        velocity: {
                            x: - 5 * Math.cos(11.5 * Math.PI / 180),
                            y: - 5 * Math.sin(11.5 * Math.PI / 180),
                        },
                        width: 20,
                        height: 20,
                        bulletNum: '02',
                        gravityApply: .02,
                        damage: 40
                    }))
                } else {
                    bullets.push(new Bullet({
                        position: {
                            x: player.hitbox.position.x + 30,
                            y: player.hitbox.position.y
                        },
                        velocity: {
                            x: 5 * Math.cos(11.5 * Math.PI / 180),
                            y: - 5 * Math.sin(11.5 * Math.PI / 180),
                        },
                        width: 20,
                        height: 20,
                        bulletNum: '02',
                        gravityApply: .02,
                        damage: 40
                    }))
                }
            }
        }
    }

    class EnemyBullet {
        constructor({ position, velocity, width, height, bulletNum, gravityApply = 0, damage = 10 }) {
            this.position = position
            this.velocity = velocity
            this.width = width
            this.height = height
            this.image = new Image()
            this.bulletNum = bulletNum
            this.image.src = `img/Lasers/${this.bulletNum}.png`
            this.gravityApply = gravityApply
            this.damage = damage
        }

        update() {
            this.position.x += this.velocity.x
            this.position.y += this.velocity.y
            this.velocity.y += this.gravityApply
            this.draw()
            this.checkHorizontalCanvasCollision()
            this.checkForPlayerCollision()
        }

        draw() {
            c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
        }

        checkHorizontalCanvasCollision() {
            if ((this.position.x + this.velocity.x <= 0) || (this.position.x + this.velocity.x + this.width >= background.image.width) || (this.position.y + this.width >= background.image.height) || (this.position.y <= 0)) {
                enemyBullets.splice(enemyBullets.indexOf(this), 1)
            }
        }

        checkForPlayerCollision() {
            if (Collision({
                object1: this,
                object2: player
            })) {
                player.life -= this.damage
                enemyBullets.splice(enemyBullets.indexOf(this), 1)
            }
        }
    }





    let isRunning = false
    let gameId = null;
    const keys = {
        right: {
            pressed: false
        },
        left: {
            pressed: false
        },
        attack: {
            pressed: false
        }
    }

    let floorPlatform2d = []
    let floorPlatforms = []
    let floorPlatform2d2 = []
    let floorPlatforms2 = []


    let verticalPlatform2d = []
    let verticalPlatforms = []
    let verticalPlatform2d2 = []
    let verticalPlatforms2 = []

    for (let i = 0; i < floorPlatform.length; i += 36) {
        floorPlatform2d.push(floorPlatform.slice(i, i + 36))
    }
    for (let i = 0; i < floorPlatform2.length; i += 36) {
        floorPlatform2d2.push(floorPlatform2.slice(i, i + 36))
    }


    for (let i = 0; i < verticalPlatform.length; i += 36) {
        verticalPlatform2d.push(verticalPlatform.slice(i, i + 36))
    }
    for (let i = 0; i < verticalPlatform2.length; i += 36) {
        verticalPlatform2d2.push(verticalPlatform2.slice(i, i + 36))
    }


    let bullets = []
    let enemyBullets = []

    let enemies = []

    let blocks = []
    let drone = ''
    let lifeNo = []
    let player = ''

    function init() {
        floorPlatform2d.forEach((row, i) => {
            row.forEach((symbol, j) => {
                if (symbol == 1051) {
                    floorPlatforms.push(new FloorPlatform({
                        position: {
                            x: j * 16,
                            y: i * 16
                        }
                    }))
                }
            });
        });
        floorPlatform2d2.forEach((row, i) => {
            row.forEach((symbol, j) => {
                if (symbol == 1051) {
                    floorPlatforms2.push(new FloorPlatform({
                        position: {
                            x: j * 16 + 36 * 16,
                            y: i * 16
                        }
                    }))
                }
            });
        });
        verticalPlatform2d.forEach((row, i) => {
            row.forEach((symbol, j) => {
                if (symbol == 1051) {
                    verticalPlatforms.push(new VerticalPlatform({
                        position: {
                            x: j * 16,
                            y: i * 16
                        }
                    }))
                }
            });
        });
        verticalPlatform2d2.forEach((row, i) => {
            row.forEach((symbol, j) => {
                if (symbol == 1051) {
                    verticalPlatforms2.push(new VerticalPlatform({
                        position: {
                            x: j * 16 + 36 * 16,
                            y: i * 16
                        }
                    }))
                }
            });
        });
        player = new Player({
            position: {
                x: 240,
                y: 350
            },
            floorPlatformArr: floorPlatforms,
            floorPlatformArr2: floorPlatforms2,
            verticalPlatformArr: verticalPlatforms,
            verticalPlatformArr2: verticalPlatforms2,
        })
        blocks.push(new Blocks({
            position: {
                x: 100,
                y: 100
            },
            floorPlatformArr: floorPlatforms,
            floorPlatformArr2: floorPlatforms2,
        }),
            new Blocks({
                position: {
                    x: 160,
                    y: 100
                },
                floorPlatformArr: floorPlatforms,
                floorPlatformArr2: floorPlatforms2,
            }),
            new Blocks({
                position: {
                    x: 155,
                    y: 40
                },
                floorPlatformArr: floorPlatforms,
                floorPlatformArr2: floorPlatforms2,
            }),
            new Blocks({
                position: {
                    x: 350,
                    y: 100
                },
                floorPlatformArr: floorPlatforms,
                floorPlatformArr2: floorPlatforms2,
            }),
            new Blocks({
                position: {
                    x: 410,
                    y: 100
                },
                floorPlatformArr: floorPlatforms,
                floorPlatformArr2: floorPlatforms2,
            }),
            new Blocks({
                position: {
                    x: 325,
                    y: 40
                },
                floorPlatformArr: floorPlatforms,
                floorPlatformArr2: floorPlatforms2,
            })
        )
        drone = new FlyingObject()
        for (let i = 0; i < 3; i++) {
            let life = new Inventory({ width: 100, height: 100 })
            life.createCanvas()
            life.startAnimation()
            lifeNo.push({
                lifeObj: life,
                animateCanvas: life.canvas
            })
        }
    }


    let countFrame = 0

    function animate() {
        gameId = requestAnimationFrame(animate)
        // c.fillStyle = 'white'
        // c.fillRect(0, 0, canvas.width, canvas.height)
        c.clearRect(0,0,canvas.width,canvas.height)
        c.save()
        c.scale(2, 2)
        c.translate(camera.position.x, camera.position.y)
        background.update()
        floorPlatforms.forEach(floors => {
            floors.update()
        });
        floorPlatforms2.forEach(floors => {
            floors.update()
        });
        verticalPlatforms.forEach(floors => {
            floors.update()
        });
        verticalPlatforms2.forEach(floors => {
            floors.update()
        });

        blocks.forEach(block => {
            block.update()
        });
        bullets.forEach(bullet => {
            bullet.update()
        });
        enemyBullets.forEach(bullet => {
            bullet.update()
        });
        drone.update()
        checkEnemies()
        enemies.forEach(enemy => {
            enemy.update()
        });


        player.checkHorizontalCanvasCollision()
        player.checkVerticalCanvasCollision()
        player.update()


        c.fillStyle = 'white'
        c.font = "20px serif";
        c.fillText(`Score: ${score}`, Math.abs(camera.position.x) + canvas.width / 2 - 100, Math.abs(camera.position.y) + 30)

        c.restore()

        if (player.life > 0) {


            if (keys.right.pressed) {
                player.velocity.x = 2
                player.createHero.face = 1
                player.switchSprite('Run')
            } else if (keys.left.pressed) {
                player.velocity.x = -2
                player.createHero.face = -1
                player.switchSprite('Run')
            } else if (keys.attack.pressed) {
                player.attack()
                player.switchSprite('Shoot')
            } else if (player.velocity.y === 0) {
                player.velocity.x = 0
                player.switchSprite('Idle')
            }


            if (player.velocity.y < 0) {
                player.switchSprite('Jump On Air')
            } else if (player.velocity.y > 0) {
                player.switchSprite('Jump Fall')
            }

            if (countFrame % 150 == 0) {
                let enemyNum = Math.floor(Math.random() * 2) + 1
                let slow = 0
                for (let i = 0; i < enemyNum; i++) {
                    if (slow == 0) {
                        let en;
                        let chooseEnemy = Math.floor(Math.random() * 3)
                        if (chooseEnemy == 0) {
                            en = new Enemy1({ width: 100, height: 100, motion: 'Walk', picNum: 1, imgSrc: 'New Zombie/PNG/Animation' })
                        } else if (chooseEnemy == 1) {
                            en = new Enemy1({ width: 100, height: 100, motion: 'Run', picNum: 1, imgSrc: 'New Zombie/PNG/Animation' })
                        } else if (chooseEnemy == 2) {
                            en = new Enemy2({ width: 100, height: 100, motion: 'Fly', picNum: 1 })
                        }

                        if (Math.floor(Math.random() * 2)) {
                            if (en.name == 'Enemy2') {
                                enemies.push(new Enemy({
                                    position: {
                                        x: 0,
                                        y: Math.abs(camera.position.y) + 20
                                    },
                                    floorPlatformArr: floorPlatforms,
                                    floorPlatformArr2: floorPlatforms2,
                                    enemyAnim: en
                                }))
                            } else {
                                enemies.push(new Enemy({
                                    position: {
                                        x: 0,
                                        y: 400
                                    },
                                    floorPlatformArr: floorPlatforms,
                                    floorPlatformArr2: floorPlatforms2,
                                    enemyAnim: en
                                }))
                            }

                        } else {
                            if (en.name == 'Enemy2') {
                                enemies.push(new Enemy({
                                    position: {
                                        x: background.image.width,
                                        y: Math.abs(camera.position.y) + 20
                                    },
                                    floorPlatformArr: floorPlatforms,
                                    floorPlatformArr2: floorPlatforms2,
                                    enemyAnim: en
                                }))
                            } else {
                                enemies.push(new Enemy({
                                    position: {
                                        x: background.image.width,
                                        y: 400
                                    },
                                    floorPlatformArr: floorPlatforms,
                                    floorPlatformArr2: floorPlatforms2,
                                    enemyAnim: en
                                }))
                            }
                        }
                        slow = 50
                    } else {
                        slow--;
                        i--;
                    }
                }
            }
        }

        countFrame++
    }

    function startGame() {
        isRunning = true
        canvas.hidden = false
        init()
        animate()
    }


}