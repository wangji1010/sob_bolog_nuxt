<template>
  <div id="index-page-box" class="index-page-box clear-fix">
    <div id="index-left-part" class="index-left-part default-border-radius float-left">
      <div class="index-left-user-info">
        <div class="user-avatar">
          <img :src="userInfo.avatar" alt="">
        </div>
        <div class="user-name">
          <span v-text="userInfo.userName"></span>
        </div>
        <div class="user-sign">
          <span v-text="userInfo.sign"></span>
        </div>
      </div>
      <div class="left-user-self-links">
        <span class="iconfont icon-weixin "></span>
        <span class="iconfont icon-github  "></span>
        <span class="iconfont icon-dianshi  "></span>
      </div>
      <div class="left-categories-box">
        <div
          :class="currentCategoryId===item.id ? 'categories-item-active default-border-radius' :'categories-item default-border-radius'"
          v-for="(item,index) in categories" :key="index">
          <span v-text="item.cName" @click="listArticleByCategoryId(item)"></span>
        </div>
      </div>

    </div>
    <div id="index-center-part" class="index-center-part float-left">
      <div class="loop-box">
        <el-carousel :interval="5000" arrow="always">
          <el-carousel-item v-for="(item,index) in loops" :key="index">
            <img :src="item.imageUrl" style="object-fit: cover" alt="">
          </el-carousel-item>
        </el-carousel>
      </div>
      <!--置顶区域-->
      <div class="article-box">
        <div class="article-item clear-fix" v-for="(item,index) in topArticle" :key="index">
          <div class="article-left float-left">
            <div class="article-title">
              <span class="tips">置顶</span>
              <span class="title"><a :href="'/article/'+item.id">{{item.title}}</a></span>
            </div>
            <div class="article-summary">
              <p>{{ item.summary }}
                <span>...</span>
                <span class="readmore">阅读全文</span>
              </p>
            </div>
            <div class="labels">
              <el-tag v-for="(label,index1) in item.articleLabels" :key="index1">
                <a target="_blank" :href="'/search?keyword='+encodeURIComponent(label)+'&page=1&size=5&categoryId='">
                  {{ label }}</a>
              </el-tag>
            </div>
          </div>
          <div class="article-right float-right">
            <div class="article-cover">
              <img :src="'http://localhost:8090/portal/image/'+item.cover" alt="">
            </div>
          </div>
        </div>
      </div>
      <!--普通文章区域-->
      <div class="last-articles-box"
           v-loading="isLoading">
        <div class="article-item clear-fix" v-for="(item,index) in articles" :key="index">
          <div class="article-left float-left">
            <div class="article-title">
              <span class="title"><a :href="'/article/'+item.id">{{item.title}}</a></span>
            </div>
            <div class="article-summary">
              <p>{{ item.summary }}
                <span>...</span>
                <span class="readmore">阅读全文</span>
              </p>
            </div>
            <div class="labels">
              <el-tag v-for="(label,index1) in item.articleLabels" :key="index1">
                <a target="_blank" :href="'/search?keyword='+encodeURIComponent(label)+'&page=1&size=5&categoryId='">
                  {{ label }}</a>
              </el-tag>
            </div>
          </div>
          <div class="article-right float-right">
            <div class="article-cover">
              <img :src="'http://localhost:8090/portal/image/'+item.cover" alt="">
            </div>
          </div>
        </div>
      </div>
      <div class="article-page-navgation-bar">
        <el-pagination
          @size-change="onSizeChange"
          @current-change="onPageChange"
          :current-page="pageNavigation.currentPage"
          :page-sizes="[3, 5, 8, 10]"
          :page-size="pageNavigation.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageNavigation.totalCount">
        </el-pagination>
      </div>
    </div>
    <div class="index-right-part float-left">
      <!--搜索-->
      <div class="right-card">
        <div class="card-title">
          搜索
        </div>
        <div class="card-content">
          <el-input
            @keyup.enter.native="toSearch"
            size="mini"
            placeholder="请输入内容"
            prefix-icon="el-icon-search"
            v-model="keyword">
          </el-input>
        </div>
      </div>
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

      <div class="right-card">
        <div class="card-title">
          联系我
        </div>
        <div class="card-content">
          <div class="labels-list-box">
            <img src="http://39.106.150.176:8090/upload/2020/09/weixin-43b6e4751cf74858a9bd7febe6eed2dc-thumbnail.png"
                 alt="">
          </div>
        </div>
      </div>
      <!--广告-->
      <div id="taobao-box" class="taobao-box">
        <TaobaoLoop/>
      </div>
    </div>

  </div>
</template>

<script>
import * as  api from '../api/api'
import TaobaoLoop from "@/components/TaobaoLoop";
import WordCloud from "@/components/WordCloud";

