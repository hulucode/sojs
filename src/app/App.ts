import { Component, Template } from "water-js";
import Menu from './Menu';

@Template(`
<div>
    <h1>{this.title}</h1>
    <menu></menu>
    <w-for operator="{let key in this.data}">
        <w-if operator="{this.data[key].title == 123 || this.data[key].title == 789}">
            <h3>开始<br/><div>{this.data[key].title}</div>结束</h3><br/>
        </w-if>
        <w-else>
            <h2>{this.data[key].title}</h2>
        </w-else>
    </w-for>
</div>
`)
export default class App extends Component {

    constructor() {
        super();
    }

    public title: string = '我是一个App组件';

    public data: any[] = [
        {
            title: "123"
        },
        {
            title: "456"
        },
        {
            title: "789"
        },
        {
            title: "4445"
        },
        {
            title: "4444"
        }
    ]
}