import { Component, Template } from "../sdk";

@Template(`
<div>
    <h2 style="color:red">{this.title}</h2>
</div>
`)
export class Menu extends Component {
    public title = '这是一个Menu菜单';
    public data = '';
}
