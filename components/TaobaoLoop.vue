<template>
  <div class="taobao-loop-list" v-loading="isLoading">
    <el-carousel :interval="5000" arrow="always">
      <el-carousel-item v-for="(item,index) in loop" :key="index">
        <a :href="item.coupon_share_url" TARGET="_blank">
          <img :src="item.pict_url" style="object-fit: cover" alt="">
        </a>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
import * as api from '../api/api'
export default {
  name: "TaobaoLoop",
  mounted() {
    this.getTaobaoRecommend();
  },
  data(){
    return{
      loop:[],
      isLoading:false
    }
  },
  methods:{
    getTaobaoRecommend(){
      this.isLoading = true
      api.getTaobaoRecommend(5).then(res=>{
      if (res.code === 10000){
          this.loop = res.data
            .tbk_dg_optimus_material_response.result_list
            .map_data
        console.log(this.loop)
        this.isLoading = false
      }
      })
    }

  }
}
</script>

<style scoped>

.taobao-loop-list img{
  object-fit: cover;
  width: 220px;
  height: 220px;
}

</style>
