
export class UnitMap {
    row: number;
    column: number;
    unitArray: Array<any>;
    constructor(_row, _column) {
        this.row = _row;
        this.column = _column;
        this.unitArray = [];
    }


    createMap():void {
        this.initMap(false);
    }
    createRandomMap():void{
        this.initMap(true);
    }
    private initMap(isRandom): void {
        var twoArray = [];
        for (var i = 0; i < this.row; i++) {
            var tempArr = [];
            for (var j = 0; j < this.column; j++) {
                var status = 0;
                if (isRandom) {
                    status = Math.round(Math.random());
                }
                tempArr.push(status);
            }
            twoArray.push(tempArr);
        }
        this.unitArray = twoArray;
    }
}
