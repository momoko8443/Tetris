import {UnitMap} from "../core/UnitMap";
import {Coordination} from "../core/Coordination";
export class BaseShape {
    map:UnitMap;
    matrixUnit:number;
    keyCoordinations: Array<Array<Coordination>>;
    color:string;
    
    constructor(_map:UnitMap,_color:string="FFFFFF",_matrixUnit:number=0,_keyCoordinations:Array<Array<Coordination>>=[]){
        this.map = _map;
        this.color = _color;
        this.matrixUnit = _matrixUnit;
        this.keyCoordinations = _keyCoordinations;
    }

    init():void{

    }
    measureInitPosition(): number {
        return Math.floor((this.map.column - this.matrixUnit) / 2);
    }

    down():boolean {
        return this.move(BaseShape.DOWN);
    }
    left():boolean {
        return this.move(BaseShape.LEFT);
    }
    right():boolean {
        return this.move(BaseShape.RIGHT);
    }
    rotate():boolean {
        return this.move(BaseShape.CLOCK_WISE);
    }
    antiRotate():boolean {
        return this.move(BaseShape.ANTI_CLOCK_WISE);
    }
    transform():boolean {
        return true;
    }
    quickDrop():boolean {
        let result = this.move(BaseShape.DOWN);
        if (result) {
            return this.quickDrop();
        }
        else {
            return false;
        }
    }
    move(direction:string):boolean {
        let nextCoords = this.mockNextCoordinations(this.keyCoordinations, direction);
        let isValid = this.validNextCoordinations(nextCoords);
        if (isValid) {
            this.keyCoordinations = nextCoords;
            return true;
        }
        else {
            if (direction == BaseShape.DOWN) {
                for (let i = 0; i < this.keyCoordinations.length; i++) {
                    let tempArr = this.keyCoordinations[i];
                    for (let j = 0; j < tempArr.length; j++) {
                        let coord = tempArr[j];
                        if (coord.value == 1) {
                            this.map.unitArray[coord.x][coord.y] = 1;
                        }
                    }
                }
            }
            return false;
        }
    }

    private mockNextCoordinations(currentCoordinations, direction):Array<Array<Coordination>> {
        let nextCoordinations:Array<Array<Coordination>> = [];
        for (let i = 0; i < currentCoordinations.length; i++) {
            let newTempArr = [];
            let tempArr = currentCoordinations[i];
            for (let j = 0; j < tempArr.length; j++) {
                let coord = tempArr[j];
                let newCoord:Coordination;
                let value:number;
                switch (direction) {
                    case BaseShape.DOWN:
                        newCoord = new Coordination(coord.x + 1, coord.y, coord.value);
                        break;
                    case BaseShape.LEFT:
                        newCoord = new Coordination(coord.x, coord.y - 1, coord.value);
                        break;
                    case BaseShape.RIGHT:
                        newCoord = new Coordination(coord.x, coord.y + 1, coord.value);
                        break;
                    case BaseShape.CLOCK_WISE:
                        value = currentCoordinations[currentCoordinations.length - 1 - j][i].value;
                        newCoord = new Coordination(coord.x, coord.y, value);
                        break;
                    case BaseShape.ANTI_CLOCK_WISE:
                        value = currentCoordinations[j][currentCoordinations.length - 1 - i].value;
                        newCoord = new Coordination(coord.x, coord.y, value);
                        break;

                }
                newTempArr.push(newCoord);
            }
            nextCoordinations.push(newTempArr);
        }
        return nextCoordinations;
    }

    private validNextCoordinations(nextCoords):boolean {
        for (let i = 0; i < nextCoords.length; i++) {
            let tempArr = nextCoords[i];
            for (let j = 0; j < tempArr.length; j++) {
                let coord = tempArr[j];
                if (coord.value == 1) {
                    if (coord.y < 0 || coord.y > this.map.column - 1 || coord.x > this.map.row - 1) {
                        return false;
                    }
                    if (this.map.unitArray[coord.x][coord.y] == 1) {
                        return false;
                    }
                }
            }

        }
        return true;
    }

    static LEFT: string = "left";
    static RIGHT: string = "right";
    static DOWN: string = "down";
    static CLOCK_WISE = "clockWise";
    static ANTI_CLOCK_WISE = "antiClockWise";
}