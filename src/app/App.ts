import { Component, Template, Event } from "water-js";

import { Menu } from './Menu';
import { Select } from './Select';

@Template(`
<div style="width:100%;">
    <div style="cursor:pointer;color:blue;padding:20px;{!this.title?'background-color:gray':''}" 
    onclick="{this.clickHandle('click-event')}">click-event</div>
    <for operator="{let item of this.data}">
        <menu data="{[1,2,3]}">
            <h2>{item}:app里面的Menu</h2>
        </menu>
    </for>
</div>
`)
export class App extends Component {

    public data: number[] = [];

    constructor(){
        super()
        while(this.data.length < 10){
            this.data.push(1);
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