export default class Tag {

    /**
     * 
     * @param val 判断是否为数字
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
     * 
     * @param val 判断是否为布尔
     */
    public static isRealBoolean(val: string): boolean {
        if (val == 'true' || val == '1') {
            return true;
        }
        return false;
    }

}