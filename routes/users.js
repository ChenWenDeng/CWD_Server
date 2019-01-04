var express = require('express');
var router = express.Router();

var user = require('./../models/user');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});


//登录接口
router.post("/login", function (req, res, next) {
  // var param = {
  //   userName   : req.body.userName,
  //   userPwd    : req.bosy.userPwd,
  //   confirmPwd : req.body.confirmPwd
  // }
  var userName = req.body.userName;
  var userPwd = req.body.userPwd;
  var confirmPwd = req.body.confirmPwd;
  console.log(userName)
  console.log(userPwd)
  console.log(confirmPwd)
  user.findOne({
    userName: userName,
    userPwd: userPwd,
    confirmPwd: confirmPwd
  }, function (err, doc) {
    if (err) {
      res.json({
        status: "1",
        msg: err.massage
      })
    } else {
      if (!doc) {
        console.log('找不到用户名或密码')
        res.json({
          status: '1',
          msg: '',
        })
      }
      if (doc) {
        res.cookie("userId", doc.userId, {
          path: '/',
          maxAge: 1000 * 60 * 60 * 12
        })
        res.cookie("userName", doc.userName, {
          path: '/',
          maxAge: 1000 * 60 * 60 * 12
        })
        // req.session.user = doc;
        res.json({
          status: '0',
          msg: '',
          result: {
            userName: doc.userName
          }
        })
      }
    }
  })
})

//登出接口
router.post("/logout", function (req, res, next) {
  res.cookie("userId", "", {
    path: "/",
    maxAge: -1
  })
  res.json({
    status: "0",
    masg: '',
    result: ''
  })
})

router.post("/checkLogin", function (req, res, next) {
  if (req.cookies.userId) {
    res.json({
      status: '0',
      msg: '',
      result: req.cookies.userName
    })
  } else {
    res.json({
      status: '1',
      msg: '未登录',
      result: ''
    })
  }
})

router.get('/cartList', function (req, res, next) {
  var userId = req.cookies.userId;
  console.log('成功进入')
  user.findOne({ userId: userId }, function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.massage,
        result: ''
      })
    } else {
      if (doc) {
        res.json({
          status: '0',
          msg: '',
          result: doc.cartList
        })
        console.log(doc.cartList)
      }
    }
  })
})

//购物车删除
router.post('/cartDel', function (req, res, next) {
  var userId = req.cookies.userId;
  var cart_id = req.body.cart_id;
  console.log(userId)
  console.log(cart_id)
  console.log('进入删除购物车')
  user.update({
    userId: userId
  }, {
      $pull: {
        'cartList': {
          '_id': cart_id
        }
      }
    }, function (err, doc) {
      if (err) {
        res.json({
          status: '1',
          msg: err.massage,
          result: ''
        })
      } else {
        res.json({
          status: '0',
          msg: '',
          result: 'suc'
        })
      }
    })
})

//修改商品数量
router.post("/cartEdit", function (req, res, next) {
  var userId = req.cookies.userId;
  var productId = req.body.productId;
  var num = req.body.num;
  console.log(userId)
  console.log(productId)
  console.log(num)
  user.findOne({ "userId": userId, 'cartList.details.productId': productId }, function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.massage,
        result: ''
      })
    } else {
      if (doc) {
        doc.cartList.forEach(function (item) {
          if (item.details[0].productId == productId) {
            item.details[0].num = num
          }
        })
        doc.save(function (err2, doc2) {
          if (err2) {
            res.json({
              status: '1',
              msg: err2.message
            })
          } else {
            res.json({
              status: '0',
              msg: '',
              result: 'suc'
            })
          }
        })
      }
    }
  })
})

//查询用户地址接口
router.get('/addressList',function(req,res,next){
  var userId = req.cookies.userId;
  user.findOne({userId:userId},function(err,doc){
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result:''
      })
    } else {
      res.json({
        status: '0',
        msg: '',
        result: doc.addressList
      })
    }
  })
})

//添加用户购物地址
router.post('/addAddress', function (req, res, next) {
  var userId    = req.cookies.userId;
  var cityName  = req.body.cityName;
  var streeName = req.body.streeName;
  var userName  = req.body.userName;
  var tel       = parseInt(req.body.tel);
  var postCode  = req.body.postCode;
  var addressId = 0;
  var object    = {}
  console.log('用户id==='+userId)
  console.log('城市==='+cityName)
  console.log('具体地址==='+streeName)
  console.log('名字==='+userName)
  console.log('电话==='+tel)
  console.log('邮编==='+postCode)
  user.findOne({userId:userId},function(err,userDoc){
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result:''
      })
    } else {
      if(userDoc){
        for (var i = 0; i < userDoc.addressList.length; i++) {
          addressId = userDoc.addressList[i].addressId
          console.log(addressId)
        }
        addressId++
        object.addressId  = addressId
        object.cityName   = cityName
        object.streeName  = streeName
        object.userName   = userName
        object.tel        = tel
        object.postCode   = postCode
        object.isDefault  = false

        userDoc.addressList.push(object);
        userDoc.save(function(err2,doc2){
          if(err2){
              res.json({
                  status:'1',
                  msg:err2.message
              })
          }else{
              res.json({
                  status: '0',
                  msg: '',
                  result: doc2.length
              })
            } 
        })
      }
    }
  })
})

//修改收货地址信息
router.post('/modifyAddress', function (req, res, next) {
  var userId    = req.cookies.userId;
  var cityName  = req.body.cityName;
  var streeName = req.body.streeName;
  var userName  = req.body.userName;
  var tel       = parseInt(req.body.tel);
  var postCode  = req.body.postCode;
  var addressId = req.body.addressId;
  console.log('用户id==='+userId)
  console.log('城市==='+cityName)
  console.log('具体地址==='+streeName)
  console.log('名字==='+userName)
  console.log('电话==='+tel)
  console.log('邮编==='+postCode)
  console.log('地址id===='+addressId)
  user.update({"userId":userId,'addressList.addressId':addressId},{
    "addressList.$.cityName" : cityName,
    "addressList.$.streeName": streeName,
    "addressList.$.userName" : userName,
    "addressList.$.tel"      : tel,
    "addressList.$.postCode" : postCode
  },function(err,doc){
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result:''
      })
    } else {
      res.json({
        status: '0',
        msg: '',
        result: 'suc'
      })
    }
  })
})

//删除收货地址信息
router.post('/delAddress', function (req, res, next) {
  var userId    = req.cookies.userId;
  var addressId = req.body.addressId;
  console.log('用户id==='+userId)
  console.log('地址id===='+addressId)
  user.update({
    'userId': userId
  }, {
    $pull: {
      'addressList': {
        'addressId': addressId
      }
    }
  }, function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.massage,
        result: ''
      })
    } else {
      res.json({
        status: '0',
        msg: '',
        result: 'suc'
      })
    }
  })
})


module.exports = router;
