<template>
	<view>
		<image src="../../static/logo-2.png" mode="widthFix" class="logo"></image>
		<view  class="register-container">
			<input type="text" v-model="registerCode" placeholder="请输入邀请码" class="register-code" maxlength="6"/>
			<view class="register-desc">
				管理员创建员工账号之后，你可以从你的个人邮箱中获得注册邀请码
			</view>
			<button class="register-btn" bindtap="getUserProfile" @tap="register()">执行注册</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				registerCode: ""
			}
		},
		methods: {
			register:function(){
				let that = this;
				let code = "";
				if(that.registerCode == null || that.registerCode == ""){
					uni.showToast({
						icon:"none",
						title:"邀请码不能为空"
					})
					return;
				}else if(/^[0-9]{6}$/.test(that.registerCode) == false){
					uni.showToast({
						icon:"none",
						title:"邀请码必须是6位数字"
					})
					return;
				}
				uni.login({
					provider:"weixin",
					success:function(res) {
						//保存临时授权字符串
						code = res.code;
						console.log(code);  
						//获取用户信息
					}
				}),
				uni.getUserProfile({
					provider:"weixin",
					desc:'正在获取', //必须填写，否则不提示弹框
					success:function(res){
						let nickName = res.userInfo.nickName;
						let avatarUrl = res .userInfo.avatarUrl;
						// console.log(avatarUrl);
						let data = {
							code: code,
							nickname: nickName,
							photo: avatarUrl,
							registerCode: that.registerCode
						};
						that.ajax(
							that.url.register,
							"POST",
							data,
							function(resp){
								console.log(resp);
								let permission=resp.data.permission;
								uni.setStorageSync("permission",permission);
								console.log(permission);
								//跳转到index页面
								uni.switchTab({
									url:"../index/index"
								})
							})
					}
				});
			}
		}
	}
</script>

<style lang="less">
	@import url("register.less");
</style>
