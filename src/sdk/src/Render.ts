import Compiler from './Compiler';
import { Component } from './Component';
import { Utils } from './utils/Utils';
import Tag from './tags/Tag';

export default class Render {

    // 渲染的组件
    private _component: Component;

    /**
     * 将组件渲染成DOM
     * @param component 组件实例
     */
    public static render(ComponentClass: typeof Component): Render {
        let render: Render = new Render();
        render._component = new ComponentClass();
        render._component.render = Compiler.toRender(render._component.template);
        return render;
    }

    /**
     * 返回DocumentFragment
     */
    public getFragment(): DocumentFragment {
        let htmlStr = this._component.render(); 
        // console.log(htmlStr);
        
        // console.log(this.getDomTree(htmlStr));

        let h = Utils.parseDom(htmlStr);
        // console.log(h);
        
        let fragment = document.createDocumentFragment();
        fragment.appendChild(h);
        return fragment;
    }

    public getDomTree(htmlStr: string): any {
        let hs = htmlStr;
        hs = hs.replace(/>.*?</g, word => {
            if (/(^>)(<$)/.test(word)) {
                return `${RegExp.$1}${Tag.SPLITFLAG}${RegExp.$2}`;
            } else if (/(^>)(.+)(<$)/.test(word)) {
                return `${RegExp.$1}${Tag.SPLITFLAG}${RegExp.$2}${Tag.SPLITFLAG}${RegExp.$3}`;
            }
            return word;
        });
        let htmlStrs = hs.split(Tag.SPLITFLAG);
        console.log(htmlStrs);
        
    }

    /**
     * 挂载DOM
     * @param el 根节点
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