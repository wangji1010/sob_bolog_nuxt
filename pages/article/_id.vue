<template>
  <div class="article-detail-box clear-fix">
    <div class="article-left-box float-left">
      <div class="detail">
        <div class="article-title">
          <h1 v-text="articleRes.title"></h1>
        </div>
        <div class="article-info">
          <img :src="articleRes.userAvatar" alt="">
          <span class="userName">{{ articleRes.userName }}</span>
          <span>发表于: </span>
          <span><i class="el-icon-date"></i> {{ articleRes.createTime | formatDate("yyyy-MM-dd hh:mm") }}</span>
          <span><i class="el-icon-view"></i> {{ articleRes.viewCount }}</span>
        </div>
        <div class="article-label">
          <el-tag v-for="(item,index) in articleRes.articleLabels" :key="index" type="info" size="mini">
            {{ item }}
          </el-tag>
        </div>
        <div id="article-content" class="article-content">
          <div class="article-detail" v-html="articleRes.content">
          </div>
        </div>
      </div>
      <div class="article-comment-input" >
        <div class="article-comment-title">
          发表评论
        </div>
        <el-input
          @focus="checkLogin"
          rows="4"
          type="textarea"
          placeholder="文明的评论一句？"
          v-model="comment.content"
          maxlength="30"
          show-word-limit>
        </el-input>
        <div class="article-comment-btn">
          <el-button type="primary" size="small" @click="docomment(articleRes.id)">评论</el-button>
        </div>
      </div>
      <div class="article-comment-list-box">
        <div class="comment-list-title">
          文章评论
        </div>
        <div class="article-comment-list" id="article-comment-list">
          <div class="article-comment-item" v-for="(item,index) in commentList" :key="index">
            <div class="article-comment-user-info">
              <a :href="'/user/'+item.userId"><img :src="item.userAvatar" alt=""></a>
              <span>{{ item.userName }}</span>
            </div>
            <div class="article-comment-reply" v-if="item.parentContent!==null">
              <span>回复：{{ item.parentContent }}</span>
            </div>
            <div class="article-comment-content">
              {{ item.content }}
            </div>
            <div class="article-comment-action">
              <span class="el-icon-date">  {{ item.createTime | formatDate('yyyy-MM-dd hh:mm') }}</span>
              .
              <span class="item-reply-btn" @click="onReplyClick(index,item.userName)">回复</span>
            </div>
            <div class="article-sub-comment-box" style="display: none" :id="'sub_input_'+index">
              <div class="sub-input-comment">
                <el-input
                  @focus="checkLogin"
                  @keydown.enter.native="replySubComment(item.content,articleRes.id)"
                  rows="2"
                  type="textarea"
                  :placeholder="subCommentPlaceHolder"
                  v-model="subComment"
                  maxlength="30"
                  show-word-limit>
                </el-input>
              </div>
              <div class="sub-comment-btn">
