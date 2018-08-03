
import { BaseComponent } from './base/BaseComponent';

export interface IEventHandle {
    context: BaseComponent,
    handle: string,
    arguments: any[]
}

export class EventListenerHandle implements EventListenerObject {

    private context: BaseComponent;
    private handle: string;
    private arguments: any[];
    constructor(event: IEventHandle) {
        this.context = event.context;
        this.handle = event.handle;
        this.arguments = event.arguments;
    }

    handleEvent(e: Event) {
        let handle = this.context.constructor.prototype[this.handle];
        handle(e, this.arguments);
    }

}