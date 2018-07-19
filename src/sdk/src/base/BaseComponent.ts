import Render from '../Render';

export default class BaseComponent {

    /**
     * 获取当前类名
     */
    public static getName(): string {
        return this.toString().match(/function\s*([^(]*)\(/)[1];
    }

    /**
     * 组件模板
     * 必须的
     */
    public template: string;

    /**
     * 组件样式
     * 不是必须的
     */
    public style: string;

    /**
     * 依赖的组件
     * 如果要异步加载，则无需添加
     */
    public components(): {} {
        return null;
    }

    /**
     * 渲染template->dom
     */
    public render(): string {
        let func = Render.template(this.template);
        return func.call(this);
    }

    /**
     * 获取当前类名
     */
    public getName(): string {
        return this.constructor.toString().match(/function\s*([^(]*)\(/)[1];
    }

}