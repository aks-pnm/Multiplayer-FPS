const maxHeight = 550;
const maxWidth = 700;
const xoffset = 25;
const yoffset = 50;

var bbullet = new Image();
bbullet.src = "Bbullet1.jpg";

var rbullet= new Image();
rbullet.src="Rbullet.jpg";

var bluet = new Image();
bluet.src = "Btank.jpg";

var redt= new Image();
redt.src="Rtank.jpg";

function getRequest(req) {
 return $.ajax({
      url: '/' + req,
      type: 'GET',
    });
}

function initializeCanvas(){
    getRequest('getUserInfo').done(putName);
}

function putName(response) {
    var canv = document.getElementById("canv").getContext("2d");
    var connection = io();

    connection.on('update',function(serv) {
    for (var i in serv.players) {
      if(serv.players[i].id == response.username) {
        $('#name').html("<font color=\"white\">Name: "+ response.username + "</font>");
        $('#score').html("<font color=\"white\">Score: "+ serv.players[i].score + "</font>");
        $('#health').html("<font color=\"white\">Health: "+ serv.players[i].health + "</font>");
        $('#bulletCount').html("<font color=\"white\">Bullets: "+ serv.players[i].bulletCount + "</font>");
        if (serv.players[i].health == 0) {
          window.location = '/';
        }
      }
    }
    canv.clearRect(0,0,maxWidth,maxHeight);
    for(var i in serv.bullets) {
        var bullet = serv.bullets[i];

        if(bullet.team == 0) {
          canv.drawImage(rbullet, bullet.x + xoffset, bullet.y);
        }else{
          canv.drawImage(bbullet, bullet.x + xoffset, bullet.y + yoffset);
        }
      }
      for (var i in serv.players) {
        var player = serv.players[i];
        if(player.team == 0) {
           canv.drawImage(redt,player.x, player.y);
        } else{
           canv.drawImage(bluet,player.x, player.y);
        }
      }
    });
}

window.onbeforeunload = function () {
    callServer('/disconnect');
};

function callServer(url){
     $.ajax({
      url: url,
      type: 'PUT',
      dataType: "json",
      contentType: 'application/json',
      data: {},
      success: function(response) {
      }
    });

}
