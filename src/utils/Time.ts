
export class Time{
    
    private static delta : number = 0;

    public static getDelta () : number{
        return Time.delta;
    }

    public static setDelat(delta : number) : void{
        Time.delta = delta;
    }

    public static getTime() : number{
        return Date.now();
    }
}