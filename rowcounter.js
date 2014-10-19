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

function formatTimestamp(timestamp) {
    if(typeof timestamp == 'undefined' || timestamp == 0)
        return("never");
    var dateObj = new Date(timestamp);
    var d = {
        year   : pad(dateObj.getFullYear(),4),
        month  : pad(dateObj.getMonth()+1,2),
        day    : pad(dateObj.getDate(),2),
        hour   : pad(dateObj.getHours(),2),
        minute : pad(dateObj.getMinutes(),2),
        second : pad(dateObj.getSeconds(),2)
    }
    // american format: hh:mm:ss dd/mm/yyyy
    return(d.hour+':'+d.minute+':'+d.second+' '+d.month+'/'+d.day+'/'+d.year);
}
function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function initialize() {
    var settings = {
        count      : parseInt($('#initialCount').val()),
        goal       : parseInt($('#goal').val()),
        key        : $('#keyCode').val(),
        lastRow    : $('#lastRow').data('value'),
        repeatFreq : parseInt($('#repeatFreq').val())
    }
    $.cookie('knitting-settings', settings, { expires: 30 });
    $('#rowCount').val(settings.count);
    placeFreqPips(settings.repeatFreq, settings.count);
    $('#goalNum').text(settings.goal);
    var percent = 0
    if(settings.goal > 0)
        percent = Math.floor((settings.count/settings.goal)*100);
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
    var settings = $.cookie('knitting-settings');
    if (typeof settings == 'undefined') {
        settings = {
            count      : parseInt($('#rowCount').val()),
            goal       : parseInt($('#goal').val()),
            key        : $('#keyCode').val(),
            lastRow    : 0,
            repeatFreq : parseInt($('#repeatFreq').val())
        }
    }
    settings.count   = parseInt($('#rowCount').val())+1;
    settings.lastRow = new Date().getTime();
    $.cookie('knitting-settings', settings, { expires: 30 });
    $('#rowCount, #initialCount').val(settings.count);
    $('#lastRow').data('value', settings.lastRow).text(formatTimestamp(settings.lastRow));
    placeFreqPips(settings.repeatFreq, settings.count);
    var percent = 0;
    if(settings.goal > 0)
        percent = Math.floor((settings.count/settings.goal)*100);
    $('#goalPercent').text(percent);
    setColors();
}
function placeFreqPips(freq, count) {
    console.log(freq + " " + count);
    if(typeof freq == 'undefined'||freq <= 1) return;
    var currentPip = count % freq;
    var $element;
    $('#freqPips').html("");
    for (i = 0; i < freq; i++) { 
        $element = $('<span></span>');
        if(i <= currentPip)
            $element.addClass('done');
        $('#freqPips').append($element);
    }
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
    $.cookie.json = true;
    var settings = $.cookie('knitting-settings');
    if (typeof settings == 'undefined') {
        settings = {
            count      : 0,
            goal       : 100,
            key        : keyMap[defaultKeyCode],
            repeatFreq : 0,
            lastRow    : 0
        }
    }
    $('#initialCount').val(settings.count);
    $('#goal').val(settings.goal);
    $('#repeatFreq').val(settings.repeatFreq);
    $('#lastRow').data('value', settings.lastRow).text(formatTimestamp(settings.lastRow));
    $.each(keyMap, function(name, code) {
        var $element = $("<option></option>").attr("value",code).text(name);
        if(code == settings.key) {
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
        $('#cancel').show();
        $('#runDiv'  ).hide();
    });
});