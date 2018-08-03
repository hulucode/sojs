import { EventObserver } from './observer.event';

export class EventEmitter {

    public static listeners: any = {};

    public static register(name: string, callback: Function, context: any) {
        let observers: EventObserver[] = EventEmitter.listeners[name];
        if (!observers) {
            EventEmitter.listeners[name] = [];
        }
        EventEmitter.listeners[name].push(new EventObserver(callback, context));
    }

    public static unRegister(name: string, callback: Function, context: any) {
        let observers: EventObserver[] = EventEmitter.listeners[name];
        if (!observers) return;
        let length = observers.length;
        for (let i = 0; i < length; i++) {
            let observer = observers[i];
            if (observer.compar(context)) {
                observers.splice(i, 1);
                break;
            }
        }
        if (observers.length == 0) {
            delete EventEmitter.listeners[name];
        }
    }

    public static trigger(name: string, ...args: any[]) {
        let observers: EventObserver[] = EventEmitter.listeners[name];
        if (!observers) return;
        let length = observers.length;
        for (let i = 0; i < length; i++) {
            let observer = observers[i];
            observer.notify(name, ...args);
        }
    }
}