const models = require('../models');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {
  if (Object.keys(req.cookies).length > 0) {
    // if (req.cookies['shortlyid']) {
      
    // }
  } else {
    models.Sessions.create()
      .then((sqlRes) => {
        // models.Sessions.update({id: sqlRes.insertId}, {userId: 10});
        // req.session = session;
        // console.log(sqlRes);
        return models.Sessions.get({id: sqlRes.insertId});
      })
      .then((newSesh) => {
        // console.log(newSesh);
        req.session = newSesh;
        //console.log(req.session.hash);
      })
      .then(() => next())
      .catch((err) => console.log(err));
  }
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

// that accesses the 
// parsed cookies on the request, 
// looks up the user data related to that session, 
// and assigns an object to a session property 
// on the request that contains relevant user information.