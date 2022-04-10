const canvas = document.querySelector('.main__canvas')
const pencil = document.querySelector('.toolbar__drawLine')
const circle = document.querySelector('.toolbar__drawCircle')
const rectangle = document.querySelector('.toolbar__drawRectangle')
const returnMove = document.querySelector('.toolbar__return') 
const colorStroke = document.querySelector('.color')
const inputRange = document.querySelector('.range')
const numberRange = document.querySelector('.rangeValue')

const ctx = canvas.getContext('2d')

const canvasOffsetX = canvas.offsetLeft
const canvasOffsetY = canvas.offsetTop

canvas.width = window.innerWidth - canvasOffsetX
canvas.height = window.innerHeight - canvasOffsetY

let isPainting = false
let lineWidth = 1
let StartX
let StartY

let linesArray = []
let index  = -1

const saveDraw = () => {
    linesArray = linesArray.concat(ctx.getImageData(0, 0, canvas.width, canvas.height))

    index += 1
}

const drawLine = event => {
    if (!isPainting) {
        return
    }

    ctx.lineWidth = lineWidth
    ctx.lineCap = 'round'

    ctx.lineTo(event.clientX - canvasOffsetX, event.clientY)
    ctx.stroke() 
}

const drawCircle = event => {
    if (!isPainting) {
        return
    }

    ctx.clearRect(0, 0, canvas.width, canvas.heigh)

    ctx.putImageData(linesArray[index], 0, 0)

    ctx.lineWidth = 2

    mouseX = parseInt(event.clientX - canvasOffsetX)
    mouseY = parseInt(event.clientY - canvasOffsetY)
 
    ctx.beginPath()

    radius = Math.sqrt(Math.pow((StartX - mouseX), 2) + Math.pow((mouseY - StartY), 2))

    ctx.arc(mouseX,event.clientY,radius, 0, 2.0 * Math.PI)

    ctx.stroke()
    ctx.closePath()
}

const drawRect = event => {
    if (!isPainting) {
        return
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    ctx.putImageData(linesArray[index], 0, 0)

    ctx.lineWidth = 2

    mouseX = parseInt(event.clientX - canvasOffsetX)
    mouseY = parseInt(event.clientY - canvasOffsetY)

    let width = mouseX - StartX
    let height = mouseY - StartY

    ctx.strokeRect(StartX, StartY, width, height)
  
    ctx.stroke()
}

const deleteLast = () => {
    if (index <= 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        linesArray = []

        index = -1
    }

    else {
        index -= 1

        linesArray.pop()

        ctx.putImageData(linesArray[index], 0, 0)
    }
}

pencil.addEventListener('click', () => {
    pencil.classList.add('selected')

    canvas.removeEventListener('mousemove', drawCircle)
    canvas.removeEventListener('mousemove', drawRect)

    canvas.addEventListener('mousemove', drawLine)

    inputRange.disabled = false

    circle.classList.remove('selected')
    rectangle.classList.remove('selected')
})

circle.addEventListener('click', () => {
    circle.classList.add('selected')

    canvas.removeEventListener('mousemove', drawLine)
    canvas.removeEventListener('mousemove', drawRect)

    canvas.addEventListener('mousemove', drawCircle)

    inputRange.disabled = true

    pencil.classList.remove('selected')
    rectangle.classList.remove('selected')
    returnMove.classList.remove('selected')
})

rectangle.addEventListener('click', () => {
    rectangle.classList.add('selected')
    
    canvas.removeEventListener('mousemove', drawCircle)
    canvas.removeEventListener('mousemove', drawLine)

    canvas.addEventListener('mousemove', drawRect)

    inputRange.disabled = true

    circle.classList.remove('selected')
    pencil.classList.remove('selected')
    returnMove.classList.remove('selected')
})

returnMove.addEventListener('click', () => {
    returnMove.classList.add('selected-undo')

    deleteLast()

    setTimeout(() => {
        returnMove.classList.remove('selected-undo')
    }, 200);
})

colorStroke.addEventListener('change', () => {
    ctx.strokeStyle = colorStroke.value
})

inputRange.addEventListener('change', () => {
    numberRange.innerHTML = inputRange.value

    lineWidth = inputRange.value
})

canvas.addEventListener('mousedown', event => {
    isPainting = true

    StartX = parseInt(event.clientX - canvasOffsetX)
    StartY = parseInt(event.clientY)

    ctx.beginPath()
})

canvas.addEventListener('mouseup', () => {
    isPainting = false

    ctx.stroke() 
    ctx.closePath()
 
    saveDraw()
})
