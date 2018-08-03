
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
      * 根据属性列表返回if表达式
      * @param attributes 属性列表
      */
    public static getExpression(attributes?: TagAttrs[]): string {
        let expression = '';
        if (attributes) {
            let operator = attributes[0].value;
            operator = operator.replace(/&gt;/g,'>').replace(/&lt;/g,'<');
            operator = operator.substring(1, operator.length - 1);
            expression = `if(${operator}){`;
        } else {
            expression = `}`;
        }
        return expression;
    }
}