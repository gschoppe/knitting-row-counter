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
var userDataTemplate = {
    profile : {
        id            : "",
        currentProject: false
    },
    settings : {
        theme : "dark",
        key   : keyMap[defaultKeyCode],
    },
    projects : {}
};

var newProjectTemplate = {
    name        : "New Project",
    row         : 0,
    goal        : 100,
    freq        : 0,
    freqStart   : 0,
    prevRowTime : 0
};

var userData;

$(document).ready(function(){
    initializeUserData();
    setTheme();
    setKey();
    showProjectsPage();
    $('#tab-projects').show();
    
    $(".tabs li a").click(function(e) {
        e.preventDefault();
        var id = $(this).attr('id');
        var idParts = id.split('-');
        var tab = "#tab-"+idParts[1];
        $('.tab').hide();
        $(tab).show();
        $('.tabs li a').removeClass('active');
        $(this).addClass('active');
    });
    
    $("#newProject").click( function() {
        createProject();
    });
    $("#projects").on("click", "td a", function(e) {
        e.preventDefault();
        var projectID = $(this).parents("tr").first().data('project')
        if($(this).hasClass('openProject')) {
            $('#cancelChanges').hide();
            openProject(projectID);
        } else if($(this).hasClass('deleteProject')) {
            deleteProject(projectID);
        }
    });
    $('#projectAdvSettingsGrabber').click(function() {
        $('#projectAdvSettings').toggle();
    });
    $('#startProject').click(function() {
        storeProjectSettings();
        $('#cancelChanges').show();
        runProject();
    });
    $('#cancelChanges').click(function() {
        runProject();
    });
    $('#changeProjectSettings').click(function() {
        var projectID = parseInt($('#projectID').val());
        openProject(projectID);
    });
    $('#switchProject, #switchProject2').click(function() {
        showProjectsPage();
    });
});

function initializeUserData() {
    $.cookie.json = true;
    userData  = $.cookie('knitting-data');
    if (typeof userData == 'undefined') {
        userData = userDataTemplate;
        doUpgrade();
        saveUserData();
    }
}

function saveUserData() {
    $.cookie('knitting-data', userData, { expires: 30 });
}

function doUpgrade() {
    var settings = $.cookie('knitting-settings');
    if (typeof settings != 'undefined' && settings) {
        var time = new Date().getTime();
        userData.projects[time] = {
            name        : "Current Project",
            row         : settings.count,
            goal        : settings.goal,
            freq        : settings.repeatFreq,
            freqStart   : 0,
            prevRowTime : settings.lastRow
        }
        userData.settings.key = settings.key
    }
}

function setTheme() {
    theme = userData.settings.theme;
    if(typeof theme != 'undefined' && theme == "light") {
        $('#themeswitch').attr('checked', false);
        $("#theme").attr('href', "styles/theme-light.css");
    }
    $("#themeswitch").change(function() {
        var theme;
        if($(this).is(':checked')) {
            theme = "dark";
        } else {
            theme = "light";
        }
        setTimeout(function(){$("#theme").attr('href', "styles/theme-"+theme+".css");}, 300);
        userData.settings.theme = theme;
        saveUserData();
    });
}

function setKey() {
    key = userData.settings.key;
    $('#keyCode').html("");
    $.each(keyMap, function(name, code) {
        var $element = $("<option></option>").attr("value",code).text(name);
        if(code == key) {
            $element.attr("selected",1);
        }
        $('#keyCode').append($element);
    });
    $("#keyCode").change(function() {
        userData.settings.key = intVal($(this).val());
        saveUserData();
    });
}

function showProjectsPage() {
    stopListening();
    $("#projects").html("");
    var i = 0;
    for (var projectID in userData.projects) {
        if(userData.projects.hasOwnProperty(projectID)){
            var project = userData.projects[projectID];
            var projectEntry  = $("<tr></tr>").data('project', projectID);
            if(i%2==1) {
                projectEntry.addClass("odd");
            }
            var percent = "";
            if(project.goal > 0)
                percent = Math.floor((project.row/project.goal)*100) + "%";
            var projectName    = $("<td></td>").html("<a href='' class='openProject'>"+project.name+"</a>");
            var projectPercent = $("<td></td>").html("<span>"+percent+"</span>");
            var projectStart   = $("<td></td>").html("<span>"+formatTimestamp(projectID, true)+"</span>");
            var projectDelete  = $("<td></td>").html("<a href='' class='deleteProject' title='Delete'>&times;</a>");
            projectEntry.append(projectName).append(projectPercent).append(projectStart).append(projectDelete);
            $("#projects").append(projectEntry);
            i++;
        }
    }
    $("#project-settings, #project-run").hide();
    $("#initial").show();
    console.log(userData);
}

function formatTimestamp(timestamp, dateOnly) {
    if(typeof timestamp == 'undefined' || timestamp == 0)
        return("never");
    if(typeof dateOnly == 'undefined')
        dateOnly = false;
    if(typeof timestamp == 'string' || timestamp instanceof String)
        timestamp = parseInt(timestamp);
    var dateObj = new Date(timestamp);
    var d = {
        year   : pad(dateObj.getFullYear().toString().substr(2,2),2),
        month  : pad(dateObj.getMonth()+1,2),
        day    : pad(dateObj.getDate(),2),
        hour   : pad(dateObj.getHours(),2),
        minute : pad(dateObj.getMinutes(),2),
        second : pad(dateObj.getSeconds(),2)
    }
    if(dateOnly) {
        // american format: dd/mm/yyyy
        return(d.month+'/'+d.day+'/'+d.year);
    } else {
        // american format: hh:mm:ss dd/mm/yyyy
        return(d.hour+':'+d.minute+':'+d.second+' '+d.month+'/'+d.day+'/'+d.year);
    }
}

