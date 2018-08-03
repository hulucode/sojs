import { BaseComponent } from './base/BaseComponent';
import { IComponent } from './interface/IComponent';

/**
 * 
 * @param template 模板装饰器
 */
export function Template(template: string): Function {
    return function (target: Function) {
        target.prototype.template = template;
    }
}

/**
 * 
 * @param style 样式装饰器
 */
export function Style(style: string): Function {
    return function (target: Function) {
        target.prototype.style = style;
    }
}

export class Component extends BaseComponent implements IComponent {

    public onCreate() {
        
    }

    public onDestroy() {

    }

    public onResize() {

    }

    public onScreen() {

    }

}

