<template>
  <div class="about-box clear-fix" id="about-box">
    <div class="about-left-part float-left" id="about-left-part">
      <el-tabs tab-position="left" v-model="target" style="height: 200px;" @tab-click="onleftItemClick">
        <el-tab-pane label="关于我们" name="关于我们"></el-tab-pane>
        <el-tab-pane label="网站使命" name="网站使命"></el-tab-pane>
        <el-tab-pane label="我们的愿景" name="我们的愿景"></el-tab-pane>
        <el-tab-pane label="联系我们" name="联系我们"></el-tab-pane>
      </el-tabs>
    </div>
    <div class="about-right-part float-left" id="about-right-part">
      <div class="about-item">
        <h1 id="关于我们">关于我们</h1>
        <p>洋波科技，坐落于湖南软件职业学院 8-506 宿舍内,成立于2020-1 那是一个阳光明媚的下午,
        只有努力才能距离成功更进一步,你可以在这里写博客，分享笔记，分享链接，让更多的人知到你,
          收获知识。你可以在这里遇到志同道合的人.</p>
      </div>
      <div class="about-item">
        <h1 id="网站使命">网站使命</h1>
        <p>让编程学习更简单</p>
      </div>
      <div class="about-item">
        <h1 id="我们的愿景">我们的愿景</h1>
        <p>让编程学习更简单</p>
      </div>
      <div class="about-item">
        <h1 id="联系我们">联系我们</h1>
        <p>让编程学习更简单</p>
      </div>

      <div class="about-item">
        <img src="http://localhost:8090/portal/image/1595772726088_1287390238582243328.png" alt="" height="400px" width="600px">
      </div>

    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    //处理内容部分的h1 标签的区间
    let rightContent = document.getElementById('about-right-part')
    let h1List = rightContent.querySelectorAll('h1');
    h1List.forEach(item=>{
      this.contentHeader.push({
        offTop:item.offsetTop,
        id:item.id
      })
    })

    let that = this;
    window.addEventListener("scroll",this.onWindowScroll)
    window.onresize = function (){
      that.onWindowScroll()
    }
    this.onWindowScroll();
  },
  beforeDestroy() {
    window.removeEventListener('scroll',this.onWindowScroll)
  },
  data(){
    return{
      target:'关于我们',
      contentHeader:[]

    }
  },
  methods:{
    onleftItemClick(){
      this.$router.push({path:'/about#'+this.target})
      console.log(this.target)
    },
    onWindowScroll(){
      let dy = document.documentElement.scrollTop;
      let dx = document.documentElement.scrollLeft;
      let leftBox = document.getElementById('about-left-part')
      let parentBox = document.getElementById('about-box')
      if (leftBox){
        let leftBoxTop = leftBox.offsetTop
        let parentBoxTop = parentBox.offsetTop
        if (dy>parentBoxTop){
          leftBox.style.top = '0px'
        }else {
          leftBox.style.top = (parentBoxTop-dy)+'px'
        }
        //处理横向滑动
        if (dx>0){
          leftBox.style.left = -dx + 'px'
        }else {
          leftBox.style.left = parentBox.offsetLeft + 'px'
        }
      }

      //处理标签的滚动范围
      // if (dy % 2 === 0){
        for (let i = 0; i < this.contentHeader.length - 1; i++) {
          let first = this.contentHeader[i]
          let second = this.contentHeader[i+1]
          if (dy>first.offTop && dy<second.offTop){
            this.target = first.id
            break;
          // }

        }
      }

    }
  }
}
</script>

<style>
#about-left-part{
  top: 94px;
  position: fixed;
}
.about-right-part .about-item p{
  padding: 20px 0;
  line-height: 32px;

}
.about-right-part .about-item{
  margin-bottom: 84px;
}
.about-left-part .el-tabs--left .el-tabs__header.is-left{
  margin-right: 0;
}
.about-left-part .el-tabs__active-bar{
  width: 0!important;
}
.about-left-part .el-tabs__item{
  height: fit-content;
  padding-top: 20px;
  padding-bottom: 20px;
  border-right: 1px dashed #e0e0e0;
  color: #666666;
  font-size: 16px;
  transition: all .3s;
}
.about-left-part .el-tabs__nav{
  padding-right: 30px;

}
.about-left-part .el-tabs__item.is-active::after{
  content: " ";
  display: inline-block;
  position: absolute;
  right: -20px;
  width: 27px;
  height: 27px;
  border: 6px solid #ff5e5e;
  -webkit-border-radius: 50%;
  -moz-border-radius: 50%;
  border-radius: 50%;
  background-color: #ffffff;
  -webkit-transform: scale(.5);
  -moz-transform: scale(.5);
  -ms-transform: scale(.5);
  transform: scale(.5);

}
.about-left-part .el-tabs__nav-wrap::after{
  background:  rgba(0,0,0,0);
}
.about-left-part .el-tabs--left .el-tabs__header.is-left{
  float: none;
}
.about-box{
  background-color: #ffffff;
  margin-top: 20px;
  margin-bottom: 20px;
}
.about-left-part .el-tabs__item.is-active{
  color: #47494E;
  font-size: 18px;
  font-weight: 600;
  transition: all .3s;
}
.about-left-part .el-tabs--left, .el-tabs--right{
  height: auto!important;
}
.about-left-part{
  padding-top: 20px;
  min-height: 300px;
  width: 300px;
}
.about-right-part{
  margin-left: 300px;
  padding: 40px 20px 30px 20px;
  width: 800px;

}

</style>
