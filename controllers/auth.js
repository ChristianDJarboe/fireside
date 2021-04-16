const mysql = require('mysql')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const pool = require('../sql/connection')
const { handleSQLError } = require('../sql/error')


// for bcrypt
const saltRounds = 10
function insertuserCredentials(user_id,email,password,res){
  // console.log("insert credentials")
  let insertCredentials = "INSERT INTO usersCredentials (user_ID, password, email ) VALUES (?, ?, ?)"
  //insert into usersCredentials table
  bcrypt.hash(password, saltRounds, function(err, hash) {
    insertCredentials = mysql.format(insertCredentials, [user_id, hash, email  ])
  
    pool.query(insertCredentials, (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') return res.status(409).send('email is taken')
      }
      // console.log("credentials created")
      // console.log(insertCredentials);
    })
  })
}
function createAccountBio (user_id,bio,location,job,school,sin_weed,sin_alch,sin_nicc){
  let sql="INSERT INTO user_profile (user_id,bio,location,job,school,sin_weed,sin_alch,sin_nicc) VALUES (?,?,?,?,?,?,?,?)"
  sql = mysql.format(sql,[user_id,bio,location,job,school,sin_weed,sin_alch,sin_nicc])
  pool.query(sql,(err,rows)=>{
    if(err){return handleSQLError(err,rows)}
    // console.log("succesfully inserted user_profile row for user"+user_id)
  })
}

const signup = (req, res) => {
  // console.log(req.body);
  const { proper_name, username, password,age, bio,location,job,school,sin_weed,sin_alch,sin_nicc} = req.body
  let insertUser = "INSERT INTO users (account_name,proper_name,age) VALUES(?,?,?)"
  //insert into users table
  insertUser =mysql.format(insertUser,[username,proper_name,age])
  pool.query(insertUser, (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') return res.status(409).send('handle is taken')
      res.send({msg:"could not create user. oopsies",code:err.code})
      return console.log(err.code);
    }

    console.log(result);
    // console.log("new insert ID"+ result.insertId);
    insertuserCredentials(result.insertId,username,password,res);
    createAccountBio(result.insertId,bio,location,job,school,sin_weed,sin_alch,sin_nicc)
    return res.send({msg:"user created",insertId:result.insertId});
  })
}

const login = (req, res) => {
  const { username, password } = req.body
  let sql = "SELECT users.*, usersCredentials.* FROM users LEFT JOIN usersCredentials on usersCredentials.user_ID = users.id WHERE email = ?"
  sql = mysql.format(sql, [ username ])
  pool.query(sql, (err, rows) => {
    if (err) return handleSQLError(res, err)
    if (!rows.length) return res.status(404).send('No matching email')

    const hash = rows[0].password
    bcrypt.compare(password, hash)
      .then(result => {
        if (!result) return res.status(400).send('Invalid password')
        const data = { ...rows[0] }
        const user_id = data.user_ID
        data.password = 'REDACTED'
        const token = jwt.sign(data, process.env.BCRYPT_SECRET)
        res.json({
          msg: 'Login successful',
          token:token,
          user_id:user_id,
          google_key:process.env.GOOGLE_API_KEY
        })
      })
  })
}


module.exports = {
  signup,
  login
}