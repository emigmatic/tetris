function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

if (isMobileDevice()) {
    document.body.classList.add("mobile");

    const controls = document.createElement("div")
    const buttons = document.createElement("div")
    
    const dropBtn = createBtn("drop-btn", "↡");
    const leftBtn = createBtn("left-btn", "←");
    const rightBtn = createBtn("right-btn", "→");
    const downBtn = createBtn("down-btn", "↓");
    const rotateBtn = createBtn("rotate-btn", "⟳");
    
    controls.className = "controls"
    buttons.className = "buttons"
    buttons.append(dropBtn, leftBtn, rightBtn, downBtn, rotateBtn)
    controls.append(buttons)
    game.appendChild(controls)
    
    let holdInterval;
    
    // Démarre l'action et le maintien au `touchstart`
    leftBtn.addEventListener("touchstart", () => {
        // Exécuter une fois l'action pour l'appui simple
        if (currentBlock.isNextPosValid("left")) {
            currentBlock.move([currentBlock.pos[0] - 1, currentBlock.pos[1]]);
        }
    
        // Définir l'intervalle pour la répétition en cas de maintien
        holdInterval = setInterval(() => {
            if (currentBlock.isNextPosValid("left")) {
                currentBlock.move([currentBlock.pos[0] - 1, currentBlock.pos[1]]);
            }
        }, 100);
    }, { passive: true });
    
    // Arrêter l'intervalle au `touchend` pour empêcher la répétition
    leftBtn.addEventListener("touchend", () => {
        clearInterval(holdInterval);
    }, { passive: true });
    
    // Optionnel : gérer le cas où le toucher est annulé
    leftBtn.addEventListener("touchcancel", () => {
        clearInterval(holdInterval);
    }, { passive: true });
    
    
    // Démarre l'action et le maintien au `touchstart`
    rightBtn.addEventListener("touchstart", () => {
        // Exécuter une fois l'action pour l'appui simple
        if (currentBlock.isNextPosValid("right")) {
            currentBlock.move([currentBlock.pos[0] + 1, currentBlock.pos[1]]);
        }
    
        // Définir l'intervalle pour la répétition en cas de maintien
        holdInterval = setInterval(() => {
            if (currentBlock.isNextPosValid("right")) {
                currentBlock.move([currentBlock.pos[0] + 1, currentBlock.pos[1]]);
            }
        }, 100);
    }, { passive: true });
    
    // Arrêter l'intervalle au `touchend` pour empêcher la répétition
    rightBtn.addEventListener("touchend", () => {
        clearInterval(holdInterval);
    }, { passive: true });
    
    // Optionnel : gérer le cas où le toucher est annulé
    rightBtn.addEventListener("touchcancel", () => {
        clearInterval(holdInterval);
    }, { passive: true });
    
    
    // Démarre l'action et le maintien au `touchstart`
    downBtn.addEventListener("touchstart", () => {
        // Exécuter une fois l'action pour l'appui simple
        if (currentBlock.isFalling) {
            clearTimeout(loopTimeout);
            loop();
        }
    
        // Définir l'intervalle pour la répétition en cas de maintien
        holdInterval = setInterval(() => {
            if (currentBlock.isFalling) {
                clearTimeout(loopTimeout);
                loop();
            }
        }, 100);
    }, { passive: true });
    
    // Arrêter l'intervalle au `touchend` pour empêcher la répétition
    downBtn.addEventListener("touchend", () => {
        clearInterval(holdInterval);
    }, { passive: true });
    
    // Optionnel : gérer le cas où le toucher est annulé
    downBtn.addEventListener("touchcancel", () => {
        clearInterval(holdInterval);
    }, { passive: true });
    
    
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
