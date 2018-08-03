
import { Tag } from './tags/Tag';
import { TagInfo } from './interface/ITag';

export class Parse {

    /**
    * 将模板转为字符串数组
    * @param template html模板片段
    */
    public static templateToArray(template: string): string[] {
        let tpl = template.replace(/[\r\n]+/g, '')
            .replace(/\{(.+?)\}/g, item => {
                return item.replace(/>/g, "&gt;").replace(/</g, "&lt;");
            })
            .replace(/(>)\s+[^\S]/g, '$1')
            .replace(/[^\S]\s+(<)/g, '$1')
            .replace(/>.*?</g, word => {
                if (/(^>)(<$)/.test(word)) {
                    return `${RegExp.$1}${Tag.SPLITFLAG}${RegExp.$2}`;
                } else if (/(^>)(.+)(<$)/.test(word)) {
                    return `${RegExp.$1}${Tag.SPLITFLAG}${RegExp.$2}${Tag.SPLITFLAG}${RegExp.$3}`;
                }
                return word;
            });
        return tpl.split(Tag.SPLITFLAG);
    }

    /**
     * 根据标签字符串返回标签名称和属性信息
     * @param tag 标签字符串
     */
    public static getTagInfo(tag: string): TagInfo {
        let tagInfo: TagInfo = {
            type: '',
            attributes: []
        };
        // 获取节点名称
        if (/<(.+?)\s/.test(tag) || /<(.+?)\s*\/?>/.test(tag)) {
            tagInfo.type = RegExp.$1;
        }
        // 获取节点所有属性
        let attributes = tag.match(/\s.+?=".+?"/g);
        if (attributes) {
            attributes.forEach(word => {
                word = word.trim();
                if (/(.+)="(.+)"/.test(word)) {
                    tagInfo.attributes.push({
                        name: RegExp.$1,
                        value: RegExp.$2
                    });
                }
            });
        }
        return tagInfo;
    }

    /**
     * 返回树状Tag结构
     * @param nodes 节点数组
     */
    public static getTagTree(template: string): TagInfo {

        // 模板字符串转为数组
        let nodes: string[] = this.templateToArray(template);

        let tagTree: TagInfo = null;
        let tagTrees: TagInfo[] = null;
        let parentNode: TagInfo = null;
        nodes.forEach(node => {
            parentNode = tagTrees ? tagTrees[tagTrees.length - 1] : null;
            if (Tag.isStartTag(node)) { //开始标签
                let tagInfo: TagInfo = this.getTagInfo(node);
                if (!tagTree) {
                    tagTree = {
                        type: tagInfo.type,
                        attributes: tagInfo.attributes,
                        children: []
                    };
                    tagTrees = [];
                    tagTrees.push(tagTree);
                } else {
                    let dt: TagInfo = {
                        type: tagInfo.type,
                        attributes: tagInfo.attributes,
                        children: []
                    };
                    parentNode.children.push(dt);
                    tagTrees.push(dt);
                }
            } else if (Tag.isEndTag(node)) { // 结束标签
                tagTrees.pop();
            } else if (Tag.isSingleTag(node)) { //单标签
                let tagInfo: TagInfo = this.getTagInfo(node);
                parentNode.children.push({
                    type: tagInfo.type,
                    attributes: tagInfo.attributes
                });
            } else { // 文本
                parentNode.children.push({
                    type: 'text',
                    attributes: [{ name: 'text', value: node }],
                });
            }
        })
        return tagTree;
    }

}