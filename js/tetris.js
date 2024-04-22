const tetris={elem:null,debugMode:!0,cols:10,rows:22,emptyCell:0,grid:[],blockNbTypes:7,blockStartPos:[5,1],soundFX:{},end:!1,delay:1e3,delayUpdate:50,linesNextLvl:5,lines:0,init:function(t){this.elem=t,this.soundFX=this.setSoundFX(),this.grid=this.initGrid(this.rows,this.cols,this.emptyCell)},Block:class{constructor(t,s){this.type=t,this.pos=s,this.name=tetris.getShapes(this.type,this.pos).name,this.shapeVariants=tetris.getShapes(this.type,this.pos).variants,this.nbVariants=this.shapeVariants.length,this.variant=0,this.shape=this.shapeVariants[this.variant],this.shapeWidth=tetris.getCellsWidth(this.shape),this.isFalling=!0}fall(){this.move([this.pos[0],this.pos[1]+1])}rotates(){let t=this.variant===this.nbVariants-1?0:this.variant+1,s=tetris.getShapes(this.type,this.pos).variants[t],i=tetris.getCellsWidth(s),e=0;"i"===this.name&&this.pos[0]<2?e=0===this.pos[0]?2:1:i>this.shapeWidth&&0===this.pos[0]?e=1:i>this.shapeWidth&&this.pos[0]===tetris.cols-1&&(e=-1),this.canRotate(s,e)&&(this.variant=t,this.shapeWidth=i,this.move([this.pos[0]+e,this.pos[1]]))}move(t){this.pos=t,this.setShape(),this.draw({val:1,shape:this.name})}register(){this.isFalling=!1,this.draw({val:2,shape:this.name})}draw(t){for(let s=0;s<this.shape.length;s++)tetris.updateCell(this.shape[s],t);tetris.displayGrid()}setShape(){this.clear(),this.shape=tetris.getShapes(this.type,this.pos).variants[this.variant]}clear(){for(let t of this.shape)tetris.updateCell(t,{val:tetris.emptyCell,shape:null})}canRotate(t,s){let i=!0;for(let e=0;e<t.length&&i;e++)tetris.isEmptyCell(t[e][0]+s,t[e][1])||(i=!1);return i}isNextPosValid(t){let s=0,i=0,e=!0;switch(t){case"left":s=-1;break;case"right":s=1;break;default:i=1}this.isFalling||(e=!1);for(let h=0;h<this.shape.length&&e;h++)tetris.isEmptyCell(this.shape[h][0]+s,this.shape[h][1]+i)||(e=!1);return e}},getShapes:function(t,s){let i=s[0],e=s[1];return[{name:"i",variants:[[[i,e],[i+1,e],[i-1,e],[i-2,e]],[[i,e],[i,e-1],[i,e+1],[i,e+2]]]},{name:"j",variants:[[[i,e],[i-1,e],[i+1,e],[i+1,e+1]],[[i,e],[i,e-1],[i,e+1],[i+1,e-1]],[[i,e],[i-1,e],[i-1,e-1],[i+1,e]],[[i,e],[i,e-1],[i,e+1],[i-1,e+1]]]},{name:"l",variants:[[[i,e],[i+1,e],[i-1,e],[i-1,e+1]],[[i,e],[i,e-1],[i,e+1],[i+1,e+1]],[[i,e],[i-1,e],[i+1,e],[i+1,e-1]],[[i,e],[i-1,e-1],[i,e-1],[i,e+1]]]},{name:"o",variants:[[[i,e],[i-1,e],[i,e+1],[i-1,e+1]]]},{name:"s",variants:[[[i,e],[i+1,e],[i-1,e+1],[i,e+1]],[[i,e],[i,e-1],[i+1,e],[i+1,e+1]]]},{name:"t",variants:[[[i,e],[i-1,e],[i+1,e],[i,e+1]],[[i,e],[i+1,e],[i,e-1],[i,e+1]],[[i,e],[i-1,e],[i+1,e],[i,e-1]],[[i,e],[i-1,e],[i,e-1],[i,e+1]]]},{name:"z",variants:[[[i,e],[i-1,e],[i,e+1],[i+1,e+1]],[[i,e],[i+1,e-1],[i+1,e],[i,e+1]]]}][t]},checkLines:function(){let t=[];for(let s=0;s<this.grid.length;s++){let i=!0;for(let e=0;e<this.grid[s].length&&i;e++)2!==this.grid[s][e].val&&(i=!1);i&&t.push(s)}return t},addRow:function(){let t=[];for(let s=0;s<this.cols;s++)t.push({val:this.emptyCell,shape:null});this.grid.unshift(t)},removeRow:function(t){this.grid.splice(t,1)},checkEnd:function(){for(let t=3;t<7;t++)if(1!==this.grid[2][t].val&&this.grid[2][t].val!==this.emptyCell)return!0;return!1},playSoundFX:function(t){t in this.soundFX&&this.soundFX[t].play()},setSoundFX:function(){let t={};return["move","softdrop","single","double","triple","tetris"].forEach(s=>{t[s]=this.createSoundFX(s)}),t},createSoundFX:function(t){let s=new Audio;return s.src="./sounds/"+t+".mp3",s.volume=.5,s},getCellsWidth:function(t){let s=[];return t.forEach(t=>{s.includes(t[0])||s.push(t[0])}),s.length},updateCell:function(t,s){return this.grid[t[1]][t[0]]=s},isEmptyCell:function(t,s){return t>=0&&t<this.cols&&s>=0&&s<this.rows&&(1===this.grid[s][t].val||this.grid[s][t].val===this.emptyCell)},displayNextBlock:function(t,s){let i=this.initGrid(4,4,tetris.emptyCell),e=tetris.getShapes(t,[2,1]).variants[0];for(let h of e)i[h[1]][h[0]].val=1;let l="<table>";for(let a=0;a<i.length;a++){l+="<tr>";for(let r=0;r<i[0].length;r++)l+=1===i[a][r].val?`<td>
					<div class="block"></div>
					</td>`:"<td></td>";l+="</tr>"}l+="</table>",s.innerHTML=l},displayGrid:function(){let t="<table>";for(let s=0;s<this.rows;s++){t+="<tr>";for(let i=0;i<this.cols;i++)t+=0!==this.grid[s][i].val?`<td>
					<div class="block ${this.grid[s][i].shape}"></div>
					</td>`:"<td></td>";t+="</tr>"}t+="</table>",this.elem.innerHTML=t,this.logGrid()},initGrid:function(t,s,i=""){let e=[];for(let h=0;h<t;h++){e.push([]);for(let l=0;l<s;l++)e[h].push({val:i,shape:null})}return e},logGrid:function(){let t="";for(let s=0;s<this.grid.length;s++){t+="|";for(let i=0;i<this.grid[s].length;i++)0===this.grid[s][i].val?t+="_":t+=this.grid[s][i].val,t+="|";t+=s<this.grid.length-1?"\n":""}this.debugMode&&console.log(t)}};