/**
 * Created by wangshouyun on 2017/3/24.
 */
export class Timer {

    private timeoutHandle:any = 0;
    private intervalHandle:any = 0;

    public startTimeOut(second: number, fun: Function, context: any): void {
        this.stopTimeOut();
        this.timeoutHandle = setTimeout(() => {
            fun.call(context);
        }, second * 1000);
    }

    public stopTimeOut(): void {
        clearTimeout(this.timeoutHandle);
    }

    public startInterval(second: number, fun: Function, context: any): void {
        this.stopInterval();
        this.intervalHandle = setInterval(() => {
            fun.call(context);
        }, second * 1000);
    }

    public stopInterval(): void {
        clearTimeout(this.intervalHandle);
    }


}