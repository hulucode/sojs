
import { TagAttrs } from '../interface/ITag';
export class Text {

    /**
    * 判断是否是text语句
    * @param node 节点
    */
    public static isText(node: string): boolean {
        if (node == 'text') {
            return true;
        }
        return false;
    }

    /**
     * 根据节点返回相应表达式
     * @param node 节点
     */
    public static getExpression(attr?: TagAttrs[]): string {
        let expression = attr[0].value;
        expression = expression.replace(/&gt;/g, '>').replace(/&lt;/g, '<');
        expression = expression.replace(/{/g, "'+(").replace(/}/g, ")+'");
        return expression;
    }

}