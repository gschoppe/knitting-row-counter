var keyMap = {
    'backspace'  :  8,
    'tab'        :  9,
    'enter'      : 13,
    'shift'      : 16,
    'ctrl'       : 17,
    'alt'        : 18,
    'pause'      : 19,
    'capslock'   : 20,
    'escape'     : 27,
    'space'      : 32,
    'pageup'     : 33,
    'pagedown'   : 34,
    'end'        : 35,
    'home'       : 36,
    'left'       : 37,
    'up'         : 38,
    'right'      : 39,
    'down'       : 40,
    'insert'     : 45,
    'delete'     : 46,
    '0'          : 48,
    '1'          : 49,
    '2'          : 50,
    '3'          : 51,
    '4'          : 52,
    '5'          : 53,
    '6'          : 54,
    '7'          : 55,
    '8'          : 56,
    '9'          : 57,
    'a'          : 65,
    'b'          : 66,
    'c'          : 67,
    'd'          : 68,
    'e'          : 69,
    'f'          : 70,
    'g'          : 71,
    'h'          : 72,
    'i'          : 73,
    'j'          : 74,
    'k'          : 75,
    'l'          : 76,
    'm'          : 77,
    'n'          : 78,
    'o'          : 79,
    'p'          : 80,
    'q'          : 81,
    'r'          : 82,
    's'          : 83,
    't'          : 84,
    'u'          : 85,
    'v'          : 86,
    'w'          : 87,
    'x'          : 88,
    'y'          : 89,
    'z'          : 90,
    'leftwin'    : 91,
    'rightwin'   : 92,
    'select'     : 93,
    'num0'       : 96,
    'num1'       : 97,
    'num2'       : 98,
    'num3'       : 99,
    'num4'       : 100,
    'num5'       : 101,
    'num6'       : 102,
    'num7'       : 103,
    'num8'       : 104,
    'num9'       : 105,
    'multiply'   : 106,
    'add'        : 107,
    'subtract'   : 109,
    'decimal'    : 110,
    'divide'     : 111,
    'f1'         : 112,
    'f2'         : 113,
    'f3'         : 114,
    'f4'         : 115,
    'f5'         : 116,
    'f6'         : 117,
    'f7'         : 118,
    'f8'         : 119,
    'f9'         : 120,
    'f10'        : 121,
    'f11'        : 122,
    'f12'        : 123,
    'numlk'      : 144,
    'scrolllk'   : 145,
    'semicolon'  : 186,
    'equals'     : 187,
    'comma'      : 188,
    'dash'       : 189,
    'period'     : 190,
    'slash'      : 191,
    'backtick'   : 192,
    'lbracket'   : 219,
    'backslash'  : 220,
    'rbracket'   : 221,
    'apostrophe' : 222,
};

function initialize() {
    $('#rowCount').val(parseInt($('#initialCount').val()));
    $('#goalNum').text(parseInt($('#goal').val()));
    var percent = Math.floor((parseInt($('#initialCount').val())/parseInt($('#goal').val()))*100);
    $('#goalPercent').text(percent);
    setColors();
    startListening();
}
var keyIsDown = true;
function startListening() {
    $('#addRow').on("click", function() {
        increment();
    });
    $(document).on("keydown", function(e) {
        e.preventDefault();
        if((e.keyCode == $('#keyCode').val())&&!keyIsDown) {
            keyIsDown = true;
            increment();
        }
    });
    $(document).on("keyup", function(e) {
        if((e.keyCode == $('#keyCode').val())) {
            keyIsDown = false;
        }
    });
}
function stopListening() {
    $('#addRow').off('click');
    $(document).off("keydown");
    $(document).off("keyup");
    keyIsDown = false;
}
function increment() {
    $('#rowCount').val(parseInt($('#rowCount').val())+1);
    var percent = Math.floor((parseInt($('#rowCount').val())/parseInt($('#goalNum').text()))*100);
    $('#goalPercent').text(percent);
    setColors();
}
function setColors() {
    var color="";
    var percent = (parseInt($('#rowCount').val())/parseInt($('#goalNum').text()))*100;
    if(percent < 50) {
        color = "#FFF";
    } else if(percent < 75) {
        color = "#F60";
    } else if(percent < 90) {
        color = "#FA0";
    } else if(percent < 100) {
        color = "#FF0";
    } else if(percent == 100) {
        color = "#0F0";
    } else {
        color = "#F00";
    }
    $('#rowCount').css('color', color);
}

$(document).ready(function(){
    $.each(keyMap, function(name, code) {
        var $element = $("<option></option>").attr("value",code).text(name);
        if(name == defaultKeyCode) {
            $element.attr("selected",1);
        }
        $('#keyCode').append($element);
    });
    $('#startCount').click(function() {
        initialize();
        $('#setupDiv').hide();
        $('#runDiv'  ).show();
    });
    $('#cancel').click(function() {
        startListening();
        $('#setupDiv').hide();
        $('#runDiv'  ).show();
    });
    $('#resetCount').click(function() {
        stopListening();
        $('#setupDiv').show();
        $('#runDiv'  ).hide();
    });
});