<!--                <el-button type="primary" size="mini">回复</el-button>-->
              </div>
            </div>
          </div>
        </div>
        <div class="loader-more-comment" v-if="commentList.length===0">
          没有评论了, 快来抢个沙发吧 ~~~
        </div>
        <div v-else>
          <div class="loader-more-comment" v-if="lastPage>1" @click="doLoadMore">
            查看更多评论 >>
          </div>
          <div class="loader-more-comment" v-else>
            实在没有评论了
          </div>
        </div>
      </div>
      <!--推荐文章区域-->
      <div class="recommend-article-box">
        <div class="recommend-header-title">
          推荐文章
        </div>
        <div class="recommend-item" v-for="(item,index) in recommendArticle" :key="index">
          <div class="recommend-title">
            <a :href="'/article/'+item.id">{{ item.title }}</a>
          </div>
          <div class="recommend-summary">
            {{ item.summary }}
          </div>
          <div class="recommend-info">
            <span class="el-icon-date"> {{ item.createTime | formatDate("yyyy-MM-dd hh:mm") }}</span>
            <span class="el-icon-view"> {{ item.viewCount }}</span>
            <el-tag size="mini" type="info" v-for="(tag,index) in item.articleLabels" :key="index">{{ tag }}</el-tag>
          </div>
        </div>
      </div>
    </div>
    <div class="article-detail-right-box float-left">
      <!--标签-->
      <div id="hot-labels-box" class="right-card-labels-box">
        <div class="labels-title">
          热门标签
        </div>
        <div class="labels-card-content">
          <word-cloud></word-cloud>
        </div>
      </div>
      <!--广告-->
      <div id="taobao-info-box" class="taobao-info-box">
        <div class="taobao-info-title">
          广而告之
        </div>
        <div class="taobao-info-content">
          <TaobaoLoop/>
        </div>
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
let lastSubInputBox = null
export default {

  components: {WordCloud, TaobaoLoop},
  data() {
    return {
      comment: {
        content: '',
        articleId:'',
        parentContent:''
      },
      isImageDialogShow: false,
      targetPath: '',
      currentPage:1,
      pageSize:5,
      subComment:'',
      subCommentPlaceHolder:'高低整两句?'
    }
  },
  mounted() {
    hljs.initHighlighting()
    let contentBox = document.getElementById('article-content')
    let images = contentBox.querySelectorAll('img')
    images.forEach(item => {
      console.log(item)
      item.addEventListener('click', this.showImage)
    })
  },
  methods: {
    replySubComment(parentContent,articleId){
      //检查数据
      if (this.subComment===''){
        this.$message.error('回复内容不能为空！')
        return
      }
      //处理数据
      this.comment.content = this.subComment
      this.comment.parentContent = parentContent
      this.comment.articleId = articleId
      // console.log(this.comment)
      //发起请求，回复
      api.postComment(this.comment).then(res=>{
        if (res.code===200){
          this.subComment = ''
          this.getArticleCommentList(1)
         let commentBox = document.getElementById('article-comment-list')
          if (commentBox){
            //添加完成评论之后，滑动到最顶部
            commentBox.scrollIntoView({
              behavior:'smooth',
              block:'start'
            })
          }
          this.$message.success(res.message)
        }else {
          this.$message.success(res.message)
        }
      })
    },
    onReplyClick(index,userName){
      this.subComment = ''
      this.subCommentPlaceHolder = '回复：@'+userName
      let subIndexBox = document.getElementById('sub_input_'+index)
      if (subIndexBox){
        if (lastSubInputBox){
          lastSubInputBox.style.display = 'none'
        }
        lastSubInputBox = subIndexBox
        subIndexBox.style.display = 'block'
      }
    },
    doLoadMore(){
      this.currentPage++
      api.getCommentByArticleId(this.articleRes.id,this.currentPage,this.pageSize).then(res=>{
        if (res.code===200){
          //请求成功则把数据合并展示
          this.commentList = this.commentList.concat(res.data.records);
          //处理是否有更多  当前页 / 总页数 = 1 代表当前就是最后一页，不用显示
          if (res.data.current / res.data.pages===1){
            this.lastPage = res.data.current / res.data.pages
          }
        }else {
          this.$message.error('没有更多的评论')
        }
      }).catch(error=>{
        console.log(error);
      })
    },
    docomment(id){
      //检查是否登录
     let sobBlogToken = document.cookie.indexOf('blog_token');
     console.log('sob-blog-token:'+sobBlogToken)
      if (sobBlogToken=== -1){
        location.href='/login?redirect='+location.href
        return
      }
      //检查数据
      if (this.comment.content===''){
        this.$message.error('你没有填写评论内容！')
        return
      }
      //补全内容
      this.comment.articleId = id
      this.comment.parentContent=null
      console.log(this.comment)
      //提交内容
      api.postComment(this.comment).then(res=>{
        if (res.code===200){
          //清空一下评论框的内容
          this.comment.content=''
          this.getArticleCommentList(1)
          this.$message.success(res.message)
        }else {
          this.$message.error('评论失败，请先检查网络状态！')
        }
      })
      //刷新评论列表
    },
    getArticleCommentList(page){
      api.getCommentByArticleId(this.articleRes.id,page,10).then(res=>{
        this.commentList = res.data.records
        this.currentPage = page
      })
    },
    checkLogin(){
      //检查登录,是否有效
      api.checkToken().then(res=>{
        console.log(res)
        if (res.code===402){
          location.href='/login?redirect='+location.href
        }
      })
    },
    showImage(even) {
      this.isImageDialogShow = true
      this.targetPath = even.target.src
    }
  },
  /*
  加载文章详情需要将文章id传递
  * */
  async asyncData({params}) {
    let articleRes = await api.getArticleDetailById(params.id + '');
    let recommendArticle = await api.getRecommendArticle(articleRes.data.id, 10);
    //加载第一页的评论数据
    let commentRes = await api.getCommentByArticleId(articleRes.data.id, 1, 5);
    console.log(commentRes.data.pages)
    // console.log(recommendArticle.data)
    // console.log(params.id)
    return {
      articleRes: articleRes.data,
      recommendArticle: recommendArticle.data,
      commentList: commentRes.data.records,
      lastPage: commentRes.data.pages
    }
  }
}
</script>

