

export class DomEvent {
    public static addEvent(el: any, type: string, fn: any, capture: boolean) {
        let win: any = window;
        if (win.addEventListener) {
            el.addEventListener(type, fn, capture);
        } else if (win['attachEvent']) {
            el['attachEvent']("on" + type, fn);
        }
        return this;
    }
    public static fireEvent(el: any, eventName: any, data: any) {
        if (typeof (el) == 'object') {
            eventName = eventName.replace(/^on/i, '');
            if (document.all) {
                eventName = "on" + eventName;
                el.fireEvent(eventName);
            } else {
                var evt: any = document.createEvent('HTMLEvents');
                evt.initEvent(eventName, true, true);
                evt['data'] = data;
                el.dispatchEvent(evt);
            }
        }
        return this;
    }
    public static removeEvent(el: any, type: string, fn: any, capture: boolean) {
        let win: any = window;
        let doc: any = document;
        if (win.removeEventListener) {
            el.removeEventListener(type, fn, capture || false);
        } else if (doc['attachEvent']) {
            el['detachEvent']("on" + type, fn);
        }
        return this;
    }
}

