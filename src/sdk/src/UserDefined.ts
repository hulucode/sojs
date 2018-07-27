import { Component } from './Component';

export default class UserDefined {

    // 组件实例
    private _component: Component;

    // 单例
    public static instance: UserDefined;

    /**
     * 设置组件实例
     * @param component 组件
     */
    public static component(component: Component): UserDefined {
        if (!UserDefined.instance) {
            UserDefined.instance = new UserDefined();
        }
        UserDefined.instance._component = component;
        return UserDefined.instance;
    }

    /**
     * 判断是否为自定义的组件
     */
    public isUserDefined(tag: string): boolean {
        return /component="([a-zA-Z0-9]+?)"/.test(tag);
    }


}