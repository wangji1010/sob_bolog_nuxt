<template>
  <div class="search-box ">
    <div class="search-input-box">
      <div class="search-input-container clear-fix">
        <div class="search-log float-left">
          <span class="logo">沙雕</span>
          <span>|</span>
          <span>搜索</span>
        </div>
        <div class="search-input float-left">
          <el-input @keyup.enter.native="toSearchPage" placeholder="你有啥要搜索得吗" v-model="keyword"></el-input>
        </div>
        <div class="search-btn float-left">
          <el-button type="primary" @click="toSearchPage" icon="el-icon-search">搜索</el-button>
        </div>
      </div>
    </div>
    <div class="search-condition">
      <div class="select-item">
        <span :class="sort===''||'0'?'sort-active' : ''" @click="doSearch">综合排序</span>
        <span @click="getSearchBySort('2')" :class="sort==='2'||'1'?'sort-active' : ''">时间</span>
        <span @click="getSearchByViews('4')" :class="sort==='3'||'4'?'sort-active' : ''">浏览量</span>
      </div>
      <div class="select-item">
        <span :class="this.categoryId===''?'category-active':''" @click="doSearchAll">全部分类</span>
        <span v-for="item in categories" :key="item.id"
              :class="item.id === categoryId ? 'category-active' : ''"
              @click="getSearchByCategoryId(item.id)">{{ item.cName }}</span>
      </div>
    </div>
    <div class="search-res-box clear-fix">
      <div class="search-left-part float-left">
        <!--820px-->
        <div v-if="pageNavigation.totalSize>0" class="search-res-list">
          <div class="search-res-count-info">
            找到约 <span v-text="this.pageNavigation.totalSize"></span> 条结果
          </div>
          <div class="search-res-list-box" v-loading="isLoading">
            <div v-if="index!==0" class="search-res-item" v-for="(item,index) in contents" :key="index">
              <div class="res-item-title" v-html="item.title"></div>
              <div class="res-item-content" v-html="item.content"></div>
              <div class="search-info-box">
                <span class="iconfont icon-rili">{{ item.createTime | formatDate("yyyy-MM-dd hh:mm") }}</span>
                <span><i class="iconfont icon-shitu iconsize"></i>{{ item.viewCount }}</span>
                <span>
                <el-tag
                  size="mini"
                  v-for="(tag,tagIndex) in item.labels"
                  :key="tagIndex"
                  effect="plain"
                >{{ tag }}</el-tag>
              </span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="pageNavigation.totalSize>0" class="search-res-pageNavigation clear-fix">
          <!-- <el-pagination
             @size-change="handleSizeChange"
             @current-change="handleCurrentChange"
             :current-page="this.page"
             :page-size="this.size"
             layout="prev, pager, next, jumper"
             :total="this.pageNavigation.totalSize">
           </el-pagination>-->
          <el-link disabled v-if="parseInt(page)===1">&lt;&lt;上一页</el-link>
          <el-link v-else :href="'/search?keyword='+keyword+'&page='+(page-1)+'&size='+size+'&categoryId='+categoryId">
            &lt;&lt;上一页
          </el-link>
          <el-link class="float-right" disabled v-if="pageNavigation.totalPage/pageNavigation.currentPage === 1">下一页
            &gt;&gt;
          </el-link>
          <el-link class="float-right" v-else
                   :href="'/search?keyword='+keyword+'&page='+(parseInt(page)+1)+'&size='+size+'&categoryId='+categoryId">
            下一页 &gt;&gt;
          </el-link>

          <!-- <div class="search-pre float-left" v-if="parseInt(page)!==1"><a :href="'/search?keyword='+keyword+'&page='+(page-1)+'&size='+size+'&categoryId='+categoryId">&lt;&lt;上一页</a></div> -->
          <!-- <div class="search-next float-right" v-if="pageNavigation.totalPage/pageNavigation.currentPage!==1"><a :href="'/search?keyword='+keyword+'&page='+(parseInt(page)+1)+'&size='+size+'&categoryId='+categoryId">下一页 &gt;&gt;</a></div> -->
        </div>
        <div v-if="pageNavigation.totalSize<=0" class="search-res-empty-box">
          <div class="empty-box">
            <div class="">
              <img
                src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1599976855170&di=e35bed515767b53ebde31c136479d01d&imgtype=0&src=http%3A%2F%2Fpic.soutu123.cn%2Felement_origin_min_pic%2F17%2F02%2F28%2F8e959816807d2a8b3796c76270ace890.jpg%2521%2Ffw%2F700%2Fquality%2F90%2Funsharp%2Ftrue%2Fcompress%2Ftrue"
                alt="">
            </div>
            <div class="empty-text">没有找到相关内容</div>
          </div>
        </div>
      </div>
      <div class="search-right-part float-left">
        <!--300px-->
        <div class="search-words-cloud-add">
          <div class="card-header">热门标签</div>
          <word-cloud></word-cloud>
        </div>

        <div class="search-taobao-add">
          <div class="card-header">广而告之</div>
          <taobao-loop/>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import * as api from '../../api/api'
