export interface IComponent {
    /**
     * 组件创建
     */
    onCreate(): void;

    /**
     * 组件销毁
     */
    onDestroy(): void;

    /**
     * 组件缩放
     */
    onResize(): void;

    /**
     * 组件显示到屏幕
     */
    onScreen(): void;
}