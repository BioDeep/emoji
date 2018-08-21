declare module emoji {
    /**
     * 获取当前脚本的URL
    */
    function scriptURL(): string;
    function GET(url: string): string;
    /**
     * 将文档之中的符合规则的占位符都替换为emoji
    */
    class Render {
        readonly resource: emoji.Resource;
        constructor();
        /**
         * 将所给定的文本之中的emoji渲染出来
        */
        rendering(text: string): string;
        private static uniq(a);
    }
    /**
     *
    */
    class Resource {
        /**
         * [name => svg]
         *
         * emoji使用svg进行缓存，为了减少对服务器的请求次数
         * 使用localstorage进行保存
        */
        readonly cache: object;
        /**
         * 在初始化的时候首先尝试从localstorage之中加载svg到cache内存缓存之中
        */
        constructor();
        /**
         * 会首先从缓存之中进行查找资源，如果不成功，就会请求服务器，然后将请求结果写入本地缓存
        */
        getSVG(name: string): string;
        private static svgURL(name);
        /**
         * 将从服务器得到的数据写入到localstorage和cache变量之中
        */
        writeCache(key: string, svg: string): void;
    }
}
