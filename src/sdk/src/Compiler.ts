import WFor from './tags/WFor';
import WIf from './tags/WIf';
import WElse from './tags/WElse';
import WText from './tags/WText';
import Tag from './tags/Tag';
import WClick from './attrs/WClick';

export default class Compiler {

    /**
     * 将模板编译成Render函数
     * @param template 模板
     */
    public static toRender(template: string): Function {
        let strs = this.toArray(template);
        let expression = this.getExpression(strs);
        console.log(expression);
        return new Function(expression);
    }

    /**
    * 生成函数表达式
    * @param tags 标签数组
    */
    private static getExpression(tags: string[]): string {
        let strs = ['let expressions = [];'];
        tags.forEach(tag => {
            if (WFor.isFor(tag)) {
                strs.push(WFor.getExpression(tag));
            } else if (WIf.isIf(tag)) {
                strs.push(WIf.getExpression(tag));
            } else if (WElse.isElse(tag)) {
                strs.push(WElse.getExpression(tag));
            } else {
                if (/<.+?>/.test(tag)) {
                    if (WClick.hasClick(tag)) {
                        strs.push(`expressions.push(${WClick.getExpression(tag)});`);
                    } else {
                        strs.push(`expressions.push('${tag}');`);
                    }
                } else {
                    strs.push(`expressions.push(${WText.getExpression(tag)});`);
                }
            }
        });
        strs.push('return expressions.join("");');
        return strs.join("");
    }

    /**
     * 将模板转为字符串数组
     * @param template html模板片段
     */
    private static toArray(template: string): string[] {
        let tpl = template.replace(/[\r\n]+/g, '');
        tpl = tpl.replace(/\{(.+?)\}/g, item => {
            return item.replace(/>/g, "&gt;").replace(/</g, "&lt;");
        });
        tpl = tpl.replace(/(>)\s+[^\S]/g, '$1');
        tpl = tpl.replace(/[^\S]\s+(<)/g, '$1');
        tpl = tpl.replace(/>.*?</g, word => {
            if (/(^>)(<$)/.test(word)) {
                return `${RegExp.$1}${Tag.SPLITFLAG}${RegExp.$2}`;
            } else if (/(^>)(.+)(<$)/.test(word)) {
                return `${RegExp.$1}${Tag.SPLITFLAG}${RegExp.$2}${Tag.SPLITFLAG}${RegExp.$3}`;
            }
            return word;
        });
        return tpl.split(Tag.SPLITFLAG);
    }

}