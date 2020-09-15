<template>
  <!--中间内容-->
  <div class="admin-login-center-box center">
    <div class="login-center-box">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form :model="sobUser" label-position="right" label-width="80px">
            <el-form-item label="账号" required prop="userName">
              <el-input v-model="sobUser.userName" placeholder="用户名/或者邮箱地址"></el-input>
            </el-form-item>
            <el-form-item label="密码" required prop="password">
              <el-input type="password" v-model="sobUser.password" placeholder="证明你自己"></el-input>
            </el-form-item>
            <el-form-item label="验证码" required>
              <el-input v-model="loginInfo.verifyCode" placeholder="请输入人类验证码" @keypress.enter.native="doLogin"></el-input>
              <img v-loading="isCaptcha"
                   :src="captchaPath" alt="点击更新" @click="updateVeryfyCode" class="captcha_code">
            </el-form-item>
            <el-form-item class="login-button">
              <el-button type="primary" @click="doLogin" size="small" > 登 录 </el-button>
              <span class="forget-tips-text"><a href="">忘记密码？</a></span>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>

    </div>
  </div>
</template>

<script>
import * as  api from '../../api/api'
export default {
  name: "index",
  asyncData(){
    let tempKey = Date.parse(new Date())
    return{
      loginInfo: {
        verifyCode: "",
        captcha_key: tempKey
      },
      captchaPath:'http://localhost:8090/user/captcha?captcha_key='+ tempKey
    }
  },
  beforeMount() {
    this.updateVeryfyCode();
  },
  mounted() {
  },
  data() {
    return {
      isCaptcha:true,
      sobUser: {
        userName: '',
        password: ''
      },
      isCommit:false
    }
  }
  , methods: {
    //检查登录是否有效
    toastS(msg) {
      this.$message.success(msg)
    },
    toastW(msg) {
      this.$message.warning(msg)
    },
    toastE(msg) {
      this.$message.error(msg)
    }
    ,
    doLogin() {
      //发起登录
      //检查数据
      if (this.sobUser.userName === '') {
        this.toastE("用户名不可以为空！")
        return
      }
      if (this.sobUser.password === '') {
        this.toastE("密码不可以为空！")
        return
      }
      if (this.loginInfo.verifyCode === '') {
        this.toastE("验证码不可以为空！")
        return
      }
      //防止重复提交
      if (this.isCommit){
        this.$message.warning('请不要重复提交数据！')
        return
      }
      this.isCommit = true
      //向服务器提交数据
      api.doLogin(this.loginInfo.verifyCode,this.sobUser)
        .then(res=>{
          this.isCommit = false
          console.log('登录'+res.data)
          if (res.code === 200){
            this.$message.success(res.message)
            //跳转页面
            let redirect = this.$route.query.redirect;
            if (redirect){
              location.href = redirect
              console.log('redirect::==='+redirect)
            }else {
              location.href = '/'
            }
          }else {
            //更新验证码
            this.updateVeryfyCode()
            this.$message.error(res.message)
          }
        })
      console.log(this.sobUser)
      console.log(this.loginInfo)
    },
    updateVeryfyCode(){
      this.captchaPath = 'http://localhost:8090/user/captcha?captcha_key='+ this.loginInfo.captcha_key
        + "&random"+Date.parse(new Date());
      this.isCaptcha = false
      console.log(this.captchaPath)
    }
  }
}
</script>

<style scoped>
.forget-tips-text a:hover{
  color: blueviolet;
}
.forget-tips-text a{
  margin-left: 10px;
  color: #999999;
}
.login-center-box[data-v-4586967a]{
  margin-top: 20px;
  width: 1100px!important;
  margin-bottom: 20px;
}
.admin-login-center-box{
  width: 1100px;
  margin-top: 20px;
}
.captcha_code_input_box{
}
.captcha_code{
  margin-left: 10px;
  vertical-align: middle;
  cursor: pointer;
  width: 100px;
  border: 1px solid #cccccc;
  padding: 0 10px;
  height: 41px;
}
.login-button{
  margin-bottom: 0;
}
.admin-login-header-box{
  margin-bottom: 20px;
  width: 100%;
  height: 46px;
  background-color: dodgerblue;
}
.center{
  margin: 0 auto;
  width: 1140px;
}
.admin-login-header-center{
  line-height: 46px;
}
.admin-login-logo{
  color: #ffffff;
  font-size: 20px;
  font-weight: 600;
}
.login-center-box .el-input{
  width: 200px;
}
.login-center-box{
  padding: 20px 20px;
  width: 1110px;
  background-color: #ffffff;
  box-shadow: 0 1px 10px #afafaf;
  border-radius: 5px;
}
.el-form-item__label{
  border-left: solid 1px #ccc;
  border-top: solid 1px #ccc;
  border-bottom: solid 1px #ccc;
  background-color: #fbfbfb;
  text-align: center;
}
.el-input__inner{
  border-radius: 0;
  border-bottom: 1px solid #cccccc;
}
</style>
