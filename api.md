/**
* @api{get} 
* {uri} / 
* {desc} Redirects to Game or Login page based on User authentication
*/

 

/**
 * @api {get} 
 * {uri} /spectator
 * {desc} Redirects to spectator mode
 * @apiName spectator
 * @apiGroup Spectator Management
 *
 *
 * @apiSuccess Redirects to spectator mode
 */


/**
 * @api {get} 
 * {url}/getUserInfo 
 * {desc} Provides current user information
 * @apiName GetUserInfo
 * @apiGroup Identity Management
 *
 *
 * @apiSuccess {String} Provides current user's Username
 */


/**
 * @api {get}
 * {url} /game
 * {desc}    Redirects to game page after successful authentication
 * @apiName Game
 * @apiGroup Game management
 *
 *
 * @apiSuccess redirects to game
 */


/**
 * @api {put} 
 * {url} /left/:id 
 * {desc} Move the tank left
 *
 * @apiName MoveLeft
 * @apiGroup Movement
 *
 * @apiParam {String} up or down.
 *
 * @apiSuccess Moves the player left
 */


/**
 * @api {put} 
 * {url} /right/:id 
 * {desc} Move the tank right
 * @apiName MoveRight
 * @apiGroup Movement
 *
 * @apiParam {String} up or down.
 *
 * @apiSuccess Moves the player right
 */


/**
 * @api {put} 
 * {url} /space/:id
 * {desc} Shoot the bullets
 *
 * @apiName Spacedown
 * @apiGroup Shooting
 *
 * @apiParam {String} up or down.
 *
 * @apiSuccess Shoots bullets from the tank
 */


/**
 * @api {put} 
 * {url} /disconnect 
 * {desc} Disconnect from the game
 * @apiName Disconnect
 * @apiGroup Identity Management
 *
 * @apiParam {String} Current User.
 *
 * @apiSuccess- Disconnects the user from the game
 */

/**
 * @api {get} 
 * {url} /logout 
 * {desc} logouts the user from the game
 * @apiName logout
 * @apiGroup Identity Management
 *
 *
 * @apiParam {String} 
 *
 * @apiSuccess redirects to sign in page.
 *
 */


/**
 * @api {post} 
 * {url} /login 
 * {desc} login to game
 *
 * @apiName login
 * @apiGroup Identity Management
 *
 * @apiParam {String} username
 * @apiParam {String} password
 * @apiParam {Boolean} Team A or B
 *
 * @apiSuccess {String} Creates a game player and redirects to game page based on the authentication
 */

/**
 * @api {get} 
 * {url} /topscore 
 * {desc} Gets the best scores
 * @apiName topscore
 * @apiGroup Game statistics
 *
 * @apiParam 
 *
 * @apiSuccess {array} returns the top scores
 */


/**
 * @api {get} 
 * {url} /signup
 * {desc} redirects to signup page
 * @apiName Signup
 * @apiGroup Identity Management
 *
 * @apiSuccess - redirects to Sign up page
 */


/**
 * @api {post} 
 * {url} /signup 
 * {desc} Used to signup for the game
 * @apiName Signup
 * @apiGroup Identity Management
 *
 * @apiParam {String} Username
 * @apiParam {String} Password
 * @apiParam {String} Personname
 *
 * @apiSuccess New registration is created, user credentials are stored and redirected to login page
 */

