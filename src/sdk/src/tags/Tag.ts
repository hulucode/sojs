
import { TagAttrs, TagInfo } from '../interface/ITag';
import { Scope } from '../utils/Scope';
import { Parse } from '../Parse';

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
    * 根据节点返回相应表达式
    * @param node 节点
    */
    public static getAttrEvent(tagInfo: TagInfo): { attr: string, event: string } {
        return this.getAttrAndEvent(tagInfo.attributes);
    }

    /**
     * 通过标签属性获取属性和事件表达式
     * @param tagAttrs 标签属性列表
     */
    public static getAttrAndEvent(tagAttrs: TagAttrs[]): { attr: string, event: string } {
        let scope = Scope.getScope();
        let attr_expression = '';
        let event_expression = '';
        tagAttrs.forEach(attr => {
            let name = attr.name;
            let value = attr.value.replace(/&gt;/g, '>').replace(/&lt;/g, '<');
            if (/^on(.+)="{(this\.)?(.+)\((.*)\)}"/.test(`${name}="${value}"`)) { // 事件属性处理
                event_expression += `events.push({
                        'type':'${RegExp.$1}',
                        'handle':'${RegExp.$3}',
                        'arguments':[${RegExp.$4}]
                    });`;
                attr_expression += ` event="${scope}"`;
            } else { // 非事件属性处理
                value = value.replace(/{/g, "'+(").replace(/}/g, ")+'");
                attr_expression += ` ${name}="${value}"`;
            }
        });
        if (event_expression != '') { // 如果存在事件属性,则添加进表达式
            event_expression = 'var events = [];' + event_expression + `this.addEventByScope('${scope}',events);`;
        }
        return { attr: attr_expression, event: event_expression };
    }
}
