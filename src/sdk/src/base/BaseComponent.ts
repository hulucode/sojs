import { Scope } from '../utils/Scope';
import { IRefComponent } from '../interface/IRefComponent';
import { EventEmitter } from '../events/emitter.event';
import { IAttribute } from '../interface/IUDComponent';
import { EventListenerHandle } from '../EventListenerHandle';
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
            this._scope = Scope.getScope();
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
        }, 1200);
    }

    // 模板编译后生成的函数
    private _render: Function;
    public get render(): Function {
        return this._render;
    }
    public set render(render: Function) {
        this._render = render;
    }

    // 引用的列表
    private _refs: IRefComponent[];
    public get refs(): IRefComponent[] {
        if (!this._refs) {
            this._refs = [];
        }
        return this._refs;
    }
    public set refs(refs: IRefComponent[]) {
        this._refs = refs;
    }

    /**
     * 添加引用
     * @param ref 引用
     */
    public addRefComponent(ref: IRefComponent) {
        if (!this._refs) {
            this._refs = [];
        }
        this._refs.push(ref);
    }

    /**
     * 通过scope获取组件引用
     * @param scope 唯一标识
     */
    public getRefComponent(ref: string): BaseComponent {
        let component = null;
        if (this._refs) {
            this._refs.forEach((reference: IRefComponent) => {
                if (reference.ref == ref) {
                    component = reference.component;
                }
            });
        }
        return component;
    }

    // 保存子组件里所有的属性值
    private childAttribute: any = {};
    public addAttrsByScope(scope: string, attributes: IAttribute[]) {
        this.childAttribute[scope] = attributes;
    }
    public getAttrsByScope(scope: string): IAttribute[] {
        return this.childAttribute[scope];
    }

    // 保存原生事件
    private nativeEvent: any = {};
    public addEventByScope(scope: string, event: INativeEvent) {
        if (!this.nativeEvent[scope]) {
            this.nativeEvent[scope] = [];
        }
        this.nativeEvent[scope].push({
            type: event.type,
            handle: event.handle,
            arguments: event.arguments
        });
    }
    public getEventByScope(scope: string): INativeEvent {
        return this.nativeEvent[scope];
    }

    /**
     * 监听原生事件
     */
    public addEventListener() {
        for (let scope in this.nativeEvent) {
            let events = this.nativeEvent[scope];
            let elements = this._element.querySelectorAll(`[scope="${scope}"]`);
            let elementsArray = Array.prototype.slice.call(elements);
            elementsArray.forEach((element: HTMLElement) => {
                events.forEach((event: INativeEvent) => {
                    element.addEventListener(event.type, new EventListenerHandle({
                        context: this,
                        handle: event.handle,
                        arguments: event.arguments
                    }));
                });
            });
        }
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