export default {
  components: {TaobaoLoop, WordCloud},
  mounted() {
    this.getLabelsAll()
    let centerPart = document.getElementById('index-center-part');
    let leftPart = document.getElementById('index-left-part');
    if (centerPart && leftPart) {
      let baseTop = centerPart.offsetTop;
      leftPart.style.top = baseTop + 'px';
    }
    window.addEventListener('scroll', this.onWindowScroll)
    let that = this
    window.onresize = function () {
      that.onWindowScroll()
    }

  },
  data() {
    return {
      fontSize: [10, 25],
      rotate: {from: -10, to: 30, numOfOrientation: 10},
      margin: {top: 0, right: 0, bottom: 0, left: 0}
      ,
      isLoading: false,
      keyword: '',
      defaultWords: [],
      currentCategoryId: '',
      topArticle: '',
      topArticleLabels: []
    }
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.onWindowScroll)
  },
  methods: {
    toSearch() {
      //如果没有输入内容，则无效
      this.keyword = this.keyword.trim()
      if (this.keyword === '') {
        console.log('内容为空！')
        return;
      }
      //跳转到搜索页面
      this.$router.push({
        path: '/search',
        query: {
          // keyword: encodeURIComponent(this.keyword),
          keyword: this.keyword,
          page: 1,
          size: 5,
          categoryId: '',
          sort: '2'
        }
      })
      // location.href = '/search/'+encodeURIComponent(this.keyword)
    },
    listArticleByCategoryId(item) {
      //当前如果点击同一个id 得话不进行加载
      if (item.id === this.currentCategoryId) {
        return
      }
      //重置页码
      this.pageNavigation.currentPage = 1
      this.pageNavigation.pageSize = 5
      this.currentCategoryId = item.id;
      //请求数据
      api.getArticles(this.currentCategoryId, this.pageNavigation.currentPage, this.pageNavigation.pageSize)
        .then(res => {
          this.handleArticleRes(res)
        })
      //处理结果
    },
    onWindowScroll() {
      let scrollTop = document.documentElement.scrollTop
      let scrollLeft = document.documentElement.scrollLeft
      let centerPart = document.getElementById('index-center-part');
      let parentPart = document.getElementById('index-page-box');
      let leftPart = document.getElementById('index-left-part');
      //处理上下滑动
      if (centerPart && leftPart && parentPart) {
        let baseTop = centerPart.offsetTop;
        if (scrollTop <= baseTop) {
          leftPart.style.top = (baseTop - scrollTop) + 'px';
        } else {
          leftPart.style.top = '20px'
        }
        //处理左右滑动
        if (scrollLeft > 0) {
          leftPart.style.left = -scrollLeft + 'px';
        } else {
          //正常状态
          leftPart.style.left = parentPart.offsetLeft + 'px'
        }
      }
      //右边部分得悬浮内容
      let taobaoAd = document.getElementById('taobao-box');
      let hotLabelsBox = document.getElementById('hot-labels-box');
      if (taobaoAd && hotLabelsBox) {
        let bootomOfTB = taobaoAd.offsetTop + taobaoAd.offsetHeight;
        if (scrollTop >= bootomOfTB) {
          //显示悬浮内容
          hotLabelsBox.style.position = 'fixed';
          hotLabelsBox.style.top = '20px';
          hotLabelsBox.style.width = '200px';

        } else {
          hotLabelsBox.style.position = '';
          hotLabelsBox.style.top = '';

        }
        //处理左右滑动
        if (scrollLeft > 0) {
          hotLabelsBox.style.left = parentPart
              .offsetWidth + parentPart
              .offsetLeft - scrollLeft - hotLabelsBox.offsetWidth
            + 'px';
        } else {
          //正常状态
          hotLabelsBox.style.left = parentPart.offsetWidth - hotLabelsBox.offsetWidth + parentPart.offsetLeft + 'px';

        }

      }
    },
    getLabelsAll() {
      api.getLabelsAll(15).then(res => {
        if (res.code === 200) {
          this.defaultWords = res.data;
        }
      })
    },

    handleArticleRes(res) {
      if (res.code === 200) {
        this.articles = res.data.records
        this.topHeader()
        //处理一下页码
        this.pageNavigation.currentPage = res.data.current
        this.pageNavigation.totalCount = res.data.total
        this.pageNavigation.pageSize = res.data.size
        this.pageNavigation.totalPage = res.data.pages
      } else {
        this.$message.error(res.message)
      }
    },
    //当页面尺寸发生大小改变
    onSizeChange(size) {
      this.isLoading = true
      if (this.currentCategoryId !== '') {
        //加载当前页的内容
        api.getArticles(this.currentCategoryId + this.pageNavigation.currentPage, size).then(res => {
          this.handleArticleRes(res)
          this.isLoading = false
        })
      } else {
        api.getArticles('' + this.pageNavigation.currentPage, size).then(res => {
          this.handleArticleRes(res)
          this.isLoading = false
        })
      }

    },
    //当页数发生改变时
    onPageChange(page) {
      this.isLoading = true
      //携带分类得列表
      if (this.currentCategoryId !== '') {
        api.getArticles(this.currentCategoryId, page, this.pageNavigation.pageSize).then(res => {
          this.handleArticleRes(res)
          this.isLoading = false
        })
      } else {
        //没有携带分类得列表
        api.getArticles('', page, this.pageNavigation.pageSize).then(res => {
          this.handleArticleRes(res)
          this.isLoading = false
        })
      }


    },
    topHeader() {
      //加载完成回到页面得顶部
      let topHeader = document.getElementById('blog-header');
      if (topHeader) {
        topHeader.scrollIntoView({
          block: 'start',
          behavior: 'smooth'
        })
      }
    },

  },
  async asyncData({params}) {
    let userInfo = await api.getAdminInfo();
    let categories = await api.getCategories();
    let loops = await api.getLoopList();
    let topArticle = await api.getArticlTop();
    let Articles = await api.getArticles('', 1, 5)


    let pageNavigation = {
      currentPage: Articles.data.current,
      totalCount: Articles.data.total,
      pageSize: Articles.data.size,
      totalPage: Articles.data.pages

    }
    let tempCategories = [];
    tempCategories.push({
      cName: '全部分类',
      id: ''
    })
    tempCategories = tempCategories.concat(categories.data)
    return {
      pageNavigation: pageNavigation,
      categories: tempCategories,
      userInfo: userInfo.data,
      loops: loops.data,
      topArticle: topArticle.data,
      articles: Articles.data.records
    };
  }
}
</script>
<!--240px  660px  240px-->
<style>
.labels .el-tag a:hover {
  color: blueviolet;
}

