const lineCont = document.getElementById('line-container')
const code = document.getElementById('code')
const codeLines = Array.from(document.querySelectorAll('.code-line'))

const noteImg = document.getElementById('note-img')
noteImg.style.width = '500vw'

const blackSlider = document.getElementById('black-slider')
const outlineImg = document.getElementById('outline-img')
const realImg = document.getElementById('real-img')

const tease1 = document.getElementById('tease-block-1')
const tease2 = document.getElementById('tease-block-2')
const tease3 = document.getElementById('tease-block-3')

const contactButt = document.getElementById('contact-button')
const xButt = document.getElementById('X')
const contact = document.getElementById('contact')
const contactMask = document.getElementById('contact-mask')

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

let firstAnim = true
function checkScroll(){
    const y = window.scrollY - (window.innerHeight / 2) + 50
    if(y > 350 && firstAnim){
        blackSlider.style.transform = 'translateX(100vw)'
        setTimeout(()=>{outlineImg.style.opacity = 0}, 2500)
        setTimeout(()=>{firstAnim = false}, 3500)
    }
    if(y > 600 && !firstAnim){
        outlineImg.style.opacity = 1
    }
    if(y < 600 && !firstAnim){
        outlineImg.style.opacity = 0
    }
    if(y > 800){
        tease1.style.transform = 'translateX(0)'
        setTimeout(()=>tease2.style.transform = 'translateX(0)',500)
    }
}

function showContact(){
    contact.style.display = 'flex'
    setTimeout(()=>contact.style.opacity = 1,50)
}

function hideContact(){
    contact.style.opacity = 0
    setTimeout(()=>contact.style.display = 'none',500)
}

window.addEventListener('scroll',checkScroll)
contactButt.addEventListener('click',showContact)
xButt.addEventListener('click',hideContact)
contactMask.addEventListener('click',hideContact)
