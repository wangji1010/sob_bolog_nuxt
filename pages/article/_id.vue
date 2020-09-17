<template>
  <div class="article-detail-box clear-fix">
    <div class="article-left-box float-left">
        <div class="article-title">
          <h1 v-text="articleRes.title"></h1>
        </div>
      <div class="article-info">
        <img :src="articleRes.userAvatar" alt="">
        <span class="userName">{{articleRes.userName}}</span>
        <span>发表于: </span>
        <span><i class="el-icon-date"></i> {{articleRes.createTime | formatDate("yyyy-MM-dd hh:mm")}}</span>
        <span><i class="el-icon-view"></i> {{articleRes.viewCount}}</span>
      </div>
      <div class="article-label">
        <el-tag v-for="(item,index) in articleRes.articleLabels" :key="index" type="info" size="mini">
          {{item}}
        </el-tag>
      </div>
      <div id="article-content" class="article-content">
          <div class="article-detail" v-html="articleRes.content"></div>
      </div>
    </div>
    <div class="article-right-box float-left">
      <!--标签-->
      <div id="hot-labels-box" class="right-card">
        <div class="card-title">
          热门标签
        </div>
        <div class="card-content">
          <div class="labels-list-box">
            <word-cloud></word-cloud>
          </div>
        </div>
      </div>
      <!--广告-->
      <div id="taobao-box" class="taobao-box">
        <TaobaoLoop/>
      </div>

    </div>
    <div class="dialog-detail-image-part">
      <el-dialog
        :visible.sync="isImageDialogShow">
        <img :src="targetPath" alt="">
      </el-dialog>
    </div>
  </div>
</template>

<script>
import * as api from '../../api/api'
import hljs from 'highlight.js';
import 'highlight.js/styles/docco.css';
import TaobaoLoop from "@/components/TaobaoLoop";
import WordCloud from "@/components/WordCloud";
export default {
  components: {TaobaoLoop, WordCloud},
  data(){
    return{
      isImageDialogShow:false,
      targetPath:''
    }
  },
  mounted() {
    hljs.initHighlighting()
    let contentBox = document.getElementById('article-content')
    let images = contentBox.querySelectorAll('img')
    images.forEach(item=>{
      console.log(item)
      item.addEventListener('click',this.showImage)
    })
  },
  methods:{
    showImage(even){
      this.isImageDialogShow = true
      this.targetPath = even.target.src
    }
  },
  /*
  加载文章详情需要将文章id传递
  * */
  asyncData({params}){
    console.log(params.id)
    return api.getArticleDetailById(params.id+'').then(res=>{
      if (res.code===200){
        console.log(res.data)
        return {
          articleRes: res.data
        }
      }
    })
  }
}
</script>

<style>
.el-dialog{
  width: 684px!important;
  height: 300px!important;
}
.el-dialog img{
  width: 684px;
  height: 300px;
}

.el-dialog__header{
 padding: 0!important;
}
.el-dialog__body{
  padding: 0!important;
}
.article-detail p,.article-detail ul{
  line-height: 20px;
  font-size: 16px;
  color: #7F828B;
  padding: 20px 0;
}
.article-detail h1{
  color: #000;
  line-height: 40px;

}
.article-detail pre{
  max-height: 750px;
  overflow: scroll;
}
.article-detail pre code{
  font-size: 14px;


}
.article-detail img{
  cursor: zoom-in;
  margin: 10px 0;
  width: 780px;
}
.article-content{
  margin-top: 20px;
}

.article-label .el-tag{
  cursor: pointer;
    margin-right: 10px;
}
.article-label{
  margin-left: 32px;
  margin-top: 10px;
}
.userName{
  font-weight: 600;
}
.article-info span{
  color: #999999;
  font-size: 16px;
  line-height: 32px;
}
.article-info{

}
.article-info img{
  margin-right: 5px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  vertical-align: middle;
}
.article-detail-box{
  margin-top: 20px;
  margin-bottom: 20px;
}
.article-right-box{
  border-radius: 4px;
  width: 300px;
  height: 400px;
  background: #cacaca;
}
.article-left-box{
  padding: 20px;
  border-radius: 4px;
  background: #ffffff;
  width: 780px;
  margin-right: 20px;
}
</style>
