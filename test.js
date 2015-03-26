var KEY = {
    // keys on display
    32: " ",
    65: "a", 66: "b", 67: "c", 68: "d", 69: "e",
    70: "f", 71: "g", 72: "h", 73: "i", 74: "j",
    75: "k", 76: "l", 77: "m", 78: "n", 79: "o",
    80: "p", 81: "q", 82: "r", 83: "s", 84: "t",
    85: "u", 86: "v", 87: "w", 88: "x", 89: "y",
    90: "z",
    188: ",", 190: "."
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
    event.preventDefault();
    var key = event.which;	console.log(key);
    if (key >= 65 && key <= 90) {
        document.getElementById("code_"+key).className = "key key_down";
    }
    switch (mode) {
    case content:
        switch (key) {
        case 8: //backspace
            toScreen(content.drop(1).string());
            break;
        case 17: //ctrl
            mode = ctrl;
            break;
        default:
            toScreen(content.append(KEY[key]).string());
            break;
        }
        break;
    case ctrl:
        ctrl.action(key);
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
    if (key == 17) { // assert: mode == ctrl
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
