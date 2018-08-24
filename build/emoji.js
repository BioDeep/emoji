var emoji;
(function (emoji) {
    // 假设一个emoji的代码是 ::smile::
    // 那么会进行正则匹配，转换为img标签，如 <img class="emoji" src="/path/to/smile.svg" />
    /**
     * svg在本地缓存之中的名字的前缀
    */
    var localPrefix = "emoji_";
    /**
     * 获取当前脚本的URL
    */
    function scriptURL() {
        var scripts = document.getElementsByTagName("script");
        var me = null;
        var len = scripts.length;
        for (var i = 0; i < len; i++) {
            var script = scripts[i];
            var src = basename(script.src);
            if (src == "emoji") {
                me = script.src;
                break;
            }
        }
        if (!me) {
            throw "Unable to detects the script url: script file has been renamed!";
        }
        else {
            return me;
        }
    }
    emoji.scriptURL = scriptURL;
    function basename(file) {
        var path = file.split(/\/+/);
        var name = path[path.length - 1].split(/\./);
        return name[0];
    }
    /**
     * 当前的URL的网络位置
    */
    var myURL = emoji.scriptURL();
    function GET(url) {
        var request = new XMLHttpRequest();
        // `false` makes the request synchronous
        request.open('GET', url, false);
        request.send(null);
        if (request.status === 200) {
            return request.responseText;
        }
        else {
            return "";
        }
    }
    emoji.GET = GET;
    /**
     * 将文档之中的符合规则的占位符都替换为emoji
    */
    var Render = /** @class */ (function () {
        function Render() {
            this.resource = new emoji.Resource();
        }
        /**
         * 将所给定的文本之中的emoji渲染出来
        */
        Render.prototype.rendering = function (text, div) {
            var html = this.renderText(text);
            div.innerHTML = html;
            var emojiSVG = div.getElementsByTagName("svg");
            var len = emojiSVG.length;
            console.log(emojiSVG);
            for (var i = 0; i < len; i++) {
                var svg = emojiSVG[i];
                svg.setAttribute("height", "1.125em");
            }
        };
        /**
         * 首先进行正则匹配，找出所有可能的emoji占位符
         * 假设emoji的名字只能够由字符和数字组成
         * 例如： ``::smile::``
        */
        Render.prototype.renderText = function (text) {
            if (!text) {
                return "";
            }
            else {
                return this.renderTextImpl(text);
            }
        };
        Render.prototype.renderTextImpl = function (text) {
            // 20180821 js的正则表达式之中必须要加上g全局选项，才会匹配出所有结果
            // 否则只会匹配出一个结果
            var pattern = /[:]{2}[a-zA-Z0-9]+[:]{2}/g;
            var keys = text.match(pattern);
            if (!keys) {
                return text;
            }
            else {
                keys = Render.uniq(keys);
            }
            for (var i = 0; i < keys.length; i++) {
                // ::smile::
                var key = keys[i];
                var name = key + "";
                name = name.substr(2);
                name = name.substr(0, name.length - 2);
                // 得到了svg
                var svg = this.resource.getSVG(name);
                if (svg.length > 0) {
                    // 只渲染存在的资源
                    var insert = ("\n                        <span>\n                            " + svg + "\n                            <span style=\"display:none;\">" + key + "</span>\n                        </span>").replace("/\n/", "");
                    var exp = new RegExp("[:]{2}" + name + "[:]{2}");
                    text = text.replace(exp, insert);
                }
            }
            return text;
        };
        Render.uniq = function (a) {
            var seen = {};
            return a.filter(function (item) {
                return seen.hasOwnProperty(item) ? false : (seen[item] = true);
            });
        };
        return Render;
    }());
    emoji.Render = Render;
    /**
     *
    */
    var Resource = /** @class */ (function () {
        /**
         * 在初始化的时候首先尝试从localstorage之中加载svg到cache内存缓存之中
        */
        function Resource() {
            /**
             * [name => svg]
             *
             * emoji使用svg进行缓存，为了减少对服务器的请求次数
             * 使用localstorage进行保存
            */
            this.cache = {};
            for (var i = 0; i < localStorage.length; i++) {
                var index = localStorage.key(i);
                // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith
                // 这个函数在string里面实际上是不存在的？？？
                if (index.startsWith(localPrefix)) {
                    this.cache[index] = localStorage.getItem(index);
                }
            }
        }
        /**
         * 会首先从缓存之中进行查找资源，如果不成功，就会请求服务器，然后将请求结果写入本地缓存
        */
        Resource.prototype.getSVG = function (name) {
            var index = "" + localPrefix + name;
            if (index in this.cache) {
                return this.cache[index];
            }
            else {
                // 不存在则请求服务器资源
                // 进行同步请求
                var svg = emoji.GET(emoji.Resource.svgURL(name));
                this.writeCache(name, svg);
                return svg;
            }
        };
        Resource.svgURL = function (name) {
            var tokens = myURL.split(/\/+/);
            // 最后一个元素是当前的脚本的文件名
            // 将其替换为svg文件夹
            // 然后再添加文件名，就可以组装出网络路径了
            tokens[tokens.length - 1] = "svg";
            // 20180821 得到的javascript路径是全路径
            // 在这里将第一个元素设置为/就意味着url的起始为//
            // 即从根节点开始计算的绝对路径
            tokens[0] = "/";
            tokens.push(name + ".svg");
            var url = tokens.join("/");
            return url;
        };
        /**
         * 将从服务器得到的数据写入到localstorage和cache变量之中
        */
        Resource.prototype.writeCache = function (key, svg) {
            var index = "" + localPrefix + key;
            // 在这里使用两种缓存，cache变量是内存缓存
            // localstorage是本地硬盘上面的缓存
            this.cache[index] = svg;
            localStorage.setItem(index, svg);
        };
        return Resource;
    }());
    emoji.Resource = Resource;
})(emoji || (emoji = {}));
/**
 * 样式依赖于 semantic.min.css
 *
 * > https://github.com/Semantic-Org/Semantic-UI
*/
var EmojiBox = /** @class */ (function () {
    /**
     * @param ncols 每一行之中的emoji的数量
    */
    function EmojiBox(emojiEntry, inputBox) {
        var container = document.createElement("div");
        var wrapper = document.createElement("div");
        var menu = document.createElement("div");
        var list = document.createElement("div");
        var grid = document.createElement("div");
        var emojiSVG = new emoji.Resource();
        container.classList.add("ui", "popup", "toolbox-popup", "toolbox-emoji", "top", "left", "transition");
        container.setAttribute("style", "top: auto; left: 0px; bottom: 25.9688px; right: auto; display: block !important;");
        wrapper.classList.add("emoji-wrapper");
        menu.classList.add("ui", "secondary", "pointing", "menu");
        menu.innerHTML = "<a class=\"item active\">Emoji</a>";
        list.classList.add("emoji-list");
        grid.classList.add("ui", "ten", "column", "padded", "grid");
        Object.keys(emojiEntry).forEach(function (name) {
            var title = emojiEntry[name];
            var col = document.createElement("div");
            var item = document.createElement("div");
            col.classList.add("column");
            item.title = title;
            item.setAttribute("data-emoji", name);
            item.classList.add("emoji-item");
            item.innerHTML = "<a id=\"" + name + "\" href=\"javascript:void(0)\" target=\"__blank\">" + emojiSVG.getSVG(name) + "</a>";
            item.getElementsByTagName("svg")[0].setAttribute("height", "1.25em");
            item.getElementsByTagName("a")[0].onclick = function () {
                inputBox.insertEmoji(this.id);
            };
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
    EmojiBox.prototype.show = function () {
        this.emojiGrid.classList.remove("hidden");
        this.emojiGrid.classList.add("visible");
    };
    EmojiBox.prototype.hide = function () {
        this.emojiGrid.classList.remove("visible");
        this.emojiGrid.classList.add("hidden");
    };
    return EmojiBox;
}());
var InputBox = /** @class */ (function () {
    /**
     * @param div 将要被插入输入框的div元素
    */
    function InputBox(emoji, publish, div, maxLen, showErrMessage) {
        if (div === void 0) { div = "tweetCommentForm"; }
        if (maxLen === void 0) { maxLen = 250; }
        if (showErrMessage === void 0) { showErrMessage = function (msg) {
            alert(msg);
        }; }
        this.commentMaxLength = maxLen;
        this.showErrMessage = showErrMessage;
        this.emojiBox = new EmojiBox(emoji, this);
        var container = document.getElementById(div);
        var form = document.createElement("div");
        form.classList.add("ui", "form", "tweet-form");
        form.innerHTML = "\n            <div class=\"field\">\n                <textarea id=\"input-textarea\" placeholder=\"\u5199\u4E0B\u8BC4\u8BBA\" rows=\"5\" class=\"tweet-comment-textarea disabled-resize\">\n                </textarea>\n            </div>\n            <div class=\"field foot-bar\" style=\"width: 100%; text-align: left;\">\n                <div id=\"toolbox\" class=\"ui horizontal link small list toolbox\">\n                    <a id=\"toolbox-emoji\" class=\"item\">\n                        <i class=\"smile icon\"></i>\u63D2\u5165\u8868\u60C5</a>\n                </div>\n                <div id=\"tweet-count\">0/" + this.commentMaxLength + "</div>\n                <!--\n                    <div class=\"ui mini checkbox pub-tweet-checkbox\">\n                        <input id=\"pubTweet\" type=\"checkbox\" class=\"hidden\">\n                        <label for=\"pubTweet\">\u5728\u52A8\u6001\u4E2D\u663E\u793A</label>\n                    </div>\n                -->\n                <button id=\"publish\" class=\"ui primary right floated small button\">\u53D1\u5E03\u8BC4\u8BBA</button>\n            </div>";
        container.appendChild(form);
        document.getElementById("toolbox").appendChild(this.emojiBox.emojiGrid);
        var inputBox = this;
        var area = document.getElementById("input-textarea");
        var counter = document.getElementById("tweet-count");
        // 初始化事件交互
        document.getElementById("toolbox-emoji").onclick = function () {
            inputBox.emojiBox.show();
        };
        document.getElementById("publish").onclick = function () {
            publish(inputBox.commentContent);
        };
        this.commentTextarea = area;
        this.commentTextarea.innerText = "";
        this.counter = counter;
        if (area.addEventListener) {
            area.addEventListener('input', function () {
                // event handling code for sane browsers
                counter.innerHTML = inputBox.commentCountText;
            }, false);
        }
        else if (area.attachEvent) {
            area.attachEvent('onpropertychange', function () {
                // IE-specific event handling code
                counter.innerHTML = inputBox.commentCountText;
            });
        }
    }
    Object.defineProperty(InputBox.prototype, "commentContent", {
        get: function () {
            return this.commentTextarea.value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InputBox.prototype, "commentContentIsEmpty", {
        get: function () {
            return 0 === this.commentContent.length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InputBox.prototype, "commentCountText", {
        get: function () {
            return this.commentContent.length + "/" + this.commentMaxLength;
        },
        enumerable: true,
        configurable: true
    });
    InputBox.prototype.focus = function () {
        this.commentTextarea.focus();
    };
    InputBox.prototype.insertContent = function (e) {
        if (this.reachMaxSize(e)) {
            this.showErrMessage("\u6700\u591A\u53EA\u80FD\u8F93\u5165" + this.commentMaxLength + "\u4E2A\u5B57\u7B26\uFF01");
        }
        else {
            selectRange
                .of(this.commentTextarea)
                .insertAfterText(e);
            this.counter.innerHTML = this.commentCountText;
        }
    };
    InputBox.prototype.reachMaxSize = function (append) {
        var a = this.commentContent.length >= this.commentMaxLength;
        var b = this.commentContent.length + append.length > this.commentMaxLength;
        return a || b;
    };
    InputBox.prototype.insertEmoji = function (emoji) {
        var name = "::" + emoji + "::";
        this.insertContent(name);
        this.emojiBox.hide();
    };
    return InputBox;
}());
var selectRange = /** @class */ (function () {
    function selectRange(inputs) {
        this.element = inputs;
    }
    selectRange.of = function (e) {
        return e ? new selectRange(e) : {};
    };
    selectRange.prototype.getCurPos = function () {
        var curPos = 0;
        var input = this.element;
        if (document.selection) {
            input.focus();
            var range = document.selection.createRange();
            range.moveStart("character", -input.value.length);
            curPos = range.text.length;
        }
        else {
            (input.selectionStart || 0 == input.selectionStart) && (curPos = input.selectionStart);
        }
        return curPos;
    };
    selectRange.prototype.setCurPos = function (position) {
        var t;
        var input = this.element;
        input.setSelectionRange ? (input.focus(),
            input.setSelectionRange(position, position)) : input.createTextRange && ((t = input.createTextRange()).collapse(!0),
            t.moveEnd("character", position),
            t.moveStart("character", position),
            t.select());
    };
    selectRange.prototype.getSelectText = function () {
        var range;
        var text = "";
        if (window.getSelection) {
            range = window.getSelection();
        }
        else {
            document.selection && (range = document.selection.createRange());
        }
        (text = range.text) || (text = range);
        return text;
    };
    selectRange.prototype.setSelectText = function (e, t) {
        var n;
        var c;
        var input = this.element;
        (n = input.value.length) && (e || (e = 0),
            t || (t = n),
            n < e && (e = n),
            n < t && (t = n),
            e < 0 && (e = n + e),
            t < 0 && (t = n + t),
            input.createTextRange ? ((c = input.createTextRange()).moveStart("character", -n),
                c.moveEnd("character", -n),
                c.moveStart("character", e),
                c.moveEnd("character", t),
                c.select()) : (input.setSelectionRange(e, t),
                input.focus()));
    };
    selectRange.prototype.insertAfterText = function (e) {
        var t;
        var n;
        var c;
        var input = this.element;
        document.selection ?
            (input.focus(), document.selection.createRange().text = e, input.focus()) : input.selectionStart || 0 == input.selectionStart ?
            (t = input.selectionStart,
                n = input.selectionEnd,
                c = input.scrollTop,
                input.value = input.value.substring(0, t) + e + input.value.substring(n, input.value.length),
                input.focus(),
                input.selectionStart = t + e.length,
                input.selectionEnd = t + e.length,
                input.scrollTop = c) : (input.value += e, input.focus());
    };
    return selectRange;
}());
//# sourceMappingURL=emoji.js.map