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
	searchMyMeetingListByPage: baseUrl + "/meeting/searchMyMeetingListByPage ",
	searchUserGroupByDept: baseUrl + "/user/searchUserGroupByDept",
	searchMembers: baseUrl + "/user/searchMembers",
	insertMeeting:baseUrl + "/meeting/insertMeeting",
	searchMeetingById:baseUrl + "/meeting/searchMeetingById",
	updateMeetingInfo: baseUrl + "/meeting/updateMeetingInfo",
	deleteMeetingById: baseUrl + "/meeting/deleteMeetingById",
	searchUserTaskListByPage: baseUrl + "/meeting/searchUserTaskListByPage",
	approvalMeeting: baseUrl + "/meeting/approvalMeeting",
	selectUserPhotoAndName: baseUrl + "/user/selectUserPhotoAndName"
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
/**
 * 日期格式化函数
 * @param {Object} fmt
 */
Date.prototype.format = function(fmt) {
	var o = {
		"M+": this.getMonth() + 1, //月份 
		"d+": this.getDate(), //日 
		"h+": this.getHours(), //小时 
		"m+": this.getMinutes(), //分 
		"s+": this.getSeconds(), //秒 
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度 
		"S": this.getMilliseconds() //毫秒 
	};
	if (/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	for (var k in o) {
		if (new RegExp("(" + k + ")").test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		}
	}
	return fmt;
}

Vue.prototype.checkNull = function(data,name){
	if(data == null){
		uni.showToast({
			icon:"none",
			title:name+"不能为空"
		})
		return true
	}
	return false
}
Vue.prototype.checkBlank = function(data,name){
	if(data == null || data == ""){
		uni.showToast({
			icon:"none",
			title:name+"不能为空"
		})
		return true
	}
	return false
}
Vue.prototype.checkValidName = function(data,name){
	if(data == null || data == ""){
		uni.showToast({
			icon:"none",
			title:name+"不能为空"
		})
		return true
	}else if(!/^[\u4e00-\u9fa5]{2,15}$/.test(data)){
		uni.showToast({
			icon:"none",
			title:name+"内容不正确"
		})
		return true
	}
	return false
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

