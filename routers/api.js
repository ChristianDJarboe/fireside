const express = require('express');
const router = express.Router();
const apiContoller = require("../controllers/api");
const { authenticate } = require('../middleware');


router.get("/userByUsername",authenticate,apiContoller.userByUsername)
router.get("/userByid",authenticate,apiContoller.userByid)

router.get("/getMyFiresides",authenticate,apiContoller.getMyFiresides)

router.get("/publicFiresides",authenticate,apiContoller.publicFiresides)
router.get("/privateFiresides",authenticate,apiContoller.privateFiresides)
router.get("/friendsOnlyFiresides",authenticate,apiContoller.friendsOnlyFiresides)

router.post("/createNewFireside",authenticate,apiContoller.createNewFireside)
router.put("/updateFireside",authenticate,apiContoller.updateFireside)

router.delete("/deleteFireside",authenticate,apiContoller.deleteFireside)

router.post("/inviteToFireside",authenticate,apiContoller.inviteToFireside)
router.get("/firesideInvites",authenticate, apiContoller.getFiresideInvites);
router.delete("/cancelInvite",authenticate,apiContoller.cancelInvite)

router.post("/handleInvites",authenticate,apiContoller.handleInvites)

router.get("/getIncomingFriendRequests",authenticate,apiContoller.getIncomingFriendRequests)
router.get("/getFriends",authenticate,apiContoller.getFriends)
router.post("/friendRequest",authenticate,apiContoller.friendRequest)
router.post("/acceptFriendRequest",authenticate,apiContoller.acceptFriendRequest)
router.post("/denyFriendRequest",authenticate,apiContoller.denyFriendRequest)

router.get("/thread",authenticate,apiContoller.thread)
router.post("/newMessage",authenticate,apiContoller.newMessage)
router.delete("/deleteMessage",authenticate,apiContoller.deleteMessage)

router.get("/allAccountMediaRefs",authenticate,apiContoller.allAccountMediaRefs)
router.get("/mediaObject/:ref",authenticate,apiContoller.mediaObject)

router.put("/updateAccountBio",authenticate,apiContoller.updateAccountBio)

module.exports = router