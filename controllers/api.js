const mysql = require('mysql')
const { param } = require('../routers/api')
const pool = require('../sql/connection')
const { handleSQLError } = require('../sql/error')
var path = require('path');
var geocoder = require('geocoder');


const userByUsername = (req,res)=>{
  let account_name = req.headers.account_name+"%";
  let sql = "SELECT user_profile.*, users.* FROM users LEFT JOIN user_profile ON users.id = user_profile.user_id WHERE account_name LIKE ?";
  sql = mysql.format(sql,[account_name])
  pool.query(sql,(err,rows)=>{
    if(err){return console.log(err)}
    console.log("get user_profile for user: "+account_name)
    if(rows.length>0){
      //for each row, find all media objects
      let mediaObjects = []
      for(let i=0;i<rows.length;i++){
        let item = rows[i]
        let sql2 = "SELECT * FROM images WHERE user_id = "+item.user_id
        pool.query(sql2,(err2,rows2)=>{
          if(err){return console.log(err)}
          let x = rows2;
          mediaObjects.push(x);
          if(i==rows.length-1){
            let data ={
              profiles:rows,
              media:mediaObjects
            }
            return res.send(data);
          }
        })
      }
    }else{
      console.log("EC.1 No user_profile found for user:"+account_name)
      return res.send("EC.1");
    }
  })
}

const userByid = (req,res)=>{
  let id = req.headers.user_id;
  let sql = "SELECT user_profile.*, users.* FROM users LEFT JOIN user_profile ON users.id = user_profile.user_id WHERE user_id = "+id;
  pool.query(sql,(err,rows)=>{
    if(err){return console.log(err)}
    console.log("get user_profile for user: "+id)
    if(rows.length>0){
      return res.send(rows[0]);
    }else{
      console.log("EC.1 No user_profile found for user:"+id)
      return res.send("EC.1");
    }
  })
}

const friendRequest = (req,res)=>{
  let requester_id = req.body.requester_id;
  let requestee_id = req.body.requestee_id;
  let sql = "INSERT INTO friend_requests (requester, requestee) VALUES (?,?)"
  sql = mysql.format(sql,[requester_id,requestee_id])
  pool.query(sql,(err,rows)=>{
    if(err){return console.log(err)}
    return res.send(rows);
  })
}

const acceptFriendRequest = (req,res)=>{
  let user_1_id = req.body.user_1_id;
  let user_2_id = req.body.user_2_id;
  let sql = "INSERT INTO friends (user_1_id, user_2_id) VALUES (?,?)"
  sql = mysql.format(sql,[user_1_id,user_2_id])
  pool.query(sql,(err,rows)=>{
    if(err){return console.log(err)}
    let sql = "DELETE FROM friend_requests WHERE requester = ? AND requestee = ?"
    sql = mysql.format(sql,[user_1_id,user_2_id]);
    pool.query(sql,(err,rows)=>{
      if(err){return console.log(err)}
    })
    return res.send("success");
  })
}

const denyFriendRequest = (req,res)=>{
  let requester = req.headers.requester
  let requestee = req.headers.requestee
  let sql = "DELETE FROM friend_requests WHERE requester = ? AND requestee = ?"
  sql = mysql.format(sql,[requester,requestee]);
  pool.query(sql,(err,rows)=>{
    if(err){return console.log(err)}
    return res.send(rows);
  })
}

const getFriends = (req,res)=>{
  let id = req.headers.user_id
  let sql = "SELECT * FROM friends WHERE user_1_id = ? OR user_2_id = ?"
  sql = mysql.format(sql,[id,id])
  pool.query(sql,(err,rows)=>{
    if(err){return console.log(err)}
    if(rows.length>0){
      let data = {
        users_data:rows,
        friends_data:[]
      }
      rows.map((item,index)=>{
        let id2;
        if(item.user_1_id == id){
         id2= item.user_2_id;
        }else if (item.user_2_id == id){
          id2= item.user_1_id;
        }
        let sql2 = "SELECT users.*, user_profile.profile_pic_ref FROM users JOIN user_profile ON user_profile.user_id = users.id WHERE users.id = "+id2
        pool.query(sql2,(err,rows2)=>{
          if(err){return console.log(err)}
          data.friends_data.push(rows2[0])
          if(index == rows.length-1){
            return res.send(data);
          }
        })
      })
    }else{
      return res.send("ec2");
    }
  })
}

const getIncomingFriendRequests = (req,res)=>{
  let id = req.headers.user_id
  let sql = "SELECT friend_requests.*, users.*, user_profile.profile_pic_ref FROM friend_requests LEFT JOIN users ON users.id = friend_requests.requester LEFT JOIN user_profile ON user_profile.user_id = friend_requests.requester  WHERE requestee = ?"
  sql = mysql.format(sql,[id,id])
  pool.query(sql,(err,rows)=>{
    if(err){return console.log(err)}
    return res.send(rows);
  })
}

