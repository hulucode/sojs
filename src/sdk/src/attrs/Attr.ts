export default class Attr {

    /**
     * 将标签内的单引号转义为编码
     * @param tag 标签
     */
    public static transferQuotation(tag: string): string {
        return tag.replace(/\'/g, '&quot;');
    }

}