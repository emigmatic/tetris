let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

// Ajouter des écouteurs d'événements pour le toucher
game.addEventListener('touchstart', handleTouchStart, false);
game.addEventListener('touchmove', handleTouchMove, false);
game.addEventListener('touchend', handleTouchEnd, false);

// Fonction appelée quand un doigt touche l'écran
function handleTouchStart(event) {
    const touch = event.changedTouches[0]; // Premier point de contact
    touchStartX = touch.pageX;
    touchStartY = touch.pageY;
}

// Fonction appelée quand un doigt glisse sur l'écran
function handleTouchMove(event) {
    event.preventDefault(); // Empêcher le comportement par défaut
    const touch = event.changedTouches[0];
    touchEndX = touch.pageX;
    touchEndY = touch.pageY;
}

// Fonction appelée quand un doigt est levé de l'écran
function handleTouchEnd(event) {
    // Calcul de la différence de position
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    // Si mouvement horizontal
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) {
            // Glissement vers la droite : déplacer le bloc à droite
            if (currentBlock.isNextPosValid("right")) {
                const newPos = [...currentBlock.pos];
                newPos[0] += 1;
                currentBlock.move(newPos);
            }
        } else {
            // Glissement vers la gauche : déplacer le bloc à gauche
            if (currentBlock.isNextPosValid("left")) {
                const newPos = [...currentBlock.pos];
                newPos[0] -= 1;
                currentBlock.move(newPos);
            }
        }
    } 
    // Si mouvement vertical
    else {
        if (deltaY > 0) {
            // Glissement vers le bas : accélérer la chute du bloc
            if (currentBlock.isFalling) {
                clearTimeout(loopTimeout);
                loop();
            }
        } else {
            // Tapoter (vers le haut ou un léger mouvement) : rotation du bloc
            if (currentBlock.isFalling) {
                currentBlock.rotates();
                tetris.playSoundFX("move");
            }
        }
    }

    // Réinitialiser les positions tactiles
    touchStartX = 0;
    touchStartY = 0;
    touchEndX = 0;
    touchEndY = 0;
}
