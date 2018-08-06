

import { Parse } from '../Parse';

export class If {

    /**
     * 判断是否是if语句
     * @param node 节点
     */
    public static isIf(node: string): boolean {
        if (/^<\/?if/.test(node)) {
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
        if (/^<if/.test(node)) {
            let operator = Parse.getTagInfo(node).attributes[0].value;
            operator = operator.replace(/&gt;/g, '>').replace(/&lt;/g, '<');
            operator = operator.substring(1, operator.length - 1);
            expression = `if(${operator}){`;
        } else {
            expression = `}`;
        }
        return expression;
    }
}