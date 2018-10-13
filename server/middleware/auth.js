const models = require('../models');
const Promise = require('bluebird');

/*
TEST
add BillZito into users with id 1
(get id 1)

FIRST CALL, request (no cookie, no nothing), empty response
  -> expecting req to have .session.hash
  update the session in db with the userId where for the user the test just inserted
    

*/


var createNewSession = (req, res, next) => {

  models.Sessions.create()
    .then((sqlRes) => {
      return models.Sessions.get({id: sqlRes.insertId});
    })
    .then((newSesh) => {
      req.session = newSesh;
      res.cookie('shortlyid', newSesh.hash);
    })
    .then(() => {
      if (req.body.username) {
        return models.Users.get({username: req.body.username});
      } else {
        next();
      }
    })
    .then((user) => {
      req.session.user = user;
      return models.Sessions.update({id: req.session.id}, {userId: user.id});
    })
    .then(() => next())
    .catch((err) => {
      if (!(err instanceof TypeError)) {
        console.log(err);
      }  
    });
};

var reinstantiateSession = (req, res, next) => {
  
  models.Sessions.get({hash: req.cookies.shortlyid})
    .then(session => {
      if (session) {
        req.session = session;
        next();
      } else {
        createNewSession(req, res, next);
      }
    }); 
};

/*
if cookie
  if session associated with cookie has id
    add that id/name to session object
  else 
    just add the session object to req

does the req have a session obj && that session obj has a username and id?
if not, no access
if yes, acccess
*/

module.exports.createSession = (req, res, next) => {
  
  if (req.cookies.shortlyid) {
    reinstantiateSession(req, res, next);
  } else {
    createNewSession(req, res, next);
  }
};


/*
When does a session object get created?
  - request with cookies comes in
      * look up user data related to that session and creates the session object
      * add to session object relevant user information
  - request with no cookies comes in because new account was created
  - request with no cookies comes in because user logged in

What is the purpose of adding a session object to the request object?
  - verify session should check that there is a session object on the req (with hash)
  - if the session has a user id on it, then 
  

What information about a do we want to keep in the session object? 
  - Username? (that's already in the req...)
  - id? 

What do we do with a session object?
  - verify the session
  - 

*/

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

var addCookie = function(req, res, next) {
  
};


// that accesses the 
// parsed cookies on the request, 
// looks up the user data related to that session, 
// and assigns an object to a session property 
// on the request that contains relevant user information.