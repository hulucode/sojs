
import { Component } from './Component';
import { Parse } from './Parse';
import { Tag } from './tags/Tag';
import { For } from './tags/For';
import { If } from './tags/If';
import { Else } from './tags/Else';
import { Text } from './tags/Text';
import { UserDefined } from './UserDefined';
import { Utils } from './utils/Utils';
import { TagInfo } from './interface/ITag';
import { Single } from './tags/Single';
import { Scope } from './utils/Scope';

export class Compiler {

    // 编译上下文
    private _component: Component;

    // 用户自定义
    private _userDefined: UserDefined;

    /**
     * 设置编译上下文环境
     * @param component 上下文
     */
    public static component(component: Component): Compiler {
        let compiler: Compiler = new Compiler();
        compiler._component = component;
        compiler._userDefined = UserDefined.currentComponent(compiler._component);
        return compiler;
    }

    /**
    * HTMLElement
    */
    public getHtmlElement(): HTMLElement {
        if (!this._component.render) {
            this._component.render = this.toRender();
        }
        this._component.element = Utils.parseStringToDom(this._component.render(this));
        return this._component.element;
    }

    /**
     * render函数
     */
    private toRender(): Function {
        let expression = this.getExpression(this._component.template);
        return new Function('compiler', expression);
    }

    /**
     * 获取解析自定义组件后的准备dom字符串
     * @param htmlString render后的字符串
     */
    public getExpression(htmlString: string): string {
        let tagInfo = Parse.getTagTree(htmlString);
        let expression: string[] = ['var expression = [];'];
        let userDefinedIndex = 0;
        this.getExcludeString(expression, tagInfo, userDefinedIndex);
        expression.push("return expression.join('');");
        return expression.join('');
    }

    /**
     * 递归循环标签信息
     * @param expression 字符串数组
     * @param tagInfo 节点信息
     */
    private getExcludeString(expression: string[], tagInfo: TagInfo, userDefinedIndex: number) {
        // 开始
        if (this._userDefined.isUserDefined(tagInfo.type)) { // 自定义开始标签
            // 当前为自定义组件
            userDefinedIndex++;
            if (userDefinedIndex == 1) {
                // 设置tagInfo唯一标识
                tagInfo.scope = Scope.getScope();
                // 保存当前tagInfo
                this._component.addChildComponents(tagInfo);
                expression.push(`var scope = '${tagInfo.scope}';`);
                expression.push("var childrenString = [];");
                // 生成dom占位符
                expression.push(`expression.push('<w-${tagInfo.type} scope="'+scope+'">');`);
            } else {
                expression.push(`childrenString.push('<${tagInfo.type}>');`);
            }
        } else if (Text.isText(tagInfo.type)) { // 文本开始标签
            if (userDefinedIndex > 0) {
                expression.push(`childrenString.push('${Text.getExpression(tagInfo.attributes)}');`);
            } else {
                expression.push(`expression.push('${Text.getExpression(tagInfo.attributes)}');`);
            }
        } else {
            if (For.isFor(tagInfo.type)) {
                expression.push(For.getExpression(tagInfo.attributes));
            } else if (If.isIf(tagInfo.type)) {
                expression.push(If.getExpression(tagInfo.attributes));
            } else if (Else.isElse(tagInfo.type)) {
                expression.push(Else.getExpression(tagInfo.attributes));
            } else if (Single.isSingle(tagInfo.type)) { // 单标签开始
                let attr_event = Single.getAttrEvent(tagInfo);
                if (userDefinedIndex > 0) {
                    expression.push(attr_event.event); // 添加事件处理
                    expression.push(`childrenString.push('<${tagInfo.type}${attr_event.attr}');`);
                } else {
                    expression.push(attr_event.event); // 添加事件处理
                    expression.push(`expression.push('<${tagInfo.type}${attr_event.attr}');`);
                }
            } else { // 双标签开始
                let attr_event = Tag.getAttrEvent(tagInfo);
                if (userDefinedIndex > 0) {
                    expression.push(attr_event.event); // 添加事件处理
                    expression.push(`childrenString.push('<${tagInfo.type}${attr_event.attr}>');`);
                } else {
                    expression.push(attr_event.event); // 添加事件处理
                    expression.push(`expression.push('<${tagInfo.type}${attr_event.attr}>');`);
                }
            }
        }
        // 存在子节点则继续循环递归
        if (tagInfo.children) {
            tagInfo.children.forEach(info => {
                this.getExcludeString(expression, info, userDefinedIndex);
            });
        }
        // 结束
        if (this._userDefined.isUserDefined(tagInfo.type)) { // 自定义结束标签
            if (userDefinedIndex > 0) {
                userDefinedIndex--;
            }
            if (userDefinedIndex == 0) {
                expression.push(`expression.push('</w-${tagInfo.type}>');`);
                expression.push("this.test(childrenString.join(''));");
            } else {
                expression.push(`childrenString.push('</${tagInfo.type}>');`);
            }
        } else if (tagInfo.type == 'text') { // 非文本结束标签
            if (userDefinedIndex > 0) {
                expression.push(`childrenString.push('');`);
            } else {
                expression.push(`expression.push('');`);
            }
        } else {
            if (For.isFor(tagInfo.type)) {
                expression.push(For.getExpression());
            } else if (If.isIf(tagInfo.type)) {
                expression.push(If.getExpression());
            } else if (Else.isElse(tagInfo.type)) {
                expression.push(Else.getExpression());
            } else if (Single.isSingle(tagInfo.type)) { // 单标签结束
                if (userDefinedIndex > 0) {
                    expression.push(`childrenString.push('/>');`);
                } else {
                    expression.push(`expression.push('/>');`);
                }
            } else { // 双标签结束
                if (userDefinedIndex > 0) {
                    expression.push(`childrenString.push('</${tagInfo.type}>');`);
                } else {
                    expression.push(`expression.push('</${tagInfo.type}>');`);
                }
            }
        }
    }

}