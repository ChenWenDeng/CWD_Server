var express = require('express');
var router = express.Router();

var user = require('./../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post("/login",function(req,res,next){
  // var param = {
  //   userName   : req.body.userName,
  //   userPwd    : req.bosy.userPwd,
  //   confirmPwd : req.body.confirmPwd
  // }
  var userName   = req.body.userName;
  var userPwd    = req.body.userPwd;
  var confirmPwd = req.body.confirmPwd;
  console.log(userName)
  console.log(userPwd)
  console.log(confirmPwd)
  user.findOne({
    userName:userName,
    userPwd:userPwd,
    confirmPwd:confirmPwd
  },function(err,doc){
    if(err){
      res.json({
        status:"1",
        msg:err.massage
      })
    }else{
      if(doc){
        res.cookie("userId",doc.userId,{
          path:'/',
          maxAge:1000 * 60 * 60
        })
        // req.session.user = doc;
        res.json({
          status:'0',
          msg:'',
          result:{
            userName:doc.userName
          }
        })
      }
    }
  })
})

module.exports = router;
