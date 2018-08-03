

export interface TagAttrs {
    name: string,
    value: string
}

export interface TagInfo {
    type: string,
    attributes: TagAttrs[],
    children?: any[]
}