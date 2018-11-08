const lineCont = document.getElementById('line-container')
const code = document.getElementById('code')
const codeLines = Array.from(document.querySelectorAll('.code-line'))

const noteImg = document.getElementById('note-img')
noteImg.style.width = '500vw'

const digEx = new RegExp(/[\d]+/)

let x = 0
function mill(){
    lineCont.style.transform = noteImg.style.transform =  'translateX(' + x + 'px)'
    noteImg.style.width = parseInt(noteImg.style.width.match(digEx)[0]) + 1 + 'vw'
    x++
    if(x % 200 == 0){
        codeLines.forEach(codeLine => {
            codeLine.insertBefore(codeLine.firstElementChild.cloneNode(true),codeLine.firstElementChild)
        })
    }
}

setInterval(mill,20)

function checkScroll(){
    
}

window.addEventListener('scroll',checkScroll)