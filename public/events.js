document.onkeydown = function(activity) {
    if(activity.keyCode == 37){
        callServer('/left/down');
    }

    if(activity.keyCode == 39){
        callServer('/right/down');
    }

    if(activity.keyCode == 32){
        var bull = new Audio('fire.mp3');
        bull.play();
        callServer('/space/down');
    }
}

document.onkeyup = function(activity){
    if(activity.keyCode == 37){
        callServer('/left/up');
    }

    if(activity.keyCode == 39){
        callServer('/right/up');
    }

    if(activity.keyCode == 32){
        callServer('/space/up');
    }
}