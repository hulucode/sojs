import { Component } from './Component';
import { Utils } from './utils/Utils';
import { IUDComponent, sync, async } from './interface/IUDComponent';
import { EventEmitter } from './events/emitter.event';
import { Compiler } from './Compiler';
import { INativeEvent } from './interface/INativeEvent';
import { EventListenerHandle } from './EventListenerHandle';
import { TagInfo } from './interface/ITag';

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
    public addChildComponentInfo(tagInfo: TagInfo) {
        this._childComponentInfo.push(tagInfo);
    }
    public getChildComponentInfo(): TagInfo[] {
        return this._childComponentInfo;
    }

    /**
    * 判断是否为自定义组件
    * @param node 节点
    */
    public isUserDefined(type: string): boolean {
        let isUserDefined = false;
        this._dependencies.forEach(dependencie => { // 遍历查找是否是自定义组件
            if (typeof dependencie == 'string' && /(.+?)\[.+\]/.test(dependencie)) { // 异步组件
                let className = RegExp.$1;
                let name = Utils.camelToLine(className);
                if (name == type) {
                    isUserDefined = true;
                }
            } else { // 同步组件
                let name = Utils.camelToLine(dependencie.className);
                if (name == type) {
                    isUserDefined = true;
                }
            }
        });
        return isUserDefined;
    }

    /**
    * 父组件创建完成后广播事件创建子组件
    * @param event 渲染事件类型
    * @param scope 父组件scope
    */
    private currentElementCreated(event: string, scope: string) {
        if (event == 'element-created' && this._currentComponent.scope == scope) {
            this._currentComponent.getChildComponents().forEach((tagInfo: TagInfo) => {
                this.renderChildComponent(tagInfo);
            });
            // 监听原生事件
            this.addNativeEventListener();
        }
    }

    /**
     * 通过标签信息渲染子组件
     * @param tagInfo 标签信息
     */
    private renderChildComponent(tagInfo: TagInfo) {
        let componentInfo = this.getComponentInfo(tagInfo.type);
        if (componentInfo.loadType == sync) {
            // 获取占位节点
            let elements = this._currentComponent.element.querySelectorAll(`[scope="${tagInfo.scope}"]`);
            // NodeList转为常规数组
            let oldElements: HTMLElement[] = Array.prototype.slice.call(elements);
            for (let index = 0; index < oldElements.length; index++) {
                // 创建组件实例
                let component: Component = new (componentInfo.className as typeof Component)();
                // 设置组件的parent
                component.parent = this._currentComponent;
                // 传递attributes
                // tagInfo.attributes.forEach(attr => {
                //     component.constructor.prototype[attr.name] = JSON.parse(attr.value);
                // });
                // 传递children
                component.children = tagInfo.children;
                // 渲染组件并获取DOM
                let newElement = Compiler.component(component).getHtmlElement();
                // 占位节点
                let oldElement = oldElements[index];
                // 替换占位为真实节点
                oldElement.parentElement.replaceChild(newElement, oldElement);
            }
        } else {
            console.log('异步组件：', componentInfo.className);
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