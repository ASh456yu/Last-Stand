import { HeroAnimation,EnemyAnimation } from "./index2.js"


let canvas = document.getElementById('canvas')
canvas.width = 1224
canvas.height = 600
addEventListener('keydown',({keyCode})=>{
    // console.log(keyCode);
    if (player.life>0) {
        if (keyCode==37||keyCode==65) {
            // left
            keys.left.pressed = true
            player.face = -1
            player.heroAnimation.face = -1
            if (player.heroAnimation.motion!='Run') {
                player.change('Run','000')
                player.heroAnimation.picW = heroDetail[1].w
                player.heroAnimation.picH = heroDetail[1].h
            }
        } else if (keyCode==68||keyCode==39) {
            // right
            keys.right.pressed = true
            player.face = 1
            player.heroAnimation.face = 1
            if (player.heroAnimation.motion!='Run') {
                player.change('Run','000')
                player.heroAnimation.picW = heroDetail[1].w
                player.heroAnimation.picH = heroDetail[1].h
            }
        }else if (keyCode==38||keyCode==87) {
            // up
            if (player.velocity.y==0) {
                player.velocity.y = -20
            }
        } else if (keyCode==83||keyCode==40) {
            // down
        } else if (keyCode==70) {
            // attack
            if (player.heroAnimation.motion!='Shoot') {
                player.change('Shoot','000')
                player.heroAnimation.picW = heroDetail[3].w
                player.heroAnimation.picH = heroDetail[3].h
            }
            if (player.timepass==0) {
                player.attack()
                player.timepass = 10
            }
            
        } else if (keyCode==80) {
            if (isRunning) {
                cancelAnimationFrame(gameId)
                isRunning = false
            } else {
                animate()
            }
        }
    }
    
})
addEventListener('keyup',({keyCode})=>{
    if (player.life>0) {
        if (keyCode==37||keyCode==65) {
            // left
            keys.left.pressed = false
            player.change('Idle','000')
            player.heroAnimation.picW = heroDetail[0].w
            player.heroAnimation.picH = heroDetail[0].h
            player.heroAnimation.face = -1
        } else if (keyCode==68||keyCode==39) {
            // right
            keys.right.pressed = false
            player.change('Idle','000')
            player.heroAnimation.picW = heroDetail[0].w
            player.heroAnimation.picH = heroDetail[0].h
            player.heroAnimation.face = 1
        }else if (keyCode==38||keyCode==87) {
            // up
        } else if (keyCode==83||keyCode==40) {
            // down
        } else if (keyCode==70) {
            // attack
            player.change('Idle','000')
            player.heroAnimation.picW = heroDetail[0].w
            player.heroAnimation.picH = heroDetail[0].h
        }
    }
})

let c = canvas.getContext('2d')

class Player{
    constructor({x,y,width,height,image,heroAnimation}){
        this.position = {
            x,y
        }
        this.velocity = {
            x:0,
            y:1
        }
        this.width = width,
        this.height = height
        this.image = image
        this.heroAnimation = heroAnimation
        this.face = 1
        this.timepass = 0
        this.life = 100
    }

    update() {
        
        this.draw()

        if (this.life>0) {
            if (this.timepass>0) {
                this.timepass--
            }
            this.position.x+=this.velocity.x
            this.position.y+=this.velocity.y
            if (this.position.y+this.height+this.velocity.y<canvas.height) {
                this.velocity.y++
            }else{
                this.velocity.y=0
            }
            if (this.position.y+this.velocity.y<=0) {
                this.position.y = 0
                this.velocity.y=0
            }
        }else{
            if (this.heroAnimation.motion != 'Death') {
                this.heroAnimation.motion = 'Death'
                this.heroAnimation.picNum = '000'
            }
            
            if (this.heroAnimation.picNum=='013') {
                cancelAnimationFrame(gameId)
                
                c.fillStyle = 'red'
                c.fillRect(canvas.width/2-150,canvas.height/2-75,300,150)
                c.fillStyle = 'black'
                c.fillText('Your Score: '+score,canvas.width/2-150,canvas.height/2-75+40)
            }
        }
    }

