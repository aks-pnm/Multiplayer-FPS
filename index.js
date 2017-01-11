var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var UserInformation = require('./models/user');


var mongoose = require('mongoose');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.cookieParser('Game Authentication'));
app.use(express.session());

var dbName = '5117umn';
mongoose.Promise = global.Promise;
var connectionString = 'mongodb://gaurav:gaurav@ds053080.mlab.com:53080/' + dbName;
mongoose.connect(connectionString);

var port = process.env.PORT || 3000;

app.set('view engine', 'ejs')
app.use(express.static('public'))
var server = app.listen(port);

console.log("Server started.");

/**
*@api{get} / Redirects to Game or Login page based on User authentication
*/

app.get('/', function (req, res) {
  if (req.session.user) {
      res.redirect('/game');
  } else {
      res.sendfile(__dirname + '/public/login.html')
  }
});

/**
 * @api {get} /spectator Redirects to spectator mode
 * @apiName spectator
 * @apiGroup Spectator Management
 *
 *
 * @apiSuccess Redirects to spectator mode
 */

app.get('/spectator', function (req, res) {
  res.render('spectator');
});

/**
 * @api {get} /getUserInfo Provides current user information
 * @apiName GetUserInfo
 * @apiGroup Identity Management
 *
 *
 * @apiSuccess {String} Provides current user's Username
 */

app.get('/getUserInfo', function (req, res) {
  res.send({username:req.session.user});
});

/**
 * @api {get} /game Redirects to game page after successful authentication
 * @apiName Game
 * @apiGroup Game management
 *
 *
 * @apiSuccess redirects to game
 */


app.get('/game', function(req, res) {
  if (req.session && req.session.user) {
    res.render('home',{user:req.session.user})
  } else {
    res.redirect('/')
  }
});

/**
 * @api {put} /left/:id Move the tank left
 * @apiName MoveLeft
 * @apiGroup Movement
 *
 * @apiParam {String} up or down.
 *
 * @apiSuccess Moves the player left
 */

app.put('/left/:id', function(req, res) {
  var playerId = req.session.user;
  if (req.params.id == 'down') {
    players[playerId].left = true;
  } else {
    players[playerId].left = false;
  }
  res.send('success');
});

/**
 * @api {put} /right/:id Move the tank right
 * @apiName MoveRight
 * @apiGroup Movement
 *
 * @apiParam {String} up or down.
 *
 * @apiSuccess Moves the player right
 */

app.put('/right/:id', function(req, res) {
  var playerId = req.session.user;
  if (req.params.id == 'down') {
    players[playerId].right = true;
  } else {
    players[playerId].right = false;
  }
  res.send('success');
});

/**
 * @api {put} /space/:id Shoot the bullets
 * @apiName Spacedown
 * @apiGroup Shooting
 *
 * @apiParam {String} up or down.
 *
 * @apiSuccess Shoots bullets from the tank
 */

app.put('/space/:id', function(req, res) {
  var playerId = req.session.user;
  if (req.params.id == 'down') {
    players[playerId].fireBullet = true;
  } else {
    players[playerId].fireBullet = false;
  }
  res.send('success');
});

function removePlayer(playerId) {
  updateScore(playerId, players[playerId].player.score);
}

/**
 * @api {put} /disconnect Disconnect from the game
 * @apiName Disconnect
 * @apiGroup Identity Management
 *
 * @apiParam {String} Current User.
 *
 * @apiSuccess- Disconnects the user from the game
 */

app.put('/disconnect', function(req, res) {
  if (req.session && req.session.user) {
    removePlayer(req.session.user);
    req.session.destroy(function() {
    });
  }
  res.send('success');
  });

/**
 * @api {get} /logout logouts the user from the game
 * @apiName logout
 * @apiGroup Identity Management
 *
 *
 * @apiParam {String} 
 *
 * @apiSuccess redirects to sign in page.
 *
 */

app.get('/logout', function (req, res) {
  if (req.session && req.session.user) {
    removePlayer(req.session.user);
    req.session.destroy(function () {
      res.redirect('/');
    });
  } else {
    res.redirect('/');
  }
});

/**
 * @api {post} /login 
 * @apiName login
 * @apiGroup Identity Management
 *
 * @apiParam {String} username
 * @apiParam {String} password
 * @apiParam {Boolean} Team A or B
 *
 * @apiSuccess {String} Creates a game player and redirects to game page based on the authentication
 */

