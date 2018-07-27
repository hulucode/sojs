
export class Utils {

    /**
     * 将字符串转为DOM
     * @param tpl 模板字符串
     */
    public static parseDom(tpl: string): HTMLElement {
        var objE = document.createElement("div");
        objE.innerHTML = tpl;
        return objE.firstChild as HTMLElement;
    };
    
    /**
    * 将类名转为中划线模式
    * @param name 组件类名
    */
    public static camelToLine(name: string): string {
        let reg = /[A-Z]/g;
        name = name.replace(reg, (w, index) => {
            if (index == 0) {
                return w.toLowerCase();
            }
            return '-' + w.toLowerCase();
        });
        return name;
    }

    /**
     * 判断是否为数字
     * @param val 
     */
    public static isRealNumer(val: any): boolean {
        if (val === "" || val == null) {
            return false;
        }
        if (!isNaN(val)) {
            return true;
        }
        return false;
    }

    /**
     * 判断是否为布尔
     * @param val 
     */
    public static isRealBoolean(val: string): boolean {
        if (val == 'true' || val == '1') {
            return true;
        }
        return false;
    }
}