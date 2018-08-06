
import { Parse } from '../Parse';

export class For {

    /**
     * 判断是否是for语句
     * @param node 节点
     */
    public static isFor(node: string): boolean {
        if (/^<\/?for/.test(node)) {
            return true;
        }
        return false;
    }

    /**
     * 根据节点返回相应表达式
     * @param node 节点
     */
    public static getExpression(node: string): string {
        let expression = '';
        if (/^<for/.test(node)) {
            let operator = Parse.getTagInfo(node).attributes[0].value;
            operator = operator.replace(/&gt;/g, '>').replace(/&lt;/g, '<');
            operator = operator.substring(1, operator.length - 1);
            expression = `for(${operator}){`;
        } else {
            expression = `}`;
        }
        return expression;
    }

}