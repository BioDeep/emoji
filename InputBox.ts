class InputBox {

    public emojiBox: EmojiBox;
    public commentTextarea: HTMLInputElement;
    public commentContent: string;

    public readonly commentMaxLength: number;
    public readonly showErrMessage: (msg: string) => void;

    public get commentContentIsEmpty(): boolean {
        return 0 === this.commentContent.length;
    }

    public get commentCountText(): string {
        return this.commentContent.length + "/" + this.commentMaxLength;
    }

    public constructor(
        maxLen: number = 250,
        showErrMessage: (msg: string) => void =
            function (msg: string) {
                alert(msg);
            }) {

        this.commentMaxLength = maxLen;
        this.showErrMessage = showErrMessage;
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

    public insertEmoji(emoji: string) {
        var name: string = `::${emoji}::`;

        this.insertContent(name);
        this.emojiBox.hide();
    }
}