const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 8080;
const { logger, authenticate } = require('./middleware')
const authRouter = require("./routers/auth")
const apiRouter = require("./routers/api")

const mysql = require('mysql')
const pool = require('./sql/connection')
const { handleSQLError } = require('./sql/error')

const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
require('dotenv').config()
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      /*
        Files will be saved in the 'uploads' directory. Make
        sure this directory already exists!
      */
      cb(null, './uploads');
    },
    filename: (req, file, cb) => {
      /*
        uuidv4() will generate a random ID that we'll use for the
        new filename. We use path.extname() to get
        the extension from the original file name and add that to the new
        generated ID. These combined will create the file name used
        to save the file on the server and will be available as
        req.file.pathname in the router handler.
      */
      const newFilename = `${uuidv4()}${path.extname(file.originalname)}`;
      cb(null, newFilename);
    },
  });
  // create the multer instance that will be used to upload/save the file
const upload = multer({ storage });

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Accept');
    next();
});

app.use(bodyParser.json());
app.use(logger);
app.use(bodyParser.urlencoded({extended: false}));

app.use("/auth",authRouter);
app.use("/api", apiRouter);

function getCookie(name, cookies) 
{
  var match = cookies.match(new RegExp('(^| )' + name + '=([^;]+)'));
  if (match) {
    return(match[2])
  }
  else{
      console.log('--could not find cookie---');
  }
}
const fs = require('fs');
app.delete("/deleteFile",authenticate, (req,res)=>{
  let ref = req.headers.img_ref;

  let sql = "DELETE FROM images WHERE ref = '"+ref+"'";

  pool.query(sql,(err,rows)=>{
    if(err){return console.log(err)}

    console.log(rows);
    fs.unlink('./uploads/'+ref, (err) => {
      if (err) {
          throw err;
      }
      console.log("File is deleted.");
      return res.send("fileDeleted")
  });
})


})
app.post('/uploadFile', upload.single('selectedFile'), (req, res) => {
/*
    We now have a new req.file object here. At this point the file has been saved
    and the req.file.filename value will be the name returned by the
    filename() function defined in the diskStorage configuration. Other form fields
    are available here in req.body.
*/
//save reference in database
let sql="INSERT INTO images (user_id, ref) VALUES ( ? , ? )"
let user_id = getCookie("user_id",req.headers.cookie)

console.log(req.file.filename +" "+ user_id);

sql = mysql.format(sql,[user_id,req.file.filename])

pool.query(sql,(err,rows)=>{
    if(err){return handleSQLError(err)}

    console.log(rows);
  
})
res.send();
});
app.post('/uploadProfilePic', upload.single('selectedFile'), (req, res) => {
  /*
      We now have a new req.file object here. At this point the file has been saved
      and the req.file.filename value will be the name returned by the
      filename() function defined in the diskStorage configuration. Other form fields
      are available here in req.body.
      
  */
  //save reference in database
  delayPicUpload(req)

  res.send();
  });
  const delay = ms => new Promise(res => setTimeout(res, ms));
  const delayPicUpload = async (req) => {
    await delay(1200);
    console.log("uploadProfilePic")
    let sql = "UPDATE user_profile SET profile_pic_ref = ? WHERE id = ?"
    let user_id = getCookie("user_id",req.headers.cookie)
    
    
    sql = mysql.format(sql,[req.file.filename,user_id])
    
    pool.query(sql,(err,rows)=>{
        if(err){return handleSQLError(err)}
    
        console.log(rows);
      
    })
  

  };


app.get("/dashboard",authenticate,(req,res)=>{
    app.use(express.static(__dirname+"/views/dashboard2.0/build/static"));            //required for css and js
    app.use(express.static('./views/dashboard2.0/build', express.static('static')));  //required for images and fonts
    res.sendFile(__dirname + "/views/dashboard2.0/build/index.html");   
})

app.get("/dashboard/*",authenticate,(req,res)=>{
    app.use(express.static(__dirname+"/views/dashboard2.0/build/static"));            //required for css and js
    app.use(express.static('./views/dashboard2.0/build', express.static('static')));  //required for images and fonts
    res.sendFile(__dirname + "/views/dashboard2.0/build/index.html");   
})

app.get("/",(req,res)=>{
    app.use(express.static(__dirname+"/views/landing/build/static"));            //required for css and js
    app.use(express.static('./views/landing/build', express.static('static')));  //required for images and fonts
    res.sendFile(__dirname + "/views/landing/build/index.html");   
})

app.listen(port, function(){
    console.log("listening on "+port);
})