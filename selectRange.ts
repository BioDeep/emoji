class selectRange {

    private element: HTMLInputElement;

    public constructor(e: HTMLInputElement) {
        this.element = e;
    }

    public static of(e: HTMLInputElement): selectRange {
        return e ? new selectRange(e) : <any>{};
    }

    public getCurPos() {
        var e, c = 0;
        var input = this.element;

        return (<any>document).selection ? (input.focus(),
            (e = (<any>document).selection.createRange()).moveStart("character", -input.value.length),
            c = e.text.length) : (input.selectionStart || 0 == input.selectionStart) && (c = input.selectionStart),
            c
    }
    public setCurPos(e) {
        var t;
        var input = this.element;
        input.setSelectionRange ? (input.focus(),
            input.setSelectionRange(e, e)) : (<any>input).createTextRange && ((t = (<any>input).createTextRange()).collapse(!0),
                t.moveEnd("character", e),
                t.moveStart("character", e),
                t.select())
    }
    public getSelectText() {
        var e, t = "";
        return window.getSelection ? e = window.getSelection() : (<any>document).selection && (e = (<any>document).selection.createRange()),
            (t = e.text) || (t = e),
            t
    }
    public setSelectText(e, t) {
        var n, c;
        var input = this.element;

        e = parseInt(e),
            t = parseInt(t),
            (n = input.value.length) && (e || (e = 0),
                t || (t = n),
                n < e && (e = n),
                n < t && (t = n),
                e < 0 && (e = n + e),
                t < 0 && (t = n + t),
                (<any>input).createTextRange ? ((c = (<any>input).createTextRange()).moveStart("character", -n),
                    c.moveEnd("character", -n),
                    c.moveStart("character", e),
                    c.moveEnd("character", t),
                    c.select()) : (input.setSelectionRange(e, t),
                        input.focus()))
    }
    public insertAfterText(e) {
        var t, n, c;
        var input: HTMLInputElement = this.element;

        (<any>document).selection ?
            (input.focus(), (<any>document).selection.createRange().text = e, input.focus()) : input.selectionStart || 0 == input.selectionStart ?
                (t = input.selectionStart,
                    n = input.selectionEnd,
                    c = input.scrollTop,
                    input.value = input.value.substring(0, t) + e + input.value.substring(n, input.value.length),
                    input.focus(),
                    input.selectionStart = t + e.length,
                    input.selectionEnd = t + e.length,
                    input.scrollTop = c) : (input.value += e, input.focus())
    }
}