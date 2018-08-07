import { Tag } from './Tag';
import { TagInfo } from '../interface/ITag';

export class Single {

    /**
     * 通过节点名称判定是否是单标签
     * @param node 节点名称
     */
    public static isSingle(node: string): boolean {
        let bl = false;
        Tag.SINGLETAGS.forEach(t => {
            if (t == node) {
                bl = true;
            }
        });
        return bl;
    }


    /**
    * 根据节点返回相应表达式
    * @param node 节点
    */
    public static getAttrEvent(tagInfo: TagInfo): { attr: string, event: string } {
        return Tag.getAttrAndEvent(tagInfo.attributes);
    }
}