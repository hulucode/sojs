import { Component } from './Component';
import { Utils } from './utils/Utils';
import { IUDComponent, sync, async } from './interface/IUDComponent';
import { Scope } from './utils/Scope';
import { EventEmitter } from './events/emitter.event';
import { TagInfo } from './interface/ITag';
import { Compiler } from './Compiler';

export class UserDefined {

    // 父组件实例
    private _parentComponent: Component;

    // 子组件类
    private _componentInfos: IUDComponent[];

    constructor() {
        // 监听父级组件创建完成事件
        EventEmitter.register('element-created', this.parentElementCreated, this);
    }

    /**
     * 设置组件实例
     * @param parentComponent 父组件
     */
    public static parentComponent(parentComponent: Component): UserDefined {
        let userDefined = new UserDefined();
        userDefined._parentComponent = parentComponent;
        userDefined._componentInfos = [];
        return userDefined;
    }

    /**
    * 判断是否为自定义组件
    * @param tagInfo 标签信息
    */
    public isUserDefined(type: string): boolean {
        let componentInfo = null;
        let dependencies = this._parentComponent.dependencies(); // 组件依赖数组
        dependencies.forEach(dependencie => { // 遍历查找是否是自定义组件
            if (typeof dependencie == 'string' && /(.+?)\[(.+)\]/.test(dependencie)) { // 异步组件
                let className = RegExp.$1;
                let classPath = RegExp.$2;
                let name = Utils.camelToLine(className);
                if (name == type) {
                    componentInfo = {
                        loadType: async,
                        className: className,
                        classPath: classPath,
                        scope: Scope.getScope()
                    };
                    this._componentInfos.push(componentInfo);
                }
            } else { // 同步组件
                let name = Utils.camelToLine(dependencie.className);
                if (name == type) {
                    componentInfo = {
                        loadType: sync,
                        className: dependencie,
                        scope: Scope.getScope()
                    };
                    this._componentInfos.push(componentInfo);
                }
            }
        });
        return componentInfo ? true : false;
    }

    public getExpression(tagInfo?: TagInfo): string {
        if (tagInfo) {
            let componentInfo = this._componentInfos[this._componentInfos.length - 1];
            let scope = componentInfo.scope;
            let expression: string = '';
            tagInfo.attributes.forEach(attr => {
                if (expression == '') {
                    expression = `var attributes = [];`;
                }
                let name = attr.name;
                let value = attr.value.replace(/&gt;/g, '>').replace(/&lt;/g, '<')
                if (/{(.+?)}/.test(value)) {
                    expression += `attributes.push({
                        'name':'${name}',
                        'value':${RegExp.$1}
                    });`
                } else {
                    expression += `attributes.push({
                        'name':'${name}',
                        'value':'${RegExp.$1}'
                    });`
                }
            });
            expression += `this.addAttrsByScope('${scope}',attributes);`;
            return this.getStartTagString(scope) + expression;
        }
        return this.getEndTagString();
    }

    /**
     * 开始标签
     */
    public getStartTagString(scope: string): string {
        return `expression.push('<div scope="${scope}">');`;
    }

    /**
    * 结束标签
    */
    public getEndTagString(): string {
        return `expression.push('</div>');`;
    }

    /**
     * 通过标签ref属性获取引用名称
     * @param currentTag 当前标签
     */
    private getRefName(currentTag: TagInfo): string {
        let refName = null;
        if (currentTag.attributes) {
            currentTag.attributes.forEach(attr => {
                if (attr.name == 'ref') {
                    refName = attr.value;
                }
            });
        }
        return refName;
    }

    /**
    * 父组件创建完成后广播事件创建子组件
    * @param event 事件类型
    * @param scope 父组件scope
    */
    private parentElementCreated(event: string, scope: string) {
        if (event == 'element-created' && this._parentComponent.scope == scope) {
            // 监听DOM中的原生事件
            this._parentComponent.addEventListener();
            // 反转数组进行遍历
            this._componentInfos.reverse();
            this._componentInfos.forEach(componentInfo => {
                if (componentInfo.loadType == sync) {
                    let attrs = this._parentComponent.getAttrsByScope(componentInfo.scope);
                    let component: Component = new (componentInfo.className as typeof Component)();
                    component.scope = componentInfo.scope;
                    let parent = this._parentComponent;
                    let newElement = Compiler.component(component).getHtmlElement();
                    let oldElement = parent.element.querySelector(`[scope="${component.scope}"]`);
                    oldElement.parentElement.replaceChild(newElement, oldElement);
                } else {
                    console.log('异步组件:', componentInfo);
                }
            });
        }
    }
}