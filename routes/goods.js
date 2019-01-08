var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Goods = require('../models/goods')

//连接数据库
mongoose.connect('mongodb://127.0.0.1:27017/eend');

mongoose.connection.on("connected",function(){
    console.log("数据库连接成功");
})

mongoose.connection.on("error",function(){
    console.log("数据库连接失败");
})

mongoose.connection.on("disconnected",function(){
    console.log("数据库连接断开");
})

router.get("/list",function(req,res,next){


    //如果接收到的参数是 全部商品
    if(req.param("keyWord")=='全部商品'){
        //保存接收到的参数
        let keyWord = req.param("keyWord")                  //保存输入搜索的文字
        let sort = req.param("sort");                       //保存的排序--升序-降序
        let pageSize = parseInt(req.param("pageSize"));     //保存渲染的数据的条数
        let page = parseInt(req.param("page"));             //保存点击的分页数
        let skip = (page - 1) * pageSize;                   //当前点击的页数减第一页乘要显示的条数

        console.log(keyWord)
        console.log(sort)
        console.log(pageSize)
        console.log(page) 

        //如果接收到的参数有sort
        if(req.param("sort")){
            console.log('查询数据库中所有数据，并进行排序')
            //查询所有的进行排序
            Goods.find({}).skip(skip).limit(pageSize).sort({'salePrice':sort}).exec(
                function(err,docc){
                    if(err){
                        res.json({
                            status:'1',
                            msg:err.message
                        })
                    }else{
                        res.json({
                            status: '0',
                            msg: '',
                            result:{
                                count:docc.length,
                                list:docc
                            }
                        })
                    }
                }
            )
        }else{
        console.log('查询数据库中所有数据，不需要排序')
            Goods.find({}).skip(skip).limit(pageSize).exec(
                function(err,docc){
                    if(err){
                        res.json({
                            status:'1',
                            msg:err.message
                        })
                    }else{
                        res.json({
                            status: '0',
                            msg: '',
                            result:{
                                count:docc.length,
                                list:docc
                            }
                        })
                    }
                }
            )
        }
    }//接收到的排序参数sort==1或==-1
    else if(req.param("sort")==1||req.param("sort")==-1){   
        let sort = req.param("sort");
        let pageSize = parseInt(req.param("pageSize"));
        let page = parseInt(req.param("page"));
        let skip = (page - 1) * pageSize;
        let keyWord = req.param("keyWord")
        const reg = new RegExp(keyWord, 'i')
        console.log(keyWord)
        console.log(sort)
        console.log(pageSize)
        console.log(page) 
        console.log('接收到排序参数sort进行排序')
        Goods.find({
            //多条件查询，查询productName是否包含接收到关键字 或 typeName是否包含接收到关键字
            $or:[
                {productName : {$regex : reg}},
                {typeName : {$regex : reg}},
            ]
        }).skip(skip).limit(pageSize).sort({'salePrice':sort}).exec(
            function(err,docc){
                if(err){
                    res.json({
                        status:'1',
                        msg:err.message
                    })
                }else{
                    res.json({
                        status: '0',
                        msg: '',
                        result:{
                            count:docc.length,
                            list:docc
                        }
                    })
                }
            }
        )
    }//如果接收到需要搜索关键字
    else if(req.param("keyWord")){
        //如果接收到paes参数   当前页数字
        if(req.param("page")){
            let pageSize = parseInt(req.param("pageSize"));
            let page = parseInt(req.param("page"));
            let skip = (page - 1) * pageSize;
            let keyWord = req.param("keyWord")
            const reg = new RegExp(keyWord, 'i')
            console.log('关键字查询完后进行分页')
            Goods.find({
                $or:[
                    {productName : {$regex : reg}},
                    {typeName : {$regex : reg}},
                ]
            }).skip(skip).limit(pageSize).exec(  //关键字查询完后进行分页
                function(err,docc){
                    if(err){
                        res.json({
                            status:'1',
                            msg:err.message
                        })
                    }else{
                        res.json({
                            status: '0',
                            msg: '',
                            result:{
                                count:docc.length,
                                list:docc
                            }
                        })
                    }
                }
            )
        }else{
            let keyWord = req.param("keyWord")
            const reg = new RegExp(keyWord, 'i') 
            console.log(keyWord)
            console.log('接收到关键字查询数据，不需要分页')
            Goods.find({
                $or:[
                    {productName : {$regex : reg}},    //关键字查询不需要分页
                    {typeName : {$regex : reg}},
                ]
            },function(err,docc){
                if(err){
                    res.json({
                        status:'1',
                        msg:err.message
                    })
                }else{
                    res.json({
                        status: '0',
                        msg: '',
                        result:{
                            count:docc.length,
                            list:docc
                        }
                    })
                }
            })
        }
    }else if(req.param("detailsId")){  //接收到数据的id号,进行查询  详情页
        let detailsId = parseInt(req.param("detailsId"))
        console.log('查询数据id 对应的详情页')
        Goods.find({'productId':detailsId},function(err,docc){
            if(err){
                res.json({
                    status:'1',
                    msg:err.message
                })
            }else{
                res.json({
                    status: '0',
                    msg: '',
                    result:{
                        count:docc.length,
                        list:docc
                    }
                })
            }
        })
    }else{
    console.log('没有参数，，返回所有的数据');        //没有参数，，返回所有的数据
    Goods.find({},function(err,docc){
        if(err){
            res.json({
                status:'1',
                msg:err.message
            })
        }else{
            res.json({
                status: '0',
                msg: '',
                result:{
                    count:docc.length,
                    list:docc
                }
            })
        }
    })
    }
})

router.post("/addCart",function(req,res,next){
    var productId  = req.body.productId;
    var productNum = req.body.num;
    var userId     = req.body.userId;
    console.log('productNum:'+productNum);
    console.log('productId:'+productId);
    // var UserId = 100001;
    var User = require('../models/user');

    User.findOne({userId:userId},function(err,userDoc){
        if(err){
            res.json({
                status:'1',
                msg:err.message
            })
        }else{
            console.log('userDoc:'+userDoc);
            if(userDoc){
                let goodsItem = '';
                userDoc.cartList.forEach(function(item){
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
                                userDoc.cartList.push(doc);
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

module.exports = router;