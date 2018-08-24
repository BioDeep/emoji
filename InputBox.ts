class InputBox {

    public emojiBox: EmojiBox;
    public commentTextarea: HTMLTextAreaElement;
    public commentContent: string;

    public readonly commentMaxLength: number;
    public readonly showErrMessage: (msg: string) => void;

    public get commentContentIsEmpty(): boolean {
        return 0 === this.commentContent.length;
    }

    public get commentCountText(): string {
        return this.commentContent.length + "/" + this.commentMaxLength;
    }

    /**
     * @param div 将要被插入输入框的div元素
    */
    public constructor(
        emoji: object,
        div: string = "tweetCommentForm",
        maxLen: number = 250,
        showErrMessage: (msg: string) => void =
            function (msg: string) {
                alert(msg);
            }) {

        this.commentMaxLength = maxLen;
        this.showErrMessage = showErrMessage;
        this.emojiBox = new EmojiBox(emoji, this);

        var container = document.getElementById(div);
        var form: HTMLElement = document.createElement("div");

        form.classList.add("ui", "form", "tweet-form");
        form.innerHTML = `
            <div class="field">
                <textarea id="input-textarea" rows="5" placeholder="我有话要说" class="tweet-comment-textarea disabled-resize">
                </textarea>
            </div>
            <div class="field foot-bar" style="width: 100%; text-align: left;">
                <div id="toolbox" class="ui horizontal link small list toolbox">
                    <a id="toolbox-emoji" class="item">
                        <i class="smile icon"></i>插入表情</a>
                </div>
                <div id="tweet-count">0/${this.commentMaxLength}</div>
                <!--
                    <div class="ui mini checkbox pub-tweet-checkbox">
                        <input id="pubTweet" type="checkbox" class="hidden">
                        <label for="pubTweet">在动态中显示</label>
                    </div>
                -->
                <button class="ui primary right floated small button disabled">发布评论</button>
            </div>`;

        container.appendChild(form);
        (<HTMLElement>document.getElementById("toolbox")).appendChild(this.emojiBox.emojiGrid);

        var inputBox: InputBox = this;
        var area: HTMLTextAreaElement = <HTMLTextAreaElement>document.getElementById("input-textarea");
        var counter: HTMLElement = document.getElementById("tweet-count");

        // 初始化事件交互
        document.getElementById("toolbox-emoji").onclick = function () {
            inputBox.emojiBox.show();
        };

        this.commentTextarea = area;
        this.commentContent = "";

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

            this.commentContent = this.commentTextarea.value;
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