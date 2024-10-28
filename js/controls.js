const controls = document.createElement("div")

const dropBtn = createBtn("drop-btn", "↡");
const leftBtn = createBtn("left-btn", "←");
const rightBtn = createBtn("right-btn", "→");
const downBtn = createBtn("down-btn", "↓");
const rotateBtn = createBtn("rotate-btn", "⟳");

controls.id = "controls"
controls.append(dropBtn, leftBtn, rightBtn, downBtn, rotateBtn) 
game.appendChild(controls)

let holdInterval;

leftBtn.addEventListener("touchstart", () => {
    holdInterval = setInterval(() => {
        if (currentBlock.isNextPosValid("left")) {
            currentBlock.move([currentBlock.pos[0] - 1, currentBlock.pos[1]]);
        }
    }, 75); // ajuster pour la vitesse souhaitée
}, { passive: true });

leftBtn.addEventListener("touchend", () => clearInterval(holdInterval));

rightBtn.addEventListener("touchstart", () => {
    holdInterval = setInterval(() => {
        if (currentBlock.isNextPosValid("right")) {
            currentBlock.move([currentBlock.pos[0] + 1, currentBlock.pos[1]]);
        }
    }, 75);
}, { passive: true });

rightBtn.addEventListener("touchend", () => clearInterval(holdInterval));

downBtn.addEventListener("touchstart", () => {
    holdInterval = setInterval(() => {
        if (currentBlock.isFalling) {
            clearTimeout(loopTimeout);
            loop();
        }
    }, 75);
}, { passive: true });

downBtn.addEventListener("touchend", () => clearInterval(holdInterval));

rotateBtn.addEventListener("touchstart", () => {
    if (currentBlock.isFalling) {
        currentBlock.rotates();
        tetris.playSoundFX("move");
    }
}, { passive: true });

dropBtn.addEventListener("touchstart", () => {
    while (currentBlock.isFalling) {
        clearTimeout(loopTimeout)
        loop()
    }
}, { passive: true });


function createBtn (id, text) {
    const btn = document.createElement("button")
    btn.id = id
    btn.innerText = text
    return btn
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