const thread = (req,res)=>{
  let thread_id = req.headers.thread_id
  let sql = "SELECT * FROM messages WHERE thread_id = "+thread_id+" ORDER BY insert_date ASC LIMIT 100";
  pool.query(sql,(err,rows)=>{
    if(err){return console.log(err)}
    return res.send(rows);
  })
}

const newMessage = (req,res)=>{
  const { sender_id, thread_id, message} = req.body
    let sql ="INSERT INTO messages (sender_id, thread_id, message) VALUES ( ?, ?, ?)"
    sql = mysql.format(sql,[sender_id, thread_id, message])
    pool.query(sql,(err,rows)=>{
      if(err){return console.log(err)}
      return res.send("msg sent")
    })
}

const deleteMessage = (req,res)=>{
  return res.send("deleteMessage")
}

const getMyFiresides = (req,res)=>{
  let id = req.headers.user_id
  let sql = "SELECT * FROM firesides WHERE user_id = "+id
  pool.query(sql,(err,rows)=>{
    if(err){return console.log(err)}
    if(rows.length !=0){
      let sql2="SELECT attendance.*, users.* FROM attendance LEFT JOIN users ON users.id = attendance.user_id WHERE fireside_id = "+rows[0].id
      pool.query(sql2,(err2,rows2)=>{
        if(err2){return console.log(err2)}
        let sql3 = "SELECT invite_requests.*, users.*  FROM invite_requests LEFT JOIN users ON users.id = invite_requests.user_id WHERE fireside_id = "+rows[0].id
        pool.query(sql3,(err3,rows3)=>{
          if(err3){return console.log(err3)}
          let sql4 = "SELECT invites.*, users.*  FROM invites LEFT JOIN users ON users.id = invites.user_id  WHERE fireside_id = "+rows[0].id
          pool.query(sql4,(err4,rows4)=>{
            if(err4){return console.log(err4)}
            let sql5 = "SELECT * FROM fireside_images WHERE fireside_id = "+rows[0].id
            pool.query(sql5,(err5,rows5)=>{
              if(err5){return console.log(err5)}
              let data ={
                fireside:rows[0],
                attendance:rows2,
                invite_requests:rows3,
                invites:rows4,
                media:rows5
              }
              return res.send(data);
            })
          })
        })
      })
    }else{
      return res.send("ec3")
    }
  })
}

const createNewFireside = (req,res)=>{
  const {user_id,vibe,location_address,allow_friends, allow_public} = req.body;
  geocoder.geocode(location_address, function(err,data){
    if(err){
      console.log(err)
      return res.json(
        {code:"1",
        message:"Could not geocode address "+ location_address}
      )
    }else{
      let lat = data.results[0].geometry.location.lat
      let lng = data.results[0].geometry.location.lng
      let sql = "INSERT INTO firesides (user_id,vibe,location_address, lat,lng ,allow_friends, allow_public) VALUES (?,?,?,?,?,?,?)"
      sql = mysql.format(sql,[user_id,vibe,location_address,lat,lng ,allow_friends, allow_public]);
      pool.query(sql,(err,rows)=>{
        if(err){return console.log(err)}
        return res.send("fireside created")
      })
    }
  },
  {key:process.env.GOOGLE_API_KEY})
}

const deleteFireside = (req,res)=>{
  let id=req.headers.fireside_id;
  let sql = "DELETE FROM firesides WHERE firesides.id = ?"
  sql = mysql.format(sql,[id]);
  pool.query(sql,(err,rows)=>{
    if(err){return console.log(err)}
    res.send("fireside deleted")
  })
}

const updateFireside = (req,res)=>{
  console.log(req.body);
  const {fireside_id,vibe,location_address, oldAddress,allow_friends, allow_public} = req.body;
  if(location_address != oldAddress){ //if location changes we have to geocode the new address
    geocoder.geocode(location_address, function(err,data){
      if(err){
        console.log(err)
        return res.json(
          {code:"1",
          message:"Could not geocode address "+ location_address}
        )
      }else{
        let lat = data.results[0].geometry.location.lat
        let lng = data.results[0].geometry.location.lng
        let sql = "UPDATE firesides SET vibe = ? , location_address = ? , lat = ? , lng =? , allow_friends = ? , allow_public = ? WHERE id = ?"
        sql = mysql.format(sql,[vibe,location_address,lat,lng,allow_friends, allow_public, fireside_id])
        pool.query(sql,(err,rows)=>{
          if(err){return handleSQLError(res,err)}
          res.send(rows);
        })
      }
    },
    {key:process.env.GOOGLE_API_KEY})
  }else{
    let sql = "UPDATE firesides SET vibe = ? , allow_friends = ? , allow_public = ? WHERE id = ?"
    sql = mysql.format(sql,[vibe, allow_friends, allow_public, fireside_id])
    pool.query(sql,(err,rows)=>{
      if(err){return handleSQLError(res,err)}
      res.send(rows);
    })
  }
}

