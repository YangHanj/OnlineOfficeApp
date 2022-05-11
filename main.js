import App from './App'

// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
    ...App
})
app.$mount()
// #endif
let baseUrl = "http://192.168.1.100:8899" 
Vue.prototype.url = {
	register: baseUrl + "/user/register",
	login: baseUrl + "/user/login",
	checkin: baseUrl + "/checkin/checkin",
	createFaceModel: baseUrl + "/checkin/createFaceModel",
	validCanCheckIn: baseUrl + "/checkin/validCanCheckIn",
	searchTodayCheckin: baseUrl + "/checkin/searchTodayCheckin",
	searchUserSummary: baseUrl + "/user/searchUserSummary",
	searchMonthCheckin: baseUrl + "/checkin/searchMonthCheckin",
	refreshMessage: baseUrl + "/message/refreshMessage",
	searchMessageByPage: baseUrl + "/message/searchMessageByPage",
	searchMessageById: baseUrl + "/message/searchMessageById",
	updateUnreadMessage: baseUrl + "/message/updateUnreadMessage",
	deleteMessageRefById:baseUrl + "/message/deleteMessageRefById",
	searchMyMeetingListByPage: baseUrl + "/meeting/searchMyMeetingListByPage "
}

//封装ajax
/**
 * 1、如果用户没有登录，跳转登录页面
 * 2、如果用户权限不够，提示信息
 * 3、如果后端出现异常，提示异常信息
 * 4、如果后端验证令牌不正确，提示信息
 * 5、后端正常处理，还要判断响应是否有Token；如果令牌刷新，则在本地存储Token
 * @param {Object} url 		请求地址
 * @param {Object} method 	请求方式
 * @param {Object} data 	请求携带数据 
 * @param {Object} fun		执行正常的回调函数
 */
Vue.prototype.ajax = function(url,method,data,fun){
	uni.request({
		"url": url,
		"method": method,
		"header": {
			token: uni.getStorageSync('token')
		},
		"data": data,
		success: function(resp) {
			if(resp.statusCode == 401){
				uni.redirectTo({
					url: '/pages/login/login.vue'
				})
			}else if(resp.statusCode == 200 && resp.data.code == 200){
				let data = resp.data;
				if(data.hasOwnProperty("token")){  
					/**
					 * 如果携带token，那么有三种情况：1、登陆成功 2、注册成功 3、令牌刷新
					 */
					//console.log(resp.data);
					let token = data.token;
					uni.setStorageSync("token",token)
				};
				fun(resp);
			}else {
				uni.showToast({
					icon:'none',
					title: resp.data 
				})
			}
		}
	})
}
/**
 * 前端鉴权
 * @param {Object} perms 权限数组
 */
Vue.prototype.checkPermission = function(perms){
	let permission = uni.getStorageSync("permission")
	let result = false;
	for(let one of perms){
		//判断当前用户的权限列表是否包含需要的权限
			if(permission.indexOf(one) != -1){
				result = true;
				break;
			}
	}
	return result;
}




// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif

