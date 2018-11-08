const lineCont = document.getElementById('line-container')
const code = document.getElementById('code')
const codeLines = Array.from(document.querySelectorAll('.code-line'))
const codeWrap = document.getElementById('code-wrap')

const noteImg = document.getElementById('note-img')
noteImg.style.width = '500vw'

const digEx = new RegExp(/[\d]+/)

const noteX = 500 - window.innerWidth * 0.067
const codeX = 500 - window.innerWidth * 0.3

function toRight(){
    noteImg.style.transform = 'translateX(' + noteX + 'px)'
    codeWrap.style.transform = 'translateX(' + codeX + 'px)'
}

function toLeft(){
    noteImg.style.transform = 'translateX(0px)'
    codeWrap.style.transform = 'translateX(0px)'
}

toRight()
setInterval(toRight,10000)

setTimeout(()=>{
    toLeft()
    setInterval(toLeft,10000)
},5000)

function checkScroll(){

}

window.addEventListener('scroll',checkScroll)