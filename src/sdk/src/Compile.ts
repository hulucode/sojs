import WFor from './tags/WFor';
import WIf from './tags/WIf';
import WElse from './tags/WElse';
import WClass from './attrs/WClass';

export default class Compile {

    /**
     * 单例实例对象
     */
    public static instance: Compile;

    /**
     * 根据模板返回Function
     * @param template 模板
     */
    public static template(template: string): Function {
        if (!Compile.instance) {
            Compile.instance = new Compile();
        }
        return Compile.instance.toFuction(Compile.instance.tplToArray(template));
    }

    /**
     * 将模板转为字符串数组
     * @param template html模板
     */
    private tplToArray(template: string): string[] {
        let tpl = template.replace(/[\r\n]/g, '').replace(/(>)\s+[^\S]/g, '$1').replace(/[^\S]\s+(<)/g, '$1');
        let reg = new RegExp('>.*?<', 'g');
        let splitFlag = '%@%';
        tpl.match(reg).forEach(w => {
            let word = '';
            if (/(^>)(<$)/.test(w)) {
                word = `${RegExp.$1}${splitFlag}${RegExp.$2}`;
            } else if (/(^>)(.+)(<$)/.test(w)) {
                word = `${RegExp.$1}${splitFlag}${RegExp.$2}${splitFlag}${RegExp.$3}`;
            }
            tpl = tpl.replace(w, word);
        });
        // console.log(tpl);
        return tpl.split(splitFlag);
    }

    /**
     * 生成Render函数
     * @param tags 标签数组
     */
    private toFuction(tags: string[]): Function {
        let expression = 'let expression = "";';
        tags.forEach(tag => {
            if (WFor.isFor(tag)) {
                expression += WFor.getExpression(tag);
            } else if (WIf.isIf(tag)) {
                expression += WIf.getExpression(tag);
            } else if (WElse.isElse(tag)) {
                expression += WElse.getExpression(tag);
            } else {
                if (WClass.isClass(tag)) {

                }
                if (/^{(.+?)}$/.test(tag)) {
                    expression += 'expression += ' + RegExp.$1 + ';';
                } else {
                    expression += 'expression += `' + tag + '`;';
                }
            }
        });
        expression += 'return expression;';
        console.log(expression);
        return new Function(expression);
    }
}