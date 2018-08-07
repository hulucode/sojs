import { Component, Template } from "water-js";
import { Menu } from './Menu';

@Template(`
<div>
    <h2 style="color:green;padding:0 40px">{this.children.join('')}</h2>
</div>
`)
export class Select extends Component {
    private _data:number;
    public set data(data:number){
        this._data = data;
    }
    public get data():number{
        return this._data;
    }

    public dependencies():any{
        return [Menu];
    }
}