    draw(){
        c.drawImage(this.image,this.position.x,this.position.y,this.width,this.height)
        if (this.life>0) {
            c.fillStyle = 'green'
            c.fillRect(this.position.x-20,this.position.y-30,(this.life/100) * this.width,10)
            c.strokeRect(this.position.x-20,this.position.y-30,this.width,10)
        }
    }

    attack() {
        bullets.push(new Bullet({x:this.position.x+this.width/2,y:this.position.y+10,width:50,height:50,dir:this.face}))
    }

    change(motion,picNum){
        this.heroAnimation.motion = motion
        this.heroAnimation.picNum = picNum
    }
}

class Platform{
    constructor({x,y,width,height,image}){
        this.position = {
            x,y
        }
        this.width = width
        this.height = height
        this.image = image
    }

    update() {
        this.draw()
    }
    draw() {
        c.drawImage(this.image,0,655,this.image.width,this.height,this.position.x,this.position.y,this.width,this.height)
    }
}

class Enemy{
    constructor({x,y,width,height,image,enemyAnimation,basicM}){
        this.position = {
            x,y
        }
        this.velocity = {
            x:0,
            y:1
        }
        this.width = width,
        this.height = height,
        this.image = image
        this.enemyAnimation = enemyAnimation
        this.life = 100
        this.basicM = basicM
        this.obstracleCollide = false
        this.hurt = false
    }

    update() {
        this.draw()
        this.position.x+=this.velocity.x
        this.position.y+=this.velocity.y
        if (this.life>0 && !this.obstracleCollide && !this.hurt && player.position.x+player.width+10<this.position.x) {
            if (this.basicM=='Walk') {
                this.velocity.x = -0.5
                if (this.enemyAnimation.motion!='Walk') {
                    this.enemyAnimation.motion = 'Walk'
                    this.enemyAnimation.picNum = 1
                }
            }else if (this.basicM=='Run') {
                this.velocity.x = -1
                if (this.enemyAnimation.motion!='Run') {
                    this.enemyAnimation.motion = 'Run'
                    this.enemyAnimation.picNum = 1
                }
            }
            
            this.enemyAnimation.face = -1
        } else if(this.life>0 && !this.obstracleCollide && !this.hurt && player.position.x-10>this.position.x+this.width){
            if (this.basicM=='Walk') {
                this.velocity.x = 0.5
                if (this.enemyAnimation.motion!='Walk') {
                    this.enemyAnimation.motion = 'Walk'
                    this.enemyAnimation.picNum = 1
                }
            }else if (this.basicM=='Run') {
                this.velocity.x = 1
                if (this.enemyAnimation.motion!='Run') {
                    this.enemyAnimation.motion = 'Run'
                    this.enemyAnimation.picNum = 1
                }
            }
            this.enemyAnimation.face = 1
        }else if(this.life>0 && !this.hurt){
            this.velocity.x = 0
            if (this.enemyAnimation.motion!='Attack') {
                this.enemyAnimation.motion = 'Attack'
                this.enemyAnimation.picNum = 1
            }
            if (frameRate%50==0) {
                player.life -= 10
            }
        }else if(this.life>0){
            this.velocity.x = 0
            if (this.enemyAnimation.motion!='Hurt') {
                this.enemyAnimation.motion = 'Hurt'
                this.enemyAnimation.picNum = 1
            }
            if (this.enemyAnimation.picNum==5) {
                this.hurt = false
            }
        }
        
        
        if (this.position.y+this.height+this.velocity.y<platform.position.y) {
            this.velocity.y++
        }else{
            this.velocity.y=0
        }
        if (this.life<=0) {
            this.velocity.x = 0
            if (this.enemyAnimation.motion!='Dead') {
                this.enemyAnimation.motion = 'Dead'
                this.enemyAnimation.picNum = 1
            }
            if (this.enemyAnimation.picNum==8) {
                score++
                enemies.splice(enemies.indexOf(this),1)
            }
        }
        
    }

    draw() {
        c.drawImage(this.image,this.position.x,this.position.y,this.width,this.height)
    }
}

class Bullet{
    constructor({x,y,width,height,dir}){
        this.position = {
            x,y
        }
        this.velocity = {
            x:0,
            y:0
        }
        this.width = width
        this.height = height
        this.dir = dir
    }

