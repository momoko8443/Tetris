import {UnitMap} from "../core/UnitMap";
import {Coordination} from "../core/Coordination";
import {BaseShape} from "./BaseShape";
export class Square extends BaseShape
{
    constructor(_map:UnitMap){
        super(_map,"#FF0000",2);
    }
	
	init():void
	{
		let position = this.measureInitPosition();
		this.keyCoordinations.push([new Coordination(0,position,1),new Coordination(0,position+1,1)]);
		this.keyCoordinations.push([new Coordination(1,position,1),new Coordination(1,position+1,1)]);
	}
}
