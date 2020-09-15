<template>
  <div class="register-box">

    <div class="register-form-container">
      <div class="register-title">
        注册
      </div>
      <div class="form-content">
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
          <el-form-item
            label="用户名" required>
            <el-input v-model="sobUser.userName" placeholder="整一个万中无一的名字" @blur="checkUserName"></el-input>
            <span class="el-icon-error" v-if="isUserNameOk==='1'">该用户名已被注册</span>
            <span class="el-icon-success" v-if="isUserNameOk==='0'">您的用户名也太棒了</span>
          </el-form-item>
          <el-form-item
            label="密码" required>
            <el-input v-model="sobUser.password" type="password" placeholder="请输入暗号"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="doRegister">注册</el-button>
            <el-button @click="resetForm('dynamicValidateForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

    </div>
  </div>
</template>

<script>
/*
* 注册逻辑
* 1、当鼠标离开用户名时，检查用户名是否已经被注册
* 2、当鼠标点击验证码，检查格式和邮箱是否已经被逐出，在获取验证码
* 输入框
* 1、用户名
* 2、邮箱地址  ---->>  获取验证码按钮
* 3、邮箱验证码
* 4、密码
* 5、人类验证码
* 6、注册
* 结果处理：
* 1、用户名已经注册  toast
* 2、验证码不正确    ----->>>  停止倒计时
* 3、图灵验证码      ------>>>  重新加载一个新的验证码
* 4、邮箱格式不正确  ：  totast
* 5、成功返回结果
* */
import * as  api from '../../api/api'

export default {
  name: "index",
  mounted() {
    this.updateVeryfyCode()
  },
  data() {
    return {
      isUserNameOk : '',
      isCountDown:false,
      countDown: '重新发送(60)',
      emailCode: '',
      originalPassword: '',
      captchaCode: '',
      captchaPath: '/user/captcha',
      sobUser: {
        userName: '',
        password: '',
        email: ''
      }
    }
  }, methods: {
    checkUserName(){
      if (this.sobUser.userName===''){
        this.isUserNameOk = ''
        return
      }
      api.checkUserName(this.sobUser.userName).then(res=>{
        if (res.code === 200) {
          //不可用
          this.isUserNameOk = '1'
        this.$message.error('该用户名已经被注册')
        }else {
          //可用
          this.isUserNameOk = '0'

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
    doRegister() {
      //检查内容
      if (this.captchaCode===''){
        this.$message.error('请输入右侧验证码')
        return
      }
      if (this.sobUser.email===''){
        this.$message.error('还没写邮箱呢')
        return
      }
      if (this.emailCode===''){
        this.$message.error('你还没收到我们的暗号么')
        return
      }
      if (this.sobUser.userName===''){
        this.$message.error('怎么称呼你呢')
        return
      }
      if (this.sobUser.password===''){
        this.$message.error('没有输入暗号呢')
        return
      }
      //提交数据
      api.registerUser(this.captchaCode,this.emailCode,this.sobUser).then(res=>{
        if (res.code === 200) {
          //注册成功给出提示，跳转到登录页面
          this.$message.success(res.message)
          location.href = '/login'
        }else {
          //给出提示，更新验证码
          this.$message.error(res.message)
          this.updateVeryfyCode()
        }

      })
      //处理结果

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
      api.sendEmailCode(this.captchaCode, this.sobUser.email).then(res => {
        console.log(res)
        if (res.code === 200) {
          this.$message.success(res.message)
          //发送成功开启倒计时
          this.showCountDown()
        } else {
          this.$message.error(res.message);
        }
      })


    },
    updateVeryfyCode(){
      this.captchaPath = 'http://localhost:8090/user/captcha?captcha_key='
        + "&random"+Date.parse(new Date());
      this.isCaptcha = false
      console.log(this.captchaPath)
    }
  }
}
</script>

<style scoped>
.form-content .el-icon-error{
  color: #f56c6c;
}
.form-content .el-icon-success{
  color: #67c23a;
}
.form-content {
  margin-left: 40px;
}

.register-form-container {
  position: relative;
}

.register-title {
  color: #999999;
  margin-right: 20px;
  font-size: 20px;
  font-weight: 600;
  position: absolute;
}

.captcha_code {
  margin-left: 10px;
  vertical-align: middle;
  cursor: pointer;
  width: 100px;
  border: 1px solid #cccccc;
  padding: 0 10px;
  height: 39px;

}

.el-input {
  width: 250px !important;
}

.register-box .register-form-container .el-input__inner {
  width: 250px !important;
}

.register-box {
  padding: 20px;
  margin-top: 20px;
  background: #ffffff;
}

.get-verifyCode-btn {
  margin-left: 10px;
}

</style>
