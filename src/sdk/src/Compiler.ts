
import { Component } from './Component';
import { Parse } from './Parse';
import { Tag } from './tags/Tag';
import { For } from './tags/For';
import { If } from './tags/If';
import { Else } from './tags/Else';
import { Text } from './tags/Text';
import { UserDefined } from './UserDefined';
import { Utils } from './utils/Utils';

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
        return compiler;
    }

    /**
    * HTMLElement
    */
    public getHtmlElement(): HTMLElement {
        if (!this._component.render) {
            this._component.render = this.toRender();
        }
        let htmlString = this._userDefined.getHtmlString(this._component.render());
        this._component.element = Utils.parseStringToDom(htmlString);
        return this._component.element;
    }

    /**
     * render函数
     */
    private toRender(): Function {
        let nodes: string[] = Parse.templateToArray(this._component.template);
        let expression: string = this.getExpression(nodes);
        return new Function(expression);
    }

    /**
     * 获取表达式字符串
     * @param nodes 节点字符串数组
     */
    private getExpression(nodes: string[]): string {
        // 用户自定义组件解析
        this._userDefined = UserDefined.currentComponent(this._component);
        // 开始
        let expressions = ['var expression = [];'];
        // 遍历节点
        nodes.forEach(node => {
            expressions.push(this.getTagString(node));
        });
        // 结束
        expressions.push('return expression.join("");');
        // 连接字符串
        return expressions.join('');
    }

    /**
     * 获取解析后的字符串
     * @param node 节点
     */
    private getTagString(node: string): string {
        if (For.isFor(node)) {
            return For.getExpression(node);
        } else if (If.isIf(node)) {
            return If.getExpression(node);
        } else if (Else.isElse(node)) {
            return Else.getExpression(node);
        } else if (Text.isText(node)) {
            return Text.getExpression(node);
        } else if (this._userDefined.isUserDefined(node)) {
            return this._userDefined.getExpression(node);
        }
        return Tag.getExpression(node);
    }

}