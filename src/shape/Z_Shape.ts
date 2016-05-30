import {UnitMap} from "../core/UnitMap";
import {Coordination} from "../core/Coordination";
import {BaseShape} from "./BaseShape";
export class ZShape extends BaseShape {
    private flag: boolean;
    constructor(_map: UnitMap) {
        super(_map, "#00FF00", 3);
        this.flag = false;
    }
    
    init(): void {
        let position = this.measureInitPosition();
        this.keyCoordinations.push([new Coordination(0, position, 1), new Coordination(0, position + 1, 1), new Coordination(0, position + 2, 0)]);
        this.keyCoordinations.push([new Coordination(1, position, 0), new Coordination(1, position + 1, 1), new Coordination(1, position + 2, 1)]);
        this.keyCoordinations.push([new Coordination(2, position, 0), new Coordination(2, position + 1, 0), new Coordination(2, position + 2, 0)]);
    }

    transform(): boolean {
        if (this.flag) {
            this.flag = false;
            return this.antiRotate();
        }
        else {
            this.flag = true;
            return this.rotate();
        }
    }

}