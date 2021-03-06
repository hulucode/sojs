/**
 * Created by wangshouyun on 2017/3/9.
 */
export class Scope {

    private static instance: Scope;

    public static getScope(): string {
        if (!Scope.instance) {
            Scope.instance = new Scope();
        }
        return Scope.instance.uuid();
    }

    private uuid() {
        var d = new Date().getTime();
        var uuid = 'xxxx-xxxx-xxxx-xxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    }

}