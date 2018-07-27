export default class Tag {

    // 分割符
    public static SPLITFLAG = '%@@%';

    /**
     * 自动闭合标签列表
     */
    public static noCloses(): string[] {
        return ['br', 'input', 'hr', 'img'];
    }

}