import WordCloud from "@/components/WordCloud";
import TaobaoLoop from "@/components/TaobaoLoop";

export default {
  components: {WordCloud, TaobaoLoop},
  mounted() {
    this.keyword = this.$route.query.keyword
    this.page = this.$route.query.page
    this.size = this.$route.query.size
    this.categoryId = this.$route.query.categoryId
    this.sort = this.$route.query.sort
    this.getSearchList()
    this.getCategories()
  },
  data() {
    return {
      isLoading: false,
      one: 1,
      keyword: '',
      page: 1,
      size: 5,
      categoryId: '',
      sort: 1,
      contents: [],
      pageNavigation: {
        totalSize: '',
        totalPage: '',
        pageSize: '',
        currentPage: ''
      },
      categories: []
    }
  },
  methods: {
    doSearchAll() {
      location.href = '/search?keyword=' + encodeURIComponent(this.keyword) + '&page=' + this.page + '&size=' + this.size + '&sort=&categoryId='
    },
    getSearchByCategoryId(CategoryId) {
      console.log('=====id====' + CategoryId)
      //发起请求根据分类拿数据
      location.href = '/search?keyword=' + encodeURIComponent(this.keyword) + '&page=' + this.page + '&size=' + this.size + '&categoryId=' + CategoryId
    },
    getSearchByViews(view) {
      if (view === '4' && this.sort === '4') {
        view = '3'
      }
      location.href = '/search?keyword=' + encodeURIComponent(this.keyword) + '&page=' + this.page + '&size=' + this.size + '&sort=' + view + '&categoryId=' + this.categoryId
    },
    doSearch() {
      location.href = '/search?keyword=' + encodeURIComponent(this.keyword) + '&page=' + this.page + '&size=' + this.size + '&sort=0&categoryId=' + this.categoryId

    },
    getSearchBySort(sort) {
      if (sort === '2' && this.sort === '2') {
        sort = '1'
      }
      console.log(sort)
      location.href = '/search?keyword=' + encodeURIComponent(this.keyword) + '&page=' + this.page + '&size=' + this.size + '&sort=' + sort + '&categoryId=' + this.categoryId
    },
    toSearchPage() {
      location.href = '/search?keyword=' + encodeURIComponent(this.keyword) + '&page=' + this.page + '&size=' + this.size + '&sort=' + this.sort + '&categoryId=' + this.categoryId
    },

    async getCategories() {
      await api.getCategories().then(res => {
        console.log(res.data)
        this.categories = res.data
      })
    },
    handleSizeChange() {
      console.log('res-----sizechange')
      this.getSearchList();
    },
    handleCurrentChange() {
      api.getSearchContent(this.keyword, this.page, this.size).then(res => {
        this.dealRes(res)
      })
    },
    dealLabels(res) {
      res.forEach(item => {
        item.labels = (item.labels || '').split('-')
      })
    },
    dealRes(res) {
      console.log('发起了额请求' + this.page)
      this.contents = res.data
      this.dealLabels(res.data)
      this.pageNavigation.totalSize = res.data[0].totalSize
      this.pageNavigation.currentPage = res.data[0].currentPage
      this.pageNavigation.totalPage = res.data[0].totalPage
      this.pageNavigation.pageSize = res.data[0].pageSize

    },
    async getSearchList() {
      this.isLoading = true
      console.log('<><><><><sort>' + this.sort)
      await api.getSearchContent(this.keyword, this.page, this.size, this.sort, this.categoryId).then(res => {
        console.log(res.data)
        this.dealRes(res)
      })
      this.isLoading = false
    }
  },

}
</script>