const inviteToFireside =(req,res)=>{
  const {user_id,fireside_id} = req.body;
  let sql = "INSERT INTO invites (user_id,fireside_id) VALUES (?,?)"
  sql = mysql.format(sql,[user_id,fireside_id]);
  pool.query(sql,(err,rows)=>{
    if(err){return console.log(err)}
    res.send("user invited to fireside")
  })
}

const handleInvites = (req,res)=>{
  const {user_id,fireside_id,type}= req.body;
  if(type == "accept"){
    let sql = "INSERT INTO attendance (user_id,fireside_id) VALUES (?,?)"
    sql = mysql.format(sql,[user_id,fireside_id]);

    pool.query(sql,(err,rows)=>{
      if(err){return console.log(err)}
      removeInvite(user_id,fireside_id);
      return res.send("user accepted invite to fireside")
    })
  }else if(type=="decline"){
    removeInvite(user_id,fireside_id);
  }
}

function removeInvite(user_id,fireside_id){
  let sql = "DELETE FROM invites WHERE user_id = ? AND fireside_id = ?"
  sql = mysql.format(sql,[user_id,fireside_id]);
  pool.query(sql,(err,rows)=>{
    if(err){return console.log(err)}
    console.log("deleted invite")
  })
}

const cancelInvite= (req,res)=>{
  let user_id = req.headers.user_id;
  let fireside_id = req.headers.fireside_id
  removeInvite(user_id,fireside_id)
  res.send("invite removed")
}

const publicFiresides = (req,res)=>{
  let sql="SELECT firesides.*, users.* FROM firesides JOIN users ON firesides.user_id = users.id WHERE allow_public = 1"
  pool.query(sql,(err,rows)=>{
    if(err){return console.log(err)} 
    return res.send(rows);
  })
}

const privateFiresides = (req,res)=>{
  let id = req.headers.user_id;
  let sql = "SELECT attendance.*, firesides.*, users.* FROM attendance JOIN firesides ON attendance.fireside_id = firesides.id JOIN users ON firesides.user_id = users.id WHERE attendance.user_id = ?";
  sql = mysql.format(sql,[id]);
  pool.query(sql,(err,rows)=>{
    if(err){return console.log(err)}
    return res.send(rows);
  })
}

const friendsOnlyFiresides = (req,res)=>{
  let requester_id = req.headers.user_id;
  let sql = "SELECT firesides.*, users.* FROM firesides "+ 
  "JOIN users ON firesides.user_id = users.id "+
  "WHERE firesides.user_id = ANY( "+
    "SELECT user_2_id FROM friends WHERE user_1_id = ? "+
  ") OR firesides.user_id = ANY( "+
  "SELECT user_1_id FROM friends WHERE user_2_id = ? "+
  ")"
  sql = mysql.format(sql,[requester_id,requester_id]);
  pool.query(sql,(err,rows)=>{
    if(err){return console.log(err)}
    return res.send(rows);
  })
}

const updateAccountBio = (req,res)=>{
  const {user_id,bio,location,job,school,sin_weed,sin_alch,sin_nicc} = req.body;
  let sql = "UPDATE user_profile SET bio = ? , location = ? , job = ? , school =? , sin_weed = ? , sin_alch = ? , sin_nicc = ? WHERE user_id = ?"
  sql = mysql.format(sql,[bio,location,job,school,sin_weed,sin_alch,sin_nicc,user_id])
  pool.query(sql,(err,rows)=>{
    if(err){return handleSQLError(res,err)}
    res.send(rows);
  })
}

const allAccountMediaRefs =(req,res)=>{
  //send all image file refs
  let id = req.headers.user_id;
  let sql = "SELECT * FROM images WHERE user_id = "+id
  pool.query(sql,(err,rows)=>{
    if(err){return handleSQLError(err,res)}
    return res.send(rows);
  })
}

const mediaObject =(req,res)=>{
  let ref = req.params.ref;
  res.sendFile(path.dirname(__dirname)+"/uploads/"+ref)
}

const getFiresideInvites = (req,res)=>{
  let id = req.headers.user_id;
  let sql = "SELECT invites.*, firesides.*, users.* FROM invites JOIN firesides ON invites.fireside_id = firesides.id JOIN users ON users.id = firesides.user_id WHERE invites.user_id = ? "
  sql = mysql.format(sql,[parseInt(id)]);
  pool.query(sql,(err,rows)=>{
    if(err){return console.log(err)}
    return res.send(rows);
  })
}


  module.exports = {
    cancelInvite,
    getFiresideInvites,

    getIncomingFriendRequests,
    getFriends,
    friendRequest,
    acceptFriendRequest,
    denyFriendRequest,

   
    userByid,
    mediaObject,
    allAccountMediaRefs,
    userByUsername,
    updateAccountBio,

    handleInvites,
    inviteToFireside,
    getMyFiresides,
    deleteFireside,
    createNewFireside,
    updateFireside,

    publicFiresides,
    privateFiresides,
    friendsOnlyFiresides,

    thread,
    newMessage,
    deleteMessage
  
  }


