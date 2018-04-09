<template>
 <div>
  <nav-header></nav-header>
  <nav-bread>
    <span>Goods</span>
  </nav-bread>
  <div class="accessory-result-page accessory-page">
    <div class="container">
      <div class="filter-nav">
        <span class="sortby">Sort by:</span>
        <a href="javascript:void(0)" class="default ">Default</a>
        <a href="javascript:void(0)" class="price" @click="sortGoods">Price 
          <svg class="icon icon-arrow-short">
            <use xlink:href="#icon-arrow-short"></use>
          </svg>
        </a>
        <a href="javascript:void(0)" class="filterby stopPop" @click="showPricePop" >Filter by</a>
      </div>
      <div class="accessory-result">
        <!-- filter -->
        <div class="filter stopPop" id="filter" :class="{'fliterby-show':filterBy}">
          <dl class="filter-price">
            <dt>Price:</dt>
            <dd><a href="javascript:void(0)" v-bind:class="{'cur':priceChecked=='all'}" @click="setpriceFilter('all')">All</a></dd>
            <dd v-for="(price,index) in priceFlitet" >
              <a href="javascript:void(0)" v-bind:class="{'cur':priceChecked==index}" @click="setpriceFilter(index)">{{price.startPrice}} - {{price.endPrice}}</a>
            </dd>
            
          </dl>
        </div>

        <!-- search result accessories list -->
        <div class="accessory-list-wrap">
          <div class="accessory-list col-4">
            <ul>
              <li v-for="goods in goodsList">
                <div class="pic">
                  <a href="#"><img v-lazy=" 'static/'+goods.productImage" alt=""></a>
                </div>
                <div class="main">
                  <div class="name">{{goods.productName}}</div>
                  <div class="price">{{goods.salePrice}}</div>
                  <div class="btn-area">
                    <a href="javascript:;" class="btn btn--m" @click="addcart(goods.productId)">加入购物车</a>
                  </div>
                </div>
              </li>
              
            </ul>
            <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="30">
              <img src="./../assets/loading-spinning-bubbles.svg" alt="" v-show="loading">
            </div>
          </div>
          
        </div>
      </div>
    </div>
  </div>
  <Modle v-bind:mdShow="mdShow" v-on:close="closeModle">
    <p slot="message">
      您还没有登陆
    </p>
    <p slot="btnGroup">
      <a href="javascript:;" class="btn btn--m" @click="mdShow=false">关闭</a>   
    </p>
  </Modle>
  <Modle v-bind:mdShow="mdShowCart " v-on:close="closeModle">
    <p slot="message">
      加入购物车成功
    </p>
    <p slot="btnGroup">
      <a href="javascript:;" class="btn btn--m" @click="mdShowCart=false">继续买买买</a> 
      <router-link href="javascript:;" class="btn btn--m" to="/cart">查看购物车</router-link>  
    </p>
  </Modle>
  <nav-footer></nav-footer>

 </div>
</template>

<script>
import "./../assets/css/base.css";
import "./../assets/css/product.css";
import NavHeader from "./../components/NavHeader";
import NavFooter from "./../components/NavFooter";
import NavBread from "./../components/NavBread";
import Modle from "./../components/modle";
import axios from "axios";

export default {
  data() {
    return {
      priceFlitet: [
        {
          startPrice: "0.00",
          endPrice: "100.00"
        },
        {
          startPrice: "100.00",
          endPrice: "500.00"
        },
        {
          startPrice: "500.00",
          endPrice: "1000.00"
        },
        {
          startPrice: "1000.00",
          endPrice: "5000.00"
        }
      ],
      priceChecked: "all",
      filterBy: false,
      overByFlag: false,
      mdShow:false,
      goodsList: [],
      sortFlag: true,
      page: 1,
      pageSize: 8,
      busy: true,
      loading:true,
      mdShowCart:false
    };
  },

  mounted() {
    this.getGoodsList();
  },

  components: {
    NavHeader,
    NavFooter,
    NavBread,
    Modle
  },
  methods: {
    showPricePop() {
      this.filterBy = true;
    },
    getGoodsList(flag) {//请求商品列表数据
      let param = {
        page: this.page,//页数
        pageSize: this.pageSize,//数据条数
        sort: this.sortFlag ? 1 : -1,//判断正序倒序
        priceLevel:this.priceChecked
      };
      this.loading = true
      axios
        .get("/goods/list", {
          params: param
        })
        .then(response => {
          this.loading=true
          let res = response.data;
          if (res.status == "0") {
            if (flag) {
              this.goodsList = this.goodsList.concat(res.result.list);
              if (res.result.count == 0) {
                this.busy = true;
              } else {
                this.busy = false;
              }
            } else {
              this.goodsList = res.result.list;
              this.busy = false;
            }
            // this.goodsList = res.result.list;
          } else {
            this.goodsList = [];
          }
        });
    },
    setpriceFilter(index){//价格过滤
      this.priceChecked = index;
      this.page = 1;
      this.getGoodsList()
    },
    sortGoods() {
      //排序功能
      this.sortFlag = !this.sortFlag;
      this.page = 1;
      this.getGoodsList();
    },
    loadMore() {//分页查询
      this.busy=true;
      setTimeout(() => {
        this.page++;
        this.getGoodsList(true);
      }, 1000);
    },
    addcart(productId){//加入购物车
      axios.post('/goods/addCart',{
        productId:productId
      }).then((response)=>{
        let res = response.data//一定要加这句，不要忘
        if(res.status==0){
          this.mdShowCart=true
          this.$store.commit('updateCartCount',1)//vuex提交
        }else{
          this.mdShow=true
        }
      })
    },
    closeModle(){
          this.mdShow=false
          this.mdShowCart=false
      
    }
  }
};
</script>

<style scoped>

</style>