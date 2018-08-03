
import { TagAttrs } from '../interface/ITag';
import { Scope } from '../utils/Scope';
import { INativeEvent } from '../interface/INativeEvent';

export class Tag {

    // 分割符
    public static SPLITFLAG = '%@@%';

    // 单标签列表
    public static SINGLETAGS: string[] = ['br', 'input', 'img', 'hr'];

    /**
     * 判断是否为开始标签
     * @param node 节点
     */
    public static isStartTag(node: string): boolean {
        if (/<[^\/]+>/.test(node) && !this.isSingleTag(node)) {
            return true;
        }
        return false;
    }

    /**
    * 判断是否为结束标签
    * @param node 节点
    */
    public static isEndTag(node: string): boolean {
        if (/<\/.+?>/.test(node) && !this.isSingleTag(node)) {
            return true;
        }
        return false;
    }

    /**
    * 判断是否为单标签
    * @param node 节点
    */
    public static isSingleTag(node: string): boolean {
        let bl = false;
        if (/<(.+?)\s/.test(node) || /<(.+?)\s*\/?>/.test(node)) {
            this.SINGLETAGS.forEach(t => {
                if (t == RegExp.$1) {
                    bl = true;
                }
            });
        }
        return bl;
    }

    /**
     * 判断是否为文本标签
     * @param node 节点
     */
    public static isTextTag(node: string): boolean {
        if (/^[^<].+[^>]$/.test(node)) {
            return true;
        }
        return false;
    }

    /**
     * 根据属性列表返回标签表达式
     * @param attributes 属性列表
     */
    public static getExpression(type: string, attributes?: TagAttrs[]): string {
        let isSingle: boolean = false;
        this.SINGLETAGS.forEach(t => {
            if (t == type) {
                isSingle = true;
            }
        });
        let expression = '';
        let eventExpression = '';
        if (attributes) {
            let scope = Scope.getScope();
            expression = `<${type}`;
            attributes.forEach(attr => {
                let name = attr.name;
                let value = attr.value.replace(/&gt;/g, '>').replace(/&lt;/g, '<');
                if (/^on(.+)="{(this\.)?(.+)\((.*)\)}"/.test(`${name}="${value}"`)) {
                    eventExpression += `var event = {
                        'type':'${RegExp.$1}',
                        'handle':'${RegExp.$3}',
                        'arguments':[${RegExp.$4}]
                    };`;
                    eventExpression += `this.addEventByScope('${scope}',event);`;
                    expression += ` scope="${scope}"`;
                } else {
                    value = value.replace(/{/g, "'+(").replace(/}/g, ")+'");
                    expression += ` ${name}="${value}"`;
                }
            });
            if (isSingle) { //单标签
                expression += '/>';
            } else { //双标签
                expression += '>';
            }
        } else {
            if (isSingle) { //单标签
                expression = '';
            } else { //双标签
                expression = `</${type}>`;
            }
        }
        return `expression.push('${expression}');${eventExpression}`;
    }

}