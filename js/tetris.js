const tetris = {
	elem : null,
	debugMode : true,
    cols : 10,
    rows : 22,
    emptyCell : 0,
    grid : [],
	blockNbTypes : 7,
	blockStartPos : [5, 1],
	soundFX : {},
	end : false,
    delay : 1000,
	delayUpdate : 50,
	linesNextLvl : 5,
	lines : 0,
	init : function (elem) {
		this.elem = elem
		this.soundFX = this.setSoundFX()
        this.grid = this.initGrid(this.rows, this.cols, this.emptyCell)
    },
	Block : class {
		constructor (type, pos) {
			this.type = type
			this.pos = pos
			this.name = tetris.getShapes(this.type, this.pos).name
			this.shapeVariants = tetris.getShapes(this.type, this.pos).variants
			this.nbVariants = this.shapeVariants.length
			this.variant = 0
			this.shape = this.shapeVariants[this.variant]
			this.shapeWidth = tetris.getCellsWidth(this.shape)
			this.isFalling = true
		}
		fall () {
			this.move([this.pos[0], this.pos[1] + 1])
		}
		rotates () {
			const nextVariant = (this.variant === this.nbVariants-1) ? 0 : this.variant+1
			const nextShape = tetris.getShapes(this.type, this.pos).variants[nextVariant]
			const nextShapeWidth = tetris.getCellsWidth(nextShape)
			let gap = 0
			if (this.name === "i" && this.pos[0] < 2) {
				gap = (this.pos[0] === 0) ? 2 : 1
			} else if (nextShapeWidth > this.shapeWidth && this.pos[0] === 0) {
				gap = 1
			} else if (nextShapeWidth > this.shapeWidth && this.pos[0] === tetris.cols-1) {
				gap = -1
			}
			if (this.canRotate(nextShape, gap)) {
				this.variant = nextVariant
				this.shapeWidth = nextShapeWidth
				this.move([this.pos[0] + gap, this.pos[1]])
			}
		}
		move (newPos) {
			this.pos = newPos
			this.setShape()
			this.draw({
				val : 1,
				shape : this.name
			})
		}
		register () {
			this.isFalling = false
			this.draw({
				val : 2,
				shape : this.name
			})
		}
		draw (v) {
			for (let i = 0; i < this.shape.length; i++) {
				tetris.updateCell(this.shape[i], v)
			}
			tetris.displayGrid()
		}
		setShape () {
			this.clear()
			this.shape = tetris.getShapes(this.type, this.pos).variants[this.variant]
		}
		clear () {
			for (let cell of this.shape) {
				tetris.updateCell(cell, {
					val : tetris.emptyCell,
					shape : null
				})
			}
		}
		canRotate (nextShape, gap) {
			let isValid = true
			for (let i = 0; i < nextShape.length && isValid; i++) {
				if (!tetris.isEmptyCell(nextShape[i][0] + gap, nextShape[i][1])) {
					isValid = false
				}
			}
			return isValid
		}
		isNextPosValid (side) {
			let nbX = 0
			let nbY = 0
			let isValid = true
			switch (side) {
				case "left" : nbX = -1
					break
				case "right" : nbX = 1
					break
				default : nbY = 1
					break
			}
			if (!this.isFalling) isValid = false
			for (let i = 0; i < this.shape.length && isValid; i++) {
				if (!tetris.isEmptyCell(this.shape[i][0] + nbX, this.shape[i][1] + nbY)) {
					isValid = false
				}
			}
			return isValid
		}
	},
	getShapes : function (type, pos) {
		const x = pos[0]
		const y = pos[1]
		const shapes = [
			{
				name : "i",
				variants : [
					[[x, y], [x+1, y], [x-1, y], [x-2, y]],
					[[x, y], [x, y-1], [x, y+1], [x, y+2]]
				]
			},
			{
				name : "j",
				variants : [
					[[x, y], [x-1, y], [x+1, y], [x+1, y+1]],
					[[x, y], [x, y-1], [x, y+1], [x+1, y-1]],
					[[x, y], [x-1, y], [x-1, y-1], [x+1, y]],
					[[x, y], [x, y-1], [x, y+1], [x-1, y+1]]
				]
			},
			{
				name : "l",
				variants : [
					[[x, y], [x+1, y], [x-1, y], [x-1, y+1]],
					[[x, y], [x, y-1], [x, y+1], [x+1, y+1]],
					[[x, y], [x-1, y], [x+1, y], [x+1, y-1]],
					[[x, y], [x-1, y-1], [x, y-1], [x, y+1]]
				]
			},
			{
				name : "o",
				variants : [
					[[x, y], [x-1, y], [x, y+1], [x-1, y+1]]
				]
			},
			{
				name : "s",
				variants : [
					[[x, y], [x+1, y], [x-1, y+1], [x, y+1]],
					[[x, y], [x, y-1], [x+1, y], [x+1, y+1]]
				]
			},
			{
				name : "t",
				variants : [
					[[x, y], [x-1, y], [x+1, y], [x, y+1]],
					[[x, y], [x+1, y], [x, y-1], [x, y+1]],
					[[x, y], [x-1, y], [x+1, y], [x, y-1]],
					[[x, y], [x-1, y], [x, y-1], [x, y+1]]
				]
			},
			{
				name : "z",
				variants : [
					[[x, y], [x-1, y], [x, y+1], [x+1, y+1]],
					[[x, y], [x+1, y-1], [x+1, y], [x, y+1]]
				]
			}
		]
		return shapes[type]
	},
	checkLines : function () {
		const completeLines = []
		for (let i = 0; i < this.grid.length; i++) {
			let isComplete = true
			for (let j = 0; j < this.grid[i].length && isComplete; j++) {
				if (this.grid[i][j].val !== 2) {
					isComplete = false
				}
			}
			if (isComplete) completeLines.push(i)
		}
		return completeLines
	},
	addRow : function () {
		let newRow = []
		for (let i = 0; i < this.cols; i++) {
			newRow.push({
				val : this.emptyCell,
				shape : null
			})
		}
		this.grid.unshift(newRow)
	},
	removeRow : function (line) {
		this.grid.splice(line, 1)
	},
	checkEnd : function () {
		for (let i = 3; i < 7; i++) {
			if (this.grid[2][i].val !== 1 && this.grid[2][i].val !== this.emptyCell) {
				return true
			}
		}
		return false
	},
	playSoundFX : function (sound) {
		if (sound in this.soundFX) {
			this.soundFX[sound].play()
		}
	},
	setSoundFX : function () {
		const soundFX = {}
		const sounds = ['move', 'softdrop', 'single', 'double', 'triple', 'tetris']
		sounds.forEach((fx) => {
			soundFX[fx] = this.createSoundFX(fx)
		})
		return soundFX
	},
	createSoundFX : function (sound) {
		const audio = new Audio ()
		audio.src = "./sounds/" + sound + ".mp3"
		audio.volume = 0.5
		return audio
	},
	getCellsWidth : function (shape) {
		let unique = []
		shape.forEach(element => {
			if (!unique.includes(element[0])) {
				unique.push(element[0])
			}
		})
		return unique.length
	},
	updateCell : function (pos, val) {
		return this.grid[pos[1]][pos[0]] = val
	},
	isEmptyCell : function (x, y) {
		if ((x >= 0 && x < this.cols) && (y >= 0 && y < this.rows)) {
			return (this.grid[y][x].val === 1) || (this.grid[y][x].val === this.emptyCell)
		} else {
			return false
		}
    },
	displayNextBlock : function (type, container) {
		const nextBlockGrid = this.initGrid(4, 4, tetris.emptyCell)
		const nextBlockShape = tetris.getShapes(type, [2, 1]).variants[0]
		for (let cell of nextBlockShape) {
			nextBlockGrid[cell[1]][cell[0]].val = 1
		}
        let html = `<table>`
        for (let i = 0; i < nextBlockGrid.length; i++) {
            html += `<tr>`
            for (let j = 0; j < nextBlockGrid[0].length; j++) {
				html += (nextBlockGrid[i][j].val === 1) ? `<td>
					<div class="block"></div>
					</td>` : `<td></td>`
            }
            html += `</tr>`
        }
        html += `</table>`
		container.innerHTML = html
	},
	displayGrid : function () {
        let html = `<table>`
        for (let i = 0; i < this.rows; i++) {
            html += `<tr>`
            for (let j = 0; j < this.cols; j++) {
				html += (this.grid[i][j].val !== 0) ? `<td>
					<div class="block ${this.grid[i][j].shape}"></div>
					</td>` : `<td></td>`
            }
            html += `</tr>`
        }
        html += `</table>`
        this.elem.innerHTML = html

        this.logGrid()
    },
	initGrid : function (nbLines, nbColumns, char="") {
		let tab = []
		for (let i = 0; i < nbLines; i++) {
			tab.push([])
			for (let j = 0; j < nbColumns; j++) {
				tab[i].push({
					val : char,
					shape : null
				})
			}
		}
		return tab
	},
	logGrid : function () {
		let txt = ""
		for (let i = 0; i < this.grid.length; i++) {
			txt += "|"
			for (let j = 0; j < this.grid[i].length; j++) {
				if (this.grid[i][j].val === 0) {
					txt += "_"
				} else {
					txt += this.grid[i][j].val
				}
				txt += "|"
			}
			txt += (i < this.grid.length-1) ? "\n" : ""
		}
		if (this.debugMode) {
			console.log(txt)
		}
	}
}
