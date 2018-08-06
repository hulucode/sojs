
export class Else {

    /**
     * 判断是否是else语句
     * @param node 节点
     */
    public static isElse(node: string): boolean {
        if (/^<\/?else/.test(node)) {
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
        if (/^<else/.test(node)) {
            expression = `else{`;
        } else {
            expression = `}`;
        }
        return expression;
    }

}