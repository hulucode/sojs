import { Tag } from './tags/Tag';

export interface DomAttrs {
    name: string,
    value: string
}

export interface DomTree {
    type: string,
    attributes?: DomAttrs[],
    children?: any[]
}

export class VDom {

    /**
    * 返回树状dom结构
    * @param nodes 节点数组
    */
    public static getDomTree(nodes: string[]): any {
        let domTree: DomTree = null;
        let domTrees: DomTree[] = null;
        let parentNode: DomTree = null;
        nodes.forEach(node => {
            parentNode = domTrees ? domTrees[domTrees.length - 1] : null;
            if (Tag.isStartTag(node)) {
                if (!domTree) {
                    domTree = {
                        type: node,
                        attributes: [],
                        children: []
                    };
                    domTrees = [];
                    domTrees.push(domTree);
                } else {
                    let dt: DomTree = {
                        type: node,
                        attributes: [],
                        children: []
                    };
                    parentNode.children.push(dt);
                    domTrees.push(dt);
                }
            } else if (Tag.isEndTag(node)) {
                domTrees.pop();
            } else {
                parentNode.children.push({
                    type: node,
                    attributes: [],
                    children: []
                });
            }
        })
        return domTree;
    }

}