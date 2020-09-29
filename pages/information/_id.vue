<template>
  <div class="user-info-detail-box clear-fix" id="user-info-detail-box">
    <div class="user-info-header-bg">
      <img :src="userInfo.avatar" alt="">
    </div>
    <div class="user-info-left-part float-left" id="user-info-left-part">
      <el-tabs tab-position="left" v-model="target" style="height: 200px;">
        <el-tab-pane label="个人信息" name="userInfo"></el-tab-pane>
      </el-tabs>
    </div>
    <div class="user-info-right-part float-left" id="user-info-right-part">
        <div class="avatar-username">
          <span>{{userInfo.userName}}</span>
        </div>
      <div class="info-item">
        <span class="info-left">角色：</span>
        <el-tag type="danger" size="mini" v-if="userInfo.roles==='role_admin'">
          管理员
        </el-tag>
        <el-tag size="mini" v-else>
          注册用户
        </el-tag>
      </div>
      <div class="info-item">
        <span class="info-left">注册时间：</span>
        {{userInfo.createTime | formatDate('yyyy-MM-dd hh:mm')}}
      </div>
      <div class="info-item" v-if="!isEditorMore">
        <span class="info-left">签名：</span>
        <span v-if="userInfo.sign ===''">我不是在写bug就是在写bug的路上</span>
        <span v-if="userInfo.sign !==''">{{userInfo.sign}}</span>
      </div>
      <div class="info-item" v-else>
        <span class="info-left">签名：</span>
        <span>
          <el-input v-model="sobUser.sign" size="mini" style="width: 200px" type="text" placeholder="来一条独一无二的签名"/>
        </span>
      </div>
      <div class="info-item name-input" v-if="isEditorMore">
        <span class="info-left">昵称：</span>
        <span>
          <el-input v-model="sobUser.userName" size="mini" style="width: 200px" type="text" placeholder="万中无一的名字"/>
        </span>
      </div>
      <div class="update-btn">
        <el-button size="mini" @click="updateUserInfo" v-if="isEditorMore">更新</el-button>
      </div>
      <div v-if="parUserId===currentUserId" class="user-info-editor-btn">
        <el-button size="mini" type="primary" @click="switchEditorModle" v-text="isEditorMore ?'取消':'编辑'"></el-button>
      </div>
    </div>
  </div>
</template>
<script>
import * as api from "@/api/api";

export default {
  asyncData(context){
    let userId = context.params.id;
    // console.log(context.params.id)
    return api.getUserInfo(userId).then(res=>{
      console.log(res)
      return {
        userInfo : res.data,
        parUserId : userId
      }
    })
  },
  mounted() {

  },
  data(){
    return{
      target:'userInfo',
      isEditorMore:false,
      sobUser:{
        id:'',
        sign:'',
        userName:''
      }
    }
  },
  computed:{
    currentUserId(){
      return this.$store.state.currentUserId;
    }
  },
  watch:{
    currentUserId(newValue){
      console.log('newVaule'+newValue)
    }
  },
  methods:{
    getUserInfo(){
      api.getUserInfo(this.parUserId).then(res=>{
        if (res.code===200){
          this.userInfo = res.data
        }
      })
    },
   async updateUserInfo(){
        this.sobUser.id = this.parUserId
      //检查用户名是否重复
      let checkUserName = await api.checkUserName(this.sobUser.userName);
        if (checkUserName.code === 200){
          this.$message.error(checkUserName.message);
          return
        }
        api.updateUserInfo(this.sobUser,this.sobUser.id).then(res=>{
          if (res.code===200){
            this.isEditorMore = false
            this.getUserInfo()
            this.$message.success(res.message)
          }else {
            this.$message.error(res.message)
          }
        })
    },
    switchEditorModle(){
      this.isEditorMore = !this.isEditorMore
    }
  }
}
</script>
<style>
.user-info-editor-btn{
  position: absolute;
  right: 50px;
  bottom: 30px;
}
.info-item .info-left{
  font-size: 16px;
  font-weight: 600;
  color: #47494e;
}
.info-item{
  line-height: 30px;
  padding: 10px;
}
.user-info-header-bg img{
  width: 100%;
  object-fit: cover;
  height: 300px;
  filter: blur(4px) contrast(.8);
}
.avatar-username span{
  margin-left: 20px;
  font-weight: 600;
  font-size: 18px;
  color: #7F828B;
}
.avatar-username img{
  width: 80px;
  height: 80px;
  border-radius: 50%;
}
#user-info-left-part{
  top: 94px;
}
.user-info-right-part .user-info-item p{
  padding: 20px 0;
  line-height: 32px;

}
.user-info-right-part .user-info-item{
  margin-bottom: 84px;
}
.user-info-left-part .el-tabs--left .el-tabs__header.is-left{
  margin-right: 0;
}
.user-info-left-part .el-tabs__active-bar{
  width: 0!important;
}
.user-info-left-part .el-tabs__item{
  height: fit-content;
  padding-top: 20px;
  padding-bottom: 20px;
  border-right: 1px dashed #e0e0e0;
  color: #666666;
  font-size: 16px;
  transition: all .3s;
}
.user-info-left-part .el-tabs__nav{
  padding-right: 30px;

}
.user-info-left-part .el-tabs__item.is-active::after{
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
.user-info-left-part .el-tabs__nav-wrap::after{
  background:  rgba(0,0,0,0);
}
.user-info-left-part .el-tabs--left .el-tabs__header.is-left{
  float: none;
}
.user-info-detail-box{
  background-color: #ffffff;
  margin-top: 20px;
  margin-bottom: 20px;
}
.user-info-left-part .el-tabs__item.is-active{
  color: #47494E;
  font-size: 18px;
  font-weight: 600;
  transition: all .3s;
}
.user-info-left-part .el-tabs--left, .el-tabs--right{
  height: auto!important;
}
.user-info-left-part{
  padding-top: 20px;
  width: 300px;
}
.user-info-right-part{
  position: relative;
  padding: 40px 20px 30px 20px;
  width: 780px;

}

</style>
