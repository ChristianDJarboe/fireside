
const jwt = require('jsonwebtoken')



const logger = (req, res, next) => {
  console.log(`${req.path} ${new Date().toISOString()}`)
  next()
}

const authenticate = (req, res, next) => {
  var token = getCookie(req.headers['cookie'],"token")
  if(token !="badboi"){
    for(let i=0;i<token.length;i++){
      if(token.charAt(i)=='='){
        token = token.substring(i+1);
        //console.log(token);
  
      }
    }
    try {
      const decoded = jwt.verify(token, process.env.BCRYPT_SECRET)
      //console.log(decoded);
      req.user = decoded
      next()
    } catch(err) {
      res.sendStatus(401)
    }
  }else{
    res.sendStatus(403)
  }
  
}


function getCookie(cookies,name) 
    {
      if(cookies != undefined){
        var match = cookies.match(new RegExp('(^| )' + name + '=([^;]+)'));
        if (match) {
          return(match[2])
        }
        else{
             console.log('--something went wrong---');
        }
      }else{
        return "badboi";
      }
   
   }

module.exports = {
  logger,
  authenticate
}
