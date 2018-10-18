class InputBox {

    public emojiBox: EmojiBox;
    public commentTextarea: HTMLTextAreaElement;
    public counter: HTMLElement;

    public readonly commentMaxLength: number;
    public readonly showErrMessage: (msg: string) => void;

    public get commentContent(): string {
        return this.commentTextarea.value;
    }

    public get commentContentIsEmpty(): boolean {
        return 0 === this.commentContent.length;
    }

    public get commentCountText(): string {
        return this.commentContent.length + "/" + this.commentMaxLength;
    }

    static readonly labelPadding: string = "padding-top: 0.5em;";

    /**
     * 调用这个构造函数的时候将会自动创建评论框
     * 
     * @param div 将要被插入输入框的div元素
    */
    public constructor(emoji: object, publish: (content: string) => void,
        div: string = "tweetCommentForm",
        maxLen: number = 250,
        showErrMessage: (msg: string) => void =
            function (msg: string) {
                alert(msg);
            }) {

        this.commentMaxLength = maxLen;
        this.showErrMessage = showErrMessage;
        this.emojiBox = new EmojiBox(emoji, this);

        var container: HTMLElement = $ts("#" + div);
        var form: HTMLTsElement = $ts("<div>", {
            class: "ui form tweet-form"
        }).asExtends;

        form.append($ts("<div>", { class: "field" }).display($ts("<textarea>", {
            id: "input-textarea",
            placeholder: "写下评论",
            rows: "5",
            class: "tweet-comment-textarea disabled-resize"
        }))).append($ts("<div>", {
            class: "field foot-bar",
            style: "width: 100%; text-align: left;"
        }).display(`<div id="toolbox" style="${InputBox.labelPadding}" class="ui horizontal link small list toolbox">
                        <a id="toolbox-emoji" class="item">
                            <i class="smile icon"></i>插入表情</a>
                    </div>
                    <div id="tweet-count" style="${InputBox.labelPadding} float: right; position: relative; right: 125px;">
                        0/${this.commentMaxLength}
                    </div>
                    <!--
                        <div class="ui mini checkbox pub-tweet-checkbox">
                            <input id="pubTweet" type="checkbox" class="hidden">
                            <label for="pubTweet">在动态中显示</label>
                        </div>
                    -->
                    <button id="publish" style="position: relative; right: -40px;" class="ui primary right floated small button">
                        发布评论
                    </button>`));

        container.appendChild(form.HTMLElement);

        (<HTMLElement>$ts("#toolbox")).appendChild(this.emojiBox.emojiGrid);

        var inputBox: InputBox = this;
        var area: HTMLTextAreaElement = <HTMLTextAreaElement>$ts("#input-textarea");
        var counter: HTMLElement = $ts("#tweet-count");

        // 初始化事件交互
        $ts("#toolbox-emoji").onclick = function () {
            if (inputBox.emojiBox.statusHidden) {
                inputBox.emojiBox.show();
            } else {
                inputBox.emojiBox.hide();
            }
        };
        $ts("#publish").onclick = function () {
            if (inputBox.commentContentIsEmpty) {
                inputBox.showErrMessage("发布的内容不可以为空！");
            } else {
                publish(inputBox.commentContent);
            }
        }

        // not working?
        this.emojiBox.emojiGrid.onblur = function () {
            inputBox.emojiBox.hide();
        }

        this.commentTextarea = area;
        this.commentTextarea.innerText = "";
        this.counter = counter;

        if (area.addEventListener) {
            area.addEventListener('input', function () {
                // event handling code for sane browsers
                counter.innerHTML = inputBox.commentCountText;
            }, false);
        } else if ((<any>area).attachEvent) {
            (<any>area).attachEvent('onpropertychange', function () {
                // IE-specific event handling code
                counter.innerHTML = inputBox.commentCountText;
            });
        }
    }

    public focus() {
        this.commentTextarea.focus();
    }

    public insertContent(e: string) {
        if (this.reachMaxSize(e)) {
            this.showErrMessage(`最多只能输入${this.commentMaxLength}个字符！`);
        } else {
            selectRange
                .of(this.commentTextarea)
                .insertAfterText(e);

            this.counter.innerHTML = this.commentCountText;
        }
    }

    private reachMaxSize(append: string): boolean {
        var a = this.commentContent.length >= this.commentMaxLength;
        var b = this.commentContent.length + append.length > this.commentMaxLength;

        return a || b;
    }

    public insertEmoji(emoji: string): void {
        var name: string = `::${emoji}::`;

        this.insertContent(name);
        this.emojiBox.hide();
    }
}