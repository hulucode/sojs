import { Scope } from '../utils/Scope';
import { EventEmitter } from '../events/emitter.event';
import { INativeEvent } from '../interface/INativeEvent';

export class BaseComponent {

    // 组件模板，必须的
    public template: string;

    // 组件样式，不是必须的
    public style: string;

    // 组件唯一标识及样式作用域
    private _scope: string;
    public get scope(): string {
        if (!this._scope) {
            this._scope = this.randomScope();
        }
        return this._scope;
    }
    public set scope(scope: string) {
        this._scope = scope;
    }

    // 组件dom
    private _element: HTMLElement;
    public get element(): HTMLElement {
        return this._element;
    }
    public set element(element: HTMLElement) {
        this._element = element;
        // 延时测试
        setTimeout(() => {
            EventEmitter.trigger('element-created', this.scope);
        }, 1000);
    }

    // 父级组件
    private _parent: BaseComponent;
    public set parent(parent: BaseComponent) {
        this._parent = parent;
    }
    public get parent(): BaseComponent {
        return this._parent;
    }

    // 模板子元素
    private _children: string[];
    public set children(children: string[]) {
        this._children = children;
    }
    public get children(): string[] {
        return this._children ? this._children : [];
    }

    // 模板编译后生成的函数
    private _render: Function;
    public get render(): Function {
        return this._render;
    }
    public set render(render: Function) {
        this._render = render;
    }

    // 原生事件
    private nativeEvent: any = {};
    public addEventByScope(scope: string, events: INativeEvent[]) {
        if (!this.nativeEvent[scope]) {
            this.nativeEvent[scope] = [];
        }
        this.nativeEvent[scope].push(events);
    }
    public getEventByScope(scope: string): INativeEvent {
        return this.nativeEvent[scope];
    }
    public get allNativeEvent(): any {
        return this.nativeEvent;
    }

    /**
     * 随机生成scope
     */
    public randomScope(): string {
        return Scope.getScope();
    }

    /**
     * 依赖的组件列表
     */
    public dependencies(): any[] {
        return [];
    }

    /**
    * 获取当前类名
    */
    public get className(): string {
        return this.constructor.toString().match(/function\s*([^(]*)\(/)[1];
    }

    /**
     * 静态获取当前类名
     */
    public static get className(): string {
        return this.toString().match(/function\s*([^(]*)\(/)[1];
    }

}