export class Attr {

    /**
     * 将标单引号转义为编码
     * @param node 标签
     */
    public static transferQuotation(node: string): string {
        return node.replace(/\'/g, '&quot;');
    }

}