class selectRange {

    private element: HTMLTextAreaElement;

    public constructor(inputs: HTMLTextAreaElement) {
        this.element = inputs;
    }

    public static of(e: HTMLTextAreaElement): selectRange {
        return e ? new selectRange(e) : <any>{};
    }

    public getCurPos(): number {
        var curPos: number = 0;
        var input = this.element;

        if ((<any>document).selection) {
            input.focus();

            var range: any = (<any>document).selection.createRange();
            range.moveStart("character", -input.value.length);
            curPos = range.text.length;
        } else {
            (input.selectionStart || 0 == input.selectionStart) && (curPos = input.selectionStart);
        }

        return curPos;
    }

    public setCurPos(position: number) {
        var t;
        var input = this.element;

        input.setSelectionRange ? (input.focus(),
            input.setSelectionRange(position, position)) : (<any>input).createTextRange && ((t = (<any>input).createTextRange()).collapse(!0),
                t.moveEnd("character", position),
                t.moveStart("character", position),
                t.select());
    }

    public getSelectText(): string {
        var range;
        var text: string = "";

        if (window.getSelection) {
            range = window.getSelection();
        } else {
            (<any>document).selection && (range = (<any>document).selection.createRange());
        }

        (text = range.text) || (text = range);

        return text;
    }

    public setSelectText(e: number, t: number) {
        var n: number;
        var c;
        var input = this.element;

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
                    input.focus()));
    }

    public insertAfterText(e: string) {
        var t: number;
        var n: number;
        var c: number;
        var input: HTMLTextAreaElement = this.element;

        (<any>document).selection ?
            (input.focus(), (<any>document).selection.createRange().text = e, input.focus()) : input.selectionStart || 0 == input.selectionStart ?
                (t = input.selectionStart,
                    n = input.selectionEnd,
                    c = input.scrollTop,
                    input.value = input.value.substring(0, t) + e + input.value.substring(n, input.value.length),
                    input.focus(),
                    input.selectionStart = t + e.length,
                    input.selectionEnd = t + e.length,
                    input.scrollTop = c) : (input.value += e, input.focus());
    }
}