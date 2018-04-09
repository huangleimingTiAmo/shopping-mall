var express = require('express');
var router = express.Router();
var User = require('./../models/user')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//登陆功能
router.post('/login',function(req,res,next){
  var param = {
    userName:req.body.userName,
    userPwd:req.body.userPwd

  }
  User.findOne(param,function(err,doc){//param不要加大括号
    if(err){
      res.json({
        status:'1',
        msg:err.message
      })
    }else{
      if(doc){
        res.cookie('userId',doc.userId,{
          path:'/',
          maxAge:1000*60*60
        })
        res.cookie('userName',doc.userName,{
          path:'/',
          maxAge:1000*60*60
        })
        res.json({
          status:'0',
          msg:'',
          result:{
            userName:doc.userName
          }

        })
      }else{
        res.json({
          status:'1',
          msg:'账号密码错误',
          result:''
            

        })
      }
    }
  })
})

//登出功能
router.post('/logout',function(req,res,next){
  res.cookie('userId','',{
    path:'/',
    maxAge:-1
  })
  res.json({
    status:'0',
    msg:"",
    result:""
  })
})


//获取用户信息


router.get('/checkLogin',function(req,res,next){
  if(req.cookies.userId){
    res.json({
      status:'0',
      msg:'',
      result:req.cookies.userName
    })
  }else{
    res.json({
      status:'1',
      msg:'未登录',
      result:""
    })
  }
})

//查询购物车数量
router.get('/getCartCount',function(req,res,next){
  var userId = req.cookies.userId;
  User.findOne({userId:userId},function(err,doc){
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:""
      })
    }else{
      var cartList = doc.cartList;
      let  cartCount = 0;
      cartList.map(function(item){
        cartCount+=parseInt(item.productNum)
      })
      res.json({
        status:'0',
        msg:'',
        result:cartCount
      })

    }
  })
  
})

//查询当前用户购物车列表
router.get('/cartList',function(req,res,next){
  var userId = req.cookies.userId
  User.findOne({userId:userId},function(err,doc){
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:""
      })
    }else{
      res.json({
        status:'0',
        msg:'',
        result:doc.cartList
      })
    }
  })
})


//删除购物车单个商品

router.post('/cartDel',function(req,res,next){
  var userId = req.cookies.userId;
  var productId = req.body.productId;
  User.update({userId:userId},{$pull:{'cartList':{'productId':productId}}},function(err,doc){
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:""
      })
    }else{
        res.json({
          status:'0',
          msg:'',
          result:'suc'
        })
    }
  })
})


//保存数量修改
router.post('/cartEdit',function(req,res,next){
  var userId = req.cookies.userId;
  var productId = req.body.productId;
  var productNum = req.body.productNum;
  var checked = req.body.checked;
  
  User.update({"userId":userId,"cartList.productId":productId},{"cartList.$.productNum":productNum,"cartList.$.checked":checked},function(err,doc){
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:""
      })
    }else{
        res.json({
          status:'0',
          msg:'',
          result:'suc'
        })
    }
  })
})

router.post("/editCheckAll", function (req,res,next) {
  var userId = req.cookies.userId,
      checkAll = req.body.checkAll?'1':'0';
  User.findOne({userId:userId}, function (err,user) {
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      });
    }else{
      if(user){
        user.cartList.forEach((item)=>{
          item.checked = checkAll;
        })
        user.save(function (err1,doc) {
            if(err1){
              res.json({
                status:'1',
                msg:err1,message,
                result:''
              });
            }else{
              // console.log(doc)
              res.json({
                status:'0',
                msg:'',
                result:'suc'
              });
            }
        })
      }
    }
  });
});



//查询用户地址列表
router.get("/addressList", function (req,res,next) {
  var userId = req.cookies.userId;
  User.findOne({userId:userId}, function (err,doc) {
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      });
    }else{
      res.json({
        status:'0',
        msg:'',
        result:doc.addressList
      });
    }
  })
});


//设置默认收货地址
router.post('/setDefault',function(req,res,next){
  var userId = req.cookies.userId;
  var addressId = req.body.addressId;
  if(!addressId){
    res.json({
      status:'1003',
      msg:'addressId不存在',
      result:''
    });
  }else{
    User.findOne({userId:userId}, function (err,doc) {
      if(err){
        res.json({
          status:'1',
          msg:err.message,
          result:''
        });
      }else{
        var addressList = doc.addressList;
        addressList.forEach((item)=>{
          if(item.addressId==addressId){
            item.isDefault=true
          }else{
            item.isDefault=false       
          }
        })
        doc.save(function(err1,doc1){
          if(err1){
            res.json({
              status:'1',
              msg:err1.message,
              result:''
            });
          }else{
            res.json({
              status:'0',
              msg:'',
              result:''
            })
          }
        })
        

        
      }
    })
  }
  
})

//删除地址接口
router.post("/delAddress", function (req,res,next) {
  var userId = req.cookies.userId;

  var userName = req.body.userName;
  User.update({userId:userId},{$pull:{'addressList':{'userName':userName}}}, function (err,doc) {
      if(err){
        res.json({
            status:'1',
            msg:err.message,
            result:''
        });
      }else{
        res.json({
          status:'0',
          msg:'',
          result:''
        });
      }
  });
});
module.exports = router;
