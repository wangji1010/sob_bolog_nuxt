<template>
  <div class="register-box">
    <div class="register-form-container">
      <el-form :model="dynamicValidateForm" ref="dynamicValidateForm" label-width="100px">
        <el-form-item label="邮箱地址">
          <el-input v-model="sobUser.email"></el-input>
          <el-button @click.prevent="getVerifyCode">获取验证码</el-button>
        </el-form-item>
        <el-form-item label="验证码">
          <el-input v-model="sobUser.email"></el-input>
        </el-form-item>
        <el-form-item
          label="用户名">
          <el-input v-model="sobUser.userName"></el-input>
        </el-form-item>
        <el-form-item
          label="密码">
          <el-input v-model="originalPassword" type="password"></el-input>
        </el-form-item>
        <el-form-item label="人类验证码" required>
          <el-input v-model="captchaCode" placeholder="请输入人类验证码" @keypress.enter.native="doLogin"></el-input>
          <img v-loading="isCaptcha"
               :src="captchaPath" alt="点击更新" @click="updateVeryfyCode" class="captcha_code">
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="doRegister">注册</el-button>
          <el-button @click="resetForm('dynamicValidateForm')">重置</el-button>
        </el-form-item>
      </el-form>
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
export default {
  name: "index",
  mounted() {
    this.updateVeryfyCode()
  },
  data() {
    return {
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
    doRegister() {

    },
    getVerifyCode() {

    },
    updateVeryfyCode() {
      this.captchaPath = 'http://localhost:8090/user/captcha' /*+ "&random"+Date.parse(new Date())*/;
      this.isCaptcha = false
      console.log(this.captchaPath)
    }
  }
}
</script>

<style scoped>
.el-input{
  width: 250px!important;
}
.register-box .register-form-container .el-input__inner {
  width: 250px !important;
}

.register-box {
  background: #ffffff;
}

</style>
