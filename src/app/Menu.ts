import { Component, Template } from "water-js";
import { Select } from './Select';

@Template(`
<div>
    <for operator="{let item of this.data}">
        <span style="color:red">{this.children.join('')}</span>
        <select>{item}:menu里面的Select</select>
    </for>
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

    public set test(test:any){
        console.log('menu==>>',test);
        
    }

    public dependencies():any{
        return [Select];
    }
}