function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function createProject() {
    var projectID       = new Date().getTime();
    userData.projects[projectID] = newProjectTemplate;
    saveUserData();
    $('#cancelChanges').hide();
    openProject(projectID);
}

function openProject(projectID) {
    stopListening();
    if(!userData.projects.hasOwnProperty(projectID))
        return false;
    var project = userData.projects[projectID];
    $('#projectID'  ).val(projectID);
    $('#projectName').val(project.name);
    $('#projectRow' ).val(project.row);
    $('#projectGoal').val(project.goal);
    $('#projectFreq').val(project.freq);
    $('#projectFreqStart').val(project.freqStart);
    $('#lastRow').data('value', project.prevRowTime).text(formatTimestamp(project.prevRowTime));
    if(project.freq) {
        $('#projectAdvSettings').show();
    } else {
        $('#projectAdvSettings').hide();
    }
    
    $("#initial, #project-run").hide();
    $('#project-settings').show();
}

function deleteProject(projectID) {
    if(!userData.projects.hasOwnProperty(projectID)) return false;
    var projectName = userData.projects[projectID].name;
    var doDelete = confirm("are you sure you want to delete the project "+ projectName + "?");
    if(!doDelete) return false;
    $("#projects tr").each(function() {
        if($(this).data("project") == projectID) {
            $(this).remove();
            return false;
        }
    });
    delete userData.projects[projectID];
    saveUserData();
}

function storeProjectSettings() {
    var projectID = parseInt($('#projectID').val());
    var projectSettings = {
        name        : $('#projectName').val(),
        row         : parseInt($('#projectRow' ).val()),
        goal        : parseInt($('#projectGoal').val()),
        freq        : parseInt($('#projectFreq').val()),
        freqStart   : parseInt($('#projectFreqStart').val()),
        prevRowTime : $('#lastRow').data('value'),
    }
    userData.projects[projectID] = projectSettings;
    saveUserData();
}

function runProject() {
    var projectID = parseInt($('#projectID'  ).val());
    if(!userData.projects.hasOwnProperty(projectID)) return false;
    var project   = userData.projects[projectID];
    $('#projectHeader').text(project.name);
    $('#rowCount').val(project.row);
    placeFreqPips(project.freq, (parseInt(project.row) - parseInt(project.freqStart)));
    $('#goalNum').text(project.goal);
    var percent = 0
    if(project.goal > 0)
        percent = Math.floor((project.row/project.goal)*100);
    $('#goalPercent').text(percent);
    setColors(percent);
    startListening(projectID);
    $('#initial, #project-settings').hide();
    $('#project-run'  ).show();
}

var keyIsDown = true;
function startListening(projectID) {
    $('#addRow').on("click", function() {
        increment(projectID);
    });
    $(document).on("keydown", function(e) {
        e.preventDefault();
        if((e.keyCode == userData.settings.key)&&!keyIsDown) {
            keyIsDown = true;
            increment(projectID);
        }
    });
    $(document).on("keyup", function(e) {
        if(e.keyCode == userData.settings.key) {
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

function increment(projectID) {
    if(!userData.projects.hasOwnProperty(projectID)) return false;
    var project = userData.projects[projectID];
    project.row += 1;
    project.prevRowTime = new Date().getTime();
    userData.projects[projectID] = project;
    saveUserData();
    $('#rowCount').val(project.row);
    $('#lastRow').data('value', project.prevRowTime).text(formatTimestamp(project.prevRowTime));
    placeFreqPips(project.freq, (parseInt(project.row) - parseInt(project.freqStart)));
    var percent = 0;
    if(project.goal > 0)
        percent = Math.floor((project.row/project.goal)*100);
    $('#goalPercent').text(percent);
    setColors(percent);
}

function placeFreqPips(freq, count) {
    freq  = parseInt(freq);
    count = parseInt(count);
    if(typeof freq == 'undefined' || !freq || freq <= 1) return;
    var currentPip = count % freq;
    var completeLoops = Math.floor(count/freq);
    var $element;
    $('#freqPips').html("");
    $('#freqPips').append($("<b></b>").text(completeLoops+'x +'));
    for (i = 0; i < freq; i++) { 
        $element = $('<span></span>');
        if(i <= currentPip) {
            $element.addClass('color-pip-done');
        } else {
            $element.addClass('color-pip');
        }
        $('#freqPips').append($element);
    }
}

function setColors(percent) {
    $('#rowCount').removeClass("percent0  percent10 percent20 percent30 percent40  percent50");
    $('#rowCount').removeClass("percent60 percent70 percent80 percent90 percent100 percentOver");
    if(percent < 10) {
        $('#rowCount').addClass("percent0");
    } else if(percent < 20) {
        $('#rowCount').addClass("percent10");
    } else if(percent < 30) {
        $('#rowCount').addClass("percent20");
    } else if(percent < 40) {
        $('#rowCount').addClass("percent30");
    } else if(percent < 50) {
        $('#rowCount').addClass("percent40");
    } else if(percent < 60) {
        $('#rowCount').addClass("percent50");
    } else if(percent < 70) {
        $('#rowCount').addClass("percent60");
    } else if(percent < 80) {
        $('#rowCount').addClass("percent70");
    } else if(percent < 90) {
        $('#rowCount').addClass("percent80");
    } else if(percent < 100) {
        $('#rowCount').addClass("percent90");
    } else if(percent == 100) {
        $('#rowCount').addClass("percent100");
    } else {
        $('#rowCount').addClass("percentOver");
    }
}