
import { TagAttrs } from '../interface/ITag';

export class Else {

    /**
     * 判断是否是else语句
     * @param node 节点
     */
    public static isElse(node: string): boolean {
        if (node == 'else') {
            return true;
        }
        return false;
    }

  
    /**
     * 根据属性列表返回else表达式
     * @param attributes 属性列表
     */
    public static getExpression(attributes?: TagAttrs[]): string {
        let expression = '';
        if (attributes) {
            expression = `else{`;
        } else {
            expression = `}`;
        }
        return expression;
    }

}