app.post('/login', function (req, res) {
 var userName = req.body.username;
 var teamName = req.body.team;
 UserInformation.findOne({username:userName},function(err, results) {
   if (err) {
    return res.send(err);
  }
  if(results && results.password==req.body.password) {
    req.session.user = userName;
      req.session.team = teamName;
      createPlayer(userName, teamName);
      res.send({redirect: '/game'});
    } else {
      res.send({redirect: '/',errormessage:'Invalid username or password'});
    }
  });
});

/**
 * @api {get} /topscore Gets the best scores
 * @apiName topscore
 * @apiGroup Game statistics
 *
 * @apiParam 
 *
 * @apiSuccess {array} returns the top scores
 */

app.get('/topscore', function (req, res) {
 UserInformation.find({}, {personname:1,score:1,_id:0},{sort: {score: -1}, limit: 10}, function(err, results){
    if (err) {
       res.send({redirect: '/'});
     }
      if(results) {
        res.send(results);
      }
   });
});

/**
 * @api {get} /signup
 * @apiName Signup
 * @apiGroup Identity Management
 *
 * @apiSuccess - redirects to Sign up page
 */

app.get('/signup', function (req, res) {
  res.sendfile(__dirname + '/public/signup.html')
});

/**
 * @api {post} /signup Used to signup for the game
 * @apiName Signup
 * @apiGroup Identity Management
 *
 * @apiParam {String} Username
 * @apiParam {String} Password
 * @apiParam {String} Personname
 *
 * @apiSuccess New registration is created, user credentials are stored and redirected to login page
 */

app.post('/signup', function (req, res) {
    if((req.body.username && req.body.username.trim()) && (req.body.password && req.body.password.trim()) && (req.body.personName && req.body.personName.trim())) {
        //console.log("Inside signup");
   var objectUser = {"username":req.body.username,"password":req.body.password,"personname":req.body.personName,"score":"0"};
   var result = new UserInformation(objectUser);
   UserInformation.findOne({username:req.body.username},function(err, results) {
     if (err) {
       return res.send(err);
     }
     if(results) {
       res.send({redirect: '/signup',errormessage:'Username already exists!!'});
     } else {
       result.save(function(err) {
        if (err)
        {
          return res.send(err);
        }
        res.send({redirect: '/'});
      });
    }
  });
    } else {
        res.send({redirect: '/signup',errormessage:'Invalid username or password'});
    }
});

emitPacket = {players:[], bullets:[]};

players = {};
bullets = [];

const maxHeight = 500;
const maxWidth = 650;
const blastRadius = 50;
const refreshRate = 25;
const reloadTime = 15;
const maxBullet = 100;
const maxHealth = 100;
const speed = 2;

function getY(team) {
  if (team == 0) { // 0 - terrorist
    return maxHeight;
  } else { // 1 - counter-terrorist
    return 0;
  }
}

function updateScore(playerId, scores) {
  UserInformation.update({username:playerId}, {$inc: {score:scores}}, function(err, results) {
    if (err) {
      //console.log(err);
    } else {
      for (var i = 0; i < bullets.length; i++) {
      var bullet = bullets[i].bullet;
        if (bullet.playerId == playerId) {
            bullet.isDeleted = true;
        }
      }
      clearBullets();
      delete players[playerId];
    }
  });
}

function sendPacket() {
  for (var i in players) {
    players[i].ticks++;
    if ((players[i].ticks > ((1000/refreshRate) * reloadTime)) && players[i].reload) {
      players[i].player.bulletCount = maxBullet;
      players[i].reload = false;
    }
    var player = players[i].player;
    emitPacket.players.push(player);
  }
  for (var i in bullets) {
    var bullet = bullets[i].bullet
    emitPacket.bullets.push(bullet);
  }
}

function clearPacket() {
  emitPacket.players = [];
  emitPacket.bullets = [];
}

function player(id, team, x) {
  this.id = id;
  this.team = team;
  this.x = x;
  this.y = getY(team);
  this.health = maxHealth;
  this.score = 0;
  this.bulletCount = maxBullet;
}

function playerDetail(id, team) {
  var playerLocation = (Math.random() * maxWidth);
  this.player = new player(id, team, playerLocation);
  this.left = false;
  this.right = false;
  this.fireBullet = false;
  this.ticks = 0;
  this.reload = false;
}

function bullet(id, playerId, x) {
  this.id = id;
  this.playerId = playerId;
  this.x = x;
  this.y = getY(players[playerId].player.team);
  this.team = players[playerId].player.team;
}

