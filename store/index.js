export const state = () =>({
  currentUserId :''
})
export const mutations ={
  setCurrentUserId(state,currentUserId){
    state.currentUserId = currentUserId
  }
}
