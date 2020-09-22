// import http from "~/api/http";
import http from "./http";
const baseUrl = 'http://localhost:8090'

export const getAdminInfo = () =>{
  if (process.client){
    return http.requestGet('/user/user_info/1275431122951471104')
  }else {
    return http.requestGet(baseUrl+'/user/user_info/1275431122951471104')
  }
};

export const getCategories = () =>{
  if (process.client){
    return http.requestGet('/portal/article/article/categories')
  }else {
    return http.requestGet(baseUrl+'/portal/article/article/categories')
  }

};

export const getLoopList = () =>{
  if (process.client){
    return http.requestGet('/portal/image/looplist')
  }else {
    return http.requestGet(baseUrl+'/portal/image/looplist')
  }

};

export const getArticlTop = () =>{
  if (process.client){
    return http.requestGet('/portal/article/top')
  }else {
    return http.requestGet(baseUrl+'/portal/article/top')
  }

};

export const getArticles = (categoryId,page,size) =>{
  if (categoryId!==''){
    return http.requestGet('/portal/article/list/'+categoryId+'/'+page+'/'+size)
  }
  if (process.client){
    return http.requestGet('/portal/article/list/'+page+'/'+size)
  }else {
    return http.requestGet(baseUrl+'/portal/article/list/'+page+'/'+size)
  }
};

export const getLabelsAll = (size) =>{
  return http.requestGet('/portal/article/label/'+size)
};

export const getTaobaoRecommend = (size) =>{
  return http.requestGet('/shop/recommend/random/'+size)
};

export const getFriendList = () =>{
  if (process.client){
    return http.requestGet('/portal/article/linkList')
  }else {
    return http.requestGet(baseUrl+'/portal/article/linkList')
  }
};

export const getSearchContent = (keyword,page,size,sort,categoryId) =>{
  if (process.client){
    if (categoryId===''){
      return http.requestGet('/portal/search/'+encodeURIComponent(keyword)+'/'+page+'/'+size+'?sort='+sort)
    }else {
      return http.requestGet('/portal/search/'+encodeURIComponent(keyword)+'/'+page+'/'+size+'?categoryId='+categoryId)
    }

  }else if (categoryId===''){
    return http.requestGet(baseUrl+'/portal/search/'+encodeURIComponent(keyword)+'/'+page+'/'+size+'?sort='+sort)
  }
};

export const doLogin = (verifyCode,sobUser)=>{
  return http.requestPost('/user/login/' + verifyCode,sobUser)
}

export const checkToken = ()=>{
  return http.requestGet('/user/check-token')
}

export const doLoginOut = ()=>{
  return http.requestGet('/user/logout')
}

export const sendEmailCode =(captchaCode,emailAddress,type)=>{
  return http.requestGet('/user/verify_code?captchaCode='+captchaCode+'&email='+emailAddress+'&type='+type)
}
export const checkUserName = (userName)=>{
  return http.requestGet('/user/user_name?userName='+userName)
}
export const registerUser = (captcaCode,emailCode,sobUser)=>{
  return http.requestPost('/user/register?captcha_code='+captcaCode+'&email_code='+emailCode,sobUser)
}
export const checkVerifyCode = (captchaCode ,emailAddress ,emailCode ) =>{
  return http.requestGet('/user/check_email_code?captchaCode='+captchaCode+'&emailAddress='+emailAddress+'&emailCode='+emailCode)
}
export const updatePassword = (verifyCode,sobUser) =>{
  return http.requestPut('/user/password/'+verifyCode,sobUser)
}
export const getArticleDetailById = (id) =>{
  return http.requestGet(baseUrl+'/portal/article/'+id)
}
export const getRecommendArticle=(articleId,id)=>{
  return http.requestGet(baseUrl+'/portal/article/recommend/'+articleId+'/'+id)
}


export const getCommentByArticleId = (articleId,page,size) =>{
  if (process.client){
    //http://localhost:8090/portal/comment/list/s/1/1
    return http.requestGet('/portal/comment/list/'+articleId+'/'+page+'/'+size)
  }else {
    return http.requestGet(baseUrl+'/portal/comment/list/'+articleId+'/'+page+'/'+size)
  }
}
export const postComment = (comment) =>{
  return http.requestPost('/portal/comment',comment)

}

