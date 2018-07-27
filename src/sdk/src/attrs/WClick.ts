import Attr from './Attr';

export default class WClick extends Attr {

    /**
     * 
     * @param tag 判断是否是click语句
     */
    public static hasClick(tag: string): boolean {
        if (/\sonclick=".+?"/.test(tag)) {
            return true;
        }
        return false;
    }

    /**
     * 
     * @param tag 根据标签返回class表达式
     */
    public static getExpression(tag: string): string {
        let t = Attr.transferQuotation(tag);
        

        let expression = "'" + t + "'";
        // <button class="btn" onclick="{this.buttonHandle(item.title)}">
        console.log(tag);

        return expression;
    }
}