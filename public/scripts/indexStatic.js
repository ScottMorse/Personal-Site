const lineCont = document.getElementById('line-container')
const code = document.getElementById('code')
const codeLines = Array.from(document.querySelectorAll('.code-line'))

const noteImg = document.getElementById('note-img')
noteImg.style.width = '500vw'

const digEx = new RegExp(/[\d]+/)

let codeX = 0
let noteX = 0
function mill(){
    if(codeX % (codeLines[0].offsetWidth) == 0){
        codeX = 0
    }
    if(noteX % 500 == 0){
        noteX = 0
    }
    lineCont.style.transform = noteImg.style.transform =  'translateX(' + codeX + 'px)'
    noteImg.style.transform = 'translateX(' + noteX + 'px)'
    codeX++
    noteX++
}

setInterval(mill,20)

console.log(codeLines[0].offsetWidth)
console.log(noteImg.offsetWidth)

function checkScroll(){

}

window.addEventListener('scroll',checkScroll)