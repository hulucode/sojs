
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
     * 根据节点返回相应表达式
     * @param node 节点
     */
    public static getExpression(attr?: TagAttrs[]): string {
        let expression = '';
        if (attr) {
            expression = `else{`;
        } else {
            expression = `}`;
        }
        return expression;
    }

}