<style>
.el-textarea__inner{
  font-size: 18px;
  font-weight: bold;
}
.article-sub-comment-box{
  margin-top: 10px;
  padding: 0 36px;
}
.article-comment-title{
  padding: 0 0 20px;
  font-size: 18px;
  font-weight: 600;
  color: #8a2be2;
}
.article-comment-btn{
  margin-top: 20px;
  text-align: right;
}
.article-comment-input {
  margin-bottom: 20px;
  border-radius: 4px;
  background-color: #ffffff;
  padding: 20px;
}

.article-comment-user-info span {
  font-size: 14px;
  font-weight: 600;
  color: #6f6f71;
}

.article-comment-user-info {
  line-height: 30px;
  vertical-align: middle;
}

.loader-more-comment:hover {
  color: blueviolet;
}

.loader-more-comment {
  margin-top: 20px;
  text-align: center;
  cursor: pointer;
  color: #7F828B;

}

.article-comment-reply {
  margin-top: 10px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  padding: 10px;
  background-color: #efeeee;
  margin-left: 30px;
}

.article-comment-content {
  padding: 10px;
  margin-left: 24px;
}

.item-reply-btn:hover {
  color: #8a2be2;
}

.item-reply-btn {
  color: #7F828B;
  cursor: pointer;
}

.article-comment-action {
  text-align: right;
  color: #7F828B;
}

.article-comment-list {
  margin-top: 20px;
}

.article-comment-item {
  border-bottom: 1px solid #dcdfe6;
  padding: 10px 0;
}

.article-comment-user-info img {
  vertical-align: middle;
  width: 30px;
  height: 30px;
  border-radius: 50%;
}

.article-comment-list-box {
  background-color: #ffffff;
  padding: 20px;
  margin-bottom: 20px;
}

.recommend-header-title, .comment-list-title {
  margin-bottom: 24px;
  font-size: 18px;
  font-weight: 600;
  color: blueviolet;
}

.recommend-info span {
  margin-right: 10px;
}

.recommend-info {
  color: #7F828B;
  font-size: 14px;
}

.article-title {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}

.recommend-summary {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  color: #7F828B;
  font-size: 16px;
  margin: 10px 0;
}

.recommend-title a:hover {
  color: blueviolet;
}

.recommend-title a {
  cursor: pointer;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  color: #47494E;
  font-weight: 600;
  font-size: 22px;
  line-height: 30px;
}

.recommend-item {
  border-bottom: 1px solid #cccccc;
  padding: 10px;
}

.recommend-info .el-tag {
  margin-right: 10px;
}

.recommend-article-box {
  padding: 20px;
  background-color: #ffffff;
  border-radius: 4px;
}

.detail {
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 20px;
  background: #ffffff;
}

.article-detail-right-box {
}

.taobao-loop-list img[data-v-566f0f8d] {
  width: 280px;
  height: 280px;
}

.taobao-info-content {
  margin-top: 20px;
  height: 280px;
}

.taobao-info-title {
  color: blueviolet;
  border-bottom: 1px solid #cccccc;
  padding-top: 10px;
  padding-bottom: 15px;
}

.taobao-info-box {
  border-radius: 4px;
  margin-top: 20px;
  background-color: #ffffff;
  padding: 10px;
}

.labels-card-content {
  padding-top: 28px;
  height: 220px;
}

.right-card-labels-box {
  border-radius: 4px;
  background-color: #ffffff;
}

.labels-title {
  color: blueviolet;
  padding: 10px;
  border-bottom: 1px solid #cccccc;
}

.el-dialog {
  width: 684px !important;
  height: 300px !important;
}

.el-dialog img {
  width: 684px;
  height: 300px;
}

.el-dialog__header {
  padding: 0 !important;
}

.el-dialog__body {
  padding: 0 !important;
}

.article-detail p, .article-detail ul {
  line-height: 20px;
  font-size: 16px;
  color: #7F828B;
  padding: 20px 0;
}

.article-detail h1 {
  color: #000;
  line-height: 40px;

}

.article-detail pre {
  max-height: 750px;
  overflow: scroll;
}

.article-detail pre code {
  font-size: 14px;


}

.article-detail img {
  cursor: zoom-in;
  margin: 10px 0;
  width: 780px;
}

.article-content {
  margin-top: 20px;
}

.article-label .el-tag {
  cursor: pointer;
  margin-right: 10px;
}

.article-label {
  margin-left: 32px;
  margin-top: 10px;
}

.userName {
  font-weight: 600;
}

.article-info span {
  color: #999999;
  font-size: 16px;
  line-height: 32px;
}

.article-info {

}

.article-info img {
  margin-right: 5px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  vertical-align: middle;
}

.article-detail-box {
  margin-top: 20px;
  margin-bottom: 20px;
}

.article-right-box {
  border-radius: 4px;
  width: 300px;
}

.article-left-box {
  border-radius: 4px;
  width: 820px;
  margin-right: 20px;
}
</style>
