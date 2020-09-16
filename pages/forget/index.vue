<template>
<div class="forget-box">
  <div class="forget-container">
    <div class="forget-title">
      找回密码
    </div>
    <div class="forget-form-container" >
      <div class="verifyCode-container" v-if="showType==='verifyCode'">
        <el-form ref="dynamicValidateForm" label-width="100px">
          <el-form-item label="人类验证码" required>
            <el-input v-model="captchaCode" placeholder="请输入右侧验证码" @keypress.enter.native="doLogin"></el-input>
            <img :src="captchaPath" alt="点击更新" @click="updateVeryfyCode" class="captcha_code">
          </el-form-item>
          <el-form-item label="邮箱地址" required>
            <el-input v-model="sobUser.email" placeholder="请输入邮箱地址"></el-input>
            <el-button v-if="!isCountDown" type="primary" class="get-verifyCode-btn" @click.prevent="getVerifyCode">发送验证码 </el-button>
            <el-button v-else type="primary" class="get-verifyCode-btn" disabled>{{ countDown }}</el-button>
          </el-form-item>
          <el-form-item label="验证码" required>
            <el-input v-model="emailCode" placeholder="请输入验证码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="doForgetPassword">找回密码</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div v-if="showType==='reset'" class="reset-password-container">
        <el-form ref="dynamicValidateForm" label-width="100px">
          <el-form-item label="验证码" required>
            <el-input v-model="sobUser.password" placeholder="请输入新密码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="setPassword">设置密码</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import * as api from "@/api/api";

export default {
name: "index",
  data(){
  return{
    type:'forget',
    showType:'verifyCode',
    originalPassword:'',
    isCountDown:false,
    countDown: '重新发送(60)',
    emailCode:'',
    captchaCode:'',
    captchaPath:'/user/captcha',
    sobUser:{
      email:'',
      userName:'',
      password:''

    }
  }
  },
  methods:{
    doLogin(){

    },
    setPassword(){
      //检查密码是否为空
      if (this.sobUser.password===''){
        this.$message.error('暗号不能为空')
        return
      }
      api.updatePassword(this.emailCode,this.sobUser).then(res=>{
        if (res.code===200){
          //成功跳转到登录界面
          this.$message.success(res.message)
          location.href = '/login'
        }else {
          //提示
          this.$message.error(res.message)
          this.showType = 'verifyCode'
        }

      })
    },
    showCountDown() {
      let that = this
      let time = 60;
      this.isCountDown = true
      let interval = setInterval(function () {
        time--;
        if (time <= 0) {
          that.isCountDown = false
          clearInterval(interval)
        }
        that.countDown = '重新发送(' + time + ')'
      }, 1000);
    },
    updateVeryfyCode(){
      this.captchaPath = 'http://localhost:8090/user/captcha?captcha_key='
        + "&random"+Date.parse(new Date());
      this.isCaptcha = false
    },
    getVerifyCode() {
      //检查人类验证码是否为空
      //检查邮箱地址是否为空
      //校验邮箱格式
      //请求发送验证码
      //禁止按钮点击，并且倒计时
      if (this.captchaCode === '') {
        this.$message.error('人类验证码不能为空！')
        return
      }
      if (this.sobUser.email === '') {
        this.$message.error('邮箱地址不能为空！')
        return
      }
      // 检查邮箱格式，判空
      let reg = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/
      if (!reg.test(this.sobUser.email)) {
        this.$message.error('邮箱格式不正确！')
        return
      }

      //发起请求
      api.sendEmailCode(this.captchaCode, this.sobUser.email,this.type).then(res => {
        console.log(res)
        if (res.code === 200) {
          this.$message.success(res.message)
          //发送成功开启倒计时
          this.showCountDown()
        } else {
          this.updateVeryfyCode()
          this.$message.error(res.message);
        }
      })


    },
    doForgetPassword(){
      console.log('qwertyuioasdfghjklzxcvbnm')
      //判空
      if (this.captchaCode===''){
        this.error('验证码不能为空')
        return
      }
      if (this.sobUser.email===''){
        this.error('邮箱不能为空')
        return
      }
      if (this.emailCode===''){
        this.error('邮箱验证码不能为空')
        return
      }

      //检查当前的验证是否全部正确，正确则显示修改密码的输入框
      api.checkVerifyCode(this.captchaCode,this.sobUser.email,this.emailCode).then(res=>{
        if (res.code === 200) {
          //显示重置密码模块
          this.showType = 'reset'
          this.$message.success('验证通过')
        }else {
          //给出提示冲洗加载验证码
          this.$message.error(res.message)
          this.updateVeryfyCode()
        }
      })
    }

  }
}
</script>

<style scoped>
.forget-title{
  font-size: 20px;
  font-family: "PingFang SC";
  color: #999999;
  margin-bottom: 10px;
}
.get-verifyCode-btn{
  margin-left: 10px;
}
.forget-box{
  padding: 20px;
  margin-top: 20px;
  background: #ffffff;
}
.el-input{
  width: 250px;
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

</style>
