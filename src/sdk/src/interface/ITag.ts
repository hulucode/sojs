

export interface TagAttrs {
    name: string,
    value: string
}

export interface TagInfo {
    type: string,
    scope?: string,
    attributes: TagAttrs[],
    children?: any[]
}