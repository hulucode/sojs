import Tag from './Tag';

export default class WElse extends Tag {
 
    /**
     * 
     * @param tag 判断是否是else语句
     */
    public static isElse(tag: string): boolean {
        if (/^<[\/]?w-else/.test(tag)) {
            return true;
        }
        return false;
    }

    /**
     * 
     * @param tag 根据标签返回else表达式
     */
    public static getExpression(tag: string): string {
        let expression = '';

        if (/^<w-else/.test(tag)) {  // start tag
            expression = 'else{'
        } else if (/^<\/w-else>$/.test(tag)) { //end tag
            expression = '}';
        }

        return expression;
    }

}