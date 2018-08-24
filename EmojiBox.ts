
/**
 * 样式依赖于 semantic.min.css
 * 
 * > https://github.com/Semantic-Org/Semantic-UI
*/
class EmojiBox {

    public emojiGrid: HTMLDivElement;

    /**
     * @param ncols 每一行之中的emoji的数量
    */
    public constructor(emojiEntry: object) {
        var container: HTMLDivElement = document.createElement("div");
        var wrapper: HTMLDivElement = document.createElement("div");
        var menu: HTMLDivElement = document.createElement("div");
        var list: HTMLDivElement = document.createElement("div");
        var grid: HTMLDivElement = document.createElement("div");
        var emojiSVG: emoji.Resource = new emoji.Resource();

        container.classList.add("ui", "popup", "toolbox-popup", "toolbox-emoji", "top", "left", "transition");
        container.setAttribute("style", "top: auto; left: 0px; bottom: 25.9688px; right: auto; display: block !important;");
        wrapper.classList.add("emoji-wrapper");
        menu.classList.add("ui", "secondary", "pointing", "menu");
        menu.innerHTML = `<a class="item active">People</a>`;
        list.classList.add("emoji-list");
        grid.classList.add("ui", "ten", "column", "padded", "grid");

        Object.keys(emojiEntry).forEach(name => {
            var title: string = emojiEntry[name];
            var col = document.createElement("div");
            var item = document.createElement("div");

            col.classList.add("column");
            item.title = title;
            item.setAttribute("data-emoji", name);
            item.classList.add("emoji-item");
            item.innerHTML = emojiSVG.getSVG(name);
            item.getElementsByTagName("svg")[0].setAttribute("height", "1.5em");

            col.appendChild(item);
            grid.appendChild(col);
        });

        list.appendChild(grid);
        wrapper.appendChild(list);
        wrapper.appendChild(menu);
        container.appendChild(wrapper);

        this.emojiGrid = container;
        this.hide();
    }

    public show(): void {
        this.emojiGrid.classList.remove("hidden");
        this.emojiGrid.classList.add("visible");
    }

    public hide(): void {
        this.emojiGrid.classList.remove("visible");
        this.emojiGrid.classList.add("hidden");
    }
}