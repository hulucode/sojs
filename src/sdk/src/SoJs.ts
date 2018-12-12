import { Component } from './Component';
import { Render } from './Render';

export class SoJs {

    // 组件类
    private _ComponentClass: typeof Component;

    // 沉浸函数
    private _render: Render;

    /**
     * 渲染组件
     * @param ComponentClass 组件类
     */
    public static render(ComponentClass: typeof Component): SoJs {
        let soJs: SoJs = new SoJs();
        soJs._ComponentClass = ComponentClass;
        return soJs;
    }

    /**
     * 挂载组件
     * @param el 根节点
     */
    public mount(el: HTMLElement): SoJs {
        this._render = Render.render(this._ComponentClass);
        el.appendChild(this._render.getHtmlElement());
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
