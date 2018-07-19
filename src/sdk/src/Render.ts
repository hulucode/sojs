import WFor from './tags/WFor';
import Compile from './Compile';

export default class Render {

    /**
     * 模板
     */
    private _template: string;

    /**
     * 样式
     */
    private _style: string;

    /**
     * 作用域
     */
    private _scope: string;

    /**
     * 
     * @param template 模板
     */
    public static template(template: string): Function {
        return Compile.template(template);
    }

    /**
     * 
     * @param style 样式
     */
    public stype(style: string): Render {
        this._style = style;
        return this;
    }

    /**
     * 
     * @param scope 作用域
     */
    public scope(scope: string): Render {
        this._scope = scope;
        return this;
    }

    /**
     * 渲染
     */
    public render(): string {
        return null;
    }

}