    update() {
        this.position.x+=(this.velocity.x*this.dir)
        this.position.y+=this.velocity.y
        this.draw()
    }

    draw() {
        c.drawImage(createImage('img/Laser Sprites/01.png'),this.position.x,this.position.y,this.width,this.height)
    }
}

class Decoration{
    constructor({x,y,width,height,image}){
        this.position = {
            x,y
        }
        this.width = width
        this.height = height
        this.image = image
    }

    update() {
        this.draw()
    }

    draw() {
        c.drawImage(this.image,this.position.x,this.position.y,this.width,this.height)
    }
}

class Obstacle{
    constructor({x,y,width,height}){
        this.position = {
            x,y
        }
        this.velocity = {
            x:0,
            y:1
        }
        this.width = width
        this.height = height
        this.life = 100
        this.face = 1
    }
    
    update() {
        this.position.y+=this.velocity.y
        if (platform.position.y<=this.position.y+this.width+this.velocity.y) {
            this.velocity.y = 0
        }else{
            let down = true
            for (let i = 0; i < obstracles.length; i++) {
                let obs = obstracles[i]
                if (obs!=this && this.position.y+this.height+this.velocity.y>obs.position.y && obs.position.y+obs.height>this.position.y && obs.position.x+obs.width>this.position.x && this.position.x+this.width>obs.position.x) {
                    down = false
                    break;
                }
            }
            if (down) {
                this.velocity.y++;
            }else{
                this.velocity.y = 0;
            }
        }
        this.draw()
        if (this.life<=0) {
            obstracles.splice(obstracles.indexOf(this),1)
        }
    }

    draw() {
        if (this.face==1) {
            c.drawImage(createImage('img/Blocks 2.png'),60+350*((100-this.life)/10),80,235,210,this.position.x,this.position.y,this.width,this.height)
        }else {
            c.drawImage(createImage('img/Blocks 3.png'),78+350*((this.life)/10),80,235,210,this.position.x,this.position.y,this.width,this.height)
        }
    }
}

function createImage(imgSrc) {
    let image = new Image()
    image.src = imgSrc
    return image
}

let platformImage = createImage('img/platform3.jpg');
let player;
let platform;
let enemies;
let bullets;
let obstracles;
let frameRate;
let decorations;
let score;
let gameId;
let isRunning = false;
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
function init() {
    score = 0;
    let hero = new HeroAnimation({width:100,height:100,motion:'Idle',picNum:'000'})
    hero.create()
    hero.startAnimation()
    player = new Player({x:600,y:100,width:80,height:100,image:hero.canvas,heroAnimation:hero})
    platform = new Platform({x:0,y:canvas.height-50,width:canvas.width,height:50,image:platformImage})
    let en = new EnemyAnimation({width: 100,height: 100,motion:'Run',picNum: 1,imgSrc:'New Zombie/PNG/Animation'})
    en.create()
    en.startAnimation()
    enemies = []
    enemies.push(new Enemy({x:canvas.width-100,y:canvas.height-platform.height-110,width:80,height:100,image:en.canvas,enemyAnimation:en,basicM:en.motion}))
    bullets = []
    obstracles = [new Obstacle({x:400,y:200,width:50,height:50}),new Obstacle({x:460,y:200,width:50,height:50}),new Obstacle({x:485,y:20,width:50,height:50}),new Obstacle({x:700,y:200,width:50,height:50}),new Obstacle({x:760,y:200,width:50,height:50}),new Obstacle({x:685,y:100,width:50,height:50}),new Obstacle({x:745,y:100,width:50,height:50})];
    frameRate = 0;
    decorations = [new Decoration({x:0,y:0,width:canvas.width,height:canvas.height,image:createImage('img/background.png')})]
}



let keys = {
    right:{
        pressed:false,
    },
    left:{
        pressed:false,
    }
}


