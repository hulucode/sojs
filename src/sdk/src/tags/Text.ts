
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
     * 根据属性列表返回广本表达式
     * @param attributes 属性列表
     */
    public static getExpression(attributes?: TagAttrs[]): string {
        let expression = '';
        if (attributes) {
            let text = attributes[0].value;
            text = text.replace(/&gt;/g, '>').replace(/&lt;/g, '<');
            text = text.replace(/{/g, "'+(").replace(/}/g, ")+'");
            expression = text;
        }
        return `expression.push('${expression}');`;
    }

}