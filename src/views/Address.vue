<template>
    <div>
      <nav-header></nav-header>
      <nav-bread>
        <span>Address</span>
      </nav-bread>
      <div class="checkout-page">
       
        <div class="container">
          <div class="checkout-addr">
            <div class="page-title-normal">
              <h2 class="page-title-h2"><span>check out</span></h2>
            </div>
            <!-- process step -->
            <div class="check-step">
              <ul>
                <li class="cur"><span>Confirm</span> address</li>
                <li><span>View your</span> order</li>
                <li><span>Make</span> payment</li>
                <li><span>Order</span> confirmation</li>
              </ul>
            </div>

            <!-- address list -->
            <div class="page-title-normal checkout-title">
              <h2><span>Shipping address</span></h2>
            </div>
            <div class="addr-list-wrap">
              <div class="addr-list">
                <ul>
                  <li v-for="(item,index) in addressListFilter" v-bind:class="{'check':checkIndex==index}" @click="checkIndex=index">
                    <dl>
                      <dt>{{item.userName}}</dt>
                      <dd class="address">{{item.streetName}}</dd>
                      <dd class="tel">{{item.tel}}</dd>
                    </dl>
                    <div class="addr-opration addr-del">
                      <a href="javascript:;" class="addr-del-btn" @click="removeAddress(item.userName)" >
                          删除
                        <svg class="icon icon-del"><use xlink:href="#icon-del"></use></svg>
                      </a>
                    </div>
                    <div class="addr-opration addr-set-default">
                      <a href="javascript:;" class="addr-set-default-btn" v-if="!item.isDefault"  @click="getAddressDefault(item.addressId)"><i>Set default</i></a>
                    </div>
                    <div class="addr-opration addr-default" v-if="item.isDefault">Default address</div>
                  </li>
                  <li class="addr-new">
                    <div class="add-new-inner">
                      <i class="icon-add">
                        <svg class="icon icon-add"><use xlink:href="#icon-add"></use></svg>
                      </i>
                      <p>Add new address</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div class="shipping-addr-more">
                <a class="addr-more-btn up-down-btn" href="javascript:;" @click="unfold" v-bind:class="{'open':limit>3}">
                  more
                  <i class="i-up-down">
                    <i class="i-up-down-l"></i>
                    <i class="i-up-down-r"></i>
                  </i>
                </a>
              </div>
            </div>

            <!-- shipping method-->
            <div class="page-title-normal checkout-title">
              <h2><span>Shipping method</span></h2>
            </div>
            <div class="shipping-method-wrap">
              <div class="shipping-method">
                <ul>
                  <li class="check">
                    <div class="name">Standard shipping</div>
                    <div class="price">Free</div>
                    <div class="shipping-tips">
                      <p>Once shipped，Order should arrive in the destination in 1-7 business days</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div class="next-btn-wrap">
              <router-link class="btn btn--m btn--red" v-bind:to="{path:'orderConfirm',query:{'uesrId':selectaddressName}}">Next</router-link>
            </div>
          </div>
        </div>
      </div>
      <Modle v-bind:mdShow="mdRemoveaddress" v-on:close="closeMdaddress">
        <p slot="message">
            你确认删除收货地址吗？
        </p>
        <p slot="btnGroup">
            <a href="javascript:;" class="btn btn--m" @click="delAddress">确认</a> 
            <a href="javascript:;" class="btn btn--m" @click="mdRemoveaddress=false">再想想</a> 
        
        </p>
      </Modle>
      <nav-footer></nav-footer>
    </div>
</template>
<style>

</style>

<script>
import NavHeader from "./../components/NavHeader";
import NavFooter from "./../components/NavFooter";
import NavBread from "./../components/NavBread";
import Modle from './../components/Modle'
import { currency } from "./../util/currency";
import axios from "axios";
export default {
  data() {
    return {
      checkIndex: "",
      limit: 3,
      addressList: [],
      mdRemoveaddress:false,
      deluserName:'',
      selectaddressName:'10007'
    };
  },
  computed: {
    addressListFilter() {
      return this.addressList.slice(0, this.limit);//控制显示条数
    }
  },
  components: {
    NavHeader,
    NavFooter,
    NavBread,
    Modle
  },
  mounted() {
    this.getaddressList();
  },
  methods: {
    getaddressList() {//获取收货地址列表
      axios.get("/users/addressList").then(response => {
        let res = response.data;
        if (res.status == 0) {
          this.addressList = res.result;
        }
      });
    },
    unfold() {//改变箭头指向
      if (this.limit == 3) {
        this.limit = this.addressList.length;
      } else {
        this.limit = 3;
      }
    },
    getAddressDefault(addressId) {//设置默认地址
      axios
        .post("/users/setDefault", {
          addressId: addressId
        })
        .then((response) => {
          let res = response.data;
          if (status == 0) {
            alert("设置成功");
            this.getaddressList();
          }
        });
    },
    closeMdaddress() {//关闭模态
        this.mdRemoveaddress=false
    },
    removeAddress(userName){//点击删除弹出模态
        this.mdRemoveaddress=true;
        this.deluserName=userName//获取当前用户ID
        
    },
    delAddress(){//删除收货地址
        axios.post('/users/delAddress',{
            userName:this.deluserName
        }).then((response)=>{
          let res = response.data;
          if(res.status==0){
            this.mdRemoveaddress=false;
            this.getaddressList();
            
              
          }
            
        })
    }
  }
};
</script>