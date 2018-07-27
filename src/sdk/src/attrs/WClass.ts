import Attr from './Attr';

export default class WClass extends Attr {
    /**
     * 
     * @param tag 判断是否是class语句
     */
    public static hasClass(tag: string): boolean {
        if (/\sclass=".+?"/.test(tag)) {
            return true;
        }
        return false;
    }

    /**
     * 
     * @param tag 根据标签返回class表达式
     */
    public static getExpression(tag: string): string {
        let expression = '';

        return expression;
    }
}