
import { Component } from '../Component';
import { TagInfo } from './ITag';

export const async = 'async';
export const sync = 'sync';

export interface IAttribute {
    name: string,
    value: any
}

export interface IUDComponent {
    className: typeof Component | string,
    loadType?: string,
    classPath?: string
}