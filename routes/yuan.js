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

router.get("/",function(req,res,next){
    // if(req.param("sort")&&req.param("pageSize")&&req.param("page")){
    //     let sort = req.param("sort");
    //     let pageSize = req.param("pageSize");
    //     let page = req.param("page");
    //     let skip = (page - 1) * pageSize;
    //     let params = {};
    //     let goodsModel = Goods.find(params).skip(skip).limit(pageSize);
    //     goodsModel.sort({'selePrice':sort});
    //     goodsModel.exec(function(err,docc){
    //         if(err){
    //             res.json({
    //                 status:'1',
    //                 msg:err.message
    //             })
    //         }else{
    //             res.json({
    //                 status: '0',
    //                 msg: '',
    //                 result:{
    //                     count:docc.length,
    //                     list:docc
    //                 }
    //             })
    //         }
    //     })


    // }

    let names = 0;
    if(req.param("keyWord")=='全部商品'){
        let keyWord = req.param("keyWord")
        let sort = req.param("sort");
        let pageSize = parseInt(req.param("pageSize"));
        let page = parseInt(req.param("page"));
        let skip = (page - 1) * pageSize;

        console.log(keyWord)
        console.log(sort)
        console.log(pageSize)
        console.log(page) 
        // var totalData = [];

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
        

        // Goods.find({}).skip(skip).limit(pageSize).sort({'salePrice':sort}).exec(
        //     function(err,docc){
        //         if(err){
        //             res.json({
        //                 status:'1',
        //                 msg:err.message
        //             })
        //         }else{
        //             res.json({
        //                 status: '0',
        //                 msg: '',
        //                 result:{
        //                     count:docc.length,
        //                     list:docc
        //                 }
        //             })
        //         }
        //     }
        // )
    }
    
    else if(req.param("keyWord")){
        let sort = req.param("sort");
        let pageSize = parseInt(req.param("pageSize"));
        let page = parseInt(req.param("page"));
        let skip = (page - 1) * pageSize;
        //let params = {};
        //let goodsModel = Goods.find(params).skip(skip).limit(pageSize);
        //goodsModel.sort({'selePrice':sort});

        let keyWord = req.param("keyWord")
        const reg = new RegExp(keyWord, 'i') 
        console.log(keyWord)
        console.log(sort)
        console.log(pageSize)
        console.log(page) 
        
        if(req.param("sort")==undefined){
            Goods.find({
                        $or:[
                            {productName : {$regex : reg}},
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
        }else if(req.param("sort")==1||req.param("sort")==-1){
            Goods.find({
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
        }
    }
    // if(req.param("keyWord")){
    //     let keyWord = req.param("keyWord")
    //     const reg = new RegExp(keyWord, 'i') 
    //     console.log(keyWord)
    //     Goods.find({
    //         $or:[
    //             {productName : {$regex : reg}},
    //             {typeName : {$regex : reg}},
    //         ]
    //     },function(err,docc){
    //         if(err){
    //             res.json({
    //                 status:'1',
    //                 msg:err.message
    //             })
    //         }else{
    //             res.json({
    //                 status: '0',
    //                 msg: '',
    //                 result:{
    //                     count:docc.length,
    //                     list:docc
    //                 }
    //             })
    //         }
    //     })
    // }
    else if(req.param("detailsId")){
        let detailsId = parseInt(req.param("detailsId"))
        console.log(detailsId)
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
    // let detailsId = parseInt(req.param("detailsId"))
    // console.log(detailsId)
    // Goods.find({},{'productId':detailsId});
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

module.exports = router;