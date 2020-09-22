<template>
<div>
      <wordcloud
        :fontSize="fontSize"
        :rotate="rotate"
        :margin="margin"
        :data="defaultWords"
        nameKey="name"
        valueKey="count"
        :showTooltip="true"
        :wordClick="wordClickHandler">
      </wordcloud>
</div>
</template>

<script>
import * as api from "@/api/api";

export default {
name: "WordCloud",
  mounted() {
    this.getLabelsAll()
  },
  data(){
  return{
    fontSize:[15,30],
    rotate:{from: -10, to: 30, numOfOrientation: 10 },
    margin: {top: 0, right: 0, bottom: 0, left: 0 },
    defaultWords:[]
  }
  },
  methods:{
    wordClickHandler(value){
      console.log('<><><><<><'+value)
      //跳转到搜索页面
      location.href = '/search?keyword=' + value + '&page=1&size=5&sort=&categoryId='

      // this.$router.push({
      //   path:'/search',
      //   query:{
      //     keyword: value,
      //     page: 1,
      //     size: 5,
      //     categoryId:'',
      //     sort:''
      //   }
      // })
    },
    getLabelsAll(){
      api.getLabelsAll(15).then(res=>{
        if (res.code === 200){
          this.defaultWords = res.data;
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