<style scoped>
.search-taobao-add{
  padding-top: 15px;
  height: 240px;
  background: #ffffff;
}
.card-header {
  border-bottom: 1px solid #cacaca;
  padding-bottom: 15px;
  text-align: left;
  color: #999999;
  margin: 0 10px;
  font-size: 12px;
  font-weight: 600;
}

.wordCloud svg {
  text-align: center;
  height: 300px!important;
  position: static !important;
}

.search-words-cloud-add {
  margin-bottom: 10px;
  padding-top: 15px;
  background: #ffffff;
  text-align: center;
  vertical-align: middle;
}

.search-res-empty-box {
  text-align: center;
  height: 400px;
}

.category-active, .sort-active {
  background: blueviolet;
  border-radius: 4px;
  color: #ffffff !important;
}

.select-item span:hover {
  color: blueviolet;
}


.select-item span {
  color: #bfbbbb;
  cursor: pointer;
  font-size: 14px;
  margin-right: 10px;
  margin-left: 10px;
  padding: 5px 10px;
}

.select-item {
  margin-top: 10px;
  line-height: 24px;
}

.el-input .el-input__inner {
  border: 3px solid #dcdfe6 !important;
}

.search-log .logo {
  font-size: 30px;

}

.search-log {
  margin-right: 20px;
  color: blueviolet;
  font-size: 20px;
}

.search-input-container {
  display: inline-block;
  line-height: 40px;
}

.search-input {
  margin-right: 20px;
  width: 250px;
}

.search-pre:hover, .search-next:hover {
  color: blueviolet;
}

.search-pre-disable, .search-next-disable {
  cursor: not-allowed;
}

.search-pre, .search-next {
  cursor: pointer;
}

.search-res-list {
  background: #ffffff;
}

.search-res-pageNavigation {
  background: #ffffff;
  padding: 20px;
}

.iconsize {
  margin-right: 3px;
  font-size: 12px;
}

.search-info-box span {
  margin-right: 10px;
}

.search-info-box {
  color: #999999;
  font-size: 14px;
}

.res-item-content {
  line-height: 20px;
  font-size: 16px;
  color: #4d5156;
  margin-top: 10px;
  margin-bottom: 10px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.search-res-item {
  margin-bottom: 20px;
}

.res-item-title {
  height: 26px;
  display: -webkit-box;
  overflow: hidden;
  cursor: pointer;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  font-size: 20px;
  color: dodgerblue;
  line-height: 26px;
}

.search-res-list-box {
  margin-left: 20px;
  margin-bottom: 10px;
  padding-bottom: 10px;
}

.search-res-count-info {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #70757a;
  font-size: 16px;
  line-height: 20px;
  padding: 20px;
}

.search-input-box {
  text-align: center;
  padding: 20px;
  background: #ffffff;
}

.search-condition {
  border-top: 1px solid #dcdfe6;
  padding: 20px;
  height: 80px;
  background: #ffffff;
  margin-bottom: 20px;

}

.search-box {
  margin-top: 20px;
  margin-bottom: 20px;
}

.search-left-part {
  margin-right: 20px;
  width: 900px;

}

.search-right-part {
  width: 220px;
}

.el-pagination {
  text-align: center;
}
</style>
