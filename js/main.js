const game = document.querySelector("#tetris")
const view = createDOM("div", {class: "view"})
const gridEl = createDOM("div", {class: "grid"})
const infosEl = createDOM("div", {class: "infos"})
const nextBlockWrapperEl = createDOM("div", {class: "infos-item next"}, "<p>Next</p>")
const nextBlockEl = createDOM("div", {class: "next-block"})
const scoreWrapperEl = createDOM("div", {class: "infos-item score"}, "<p>Score</p>")
const scoreEl = createDOM("div", {id: "score"})
const levlelWrapperEl = createDOM("div", {class: "infos-item level"}, "<p>Level</p>")
const levlelEl = createDOM("div", {id: "level"})
const nbLinesWrapperEl = createDOM("div", {class: "infos-item lines"}, "<p>Lines</p>")
const nbLinesEl = createDOM("div", {id: "lines"})

let currentBlock = null
let nextBlockType = null
let loopTimeout = null
let level = formatTwoDigits(1)
let score = 0

view.append(gridEl, infosEl)
nextBlockWrapperEl.appendChild(nextBlockEl)
scoreWrapperEl.appendChild(scoreEl)
levlelWrapperEl.appendChild(levlelEl)
nbLinesWrapperEl.appendChild(nbLinesEl)
infosEl.append(nextBlockWrapperEl, scoreWrapperEl, levlelWrapperEl, nbLinesWrapperEl)
game.appendChild(view)

tetris.init(gridEl)

currentBlock = new tetris.Block(randomNb(tetris.blockNbTypes), tetris.blockStartPos)
nextBlockType = randomNb(tetris.blockNbTypes)
tetris.displayNextBlock(nextBlockType, nextBlockEl)
nbLinesEl.textContent = tetris.lines
scoreEl.textContent = score
levlelEl.textContent = level + "/20"
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
                    levlelEl.textContent = formatTwoDigits(level) + "/20"
                    tetris.displayGrid()
                    loopTimeout = setTimeout(loop, tetris.delay)
                })
            } else {
                tetris.playSoundFX("softdrop")
                loopTimeout = setTimeout(loop, tetris.delay)
            }
        }
    } else {
        game.classList.add("is-ended")
    }
}

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

function formatTwoDigits (number) {
    return number.toLocaleString('fr-FR', { minimumIntegerDigits: 2 });
}

function createDOM (tag, attrs = {}, childNode = "") {
    const element = document.createElement(tag)
    for (const [attr, value] of Object.entries(attrs)) {
        if (value !== null) {
            element.setAttribute(attr, value)
        }
    }
    element.innerHTML = childNode
    return element
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
