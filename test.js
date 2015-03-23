function content() {
    var arr = [];

    return {
	edit: function (index, replaceWith) {
	    arr[index] = replaceWith;
	},
	toScreen: function () {
	    $("#screen span").text(arr.join(' '));
	},
    };
}

var KEY = {
    // keys on display
    65: "a", 66: "b", 67: "c", 68: "d", 69: "e",
    70: "f", 71: "g", 72: "h", 73: "i", 74: "j",
    75: "k", 76: "l", 77: "m", 78: "n", 79: "o",
    80: "p", 81: "q", 82: "r", 83: "s", 84: "t",
    85: "u", 86: "v", 87: "w", 88: "x", 89: "y",
    90: "z"
};

var processKeyInput = function () {
    var current_text = "";
    return (function (key) {
	current_text += KEY[key];
	return current_text;
    });
}();

function toScreen(s) {
    $("#screen span").text(s);
}

function getHandler(key) {
    if (key >= 65 && key <= 90) {
	return (function () {
	    document.getElementById("code_"+key).className = "key key_down";
	    toScreen(processKeyInput(key));
	});
    }
    switch(key) {
    case 17:

    }
}

var key_seq = "";

function keyDown(event) {
    var key = event.which;	console.log(key);
    var id = "code_" + key;
    getHandler(key)();
}

function keyUp(event) {
    var key = event.which;
    if (key >= 65 && key <= 90) {
        document.getElementById("code_" + key).className = "key key_up";
    }
}

function styleKeyboard() {
    var kb = "#keyboard";
    var k = ".key";

    //var r = 1.618;	// golden ratio
    var r = 2;
    
    var h_total	= $(window).width();
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
