import { Component } from './Component';
import { Utils } from './utils/Utils';
import { IUDComponent, sync, async } from './interface/IUDComponent';
import { EventEmitter } from './events/emitter.event';
import { Compiler } from './Compiler';
import { INativeEvent } from './interface/INativeEvent';
import { EventListenerHandle } from './EventListenerHandle';
import { Parse } from './Parse';
import { TagInfo } from './interface/ITag';
import { Tag } from './tags/Tag';
import { Scope } from './utils/Scope';

export class UserDefined {

    // 父组件实例
    private _currentComponent: Component;

    private _dependencies: any[];

    constructor() {
        // 监听父级组件创建完成事件
        EventEmitter.register('element-created', this.currentElementCreated, this);
    }

    /**
     * 设置组件实例
     * @param currentComponent 当前组件
     */
    public static currentComponent(currentComponent: Component): UserDefined {
        let userDefined = new UserDefined();
        userDefined._currentComponent = currentComponent;
        userDefined._dependencies = userDefined._currentComponent.dependencies();
        if (userDefined._currentComponent.parent) {
            userDefined._dependencies = userDefined._dependencies.concat(userDefined._currentComponent.parent.dependencies());
        }
        return userDefined;
    }

    // 保存当前组件Children
    private _childComponentInfo: TagInfo[] = [];
    private addChildComponentInfo(tagInfo: TagInfo) {
        this._childComponentInfo.push(tagInfo);
    }
    private getChildComponentInfo(): TagInfo[] {
        return this._childComponentInfo;
    }

    /**
    * 判断是否为自定义组件
    * @param node 节点
    */
    public isUserDefined(node: string): boolean {
        let isUserDefined = false;
        let tagInfo = Parse.getTagInfo(node);
        this._dependencies.forEach(dependencie => { // 遍历查找是否是自定义组件
            if (typeof dependencie == 'string' && /(.+?)\[.+\]/.test(dependencie)) { // 异步组件
                let className = RegExp.$1;
                let name = Utils.camelToLine(className);
                if (name == tagInfo.type) {
                    isUserDefined = true;
                }
            } else { // 同步组件
                let name = Utils.camelToLine(dependencie.className);
                if (name == tagInfo.type) {
                    isUserDefined = true;
                }
            }
        });
        return isUserDefined;
    }

    /**
     * 获取自定义组件表达式和属性
     * @param node 节点
     */
    public getExpression(node: string): string {
        let tagInfo = Parse.getTagInfo(node);
        if (/<[^\/].+>/.test(node)) { // 开始标签
            let expression = '';
            tagInfo.attributes.forEach(attr => {
                let name = attr.name;
                let value = attr.value.replace(/&gt;/g, '>').replace(/&lt;/g, '<');
                if (/{(.+)}/.test(value)) { // 将数据保存为json字符串
                    value = value.replace(/{(.+)}/, `'+(JSON.stringify(${RegExp.$1}))+'`);
                }
                expression += ` ${name}="${value}"`;
            });
            return `expression.push('<${tagInfo.type}${expression}>');`;
        } else { //结束标签
            return `expression.push('</${tagInfo.type}>');`;
        }
    }

    /**
     * 获取解析自定义组件后的准备dom字符串
     * @param htmlString render后的字符串
     */
    public getHtmlString(htmlString: string): string {
        let tagInfo = Parse.getTagTree(htmlString);
        let expression: string[] = [];
        this.getExcludeString(expression, tagInfo);
        return expression.join('');
    }

    /**
     * 递归排队自定义组件标签
     * @param expression 字符串数组
     * @param tagInfo 节点信息
     */
    private getExcludeString(expression: string[], tagInfo: TagInfo) {
        if (this.isUserDefined(`<${tagInfo.type}>`)) { // 自定义开始标签
            // 生成组件scope
            tagInfo.scope = Scope.getScope();
            // 保存组件信息
            this.addChildComponentInfo(JSON.parse(JSON.stringify(tagInfo)));
            // 去除子组件列表阻止此次渲染
            tagInfo.children = [];
            expression.push(`<w-${tagInfo.type} scope="${tagInfo.scope}">`);
        } else if (tagInfo.type == 'text') { // 文本开始标签
            expression.push(tagInfo.attributes[0].value);
        } else {
            let attributes = '';
            tagInfo.attributes.forEach(attr => {
                attributes += ` ${attr.name}="${attr.value}"`;
            });
            if (Tag.isSingle(tagInfo.type)) { // 单标签开始
                expression.push(`<${tagInfo.type}${attributes}`);
            }
            else {
                expression.push(`<${tagInfo.type}${attributes}>`);
            }
        }
        // 存在子节点则继续循环递归
        if (tagInfo.children) {
            tagInfo.children.forEach(info => {
                this.getExcludeString(expression, info);
            });
        }
        if (this.isUserDefined(`<${tagInfo.type}>`)) { // 自定义结束标签
            expression.push(`</w-${tagInfo.type}>`);
        } else if (tagInfo.type != 'text') { // 非文本结束标签
            if (Tag.isSingle(tagInfo.type)) { // 单标签结束
                expression.push(`/>`);
            } else {
                expression.push(`</${tagInfo.type}>`);
            }
        }
    }

