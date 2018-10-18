
/**
 * 样式依赖于 semantic.min.css
 * 
 * > https://github.com/Semantic-Org/Semantic-UI
*/
class EmojiBox {

    public emojiGrid: HTMLDivElement;
    public statusHidden: boolean;

    /**
     * @param ncols 每一行之中的emoji的数量
    */
    public constructor(emojiEntry: object, inputBox: InputBox) {
        var emojiSVG: emoji.Resource = new emoji.Resource();
        var container: HTMLDivElement = $ts("<div>", {
            class: "ui popup toolbox-popup toolbox-emoji top left transition",
            style: "top: auto; left: 0px; bottom: 25.9688px; right: auto; display: block !important;"
        });
        var wrapper: HTMLDivElement = $ts("<div>", {
            class: "emoji-wrapper"
        });
        var list: HTMLDivElement = $ts("<div>", {
            class: "emoji-list"
        });
        var grid: HTMLDivElement = $ts("<div>", {
            class: "ui eight column padded grid"
        });

        Object.keys(emojiEntry).forEach(name => {
            var title: string = emojiEntry[name];
            var col: HTMLTsElement = $ts("<div>", {
                class: "column"
            }).asExtends;
            var item = document.createElement("div");

            item.title = title;
            item.setAttribute("data-emoji", name);
            item.classList.add("emoji-item");
            item.innerHTML = `<a id="${name}" href="javascript:void(0)" target="__blank">${emojiSVG.getSVG(name)}</a>`;
            item.getElementsByTagName("svg")[0].setAttribute("height", "1.25em");
            item.getElementsByTagName("a")[0].onclick = function () {
                inputBox.insertEmoji(this.id);
            }

            grid.appendChild(col.display(item).HTMLElement);
        });

        list.appendChild(grid);
        wrapper.appendChild(list);
        container.appendChild(wrapper);

        this.emojiGrid = container;
        this.hide();
    }

    public show(): void {
        this.statusHidden = false;
        this.emojiGrid.classList.remove("hidden");
        this.emojiGrid.classList.add("visible");
    }

    public hide(): void {
        this.statusHidden = true;
        this.emojiGrid.classList.remove("visible");
        this.emojiGrid.classList.add("hidden");
    }
}