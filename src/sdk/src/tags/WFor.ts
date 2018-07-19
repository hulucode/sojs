import Tag from './Tag';

export default class WFor extends Tag {

    /**
     * 
     * @param tag 判断是否是for语句
     */
    public static isFor(tag: string): boolean {
        if (/^<[\/]?w-for/.test(tag)) {
            return true;
        }
        return false;
    }

    /**
     * 
     * @param tag 根据标签返回for表达式
     */
    public static getExpression(tag: string): string {
        let expression = '';
        if (/^<w-for/.test(tag)) {  // start tag
            let operator;
            if (/operator="{(.+?)}"/.test(tag)) { // 操作符
                operator = RegExp.$1;
            }else{
                operator = true;
            }
            expression = `for(${operator}){`;
        } else if (/^<\/w-for>$/.test(tag)) { //end tag
            expression = '}';
        }

        return expression;
    }

}