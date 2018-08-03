
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
        // 当前组件
        compiler._component = component;
        // 用户自定义组件
        compiler._userDefined = UserDefined.parentComponent(compiler._component);
        return compiler;
    }

    /**
    * 返回HTMLElement
    */
    public getHtmlElement(): HTMLElement {
        if (!this._component.render) {
            this._component.render = this.toRender();
        }
        this._component.element = Utils.parseDom(this._component.render());
        return this._component.element;
    }

    /**
     * 返回render函数
     */
    private toRender(): Function {
        let tagTree: TagInfo = Parse.getTagTree(this._component.template);
        let expression: string = this.getExpression(tagTree);
        return new Function(expression);
    }

    /**
     * 获取表达式字符串
     * @param tagTree 树状DOM字符串
     */
    private getExpression(tagTree: TagInfo): string {
        // 开始
        let expressions = ['var expression = [];'];
        // 循环递归获取标签
        this.getTagString(tagTree, expressions);
        // 结束
        expressions.push('return expression.join("");');
        // 连接字符串
        return expressions.join('');
    }

    /**
     * 获取标签字符串表达式
     * @param currentTag 节点
     */
    private getTagString(currentTag: TagInfo, expressions: string[]) {
        // 自定义组件
        let isUserDefined = this._userDefined.isUserDefined(currentTag.type);
        // 处理开始标签
        if (isUserDefined) {
            expressions.push(this._userDefined.getExpression(currentTag));
        } else {
            expressions.push(this.getStartTagString(currentTag));
        }
        // 如果有子元素则循环递归
        if (currentTag.children) {
            currentTag.children.forEach((tag: TagInfo) => {
                this.getTagString(tag, expressions);
            });
        }
        // 处理结束标签
        if (isUserDefined) {
            expressions.push(this._userDefined.getExpression());
        } else {
            expressions.push(this.getEndTagString(currentTag));
        }
    }

    // 获取开始标签字符串
    private getStartTagString(currentTag: TagInfo): string {
        if (For.isFor(currentTag.type)) {
            return For.getExpression(currentTag.attributes);
        } else if (If.isIf(currentTag.type)) {
            return If.getExpression(currentTag.attributes);
        } else if (Else.isElse(currentTag.type)) {
            return Else.getExpression(currentTag.attributes);
        } else if (Text.isText(currentTag.type)) {
            return Text.getExpression(currentTag.attributes);
        }
        return Tag.getExpression(currentTag.type, currentTag.attributes);
    }

    // 获取结束标签字符串
    private getEndTagString(currentTag: TagInfo): string {
        if (For.isFor(currentTag.type)) {
            return For.getExpression();
        } else if (If.isIf(currentTag.type)) {
            return If.getExpression();
        } else if (Else.isElse(currentTag.type)) {
            return Else.getExpression();
        } else if (Text.isText(currentTag.type)) {
            return Text.getExpression();
        }
        return Tag.getExpression(currentTag.type);
    }

}