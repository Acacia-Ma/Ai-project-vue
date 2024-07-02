import { defineStore } from 'pinia'
 
export const useTestStore = defineStore("user", {
 	state:()=>{
 		return {
			username:'',
            password:'',
            access_token:'',
            refresh_token:'',
            avatar:'',
            permission:null,
            now_time:0,
		}
 	},
    persist: true,
 	//类似于computed 可以帮我们去修饰我们的值
     getters:{
 
     },
     //可以操作异步 和 同步提交state
     actions:{
        Savingtoken(data){
            return new Promise((resolve,reject)=>{
                console.log(data)
                this.access_token = data.access_token
                this.refresh_token = data.refresh_token
                this.username = data.username
                this.now_time = new Date().getTime()
                this.permission = data.permission
                resolve()
            })
        },
        Refresh_token(data){
            return new Promise((resolve,reject)=>{
                this.access_token = data.access_token
                this.now_time = new Date().getTime()
                resolve()
            })
        },
        Logout(){
            return new Promise((resolve,reject)=>{
                this.access_token = ''
                this.refresh_token = ''
                this.username = ''
                this.permission = null
                this.now_time = 0
                resolve()
            })
        }
     }
})