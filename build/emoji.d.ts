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
        rendering(text: string, div: HTMLElement): void;
        /**
         * 首先进行正则匹配，找出所有可能的emoji占位符
         * 假设emoji的名字只能够由字符和数字组成
         * 例如： ``::smile::``
        */
        renderText(text: string): string;
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
/**
 * 样式依赖于 semantic.min.css
 *
 * > https://github.com/Semantic-Org/Semantic-UI
*/
declare class EmojiBox {
    emojiGrid: HTMLDivElement;
    /**
     * @param ncols 每一行之中的emoji的数量
    */
    constructor(emojiEntry: object);
    show(): void;
    hide(): void;
}
declare class InputBox {
    emojiBox: EmojiBox;
    commentTextarea: HTMLTextAreaElement;
    commentContent: string;
    readonly commentMaxLength: number;
    readonly showErrMessage: (msg: string) => void;
    readonly commentContentIsEmpty: boolean;
    readonly commentCountText: string;
    /**
     * @param div 将要被插入输入框的div元素
    */
    constructor(emoji: object, div?: string, maxLen?: number, showErrMessage?: (msg: string) => void);
    focus(): void;
    insertContent(e: string): void;
    private reachMaxSize(append);
    insertEmoji(emoji: string): void;
}
declare class selectRange {
    private element;
    constructor(inputs: HTMLTextAreaElement);
    static of(e: HTMLTextAreaElement): selectRange;
    getCurPos(): number;
    setCurPos(position: number): void;
    getSelectText(): string;
    setSelectText(e: number, t: number): void;
    insertAfterText(e: string): void;
}
