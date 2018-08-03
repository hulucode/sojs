
import { TagAttrs } from '../interface/ITag';

export class For {

    /**
     * 判断是否是for语句
     * @param node 节点
     */
    public static isFor(node: string): boolean {
        if (node == 'for') {
            return true;
        }
        return false;
    }

    /**
     * 根据属性列表返回for表达式
     * @param attributes 属性列表
     */
    public static getExpression(attributes?: TagAttrs[]): string {
        let expression = '';
        if (attributes) {
            let operator = attributes[0].value;
            operator = operator.replace(/&gt;/g,'>').replace(/&lt;/g,'<');
            operator = operator.substring(1, operator.length - 1);
            expression = `for(${operator}){`;
        } else {
            expression = `}`;
        }
        return expression;
    }

}