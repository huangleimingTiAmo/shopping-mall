var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Goods = require('./../models/goods')
var Users = require('./../models/user')


//连接数据库
mongoose.connect('mongodb://127.0.0.1:27017/demo')

mongoose.connection.on("connected",function(){
    console.log('mongodb连接成功')
})

mongoose.connection.on("error",function(){
    console.log('mongodb连接失败')
})

mongoose.connection.on("disconnected",function(){
    console.log('mongodb连接断开')
})

//获取商品列表
router.get("/list",function(req,res,next){
    let page = parseInt(req.param('page'));
    let pageSize =parseInt(req.param('pageSize'));
    let priceLevel = req.param('priceLevel')
    let sort = req.param('sort');
    let skip = (page-1)*pageSize
    var priceGt = '',priceLte = '';
    let params = {}

    if(priceLevel!='all'){
        switch(priceLevel){
            case '0' :priceGt=0;priceLte=100;break
            case '1' :priceGt=100;priceLte=500;break
            case '2' :priceGt=500;priceLte=1000;break
            case '3' :priceGt=1000;priceLte=5000;break
            
        }
        params = {
            salePrice:{
                $gt:priceGt,
                $lte:priceLte
            }
          }
    }
    let goodsModel = Goods.find(params).skip(skip).limit(pageSize)
    goodsModel.sort({'salePrice':sort});



    goodsModel.exec(function(err,doc){
        if(err){
            res.json({
                status:'1',
                msg:err.message
            })
        }else{
            res.json({
                status:"0",
                msg:'',
                result:{
                    count:doc.length,
                    list:doc
                }

            })
        }
    })
})
//加入购物车
router.post('/addCart',function(req,res,next){
    var userId =  "100000077";
    var productId = req.body.productId
    // console.log(productId)
    Users.findOne({userId:userId},function(err,userDoc){
        if(err){
            res.json({
                status:'1',
                msg:err.message
            })
        }else{
            // console.log('userDoc'+userDoc)
            if(userDoc){
                let goodsItem = '';
                userDoc.cartList.forEach(function(item){
                    if(item.productId==productId){
                        goodsItem==item;
                        item.productNum++
                    }
                })
                if(goodsItem){
                    userDoc.save(function(err2,doc2){
                        // console.log(doc2)
                        if(err2){
                            res.json({
                                status:'1',
                                msg:err2.message
                            })
                        }else{
                        // console.log(doc2)
                            
                            res.json({
                                status:'0',
                                msg:'',
                                result:"suc2"
                            })
                            

                        }
                    })
                }else{
                    Goods.findOne({productId:productId},function(err1,doc1){
                        // console.log(doc1)
                        if(err1){
                            res.json({
                                status:'1',
                                msg:err1.message
                            })
                        }else{
                            if(doc1){
                                doc1.productNum = 1
                                doc1.checked = 1
                                userDoc.cartList.push(doc1)
                                userDoc.save(function(err2,doc2){
                                    if(err2){
                                        res.json({
                                            status:'1',
                                            msg:err2.message
                                        })
                                    }else{
                                        // console.log(doc2)
                                        
                                        res.json({
                                            status:'0',
                                            msg:'',
                                            result:"suc1"
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


module.exports = router

