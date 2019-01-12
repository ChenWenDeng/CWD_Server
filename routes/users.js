var express = require('express');
var router = express.Router();

require('./../util/util');

var user = require('./../models/user');
var Goods = require('../models/goods')

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

//注册接口
router.post("/register", function (req, res, next) {
  var userName   = req.body.userName;
  var userPwd    = req.body.userPwd;
  var confirmPwd = req.body.confirmPwd;
  var phone      = req.body.phone;
  var eliam      = req.body.eliam;
  console.log('userName=='+userName)
  console.log('userPwd=='+userPwd)
  console.log('confirmPwd=='+confirmPwd)
  console.log('phone=='+phone)
  console.log('eliam=='+eliam)
  user.findOne({'userName':userName},function(err,userNameDoc){
    if(err){
      res.json({
        status: '1',
        msg: err.massage,
        result: ''
      })
      console.log('err===='+'错误')
    }else{
      if(userNameDoc){
        res.json({
          status: '10020',
          msg: '',
          result: '用户名已存在'
        })
      }
      else if(!userNameDoc){
        user.find({},function(err2,userDoc){
          if(userDoc){
            console.log('进入===='+userDoc.length)
            if(userDoc.length == 0){
              var userId = 100001
            }else{
              for(var i=0;i<userDoc.length;i++){
                if(i == userDoc.length-1){
                  var userId = userDoc[i].userId
                  console.log('www'+userDoc[i].userId);
                }
              }
              userId++
            }

            var createDate = new Date().Format('yyyy-MM-dd hh:mm:ss');

            let object = {
              "userId":userId,
              "userName":userName,
              "userPwd":userPwd,
              "confirmPwd":confirmPwd,
              "phone":phone,
              "eliam":eliam,
              "orderList":[],
              "cartList":[],
              "purchaseList":[],
              "addressList":[],
              'createDate': createDate
            }
            user.create(object)

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


//登录接口
router.post("/login", function (req, res, next) {
  var userName   = req.body.userName;
  var userPwd    = req.body.userPwd;
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
            userName: doc.userName,
            userId: doc.userId
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

//登录后拿到用户名和id
router.get("/checkLogin", function (req, res, next) {
  console.log('成功进入checkLogin')
  if (req.cookies.userId) {
    console.log('成功进入checkLogin2')
    res.json({
      status: '0',
      msg: '',
      // result: req.cookies.userName,
      result:{
        userId   : req.cookies.userId,
        userName : req.cookies.userName
      }
    })
  } else {
    res.json({
      status: '1',
      msg: '未登录',
      result: ''
    })
  }
})

//获取购物车列表
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
  var userId  = req.cookies.userId;
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
  var userId    = req.cookies.userId;
  var productId = req.body.productId;
  var num       = req.body.num;
  var checked   = req.body.checked;
  console.log(userId)
  console.log(productId)
  console.log(num)
  console.log(checked)
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
            item.details[0].checked = checked
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

//购物车全选接口
router.post('/editCheckAll', function (req, res, next) {
  var userId   = req.cookies.userId;
  var checkAll = req.body.checkAll?'1':'0';
  user.findOne({userId:userId},function(err,user){
    if (err) {
      res.json({
        status: '1',
        msg: err.massage,
        result: ''
      })
    } else {
      if(user){
        user.cartList.forEach((item)=>{
          item.details[0].checked = checkAll;
        })
        user.save(function(err1,doc){
          if(err1){
            res.json({
              status: '1',
              msg: err.massage,
              result: ''
            })
          }else{
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

//购物车数量接口
router.get("/getCartCount",function(req,res,next){
  if(req.cookies && req.cookies.userId){
    var userId = req.cookies.userId;
    user.findOne({'userId':userId},function(err,doc){
      if (err) {
        res.json({
          status: '1',
          msg: err.massage,
          result: ''
        })
      } else {
        var cartList = doc.cartList;
        let cartCount = 0;
        cartList.map(function(item){
          cartCount += parseInt(item.details[0].num);
        })
        res.json({
          status: '0',
          msg: '',
          result: cartCount
        })
      }
    })
  }
})

//清空立即购买列表数据
router.post('/delPurchaseList', function (req, res, next) {
  var userId    = req.cookies.userId;
  var productId = req.body.productId;
  console.log(userId)
  console.log(productId)
  console.log('进入删除购物车')
  user.update({
    userId: userId
  }, {
      $pull: {
        'purchaseList': {
          'productId': productId
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


//立即购买
router.post('/purchase',function(req,res,next){
  var userId     = req.cookies.userId;
  var productId  = req.body.productId;
  var productNum = req.body.num;
  console.log(productId)
  console.log('购买')

  user.findOne({userId:userId},function(err,userDoc){
      if(err){
          res.json({
              status:'1',
              msg:err.message
          })
      }else{
          if(userDoc){
            user.update({
              userId: userId
            }, {
                $pull: {
                  'purchaseList': {
                    'productId': productId
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
                  // res.json({
                  //   status: '0',
                  //   msg: '',
                  //   result: 'suc'
                  // })
                }
              })
          }
          if(userDoc){
            let goodsItem = '';
            userDoc.purchaseList.forEach(function(item){
                if(item.details[0].productId  == productId){
                    goodsItem = item;
                    if(productNum==1){
                        item.details[0].num++;
                    }else{
                        item.details[0].num += productNum
                    }
                    console.log('item==========='+item)
                }
                console.log('itemssss==========='+item.details[0].num)
            })
            if(goodsItem){
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
                            result:{
                                count:doc2.length,
                                list:doc2
                            }
                        })
                    } 
                })
            }else{
                Goods.findOne(
                    {
                        "details.productId":productId
                    },function(err1,doc){
                    if(err1){
                        res.json({
                            status:'1',
                            msg:err1.message
                        })
                    }else{
                        if(doc){
                            doc.details[0].checked = 1;
                            //第一次添加到购物车的数量不是1的话，改成要添加的数量
                            if(productNum != 1){
                                doc.details[0].num = productNum
                            }
                            console.log('doc======'+doc)
                            userDoc.purchaseList.push(doc);
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
                                        result:{
                                            count:doc2.length,
                                            list:doc2,
                                            _id:doc._id
                                        }
                                    })
                                } 
                            })
                        }
                    }
                })
            }
          }
      }
  })
})

//获取立即购买列表
router.get('/purchase', function (req, res, next) {
  var userId = req.cookies.userId;
  console.log('成功进入购买列表')
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
          result: doc.purchaseList
        })
        console.log(doc.purchaseList)
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
        // object.isDefault  = false
        object.isDefault  = userDoc.addressList.length == 0 ? true : false

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

//设置默认地址接口
router.post("/setDefault",function(req,res,next){
  var userId    = req.cookies.userId;
  var addressId = req.body.addressId;
  if(!addressId){
    res.json({
      status: '1',
      msg: 'addressId is null',
      result: ''
    })
  }else{
    user.findOne({userId:userId},function(err,doc){
      if (err) {
        res.json({
          status: '1',
          msg: err.massage,
          result: ''
        })
      } else {
        var addressList = doc.addressList;
        addressList.forEach((item)=>{
          if(item.addressId ==  addressId){
            item.isDefault = true;
          }else{
            item.isDefault = false;
          }
        });
        doc.save(function(err1,doc1){
          if (err1) {
            res.json({
              status: '1',
              msg: err1.massage,
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
      }
    })
  }
})


//生成订单
router.post("/payMent",function(req,res,next){
  var userId = req.cookies.userId;
  var modes = req.body.modes;
  var addressId = req.body.addressId;
  console.log('modes==='+modes)
  console.log('addressId==='+addressId)
  user.findOne({'userId':userId},function(err,doc){
    if (err) {
      res.json({
        status: '1',
        msg: err.massage,
        result: ''
      })
    }else{
      if(doc){
        var totalPrice = 0; //计算本次购买商品的总金额

        if(modes=='cart'){
          var goodsList = [];
          doc.cartList.filter((item)=>{
            if(item.details[0].checked == '1'){
              //计算本次购买商品的总金额
              totalPrice += item.details[0].salePrice * item.details[0].num
              goodsList.push(item.details[0])
              console.log(goodsList)
            }
          })
        }

        if(modes=='purchase'){
          var goodsList = [];
          totalPrice += doc.purchaseList[0].details[0].salePrice * doc.purchaseList[0].details[0].num
          goodsList.push(doc.purchaseList[0].details[0])
           console.log(goodsList)
        }

        if(addressId == 0){
          var address = ''
          doc.addressList.filter((item)=>{
            if(item.isDefault == true){
              address = item
              console.log(address)
            }
          })
        }

        if(addressId != 0){
          var address = ''
          doc.addressList.filter((item)=>{
            if(item.addressId == addressId){
              address = item
              console.log(address)
            }
          })
        }

        var platform = '588';
        var r1 = Math.floor(Math.random()*10)
        var r2 = Math.floor(Math.random()*10)

        var sysDate = new Date().Format('yyyyMMddhhmmss');
        var createDate = new Date().Format('yyyy-MM-dd hh:mm:ss');
        var orderId = platform + r1 + sysDate + r2;

        var order = {
          orderId : orderId,
          addressInfo : address,
          goodsList : goodsList,
          orderStatus : '1',
          createDate : createDate,
          totalPrice : totalPrice
        }

        doc.orderList.push(order)
        doc.save(function(err1,doc1){
          if (err1) {
            res.json({
              status: '1',
              msg: err1.massage,
              result: ''
            })
          } else {
            res.json({
              status: '0',
              msg: '',
              result: order
            })
          }
        })

      }
    }
  })
})


//个人中心  获取订单列表   orders
router.get("/ordersList",function(req,res,next){
  var userId = req.cookies.userId;

  user.findOne({userId:userId},function(err,doc){
    if (err) {
      res.json({
        status: '1',
        msg: err.massage,
        result: ''
      })
    } else {
      if(doc){
        res.json({
          status: '0',
          msg: '',
          result: doc.orderList
        })
      } 
    }
  })
})

//个人中心  获取用户个人信息   account
router.get("/account",function(req,res,next){
  var userId = req.cookies.userId;

  user.findOne({userId:userId},function(err,doc){
    if (err) {
      res.json({
        status: '1',
        msg: err.massage,
        result: ''
      })
    } else {
      if(doc){
        res.json({
          status: '0',
          msg: '',
          result: {
            createDate: doc.createDate,
            userName  : doc.userName,
            phone     : doc.phone,
            eliam     : doc.eliam,
          }
        })
      } 
    }
  })
})


module.exports = router;
