/// <reference path="../../../vendor/Linq.js/linq.d.ts" />

module emoji {

    // 假设一个emoji的代码是 ::smile::
    // 那么会进行正则匹配，转换为img标签，如 <img class="emoji" src="/path/to/smile.svg" />

    /**
     * svg在本地缓存之中的名字的前缀
    */
    const localPrefix: string = "emoji_";

    /**
     * 获取当前脚本的URL
    */
    export function scriptURL(): string {
        var scripts = document.getElementsByTagName("script");
        var me: string = null;
        var len: number = scripts.length;

        for (var i: number = 0; i < len; i++) {
            var script: HTMLScriptElement = scripts[i];
            var src: string = basename(script.src);

            if (src == "emoji") {
                me = script.src;
                break;
            }
        }

        if (!me) {
            throw "Unable to detects the script url: script file has been renamed!";
        } else {
            return me;
        }
    }

    function basename(file: string): string {
        var path: string[] = file.split(/\/+/);
        var name: string[] = path[path.length - 1].split(/\./);

        return name[0];
    }

    /**
     * 当前的URL的网络位置
    */
    var myURL: string = emoji.scriptURL();

    /**
     * 将文档之中的符合规则的占位符都替换为emoji
    */
    export class Render {

        public readonly resource: emoji.Resource;

        public constructor() {
            this.resource = new emoji.Resource();
        }

        /**
         * 将所给定的文本之中的emoji渲染出来
        */
        public rendering(text: string, div: HTMLElement): void {
            var html: string = this.renderText(text);
            div.innerHTML = html;
            var emojiSVG = div.getElementsByTagName("svg");
            var len = emojiSVG.length;

            // console.log(emojiSVG);

            for (var i: number = 0; i < len; i++) {
                var svg: SVGSVGElement = emojiSVG[i];
                svg.setAttribute("height", "1.125em");
            }
        }

        /**
         * 首先进行正则匹配，找出所有可能的emoji占位符
         * 假设emoji的名字只能够由字符和数字组成
         * 例如： ``::smile::``
        */
        public renderText(text: string): string {
            if (!text) {
                return "";
            } else {
                return this.renderTextImpl(text);
            }
        }

        private renderTextImpl(text: string) {
            // 20180821 js的正则表达式之中必须要加上g全局选项，才会匹配出所有结果
            // 否则只会匹配出一个结果
            var pattern = /[:]{2}[a-zA-Z0-9]+[:]{2}/g;
            var keys: string[] = text.match(pattern);

            if (!keys) {
                return text;
            } else {
                keys = Strings.Unique(keys);
            }

            for (var i: number = 0; i < keys.length; i++) {
                // ::smile::
                var key: string = keys[i];
                var name: string = key + "";

                name = name.substr(2);
                name = name.substr(0, name.length - 2);

                // 得到了svg
                var svg: string = this.resource.getSVG(name);

                if (svg.length > 0) {
                    // 只渲染存在的资源
                    var insert: string = `
                        <span>
                            ${svg}
                            <span style="display:none;">${key}</span>
                        </span>`.replace("/\n/", "");
                    var exp = new RegExp(`[:]{2}${name}[:]{2}`);

                    text = text.replace(exp, insert);
                }
            }

            return text;
        }
    }

    /**
     * 
    */
    export class Resource {

        /**
         * [name => svg] 
         * 
         * emoji使用svg进行缓存，为了减少对服务器的请求次数
         * 使用localstorage进行保存
        */
        public readonly cache: object = {};

        /**
         * 在初始化的时候首先尝试从localstorage之中加载svg到cache内存缓存之中
        */
        public constructor() {
            for (var i: number = 0; i < localStorage.length; i++) {
                var index: string = localStorage.key(i);

                // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith
                // 这个函数在string里面实际上是不存在的？？？
                if ((<any>index).startsWith(localPrefix)) {
                    this.cache[index] = localStorage.getItem(index);
                }
            }
        }

        /**
         * 会首先从缓存之中进行查找资源，如果不成功，就会请求服务器，然后将请求结果写入本地缓存
        */
        public getSVG(name: string): string {
            var index: string = `${localPrefix}${name}`;

            if (index in this.cache) {
                return <string>this.cache[index];
            } else {
                // 不存在则请求服务器资源
                // 进行同步请求
                var svg: string = HttpHelpers.GET(emoji.Resource.svgURL(name));
                this.writeCache(name, svg);
                return svg;
            }
        }

        private static svgURL(name: string): string {
            var tokens: string[] = myURL.split(/\/+/);
            // 最后一个元素是当前的脚本的文件名
            // 将其替换为svg文件夹
            // 然后再添加文件名，就可以组装出网络路径了
            tokens[tokens.length - 1] = "svg";
            // 20180821 得到的javascript路径是全路径
            // 在这里将第一个元素设置为/就意味着url的起始为//
            // 即从根节点开始计算的绝对路径
            tokens[0] = "/";
            tokens.push(`${name}.svg`);

            var url: string = tokens.join("/");
            return url;
        }

        /**
         * 将从服务器得到的数据写入到localstorage和cache变量之中
        */
        public writeCache(key: string, svg: string) {
            var index: string = `${localPrefix}${key}`;

            // 在这里使用两种缓存，cache变量是内存缓存
            // localstorage是本地硬盘上面的缓存
            this.cache[index] = svg;
            localStorage.setItem(index, svg);
        }
    }
}