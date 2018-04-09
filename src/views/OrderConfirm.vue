<template>
    <div>
      <nav-header></nav-header>
      <nav-bread>
        <span>确认订单</span>
      </nav-bread>
      <div class="container">
                <div class="checkout-order">
          <div class="page-title-normal">
            <h2 class="page-title-h2"><span>check out</span></h2>
          </div>
          <!-- process step -->
          <div class="check-step">
            <ul>
              <li class="cur"><span>Confirm</span> address</li>
              <li class="cur"><span>View your</span> order</li>
              <li><span>Make</span> payment</li>
              <li><span>Order</span> confirmation</li>
            </ul>
          </div>

          <!-- order list -->
          <div class="page-title-normal checkout-title">
            <h2><span>Order content</span></h2>
          </div>
          <div class="item-list-wrap confirm-item-list-wrap">
            <div class="cart-item order-item">
              <div class="cart-item-head">
                <ul>
                  <li>Order contents</li>
                  <li>Price</li>
                  <li>Quantity</li>
                  <li>Subtotal</li>
                </ul>
              </div>
              <ul class="cart-item-list">
                <li v-for="item in cartList" v-if="item.checked==1" >
                  <div class="cart-tab-1">
                    <div class="cart-item-pic">
                      <img v-bind:src="'static/'+item.productImage" alt="">
                    </div>
                    <div class="cart-item-title">
                      <div class="item-name">{{item.productName}}</div>

                    </div>
                  </div>
                  <div class="cart-tab-2">
                    <div class="item-price">￥{{item.salePrice}}</div>
                  </div>
                  <div class="cart-tab-3">
                    <div class="item-quantity">
                      <div class="select-self">
                        <div class="select-self-area">
                          <span class="select-ipt">×{{item.productNum}}</span>
                        </div>
                      </div>
                      <div class="item-stock item-stock-no">In Stock</div>
                    </div>
                  </div>
                  <div class="cart-tab-4">
                    <div class="item-price-total">￥{{item.productNum*item.salePrice}}</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <!-- Price count -->
          <div class="price-count-wrap">
            <div class="price-count">
              <ul>
                <li>
                  <span>总金额:</span>
                  <span>￥{{this.subtotal}}</span>
                </li>
                <li>
                  <span>运费:</span>
                  <span>￥{{this.shipping}}</span>
                </li>
                <li>
                  <span>折扣:</span>
                  <span>￥{{this.discount}}</span>
                </li>
                <li>
                  <span>税费:</span>
                  <span>￥{{this.tax}}</span>
                </li>
                <li class="order-total-price">
                  <span>实际应付:</span>
                  <span>￥{{this.orderTotal}}</span>
                </li>
              </ul>
            </div>
          </div>

          <div class="order-foot-wrap">
            <div class="prev-btn-wrap">
              
              <router-link class="btn btn--m" to="/address">返回</router-link>
            </div>
            <div class="next-btn-wrap">
              <button class="btn btn--m btn--red" @click="payMent">支付</button>
            </div>
          </div>
        </div>
      </div>
      <nav-footer></nav-footer>
  
    </div>
</template>
<script>
import NavHeader from "./../components/NavHeader";
import NavFooter from "./../components/NavFooter";
import NavBread from "./../components/NavBread";
import axios from "axios";

export default {
  data(){
    return{
      cartList:[],
      subtotal:'',
      shipping:"10",
      discount:'8',
      tax:'10',
      orderTotal:''

      

    }
  },
  // computed:{
  //   ordertotal(){
  //     return this.subtotal+this.shipping-this.discount+this.tax
  //   }
  // },

  mounted(){
    this.init()
  },
  components: {
    NavHeader,
    NavFooter,
    NavBread
    
  },
  methods:{
    init(){
      axios.get('/users/cartList').then((response)=>{//获取购物车里订单
        let res = response.data;
        if(status==0){
          this.cartList=res.result;//列表中用v-if控制已经选中的商品来展示出来
          this.cartList.forEach((item) => {
            if(item.checked==1){
              this.subtotal+=parseInt(item.salePrice)*parseInt(item.productNum);
            }
          });
          this.orderTotal = this.subtotal+this.shipping-this.discount+this.tax;
        }
      })
    },
    payMent(){
    this.$router.push('/orderSuccess')
  }
  }
  
};
</script>