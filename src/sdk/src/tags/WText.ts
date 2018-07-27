import Tag from './Tag';

export default class WText extends Tag {

    /**
     * 返回文本类的表达式
     * @param tag 标签
     */
    public static getExpression(tag: string): string {
        let t = tag.replace(/&gt;/g, ">").replace(/&lt;/g, "<");
        if (/{.+?}/g.test(tag)) {
            if (/^{(.+?)}$/g.test(tag)) {
                t = RegExp.$1;
            } else {
                t = "'" + t.replace(/{/g, "'+(").replace(/}/g, ")+'") + "'";
            }
        } else {
            t = "'" + t + "'";
        }
        return t;
    }

}