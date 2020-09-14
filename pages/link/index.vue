<template>
  <div class="index-page-box">
   <div class="link-title">
      友情链接
   </div>
    <div class="link-list-box clear-fix">
      <div :title="item.lName" class="link-item float-left" v-for="(item,index) in linksList" :key="index">
        <a :href="item.url" target="_blank">
          <img :src="'http://localhost:8090'+item.logo" alt="">
        </a>

      </div>
    </div>
  </div>
</template>

<script>
import * as api from '../../api/api'
export default {
  asyncData(){
   return api.getFriendList().then(res=>{
      console.log(res.data);
      return{
        linksList: res.data
      }
    })
  }
}
</script>

<style scoped>
.link-title{
  color: #999999;
  margin-bottom: 20px;
  text-align: center;
  font-size: 20px;

}
.index-page-box{
  background: #ffffff;
  padding: 20px;
}
.link-item{
  margin-bottom: 20px;
  text-align: center;
  padding: 10px;
  border: #F5F5F5 1px solid;
  width: 198px;
  height: 74px;
}
.link-item:hover{
  border: blueviolet 1px solid;
}
.link-item img{
  margin-top: 13px;
  cursor: pointer;
  vertical-align: middle;
  width: 100px;
  height: 50px;
}

</style>
