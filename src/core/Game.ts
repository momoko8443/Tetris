import {GamePad} from "./GamePad";
import {UnitMap} from "./UnitMap";
import {CommonUtil} from "../util/CommonUtil";
import {EventEmitter} from "./EventEmitter";
enum GameStatus{
    INITIALIZED = 0,
    READY = 1,
    STARTING = 2,
    PAUSED = 3,
    END = 4
}
export class Game extends EventEmitter{
    private _canvas:HTMLCanvasElement;
    private _speed:number;
    private _record:number;
    private _status:GameStatus;
    private _gamePad:GamePad;
    private _columns:number;
    private _rows:number;
    private _gap:number;
    
    constructor(_canvas:HTMLCanvasElement,_speed:number=100,_columns:number=12,_rows:number=20,_gap:number=2){
        super();
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
        this._gamePad.speed = this._speed;
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
            this._gamePad.addListener(GamePad.EVENT_CLEAN_RECORD_UPDATE,(e:Object)=>{
                this._record = e['record'];
                this.dispatchEvent(e);
            });
            this._gamePad.addListener(GamePad.EVENT_GAME_OVER,(e:Object)=>{
                this._status = GameStatus.END;
                this.dispatchEvent(e);
            });
            this._gamePad.cleanPad();
            this._status = GameStatus.READY;
            document.body.addEventListener("keydown",(event:KeyboardEvent)=>{
                this.keyDownHandler(event);
            });
        }
        
    }
    
    
    start():void{
        this._gamePad.cleanPad();
        this._gamePad.generateNextShape();
        this._status = GameStatus.STARTING;
        this._record = 0;
    }
    
    pause():void{
        if(this._status === GameStatus.STARTING){
            this._gamePad.pause();
            this._status = GameStatus.PAUSED;
        }else if(this._status === GameStatus.PAUSED){
            this._gamePad.resume();
            this._status = GameStatus.STARTING;
        }
    }
    
    end():void{
        this._status = GameStatus.END;
        this._gamePad.reset();
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
    
    static EVENT_GAME_OVER:string = "game_over";
    static EVENT_CLEAN_RECORD_UPDATE = "clean_record_update";
}