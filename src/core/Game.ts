import {GamePad} from "./GamePad";
import {UnitMap} from "./UnitMap";
import {CommonUtil} from "../util/CommonUtil";
enum GameStatus{
    INITIALIZED = 0,
    READY = 1,
    STARTING = 2,
    PAUSED = 3,
    END = 4
}
export class Game{
    private _canvas:HTMLCanvasElement;
    private _speed:number;
    private _record:number;
    private _status:GameStatus;
    private _gamePad:GamePad;
    private _columns:number;
    private _rows:number;
    private _gap:number;
    
    constructor(_canvas:HTMLCanvasElement,_speed:number=100,_columns:number=12,_rows:number=20,_gap:number=2){
        this._canvas = _canvas;
        this._speed = _speed; 
        this._columns = _columns;
        this._rows = _rows;
        this._gap = _gap;
        
        this._record = 0;
        this._status = GameStatus.INITIALIZED;
        
        this.init();
    }
    
    set speed(value:number){
        this._speed = value;
    }
    
    get speed():number{
        return this._speed;
    }
    get record():number{
        return this._record;
    }
    
    private init():void{
        let canvasWidth:number = CommonUtil.removeUnit(this._canvas.getAttribute('width'),"px");
		let canvasHeight:number = CommonUtil.removeUnit(this._canvas.getAttribute('height'),"px");
        var unitWidth = (canvasHeight - (this._rows + 1) * this._gap) / this._rows;
        if(!this._gamePad){
            let map = new UnitMap(this._rows,this._columns);
            this._gamePad = new GamePad(map,this._canvas.getContext("2d"),unitWidth,this._gap,"#CCCCCC",this._speed);
            this._gamePad.cleanPad();
            this._status = GameStatus.READY;
        }
        
    }
    
    
    start():void{
        this._gamePad.cleanPad();
        this._gamePad.generateNextShape();
        this._status = GameStatus.STARTING;
        document.body.addEventListener("keydown",(event:KeyboardEvent)=>{
            this.keyDownHandler(event);
        });
    }
    
    pause():void{
        
    }
    
    restart():void{
        
    }
    
    end():void{
        
    }
    
    private keyDownHandler(event:KeyboardEvent):void{
        if(this._status !== GameStatus.STARTING){
            return;
        }
        if (event.keyCode === 37) {
            //left;
            this._gamePad.moveLeft();
        } else if (event.keyCode === 39) {
            //right;
            this._gamePad.moveRight();
        } else if (event.keyCode === 40) {
            //down;
            this._gamePad.accelerateDown();
        } else if (event.keyCode === 38) {
            //up
            this._gamePad.rotate()
        } else if (event.keyCode === 32) {
            //space bar
            this._gamePad.teleportDown();
        }
    }
}