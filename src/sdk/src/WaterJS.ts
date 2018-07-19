import { Component } from './Component';

export class WaterJS {

    /**
     * 组件实例
     */
    private _component: Component;

    /**
     * 组件挂载节点
     */
    private _el: HTMLElement;

    /**
     * 
     * @param ComponentClass 组件类
     */
    public static render(ComponentClass: typeof Component): WaterJS {
        let waterJS: WaterJS = new WaterJS();
        waterJS._component = new ComponentClass();
        return waterJS;
    }

    /**
     * 
     * @param el 挂载组件
     */
    public mount(el: HTMLElement): WaterJS {
        this._el = el;
        let html = this._component.render();
        this._el.innerHTML = html;
        this._component.onCreate();
        return this;
    }

    /**
     * 卸载组件
     */
    public unmount() {
        this._component.onDestroy();
    }
}
