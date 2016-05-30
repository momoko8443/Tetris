import {UnitMap} from "../core/UnitMap";
import {Coordination} from "../core/Coordination";
import {BaseShape} from "./BaseShape";
export class AntiLShape extends BaseShape {

    constructor(_map: UnitMap) {
        super(_map, "#FF00FF", 3);
    }


    init(): void {
        let position = this.measureInitPosition();
        this.keyCoordinations.push([new Coordination(0, position, 0), new Coordination(0, position + 1, 1), new Coordination(0, position + 2, 0)]);
        this.keyCoordinations.push([new Coordination(1, position, 0), new Coordination(1, position + 1, 1), new Coordination(1, position + 2, 0)]);
        this.keyCoordinations.push([new Coordination(2, position, 1), new Coordination(2, position + 1, 1), new Coordination(2, position + 2, 0)]);
    }
    transform(): boolean {
        return this.rotate();
    }
}
