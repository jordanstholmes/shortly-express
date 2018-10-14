const models = require('../models');
const Promise = require('bluebird');
const cookieParser = require('./cookieParser.js');

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
      /*
      NOTE: it appears that if a user is signing up, and we run auth on the request,
      the Users.get below times out because cannot get a property of undefined (user.id)
      */
      req.session.user = user;
      return models.Sessions.update({id: req.session.id}, {userId: user.id});
    })
    .then((sessionUpdateInfo) => {
      next();
    })
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

module.exports.createSession = (req, res, next) => {
  cookieParser(req, res, () => {
    if (req.cookies.shortlyid) {
      reinstantiateSession(req, res, next);
    } else {
      createNewSession(req, res, next);
    }
  });  
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

