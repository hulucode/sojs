import { Attr } from './Attr';

export class Click extends Attr {

    /**
     * 判断是否是click语句
     * @param node 
     */
    public static hasClick(node: string): boolean {
        if (/\sonclick=".+?"/.test(node)) {
            return true;
        }
        return false;
    }

    /**
     * 根据标签返回class表达式
     * @param node 
     */
    public static getExpression(node: string): string {
        let expression = node;
        if (this.hasClick(node)) {
            let str = Attr.transferQuotation(node);
            str = str.replace(/\sonclick="{.+?(\(.+\))}"/, word => {
                let old_w = RegExp.$1;
                word = word.replace(old_w, "('+" + old_w + "+')");
                return word;
            });
            expression = str;
        }
        return expression;
    }
}