import { Component, Template, Event } from "water-js";

import { Menu } from './Menu';
import { Select } from './Select';

@Template(`
<div style="width:100%;">
    <div style="cursor:pointer;color:blue;margin:20px;text-align:center;padding:10px;{!this.title?'background-color:gray':''}" 
    onclick="{this.clickHandle('click-event')}">click-event</div>
    <for operator="{let item of this.data}">
        <br>
        <div>{item}</div>
        <menu data="{[item]}">
            <h2>{item}:app里面的Menu</h2>
            <select>123456</select>
        </menu>
    </for>
</div>
`)
export class App extends Component {

    public data: number[] = [];

    constructor() {
        super();
        let index = 1;
        while (this.data.length < 3) {
            this.data.push(index++);
        }
    }

    public clickHandle(e: Event) {
        console.log(e.data);
    }

    public enterHandle(e: Event) {
        console.log(e.data);
    }

    public dependencies(): any[] {
        return [Menu, Select];
    }
}