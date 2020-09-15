<template>
  <div id="blog-box">
    <div id="blog-header" class="blog-header clear-fix">
      <div class="logo-box float-left">
        <div class="logo">
          <a href="/"><h3>沙雕博客</h3></a>
          </div>
      </div>
      <div id="login-tips-tex-box" style="display: none"  class="login-tips-tex-box float-right">
       <span>
         <a :href='"/login?redirectPath="+redirectPath'><i class="iconfont icon-zhiwen" ></i>登录</a>
       </span>
       <span>
         <a href="/register"><i class="iconfont icon-tianjia"></i>注册</a>
       </span>
      </div>
      <div id="user-info-box" style="display: none" class="user-info-box float-right">
        <div v-if="userInfo!==null" class="header-user-username float-right">
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              {{userInfo.userName}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="userInfo">用户信息</el-dropdown-item>
              <el-dropdown-item command="adminCenter" v-if="userInfo.roles==='role_admin'">管理中心</el-dropdown-item>
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div v-if="userInfo!==null" class="head-user-avatar float-left">
          <img :src="userInfo.avatar" alt="">
        </div>
      </div>
      <div class="navgation-box float-right">
        <NuxtLink to="/">
          <span><i class="iconfont icon-shouye"></i>首页</span>
        </NuxtLink>
        <NuxtLink to="/about">
          <span><i class="iconfont icon-fl-xinxi"></i>关于</span>
        </NuxtLink>
        <NuxtLink to="/link">
          <span><i class="iconfont icon-lianjie"></i>友链</span>
        </NuxtLink>
      </div>




    </div>
    <Nuxt />
    <div class="blog-footer">
      <div class="copy">
        <p>
          究极备案号21515715413|
        </p>
      </div>

      <div>
        <span>关于我们</span> |
        <span>关于我们</span> |
        <span>关于我们</span>|
        <span>关于我们</span> |
      </div>

    </div>
  </div>
</template>

<script>
import * as api from '../api/api'
export default {
  mounted() {
    if (this.redirectPath !==''&&this.route.path!=='/'&&this.route.path!=='/login'){
      this.redirectPath = location.href
    }
    this.checkToken()
  },
  data(){
    return{
      redirectPath:'',
      userInfo:null
    }
  }
  ,methods:{
    handleCommand(command){
      if (command==='logout'){
        api.doLoginOut().then(res=>{
          if (res.code===200){
            console.log(res)
            //跳转到登录的页面
            location.href = '/login';
            this.$message.info(res.message)
          }
        })
      }else if (command==='adminCenter'){
        //管理中心
        location.href = ''
      }else if (command==='userInfo'){
        location.href = '/information'
      }
    },
    checkToken(){
      api.checkToken().then(res=>{
        let loginTips = document.getElementById('login-tips-tex-box');
        let userInfoBox = document.getElementById('user-info-box');
        if (res.code===200){
          //获取成功
          this.userInfo = res.data
          //控制顶部登陆提示的显示
          if (userInfoBox){
            userInfoBox.style.display = 'block'
          }
        }else if (loginTips){
          loginTips.style.display = 'block'
        }



      })
    }
  }
}
</script>

<style>
.header-user-username span{
  cursor: pointer;
}
.user-info-box{
  margin-right: 20px;
}
.head-user-avatar img{
  margin-right: 10px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  vertical-align: middle;
}
.navgation-box i{
  font-size: 18px;
  font-weight: 600;
}
.login-tips-tex-box a{
  color: #737f90;
}
.login-tips-tex-box span{
  margin-right: 10px;
}
.login-tips-tex-box{
  color: #737f90;
  font-size: 18px;
  cursor: pointer;
}
.default-borader-radius{
  border-radius: 4px;
}
.navgation-box span:hover , .login-tips-tex-box span:hover , .login-tips-tex-box span a:hover{
  color: #134e84;
}
.navgation-box span{
  color: #737f90;
  font-size: 18px;
  cursor: pointer;
  margin-right: 40px;
}
.navgation-box{
  right: 200px;
  position: absolute;
  text-decoration: none;
}
.login-tips-tex-box{
  margin-right: 40px;
  font-size: 16px;
}
.logo-box .logo{
  color: #737f90;
  font-size: 15px;
  font-weight: 600;
}
.copy{
  margin-bottom: 10px;
}
.blog-footer{
  color: #737f90;
  text-align: center;
  padding-bottom: 30px;
}
*{
  text-decoration: none!important;
  margin: 0;
  padding: 0;
}
.blog-header{
  position: relative;
  line-height: 30px;
  margin-top: 20px;
  background-color: #fff;
  padding: 10px;
}
body{
  background: #f2f2f2;
}
#blog-box{
  width: 1140px;
  margin: 0 auto;
}
.float-left{
  float: left;
}
.float-right{
  float: right;
}
.clear-fix{
overflow: hidden;
  zoom: 1;
}
</style>
