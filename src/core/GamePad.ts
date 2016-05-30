
import {UnitMap} from "./UnitMap";
import {BaseShape} from "../shape/BaseShape";
import {AntiLShape} from "../shape/Anti_L_Shape";
import {AntiZShape} from "../shape/Anti_Z_Shape";
import {LShape} from "../shape/L_Shape";
import {Square} from "../shape/Square";
import {Strip} from "../shape/Strip";
import {TShape} from "../shape/T_Shape";
import {ZShape} from "../shape/Z_Shape";
import {SquareUnit} from "./SquareUnit";
import {EventEmitter} from "./EventEmitter";

enum SoundType{
    rotate = 0,
    land = 1,
    clean = 2,
    over = 3
}

export class GamePad extends EventEmitter{
    
    color: string = "#8B658B";
    map: UnitMap;
    unitWidth: number;
    gap: number;
    background: string;
    activeShape:BaseShape;
    speed:number;
    timer:number;
    cleanRowsCount:number;
    cx:CanvasRenderingContext2D;

    constructor(_map: UnitMap,_cx:CanvasRenderingContext2D, _unitWidth: number, _gap: number, _background: string,_speed:number) {
        super();
        this.map = _map;
        this.cx = _cx;
        this.unitWidth = _unitWidth;
        this.gap = _gap;
        this.background = _background;
        this.speed = _speed;
        this.color = "#8B658B";
        this.cleanRowsCount = 0;
        
    }


    render(shape: BaseShape): void {
        let unitArray = this.map.unitArray;
        this.drawBackground();
        for (let i = 0; i < unitArray.length; i++) {
            let rowArr = unitArray[i];
            for (let j = 0; j < rowArr.length; j++) {
                let item = rowArr[j];
                if (item == 1) {
                    let xPosition = this.gap * (j + 1) + this.unitWidth * j;
                    let yPosition = this.gap * (i + 1) + this.unitWidth * i;
                    let squareUnit = new SquareUnit(xPosition, yPosition, this.unitWidth, this.color);
                    squareUnit.draw(this.cx);
                }
            }
        }

        for (let i = 0; i < shape.keyCoordinations.length; i++) {
            let tempArr = shape.keyCoordinations[i];
            for (let j = 0; j < tempArr.length; j++) {
                let coord = tempArr[j];
                if (coord.value == 1) {
                    let xPosition = this.gap * (coord.y + 1) + this.unitWidth * coord.y;
                    let yPosition = this.gap * (coord.x + 1) + this.unitWidth * coord.x;
                    let squareUnit = new SquareUnit(xPosition, yPosition, this.unitWidth, shape.color);
                    squareUnit.draw(this.cx);
                }
            }
        }
    }

    drawBackground() {
        if (this.cx != null) {
            let width = this.unitWidth * this.map.column + this.gap * (this.map.column + 1);
            let height = this.unitWidth * this.map.row + this.gap * (this.map.row + 1);
            this.cx.save();
            this.cx.fillStyle = this.background;
            this.cx.fillRect(0, 0, width, height);
            this.cx.restore();
        }
    }
    cleanPad() {
        this.map.createMap();
        this.drawBackground();
    }
    
    autoDown()
    {
        var result = this.activeShape.down();
        if(result)
        {
            this.render(this.activeShape);
            this.timer = setTimeout(()=>{
                this.autoDown();
            },this.speed);				
        }
        else
        {
            this.playSound(SoundType.land);
            this.updatePad();
        }
        
    }
    
    updatePad():void{
        let cleanLineCount = this.cleanRow();
        if(cleanLineCount == -1)
        {
            this.playSound(SoundType.over);
            clearTimeout(this.timer);
            this.dispatchEvent({'eventType':GamePad.EVENT_GAME_OVER});
        }
        else 
        {
            if(cleanLineCount > 0)
            {
                this.playSound(SoundType.clean);
                this.cleanRowsCount += cleanLineCount;
                this.dispatchEvent({'eventType':GamePad.EVENT_CLEAN_RECORD_UPDATE,'record':this.cleanRowsCount});
            }
            this.generateNextShape();
        }
    }
    
    generateNextShape()
    {
        var num:number = 7;
        var random:number = Math.round(Math.random()*(num-1));
        switch(random)
        {
            case 0:
                this.activeShape = new Square(this.map);
                break;
            case 1:
                this.activeShape = new Strip(this.map);
                break;
            case 2:
                this.activeShape = new LShape(this.map);
                break;
            case 3:
                this.activeShape = new AntiLShape(this.map);
                break;
            case 4:
                this.activeShape = new ZShape(this.map);
                break;
            case 5:
                this.activeShape = new AntiZShape(this.map);
                break;
            case 6:
                this.activeShape = new TShape(this.map);
                break;
        }	
        this.activeShape.init();
        clearTimeout(this.timer);
        this.render(this.activeShape);
        this.timer = setTimeout(()=>{
            this.autoDown();
        },this.speed);
    }

    cleanRow():number {
        let lineCount = 0;
        for (let i = this.map.unitArray.length - 1; i >= 0; i--) {
            let rowArr = this.map.unitArray[i];
            let count = 0;
            for (let j = 0; j < rowArr.length; j++) {
                let item = rowArr[j];
                if (item == 1) {
                    count++;
                }
            }
            if (count == rowArr.length) {
                lineCount++;
                this.map.unitArray.splice(i, 1);
            }
        }
        for (let i = 0; i < lineCount; i++) {
            let newRow = [];
            for (let j = 0; j < this.map.column; j++) {
                newRow.push(0);
            }
            this.map.unitArray.unshift(newRow);
        }
        for (let i = 0; i < this.map.unitArray[0].length; i++) {
            let item = this.map.unitArray[0][i];
            if (item == 1) {
                return -1;
            }
        }
        return lineCount;
    }
    
    accelerateDown() {
        var result = this.activeShape.down();
        if (result) {
            this.render(this.activeShape);
        } else {
            this.playSound(SoundType.land);
            this.updatePad();
        }
    }

    teleportDown() {
        var result = this.activeShape.quickDrop();
        if (!result) {
            
            this.playSound(SoundType.land);
            this.render(this.activeShape);
            this.updatePad();
        }
    }

    moveLeft() {
        var result = this.activeShape.left();
        if (result) {
            this.render(this.activeShape);
        }

    }

    moveRight() {
        var result = this.activeShape.right();
        if (result) {
            this.render(this.activeShape);
        }
    }

    rotate() {
        var result = this.activeShape.transform();
        if (result) {
            this.playSound(SoundType.rotate);
            this.render(this.activeShape);
        }
    }
    private soundPlayer:HTMLAudioElement;
    playSound(soundType:SoundType)
    {
        if(!this.soundPlayer){
            this.soundPlayer = document.createElement("Audio") as HTMLAudioElement;
            document.body.appendChild(this.soundPlayer);
            this.soundPlayer.style.visibility = "none";
        }
        let url:string;
        switch(soundType)
        {
            case SoundType.rotate:
                url = "asset/sound/effect1.mp3";
                break;
            case SoundType.land:
                url = "asset/sound/effect1.mp3";
                break;
            case SoundType.clean:
                url = "asset/sound/effect3.mp3";
                break;
            case SoundType.over:
                url = "asset/sound/gameover.mp3";
                break;
        }
        if(this.soundPlayer.src !== url){
            this.soundPlayer.src = url;
        }
        this.soundPlayer.currentTime = 0;
        this.soundPlayer.play();
    }
    
    static EVENT_GAME_OVER:string = "game_over";
    static EVENT_CLEAN_RECORD_UPDATE = "clean_record_update";
}
