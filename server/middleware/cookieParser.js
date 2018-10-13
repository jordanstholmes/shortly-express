const parseCookies = (req, res, next) => {
  var cookies = req.get('Cookie');
  if (!cookies) {
    req.cookies = {};
  } else {
    req.cookies = cookies.split('; ').reduce((acc, cookie) => {
      cookie = cookie.split('=');
      acc[cookie[0]] = cookie[1];
      return acc;
    }, {});
  }  
  next();
};

module.exports = parseCookies;