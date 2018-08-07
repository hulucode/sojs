

import { Parse } from '../Parse';
import { TagAttrs } from '../interface/ITag';

export class If {

    /**
     * 判断是否是if语句
     * @param node 节点
     */
    public static isIf(node: string): boolean {
        if (node == 'if') {
            return true;
        }
        return false;
    }

    /**
     * 根据节点返回相应表达式
     * @param node 节点
     */
    public static getExpression(attrs?: TagAttrs[]): string {
        let expression = '';
        if (attrs) {
            let operator = attrs[0].value;
            operator = operator.replace(/&gt;/g, '>').replace(/&lt;/g, '<');
            operator = operator.substring(1, operator.length - 1);
            expression = `if(${operator}){`;
        } else {
            expression = `}`;
        }
        return expression;
    }
}