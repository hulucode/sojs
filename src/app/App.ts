import { Component, Template } from "../sdk";
import { Menu } from './Menu';

@Template(`
<div class="abc {this.title?'def':''} ghi {this.title?'jkl':''} mno" 
    style="width:100%;">
    {this.getDiv()}
    <menu data="{this.title}"></menu>
    <h1 class="color">哈哈，{this.title}</h1><br/>
    <select data="{this.data}">
        --select--
        <div style="padding:0 50px"><menu>菜单里的Children</menu></div>
        --select--
    </select>
    <h3 style="color:gray;font-size:24px;{this.title?'background-color:yellow':'border:5px solid gay'}">这只是一个开始</h3>
    <for operator="{let item of this.data}">
        <if operator="{item.title == 123}">
            <h3 style="color:red">{item.title}</h3>
            <menu data="{item.title}"><span>菜单里的Children</span></menu>
        </if>
        <else>
            <h3 style="color:blue">{item.title}</h3>
            <button onclick="{this.clickHandle(item.title,item.title)}" onmouseenter="{this.enterHandle(item.title)}">{this.getText()}</button>
        </else>
    </for>
</div>
`)
export class App extends Component {

    public title: string = '这是一个App组件';

    public imgPath: string = 'http://c.hiphotos.baidu.com/image/pic/item/d439b6003af33a87433692cfca5c10385243b588.jpg';

    public getDiv(): string {
        return `<div>这是一个方法返回的节点</div>`;
    }

    public data: any[] = [
        {
            title: "123"
        },
        {
            title: "456"
        },
        {
            title: "789"
        }
    ]

    public getText(): string {
        return 'getText';
    }

    public clickHandle(e: Event) {
        alert('clickHandle : ' + e.type);
    }

    public enterHandle(e: Event) {
        console.log('enterHandle : ' + e.type);
    }

    public dependencies(): any[] {
        return [Menu, 'Select[http://www.baid.com]'];
    }
}