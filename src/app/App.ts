import { Component, Template } from "water-js";
import Button from './Button';

@Template(`
<div>
    <h1>{this.title}</h1>
    <h3 style="color:gray;font-size:24px">这只是一个开始</h3>
    <w-for operator="{let item of this.data}">
        <w-if operator="{item.title > 456}">
            <h3 style="color:red">{item.title}</h3>
            <button class="btn" onclick="{this.buttonHandle(item.title)}">{this.button}</button>
        </w-if>
        <w-else>
            <h3 style="color:blue">{item.title}</h3>
            <button onclick="{this.buttonHandle('my-item')}">{this.button}</button>
        </w-else>
    </w-for>
</div>
`)
export default class App extends Component {

    public title: string = '这是一个App组件';

    public button: string = '这是一个按钮';

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
            title: "999"
        },
        {
            title: "1234"
        },
        {
            title: "2345"
        }
    ]

    public buttonHandle(e: Event) {
        alert('buttonHandle');
    }

    public dependencies(): typeof Component[] {
        return [Button];
    }
}