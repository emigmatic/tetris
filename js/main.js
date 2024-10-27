const game = document.querySelector("#tetris")
const gridEl = document.createElement("div")
const infosEl = document.createElement("div")
const nextBlockWrapperEl = document.createElement("div")
const nextBlockEl = document.createElement("div")
const scoreWrapperEl = document.createElement("div")
const scoreEl = document.createElement("div")
const levlelWrapperEl = document.createElement("div")
const levlelEl = document.createElement("div")
const nbLinesWrapperEl = document.createElement("div")
const nbLinesEl = document.createElement("div")
//const soundBtn = document.createElement("button")
let currentBlock = null
let nextBlockType = null
let loopTimeout = null
let level = 1
let score = 0

gridEl.className = "grid"
infosEl.className = "infos"
nextBlockWrapperEl.className = "infos-item next"
nextBlockWrapperEl.innerHTML = "<p>Next</p>"
nextBlockEl.className = "next-block"
scoreWrapperEl.className = "infos-item score"
scoreWrapperEl.innerHTML = "<p>Score</p>"
levlelWrapperEl.className = "infos-item level"
levlelWrapperEl.innerHTML = "<p>Level</p>"
nbLinesWrapperEl.className = "infos-item lines"
nbLinesWrapperEl.innerHTML = "<p>Lines</p>"
nbLinesEl.id = "lines"
scoreEl.id = "score"
levlelEl.id = "level"
//soundBtn.id = "btn-sound"
//soundBtn.innerHTML = "Play Sounds"
nextBlockWrapperEl.appendChild(nextBlockEl)
scoreWrapperEl.appendChild(scoreEl)
levlelWrapperEl.appendChild(levlelEl)
nbLinesWrapperEl.appendChild(nbLinesEl)
infosEl.appendChild(nextBlockWrapperEl)
infosEl.appendChild(scoreWrapperEl)
infosEl.appendChild(levlelWrapperEl)
infosEl.appendChild(nbLinesWrapperEl)
//infosEl.appendChild(soundBtn)
game.appendChild(gridEl)
game.appendChild(infosEl)

tetris.init(gridEl)

currentBlock = new tetris.Block(randomNb(tetris.blockNbTypes), tetris.blockStartPos)
nextBlockType = randomNb(tetris.blockNbTypes)
tetris.displayNextBlock(nextBlockType, nextBlockEl)
nbLinesEl.textContent = tetris.lines
scoreEl.textContent = score
levlelEl.textContent = level
loop()

function loop () {
    if (!tetris.checkEnd()) {
        if (!currentBlock.isFalling) {
            currentBlock = new tetris.Block(nextBlockType, tetris.blockStartPos)
            nextBlockType = randomNb(tetris.blockNbTypes)
            tetris.displayNextBlock(nextBlockType, nextBlockEl)
        }
        if (currentBlock.isNextPosValid()) {
            currentBlock.fall()
            loopTimeout = setTimeout(loop, tetris.delay)
        } else {
            currentBlock.register()
            const lines = tetris.checkLines()
            if (lines.length > 0) {
                for (let line of lines) {
                    const gridRow = game.querySelector(`tr:nth-of-type(${line + 1})`)
                    const blocksToRemove = gridRow.querySelectorAll(".block")
                    blocksToRemove.forEach((block) => block.classList.add("explode"))
                }
                playLinesSound(lines.length)
                scoreEl.textContent = updateScore(lines.length)
                wait(500).then(() => {
                    for (let line of lines) {
                        tetris.removeRow(line)
                        tetris.addRow()
                        tetris.lines += 1
                        if (level < 20 && tetris.lines % tetris.linesNextLvl === 0) {
                            tetris.delay -= tetris.delay * tetris.delayUpdate
                            level++
                        }
                    }
                    nbLinesEl.textContent = tetris.lines
                    levlelEl.textContent = level
                    tetris.displayGrid()
                    loopTimeout = setTimeout(loop, tetris.delay)
                })
            } else {
                tetris.playSoundFX("softdrop")
                loopTimeout = setTimeout(loop, tetris.delay)
            }
        }
    }
}

document.addEventListener("keydown", function (event) {
	const key = event.code
	const newPos = Array.from(currentBlock.pos)
	switch (key) {
        case "ArrowUp" :
            while (currentBlock.isFalling) {
                clearTimeout(loopTimeout)
                loop()
			}
			break
		case "ArrowLeft" :
			if (currentBlock.isNextPosValid("left")) {
				newPos[0] -= 1
				currentBlock.move(newPos)
			}
            debug("Left")
			break
		case "ArrowRight" :
			if (currentBlock.isNextPosValid("right")) {
				newPos[0] += 1
				currentBlock.move(newPos)
			}
            debug("Right")
			break
		case "ArrowDown" :
            if (currentBlock.isFalling) {
                clearTimeout(loopTimeout)
                loop()
            }
            debug("Down")
			break
		//case "ArrowUp" :
        case "Space" :
			if (currentBlock.isFalling) {
				currentBlock.rotates()
				tetris.playSoundFX("move")
			}
            debug("Rotate")
			break
		default :
			return
	}
})

function randomNb (max) {
    return Math.floor(Math.random() * max)
}

function updateScore (nbLines) {
    const points = [0, 40, 100, 500, 1200]
    score += (points[nbLines] * level)
    return score
}

function playLinesSound (nbLines) {
    switch (nbLines) {
        case 1 :
            tetris.playSoundFX("single")
            break
        case 2 :
            tetris.playSoundFX("double")
            break
        case 3 :
            tetris.playSoundFX("triple")
            break
        case 4 :
            tetris.playSoundFX("tetris")
            break
        default :
            return
    }
}

function wait (duration) {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(duration), duration)
    })
}

function debug (e) {
    if (tetris.debugMode) {
        const msg = `${e} - 
        PosX: ${currentBlock.pos[0]}
        Width: ${currentBlock.shapeWidth}
        Valid left: ${currentBlock.isNextPosValid("left")}
        Valid right: ${currentBlock.isNextPosValid("right")}
        Valid bottom: ${currentBlock.isNextPosValid()}`
        console.log(msg)
    }
}