function bulletDetail(id, playerId, x) {
  this.bullet = new bullet(id, playerId, x);
  this.isDeleted = false;
}

function showPlayers() {
  for (var i in players) {
		var player = players[i].player;
    console.log(player.id + ' ' + player.team + ' ' + player.x + ' ' + player.y);
  }
}

function showBullets() {
  for (var i in bullets) {
    var bullet = bullets[i].bullet;
    console.log(bullet.id + ' ' + bullet.playerId + ' ' + bullet.x + ' ' + bullet.y);
  }
}

function createPlayer(id, team) {
  newPlayer = new playerDetail(id, team);
  players[newPlayer.player.id] = newPlayer;
  //showPlayers();
}

function createBullet(playerId, x) {
  var bulletId = Math.random();
  newBullet = new bulletDetail(bulletId, playerId, x);
  bullets.push(newBullet);
  //showBullets();
}

bulletsInRangeIndexTeam0 = [];
bulletsInRangeIndexTeam1 = [];

function moveBullets() {
  for (var i = 0; i < bullets.length; i++) {
    var bullet = bullets[i].bullet;
    if (players[bullet.playerId]) {
      if (players[bullet.playerId].player.team == 0) {
        if (bullet.y < blastRadius) {
          bulletsInRangeIndexTeam1.push(i);
        }
        if (bullet.y > 0) {
          bullet.y = bullet.y - speed;
        } else {
          bullets[i].isDeleted = true;
        }
      } else {
        if (bullet.y > (maxHeight - blastRadius)) {
          bulletsInRangeIndexTeam0.push(i);
        }
        if (bullet.y < maxHeight) {
          bullet.y = bullet.y + speed;
        } else {
          bullets[i].isDeleted = true;
        }
      }
    } else {
      bullets.splice(i, 1);
    }
  }
}

function checkIfBulletHitUtil(bullet, playerDetails) {
  var dist = Math.sqrt(Math.pow(playerDetails.player.x - bullet.x, 2) + Math.pow(playerDetails.player.y - bullet.y, 2));
  if (dist < blastRadius) {
    var health = playerDetails.player.health;
    if (health > 0) {
      playerDetails.player.health--;
    }
    players[bullet.playerId].player.score++;
    return true;
  } else {
    return false;
  }
}

function checkIfBulletHit(playerDetails) {
  if(playerDetails.player.team == 0) {
    for (var i = 0; i < bulletsInRangeIndexTeam0.length; i++) {
      if (checkIfBulletHitUtil(bullets[i].bullet, playerDetails)) {
        bullets[i].isDeleted = true;
      }
    }
  } else {
    for (var i = 0; i < bulletsInRangeIndexTeam1.length; i++) {
      if (checkIfBulletHitUtil(bullets[i].bullet, playerDetails)) {
        bullets[i].isDeleted = true;
      }
    }
  }
}

function clearBullets() {
  for (var i in bullets) {
    if (bullets[i].isDeleted == true) {
      bullets.splice(i,1);
    }
  }
  bulletsInRangeIndexTeam0 = [];
  bulletsInRangeIndexTeam1 = [];
}

function movePlayersCreateBullets() {
  for (var i in players) {
    var playerD = players[i];
    checkIfBulletHit(playerD);
    if (playerD.left == true) {
      var x = playerD.player.x;
      if (x > 0) {
        playerD.player.x = playerD.player.x - speed;
      }
    }
    if (playerD.right == true) {
      var x = playerD.player.x;
      if (x < maxWidth) {
        playerD.player.x = playerD.player.x + speed;
      }
    }
    if (playerD.fireBullet == true) {
      if (playerD.player.bulletCount > 0) {
        playerD.player.bulletCount--;
        createBullet(i, playerD.player.x);
      } else {
        if (!playerD.reload) {
          playerD.ticks = 0;
          playerD.reload = true;
        }
      }
    }
  }
}

var io = require('socket.io').listen(server);
io.sockets.on('connection', function (socket) {
  //console.log("A new connection arrived");
	socket.broadcast.emit('message', "Connected");

  socket.on('disconnect',function() {
		socket.broadcast.emit('message', "Disconnected");
	});

  setInterval(function() {
    moveBullets();
    movePlayersCreateBullets();
    clearBullets();
    sendPacket();
    socket.broadcast.emit('update', emitPacket);
    clearPacket();
  }, refreshRate);
});