.labels .el-tag a {
  color: #8b7979;
}

.labels .el-tag {
  margin-right: 10px;
}

#index-left-part {
  position: fixed;
  top: 0;
}

.taobao-box .el-carousel__container {
  position: relative;
  height: 220px;
}

.wordCloud {
  height: 200px !important;
}

.wordCloud svg {
  position: static !important;
}

.wordCloud .text {
  cursor: pointer;
}

.labels-list-box img {
  width: 200px;
  height: 200px;
}

.labels-list-box {
  height: 200px;
}

.right-card {
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 20px;
  background: #ffffff;
}

.right-card .card-title {
  color: #999999;
  margin-bottom: 10px;
  font-size: 12px;
  font-weight: 600;
}

.article-page-navgation-bar {
  text-align: center;
}

.labels .el-tag {
  height: 22px;
  line-height: 22px;
  cursor: pointer;
  margin-top: 10px;
}

.readmore:hover {
  color: #5a4d4d;
}

.readmore {
  color: #999999;
  font-size: 10px;
  border-radius: 4px;
  padding: 3px 4px;
  cursor: pointer;
}

.article-summary {
  max-width: 400px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  -webkit-line-clamp: 1;
  font-size: 14px;
  color: #606266;
  margin-top: 20px;
}

.article-item {
  padding: 10px;
  background: #ffffff;
  margin-bottom: 20px;
}

.article-title .tips {
  vertical-align: middle;
  color: #ffffff;
  font-size: 16px !important;
  padding: 3px 10px;
  border-radius: 4px;
  background: #E6A23C;
}
.article-title .title a:hover{
  color: blueviolet;
}
.article-title .title a{
  color: #303133;
  vertical-align: middle;
  font-size: 20px;
}
.article-title .title {

}

.article-box {
  margin-top: 20px;
}

.article-cover img {
  border-radius: 4px;
  width: 120px;
  height: 120px;
  object-fit: cover;
}

.loop-box img {
  width: 100%;
  height: 300px;
}

.left-categories-box .categories-item:hover, .left-categories-box .categories-item-active {
  background: #F5F5F5;
  color: #8a2be2 !important;
}

.left-categories-box .categories-item, .left-categories-box .categories-item-active {
  margin: 0 5px;
  color: #999999;
  cursor: pointer;
  padding: 10px 5px;
}

.left-categories-box {
  padding-bottom: 10px;
  padding-top: 20px;
  text-align: center;
  background: #fff;
}

.left-user-self-links {
  padding-top: 10px;
  text-align: center;
  background: #fff;
}

.left-user-self-links span:hover {
  color: #606060;
}

.left-user-self-links span {
  font-size: 30px;
  cursor: pointer;
  font-weight: 600;
  color: #cacaca;
  margin-left: 15px;
  margin-right: 1px;

}

.default-border-radius {
  border-radius: 4px;
}

.index-left-user-info .user-sign {
  margin-top: 14px;
  color: #cacaca;
}

.index-left-user-info .user-name {
  color: #606060;
  margin-top: 10px;
  font-size: 20px;
}

.index-left-user-info {
  padding-top: 10px;
  text-align: center;
  background: #fff;
}

.index-left-user-info .user-avatar img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
}

.index-page-box {
  margin-top: 10px;
  margin-bottom: 10px;
}

.index-left-part {
  border-radius: 4px;
  width: 220px;
  margin-right: 20px;
}

.index-right-part {
  margin-left: 20px;
  width: 220px;
}


.index-center-part {
  width: 660px;
  margin-left: 240px;

}

.taobao-box {
  border-radius: 4px;
  background: #ffffff;
  margin-top: 20px;
}


</style>
