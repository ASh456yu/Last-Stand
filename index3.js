import { startGame } from "./index.js"
let myDiv = document.createElement('div')
myDiv.style.display = 'flex'
myDiv.style.width = '600px'
myDiv.style.height = '600px'
myDiv.style.alignItems = 'center'
myDiv.style.justifyContent = 'center'
myDiv.style.border = '1px solid white'
document.body.appendChild(myDiv)

let label = document.createElement('label')
label.setAttribute('for','name')
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
submit.addEventListener('mouseover',()=>{
    submit.style.backgroundColor = 'red'
    submit.style.color = 'black'
})
submit.addEventListener('mouseout',()=>{
    submit.style.backgroundColor = 'black'
    submit.style.color = 'red'
})
submit.addEventListener('click',()=>{
    if (text.value!='') {
        localStorage.setItem(text.value,0)
        document.body.removeChild(myDiv)
        startGame(text.value)
    }else{
        text.style.border = '2px solid red'
    }
})
myDiv.appendChild(submit)