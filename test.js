var KEY = {
    32: " ",
    48: "0", 49: "1", 50: "2", 51: "3", 52: "4",
    53: "5", 54: "6", 55: "7", 56: "8", 57: "9",
    65: "a", 66: "b", 67: "c", 68: "d", 69: "e",
    70: "f", 71: "g", 72: "h", 73: "i", 74: "j",
    75: "k", 76: "l", 77: "m", 78: "n", 79: "o",
    80: "p", 81: "q", 82: "r", 83: "s", 84: "t",
    85: "u", 86: "v", 87: "w", 88: "x", 89: "y",
    90: "z",
    96: "0", 97: "1", 98: "2", 99: "3", 100: "4",
    101: "5", 102: "6", 103: "7", 104: "8", 105: "9",
    106: "*", 107: "+", 109: "-", 110: ".", 111: "/",
    186: ";", 187: "=", 188: ",", 189: "-", 190: ".",
    191: "/", 192: "`",
    219: "[", 220: "\\", 221: "]", 222: "'"
};

var SHIFT_KEY = {
    48: ")", 49: "!", 50: "@", 51: "#", 52: "$",
    53: "%", 54: "^", 55: "&", 56: "*", 57: "(",
    65: "A", 66: "B", 67: "C", 68: "D", 69: "E",
    70: "F", 71: "G", 72: "H", 73: "I", 74: "J",
    75: "K", 76: "L", 77: "M", 78: "N", 79: "O",
    80: "P", 81: "Q", 82: "R", 83: "S", 84: "T",
    85: "U", 86: "V", 87: "W", 88: "X", 89: "Y",
    90: "Z",
    186: ":", 187: "+", 188: "<", 189: "_", 190: ">",
    191: "?", 192: "~",
    219: "{", 220: "|", 221: "}", 222: "\""
};

var content = function () {
    var txt = "";
    return {
        string: function () {
            return txt;
        },
        append: function (s) {
            txt += s;
            return this;
        },
        drop: function (n) {
            txt = txt.slice(0, txt.length - n);
            return this;
        },
    };
}();

function toScreen(s) {
    $("#screen > span").text(s);
}

var shift = {
    input: function (key) {
        x = SHIFT_KEY[key];
        if (x)
            toScreen(content.append(x).string());
    },
};

/*
Control key sequence creates a special environment for the keydowns
following the keydown of ctrl, and before the keyup of ctrl. In this
environment, keydowns are interpreted differently; say, in normal
environment, keydown on 'v' will append a character 'v' at the end
of current text on screen, while in this special environment, it will
be interpreted as a COPY command, and freeze the environment (further
keydowns will not have any effect until the next keyup of ctrl.) 
*/

var ctrl = {
    action: function (key) {
        switch (key) {
        case 67:
            $("#screen > span").focus();
            document.execCommand("SelectAll");
            document.execCommand("Copy");
            break;
        default:
            break;
        }
    },
};

var mode = content; // or ctrl, shift

function keyDown(event) {
    var k, x;

    event.preventDefault();
    k = event.which;	console.log(k);
    if (k >= 65 && k <= 90) {
        document.getElementById("code_" + k).className = "key key_down";
    }
    switch (mode) {
    case content:
        switch (k) {
        case 8: //backspace
            toScreen(content.drop(1).string());
            break;
        case 16: //shift
            mode = shift;
            break;
        case 17: //ctrl
            mode = ctrl;
            break;
        default:
            x = KEY[k];
            if (x)
                toScreen(content.append(x).string());
            break;
        }
        break;
    case shift:
        shift.input(k);
    case ctrl:
        ctrl.action(k);
        break;
    default:
        break;
    }
}

function keyUp(event) {
    var key = event.which;
    if (key >= 65 && key <= 90) {
        document.getElementById("code_" + key).className = "key key_up";
    }
    if (key == 16 || key == 17) { // assert: mode == ctrl
        mode = content;
    }
}

function styleKeyboard() {
    var kb = "#keyboard";
    var k = ".key";

    //var r = 1.618;	// golden ratio
    var r = 2;
    
    var h_total	= $("html").width();
    var h_unit	= Math.floor(h_total/10);
    var h_space	= h_unit * 0.1;
    var h_margin= h_space * 0.5;
    var h_key	= h_unit - h_space;

    var v_unit	= Math.round(h_unit * (r-1));
    var v_total	= v_unit * 3;
    var v_space	= v_unit * 0.1;
    var v_margin= v_space * 0.5;
    var v_key	= v_unit - v_space;

    $(kb).css("height", v_total);

    $(kb+" div").css("margin-left", h_margin);
    $(kb+" div").css("margin-right", h_margin);
    $(kb+" div").css("margin-top", v_margin);
    $(kb+" div").css("margin-bottom", v_margin);

    $(k).css("width", h_key);
    $(k).css("height", v_key)

    var h = 0;
    var v = 0;
    var i = 0;
    for (; i < 10; i++, h+=h_unit) {
	$(kb+" div div:nth-child("+(i+1)+")").css("left", h);
	$(kb+" div div:nth-child("+(i+1)+")").css("top", v);
    }
    h = h_unit * 0.5;
    v += v_unit;
    for (; i < 19; i++, h+=h_unit) {
	$(kb+" div div:nth-child("+(i+1)+")").css("left", h);
	$(kb+" div div:nth-child("+(i+1)+")").css("top", v);
    }
    h = h_unit * 1.5;
    v += v_unit;
    for (; i < 26; i++, h+=h_unit) {
	$(kb+" div div:nth-child("+(i+1)+")").css("left", h);
	$(kb+" div div:nth-child("+(i+1)+")").css("top", v);
    }

    $(k).addClass("key_up");
}

$(function() {
    styleKeyboard();

    $(window).on("resize", styleKeyboard);

    $(document).on("keydown", keyDown);
    $(document).on("keyup", keyUp);
});
