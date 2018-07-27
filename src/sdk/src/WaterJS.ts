import { Component } from './Component';
import Render from './Render';

export class WaterJS {

    // 组件类
    private _ComponentClass: typeof Component;

    private _render: Render;

    /**
     * 渲染组件
     * @param ComponentClass 组件类
     */
    public static render(ComponentClass: typeof Component): WaterJS {
        let waterJS: WaterJS = new WaterJS();
        waterJS._ComponentClass = ComponentClass;
        return waterJS;
    }

    /**
     * 挂载组件
     * @param el 根节点
     */
    public mount(el: HTMLElement): WaterJS {
        this._render = Render.render(this._ComponentClass);
        el.appendChild(this._render.getFragment());
        this._render.mount();
        return this;
    }

    /**
     * 卸载组件
     */
    public unmount() {
        this._render.unmount();
    }
}