function animate() {
    gameId = requestAnimationFrame(animate)
    isRunning = true
    c.fillStyle = 'white'
    c.fillRect(0,0,canvas.width,canvas.height)
    decorations.forEach(decor => {
        decor.update()
    });
    
    platform.update()
    player.update()
    
    enemies.forEach(enemy => {
        let obstracleColl = false;
        for (let i = 0; i < obstracles.length; i++) {
            let obstracle = obstracles[i]
            if (obstracle.position.x<enemy.position.x+enemy.width+enemy.velocity.x&&obstracle.position.x+obstracle.width>enemy.position.x+enemy.velocity.x&&obstracle.position.y<enemy.position.y+enemy.width+enemy.velocity.y&&obstracle.position.y+obstracle.width+obstracle.velocity.y>enemy.position.y) {
                if (enemy.position.x>obstracle.position.x) {
                    obstracle.face = -1
                } else {
                    obstracle.face = 1
                }
                if (frameRate%20===0) {
                    obstracle.life-=10
                }
                obstracleColl = true
                break;
            }
        }
        if (obstracleColl) {
            enemy.obstracleCollide = true
        }else{
            enemy.obstracleCollide = false
        }
        enemy.update()        
    });
    
    

    if (keys.right.pressed && player.position.x+player.width+player.velocity.x<canvas.width) {
        player.velocity.x = 5
    }else if (keys.left.pressed && player.position.x-player.velocity.x>0) {
        player.velocity.x = -5
    }else{
        player.velocity.x = 0
    }

    if (player.position.y+player.height+player.velocity.y>=platform.position.y && player.position.y+player.height+player.velocity.y<platform.position.y+platform.height && player.position.x+player.width>platform.position.x && player.position.x<platform.position.x+platform.width) {
        player.velocity.y = 0
    }

    bullets.forEach(bullet => {
        bullet.update()
        enemies.forEach(enemy => {
            if (bullet.position.y+bullet.height+bullet.velocity.y>enemy.position.y&&bullet.position.x+bullet.width+bullet.velocity.x>enemy.position.x && bullet.position.x+bullet.velocity.x<enemy.position.x+enemy.width) {
                bullets.splice(bullets.indexOf(bullet),1)
                enemy.life -= 15
                enemy.hurt = true
            }
        });
        if (bullet.position.x+bullet.width<canvas.width && bullet.position.x>0) {
            bullet.velocity.x = 10
        }else {
            bullets.splice(bullets.indexOf(bullet),1)
        }
        if (bullet.position.y+bullet.height<canvas.height && bullet.position.y>0) {
            bullet.velocity.y = .2
        }else {
            bullets.splice(bullets.indexOf(bullet),1)
        }
        
    });
    obstracles.forEach(obstracle => {
        obstracle.update();
        if (obstracle.position.y<=(player.position.y+player.height+player.velocity.y)&&obstracle.position.y>=(player.position.y+player.height)&&obstracle.position.x<=(player.position.x+player.width)&&obstracle.position.x+obstracle.width>=player.position.x) {
            player.velocity.y = 0;
        }
    });
    if (frameRate%200==0) {
        let enemyNum = Math.floor(Math.random()*2)+1
        let slow = 0
        for (let i = 0; i < enemyNum; i++) {
            if (slow==0) {
                let en;
                if (Math.floor(Math.random()*2)==1) {
                    en = new EnemyAnimation({width: 100,height: 100,motion:'Walk',picNum: 1,imgSrc:'New Zombie/PNG/Animation'})
                }else{
                    en = new EnemyAnimation({width: 100,height: 100,motion:'Run',picNum: 1,imgSrc:'New Zombie/PNG/Animation'})
                }
                en.create()
                en.startAnimation()
                if (Math.floor(Math.random()*2)==1) {
                    enemies.push(new Enemy({x:0,y:canvas.height-platform.height-110,width:80,height:100,image:en.canvas,enemyAnimation:en,basicM:en.motion}))
                }else{
                    enemies.push(new Enemy({x:canvas.width-100,y:canvas.height-platform.height-110,width:80,height:100,image:en.canvas,enemyAnimation:en,basicM:en.motion}))
                }
                slow = 50
            }else{
                slow--;
                i--;
            }
            
        }
    }
    c.fillStyle = 'white'
    c.font = "48px serif";
    c.fillText(`Score: ${score}`,canvas.width-200,50)
    frameRate++;
}


init()
animate()