    /**
     * 处理children taginfo,生成模板字符串
     * @param tagInfo chilren taginfo
     */
    private getChildrens(tagInfos: TagInfo[]): string[] {
        let childrenString: string[] = [];
        tagInfos.forEach(tagInfo => {
            let expression: string[] = [];
            this.getChildrenString(expression, tagInfo);
            childrenString.push(expression.join(''));
        });
        return childrenString;
    }

    /**
     * 
     * @param expression 表达式数组
     * @param tagInfo children taginfo
     */
    private getChildrenString(expression: string[], tagInfo: TagInfo) {
        if (tagInfo.type == 'text') { // 文本开始标签
            expression.push(tagInfo.attributes[0].value);
        } else {
            let attributes = '';
            tagInfo.attributes.forEach(attr => {
                attributes += ` ${attr.name}="${attr.value}"`;
            });
            if (Tag.isSingle(tagInfo.type)) { // 单标签开始
                expression.push(`<${tagInfo.type}${attributes}`);
            }
            else {
                expression.push(`<${tagInfo.type}${attributes}>`);
            }
        }
        // 存在子节点则继续循环递归
        if (tagInfo.children) {
            tagInfo.children.forEach(info => {
                this.getExcludeString(expression, info);
            });
        }
        if (tagInfo.type != 'text') { // 非文本结束标签
            if (Tag.isSingle(tagInfo.type)) { // 单标签结束
                expression.push(`/>`);
            } else {
                expression.push(`</${tagInfo.type}>`);
            }
        }
    }

    /**
    * 父组件创建完成后广播事件创建子组件
    * @param event 渲染事件类型
    * @param scope 父组件scope
    */
    private currentElementCreated(event: string, scope: string) {
        if (event == 'element-created' && this._currentComponent.scope == scope) {
            this.getChildComponentInfo().forEach((tagInfo: TagInfo) => {
                let componentInfo = this.getComponentInfo(tagInfo.type);
                if (componentInfo.loadType == sync) {
                    // 创建组件实例
                    let component: Component = new (componentInfo.className as typeof Component)();
                    // 设置组件的parent
                    component.parent = this._currentComponent;
                    // 传递attributes
                    tagInfo.attributes.forEach(attr => {
                        component.constructor.prototype[attr.name] = JSON.parse(attr.value);
                    });
                    // 传递children
                    component.children = this.getChildrens(tagInfo.children);
                    // 渲染组件并获取DOM
                    let newElement = Compiler.component(component).getHtmlElement();
                    // 获取组件占位符
                    let oldElement = this._currentComponent.element.querySelector(`[scope="${tagInfo.scope}"]`);
                    // 替换占位符为真实组件
                    oldElement.parentElement.replaceChild(newElement, oldElement);
                } else {
                    console.log('异步组件：', componentInfo.className);
                }
            });
            // 监听原生事件
            this.addNativeEventListener();
        }
    }

    /**
     * 通过标签名称获取组件信息
     * @param type 标签名称
     */
    private getComponentInfo(type: string): IUDComponent {
        let componentInfo: IUDComponent = null;
        this._dependencies.forEach(dependencie => {
            if (typeof dependencie == 'string' && /(.+?)\[(.+)\]/.test(dependencie)) { // 异步组件
                let className = RegExp.$1;
                let classPath = RegExp.$2;
                let name = Utils.camelToLine(className);
                if (name == type) {
                    componentInfo = {
                        loadType: async,
                        className: className,
                        classPath: classPath
                    };
                }
            } else { // 同步组件
                let name = Utils.camelToLine(dependencie.className);
                if (name == type) {
                    componentInfo = {
                        loadType: sync,
                        className: dependencie
                    };
                }
            }
        });
        return componentInfo;
    }

    /**
    * 监听原生事件
    */
    private addNativeEventListener() {
        for (let scope in this._currentComponent.allNativeEvent) {
            let events = this._currentComponent.allNativeEvent[scope];
            let elements = this._currentComponent.element.querySelectorAll(`[event="${scope}"]`);
            let elementsArray = Array.prototype.slice.call(elements);
            elementsArray.forEach((element: HTMLElement, index: number) => {
                events[index].forEach((event: INativeEvent) => {
                    element.addEventListener(event.type, new EventListenerHandle({
                        context: this._currentComponent,
                        handle: event.handle,
                        arguments: event.arguments
                    }));
                });
            });
        }
    }
}