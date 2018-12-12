import { Component, Template } from "so-js";
import { Select } from './Select';

@Template(`
<div>
    <for operator="{let item of this.data}">
        <span style="color:red">{this.children.join('')}</span>
    </for>
    <h2>menu</h2>
</div>
`)
export class Menu extends Component {
    private _data: number[];
    public set data(data: number[]) {
        this._data = data;
    }
    public get data(): number[] {
        return this._data ? this._data : [];
    }

    public dependencies():any{
        return [Select];
    }
}
