import { Scope } from '../utils/Scope';

export default class BaseComponent {

    // 组件模板，必须的
    public template: string;

    // 组件样式，不是必须的
    public style: string;

    // 模板编译后的渲染函数
    private _render: Function;
    public get render(): Function {
        return this._render;
    }
    public set render(render: Function) {
        this._render = render;
    }

    // 组件唯一标识及样式作用域
    private _scope: string;
    public get scope(): string {
        return this._scope;
    }
    public set scope(scope: string) {
        this._scope = Scope.scope;
    }

    /**
     * 依赖的组件列表
     */
    public dependencies(): typeof BaseComponent[] {
        return null;
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