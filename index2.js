

let heroDetail = [
    {
        Name:'Idle',
        w:530,
        h:450
    },
    {
        Name:'Run',
        w:630,
        h:450
    },
    {
        Name:'Hurt',
        w:530,
        h:470
    },
    {
        Name:'Shoot',
        w:550,
        h:500
    }
]


class HeroAnimation{
    constructor({width,height,motion,picNum}){
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
    create(){
        this.canvas = document.createElement('canvas')
        this.canvas.width = this.width
        this.canvas.height = this.height
        // document.body.appendChild(this.canvas)
        this.canvas.style.border = '1px solid black'
        this.c = this.canvas.getContext('2d')
    }
    update(){
        this.draw()
    }
    draw(){
        if (this.face==1) {
            this.c.drawImage(getImage(`img/Hero Character/The Hero/Animations/${this.motion}/${this.motion}_${this.picNum}.png`),0,0,this.picW,this.picH,0,0,this.canvas.width,this.canvas.height)    
        } else {
            this.c.save()
            this.c.translate(this.width,0)
            this.c.scale(-1,1)
            this.c.drawImage(getImage(`img/Hero Character/The Hero/Animations/${this.motion}/${this.motion}_${this.picNum}.png`),0,0,this.picW,this.picH,0,0,this.canvas.width,this.canvas.height)
            this.c.restore()
        }
        
    }

    startAnimation(){
        requestAnimationFrame(this.startAnimation.bind(this))
        this.c.clearRect(0,0,this.canvas.width,this.canvas.height)
        this.update();
        if (this.frameRate%this.slowMo===0) {
            if (this.motion=='Idle') {
                this.slowMo = 5
                if (parseInt(this.picNum)<9) {
                    this.picNum = `00${parseInt(this.picNum)+1}`
                } else if (parseInt(this.picNum)<11) {
                    this.picNum = `0${parseInt(this.picNum)+1}`
                }else{
                    this.picNum = `000`
                }
            }else if (this.motion=='Run') {
                this.slowMo = 5
                if (parseInt(this.picNum)<9) {
                    this.picNum = `00${parseInt(this.picNum)+1}`
                } else if (parseInt(this.picNum)<13) {
                    this.picNum = `0${parseInt(this.picNum)+1}`
                }else{
                    this.picNum = `000`
                }
            }else if (this.motion=='Shoot') {
                this.slowMo = 1
                if (parseInt(this.picNum)<9) {
                    this.picNum = `00${parseInt(this.picNum)+1}`
                } else if (parseInt(this.picNum)<14) {
                    this.picNum = `0${parseInt(this.picNum)+1}`
                }else{
                    this.picNum = `000`
                }
            }else if (this.motion=='Hurt') {
                this.slowMo = 5
                if (parseInt(this.picNum)<9) {
                    this.picNum = `00${parseInt(this.picNum)+1}`
                }else{
                    this.picNum = `000`
                }
            }else if (this.motion=='Death') {
                this.slowMo = 25
                if (parseInt(this.picNum)<9) {
                    this.picNum = `00${parseInt(this.picNum)+1}`
                } else if (parseInt(this.picNum)<14) {
                    this.picNum = `0${parseInt(this.picNum)+1}`
                }else{
                    this.picNum = `000`
                }
            }else if (this.motion=='Jump Start') {
                this.slowMo = 5
                if (parseInt(this.picNum)<9) {
                    this.picNum = `00${parseInt(this.picNum)+1}`
                }else{
                    this.picNum = `000`
                }
            }
        }
        this.frameRate++;
    }
}

class EnemyAnimation{
    constructor({width,height,motion,picNum,imgSrc}){
        this.width = width
        this.height = height
        this.motion = motion
        this.picNum = picNum
        this.canvas;
        this.c;
        this.frameRate = 0;
        this.face = 1
        this.slowMo = 5
        this.imgSrc = imgSrc
    }
    create(){
        this.canvas = document.createElement('canvas')
        this.canvas.width = this.width
        this.canvas.height = this.height
        // document.body.appendChild(this.canvas)
        this.canvas.style.border = '1px solid black'
        this.c = this.canvas.getContext('2d')
    }
    update(){
        this.draw()
    }
    draw(){
        if (this.face==1) {
            this.c.drawImage(getImage(`img/${this.imgSrc}/${this.motion}${this.picNum}.png`),0,0,this.canvas.width,this.canvas.height)    
        } else {
            this.c.save()
            this.c.translate(this.width,0)
            this.c.scale(-1,1)
            this.c.drawImage(getImage(`img/${this.imgSrc}/${this.motion}${this.picNum}.png`),0,0,this.canvas.width,this.canvas.height)
            this.c.restore()
        }
        
    }

    startAnimation(){
        requestAnimationFrame(this.startAnimation.bind(this))
        this.c.clearRect(0,0,this.canvas.width,this.canvas.height)
        this.update();
        if (this.frameRate%this.slowMo===0) {
            if (this.motion=='Idle') {
                this.slowMo = 5
                if (this.picNum<4) {
                    this.picNum = this.picNum+1
                } else{
                    this.picNum = 1
                }
            }else if (this.motion=='Run') {
                this.slowMo = 5
                if (this.picNum<10) {
                    this.picNum = this.picNum+1
                } else{
                    this.picNum = 5
                }
            }else if (this.motion=='Attack') {
                this.slowMo = 15
                if (this.picNum<6) {
                    this.picNum = this.picNum+1
                } else{
                    this.picNum = 1
                }
            }else if (this.motion=='Hurt') {
                this.slowMo = 10
                if (this.picNum<5) {
                    this.picNum = this.picNum+1
                } else{
                    this.picNum = 1
                }
            }else if (this.motion=='Dead') {
                this.slowMo = 5
                if (this.picNum<8) {
                    this.picNum = this.picNum+1
                } else{
                    this.picNum = 1
                }
            }else if (this.motion=='Walk') {
                this.slowMo = 5
                if (this.picNum<6) {
                    this.picNum = this.picNum+1
                } else{
                    this.picNum = 1
                }
            }else if (this.motion=='Jump') {
                this.slowMo = 5
                if (this.picNum<7) {
                    this.picNum = this.picNum+1
                } else{
                    this.picNum = 1
                }
            }
        }
        this.frameRate++;
    }
}

function getImage(imageSrc) {
    let image = new Image();
    image.src = imageSrc;
    return image;
}






// let hero = new HeroAnimation({width:600,height:600,motion:'Run',picNum:'000'})
// hero.create()
// hero.startAnimation()

// let obs = new ObstracleAnimation({width: 600,height: 600})
// obs.create()
// obs.startAnimation()

// let en = new EnemyAnimation({width: 600,height: 600,motion:'Jump',picNum: 1,imgSrc:'New Zombie/PNG/Animation'})
// en.create()
// en.startAnimation()
export{HeroAnimation}
export{EnemyAnimation}

