
import { Component } from '../Component';

export const async = 'async';
export const sync = 'sync';

export interface IAttribute {
    name: string,
    value: any
}

export interface IUDComponent {
    loadType: string,
    scope: string,
    className: typeof Component | string,
    classPath?: string
}