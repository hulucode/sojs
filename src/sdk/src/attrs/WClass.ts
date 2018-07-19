import Attr from './Attr';

export default class WClass extends Attr {
    /**
     * 
     * @param tag 判断是否是class语句
     */
    public static isClass(tag: string): boolean {
        if (/\sclass=".*"/.test(tag)) {
            return true;
        }
        return false;
    }

    /**
     * 
     * @param tag 根据标签返回class表达式
     */
    public static getExpression(tag: string): string {
        let expression = '';
        if (/^<w-class/.test(tag)) {  // start tag
            let data = '[]';
            let object = 'item';
            let index = 'index';
            if (/data="{(.+?)}"/.test(tag)) { // 数据源data
                data = RegExp.$1;
            }
            if (/let="(.+?)"/.test(tag)) { // 声明变量 let
                object = RegExp.$1;
            }
            if (/index="(.+?)"/.test(tag)) { // 定义索引 index
                index = RegExp.$1;
            }
            expression = `class(let key in ${data}){let ${index} = key;let ${object} = ${data}[key];`;
        } else if (/^<\/w-class>$/.test(tag)) { //end tag
            expression = '}';
        }

        return expression;
    }
}