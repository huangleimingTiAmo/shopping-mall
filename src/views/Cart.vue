<template>
  <div>
    <nav-header></nav-header>
    <nav-bread>
      <span>My Cart</span>
    </nav-bread>
    
    <div class="container">
      <div class="cart">
        <div class="page-title-normal">
          <h2 class="page-title-h2"><span>My Cart</span></h2>
        </div>
        <div class="item-list-wrap">
          <div class="cart-item">
            <div class="cart-item-head">
              <ul>
                <li>Items</li>
                <li>Price</li>
                <li>Quantity</li>
                <li>Subtotal</li>
                <li>Edit</li>
              </ul>
            </div>
            <ul class="cart-item-list">
              <li v-for="item in cartList" >
                <div class="cart-tab-1">
                  <div class="cart-item-check">
                    <a href="javascipt:;" class="checkbox-btn item-check-btn " v-bind:class="{'check':item.checked==1}" @click="cartEdit('check',item)">
                      <svg class="icon icon-ok">
                        <use xlink:href="#icon-ok"></use>
                      </svg>
                    </a>
                  </div>
                  <div class="cart-item-pic">
                    <img v-bind:src="'static/'+item.productImage" v-bind:alt="item.productName" >
                  </div>
                  <div class="cart-item-title">
                    <div class="item-name">{{item.productName}}</div>
                  </div>
                </div>
                <div class="cart-tab-2">
                  <div class="item-price">{{item.salePrice | currency('￥')}}</div>
                </div>
                <div class="cart-tab-3">
                  <div class="item-quantity">
                    <div class="select-self select-self-open">
                      <div class="select-self-area">
                        <a class="input-sub" @click="cartEdit('minu',item)">-</a>
                        <span class="select-ipt">{{item.productNum}}</span>
                        <a class="input-add" @click="cartEdit('add',item)">+</a>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="cart-tab-4">
                  <div class="item-price-total">{{item.productNum*item.salePrice | currency('￥')}}</div>
                </div>
                <div class="cart-tab-5">
                  <div class="cart-item-opration">
                    <a href="javascript:;" class="item-edit-btn" @click="removeCartGoods(item)" >
                      删除
                      <svg class="icon icon-del">
                        <use xlink:href="#icon-del"> </use>
                      </svg>
                    </a>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="cart-foot-wrap">
          <div class="cart-foot-inner">
            <div class="cart-foot-l">
              <div class="item-all-check">
                <a href="javascipt:;" >
                  <span class="checkbox-btn item-check-btn" v-bind:class="{'check':allChecked}" @click="changeAllChecked">
                      <svg class="icon icon-ok"><use xlink:href="#icon-ok"/></svg>
                  </span>
                  <span>Select all</span>
                </a>
              </div>
            </div>
            <div class="cart-foot-r">
              <div class="item-total">
                Item total: <span class="total-price">{{totalPrice | currency('￥')}}</span>
              </div>
              <div class="btn-wrap">
                <a class="btn btn--red" v-bind:class="{'btn--dis':checkedCount==0}" @click="checkedOut">Checkout</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Modle v-bind:mdShow="mdRemoveCart " v-on:close="closeMdCart">
    <p slot="message">
      你确认删除吗？三思啊！！！
    </p>
    <p slot="btnGroup">
      <a href="javascript:;" class="btn btn--m" @click="removeGoods">确认</a> 
      <a href="javascript:;" class="btn btn--m" @click="mdRemoveCart=false">再想想</a> 
        
    </p>
  </Modle>
    <nav-footer></nav-footer>
  </div>
</template>
<style>
  .input-sub,.input-add{
    min-width: 40px;
    height: 100%;
    border: 0;
    color: #605F5F;
    text-align: center;
    font-size: 16px;
    overflow: hidden;
    display: inline-block;
    background: #f0f0f0;
  }
  .item-quantity .select-self-area{
    background:none;
    border: 1px solid #f0f0f0;
  }
  .item-quantity .select-self-area .select-ipt{
    display: inline-block;
    padding:0 3px;
    width: 30px;
    min-width: 30px;
    text-align: center;
  }
</style>
<script>
    import './../assets/css/checkout.css'
    import NavHeader from './../components/NavHeader'
    import NavFooter from './../components/NavFooter'
    import NavBread from './../components/NavBread'
    import Modle from './../components/Modle'
    import {currency} from './../util/currency'
    
    import axios from 'axios'
    export default{
        data(){
            return{
                cartList:[],
                mdRemoveCart:false,
               
                delItem:{}
                
            }
        },
       
        components:{
          NavHeader,
          NavFooter,
          NavBread,
          Modle
        },
        filters:{
          currency:currency
        },
        computed:{
          allChecked(){
            return this.checkedCount==this.cartList.length
          },
          checkedCount(){
            var i =0;
            this.cartList.forEach((item)=>{
              if(item.checked=='1')i++
            })
            return i
          },
          totalPrice(){
            var money =0;
            this.cartList.forEach((item)=>{
              if(item.checked=='1'){
                money += parseFloat(item.salePrice)*parseInt(item.productNum);
              }
            })
            return money
          }
        },
        mounted(){
          this.getCartList()
        },
        methods:{
          getCartList(){//获取购物车列表
            axios.get('/users/cartList').then((response)=>{
                let res =  response.data;
                if(res.status==0){
                  this.cartList = res.result
                }
            })
          },
          removeCartGoods(item){//点击删除按钮弹出模态匡
            this.delItem = item  //获取点击当前商品
            this.mdRemoveCart = true//显示模态
          },
          removeGoods(){//点击确认删除数据
           
            axios.post('users/cartDel',{
              productId:this.delItem.productId
            }).then((response)=>{
              let res = response.data;
              if(res.status==0){
                 this.mdRemoveCart=false;//关闭模态
                 var delCount = this.delItem.productNum
                 this.$store.commit('updateCartCount',-delCount)//改变vuex状态
                 this.getCartList()//从新渲染
              }
            })

          },
          closeMdCart(){//关闭模态框
            this.mdRemoveCart=false
          },
          cartEdit(flag,item){//增加，减少，选中，操作购物车数量
            if(flag=="add"){
              item.productNum++
            }else if(flag=='minu'){
              if(item.productNum<=1){
                return
              }
              item.productNum--
            }else{
              item.checked=item.checked=='1'?'0':'1'
            }
            axios.post('/users/cartEdit',{
              productId:item.productId,
              productNum:item.productNum,
              checked:item.checked
              
            }).then((response)=>{
              let res = response.data;
              if(res.status==0){
                 this.$store.commit("updateCartCount",flag=="add"?1:-1);//改变vuex状态
              }
            })
          },
          changeAllChecked(){//改变所有数量
            var flag=!this.allChecked//判断当前列表项的选中状态，若全部选中，取false
            this.cartList.forEach((item)=>{
                item.checked=flag?'1':'0'//改变选中状态
            })

            axios.post('/users/editCheckAll',{
              checkAll:flag?'1':'0'
            }).then((response)=>{
              let res = response.data;
              if(res.status==0){
                 
              }
            })
          },
          checkedOut(){
            if(this.checkedCount>0){
              this.$router.push({
                path:'/address'
              })
            }
          }

          
        }
        
    }
</script>
