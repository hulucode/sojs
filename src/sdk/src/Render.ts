import { Component } from './Component';
import { Utils } from './utils/Utils';
import { Compiler } from './Compiler';

export class Render {

    // 渲染的组件
    private _component: Component;

    /**
     * 将组件渲染成DOM
     * @param component 组件实例
     */
    public static render(ComponentClass: typeof Component): Render {
        let render: Render = new Render();
        render._component = new ComponentClass();
        return render;
    }

    /**
     * 返回HTMLElement
     */
    public getHtmlElement(): HTMLElement {
        return Compiler.component(this._component).getHtmlElement();
    }

    /**
     * 挂载DOM
     */
    public mount() {
        this._component.onCreate();
    }

    /**
     * 卸载组件
     */
    public unmount() {
        this._component.onDestroy();
    }

}