export class CommonUtil{
    static removeUnit(value:string,unit:string){
        if(value && unit){
            return parseFloat(value.split(unit)[0]);
        }
        return undefined;
    }
}