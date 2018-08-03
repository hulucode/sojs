export class EventObserver {
    public callback: Function = null;
    public context: any = null;

    constructor(callback: Function, context: any) {
        let self = this;
        self.callback = callback;
        self.context = context;
    }

    notify(...args: any[]): void {
        let self = this;
        self.callback.call(self.context, ...args);
    }

    compar(context: any): boolean {
        return context == this.context;
    }
}