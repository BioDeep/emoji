class InputBox {

    public clearMessage() {
        var e = this;
        e.tipMessage.className = "",
            e.tipMessage.content = "",
            e.tipMessage.show = !1
    }
    public focus() {
        this.$refs.commentTextarea.focus()
    }

    public insertContent(e) {
        return !this.commentPublishLoading &&
            (this.commentContent.length >= this.commentMaxLength || this.commentContent.length + e.length > this.commentMaxLength ?
                void this.showMessage("error", "最多只能输入" + this.commentMaxLength + "个字符！", 2e3) :
                (selectRange.of(this.$refs.commentTextarea).insertAfterText(e),
                    this.commentContent = this.$refs.commentTextarea.value,
                    !0))
    }

    public insertEmoji(e) {
        this.clearMessage();
        var o = ":" + e + ":";
        this.insertContent(o),
            r(this.$refs.showEmojiBox).popup("hide")
    },
}