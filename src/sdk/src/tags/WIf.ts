import Tag from './Tag';

export default class WIf extends Tag {

    /**
     * 
     * @param tag 判断是否是if语句
     */
    public static isIf(tag: string): boolean {
        if (/^<[\/]?w-if/.test(tag)) {
            return true;
        }
        return false;
    }

    /**
     * 
     * @param tag 根据标签返回if表达式
     */
    public static getExpression(tag: string): string {
        let expression = '';
        if (/^<w-if/.test(tag)) {  // start tag
            let operator;
            if (/operator="(.+?)"/.test(tag)) { // 操作符
                if (/^{(.+?)}$/.test(RegExp.$1)) {
                    operator = RegExp.$1;
                } else {
                    operator = Tag.isRealBoolean(RegExp.$1);
                }
            }else{
                operator = true;
            }
            expression = `if(${operator}){`
        } else if (/^<\/w-if>$/.test(tag)) { //end tag
            expression = '}';
        }

        return expression;
    }
}