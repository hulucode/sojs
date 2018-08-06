
export class Text {

    /**
    * 判断是否是text语句
    * @param node 节点
    */
    public static isText(node: string): boolean {
        if (/^[^<].*[^>]$/.test(node)) {
            return true;
        }
        return false;
    }

    /**
     * 根据节点返回相应表达式
     * @param node 节点
     */
    public static getExpression(node: string): string {
        let expression = node;
        expression = expression.replace(/&gt;/g, '>').replace(/&lt;/g, '<');
        expression = expression.replace(/{/g, "'+(").replace(/}/g, ")+'");
        return `expression.push('${expression}');`;
    }

}