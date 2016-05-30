export class SquareUnit{
    x:number;
    y:number;
    width:number;
    color:string;
    
    constructor(_x:number,_y:number,_width:number,_color:string){
        this.x = _x;
        this.y = _y;
        this.width = _width;
        this.color = _color;
    }
    
    draw(cx:CanvasRenderingContext2D){
        if(cx){
            cx.save();
			cx.fillStyle = this.color;
			cx.strokeStyle = "#000000";
			cx.fillRect(this.x,this.y,this.width,this.width);
			cx.strokeRect(this.x,this.y,this.width,this.width);
			cx.restore();     
        }
    }
}