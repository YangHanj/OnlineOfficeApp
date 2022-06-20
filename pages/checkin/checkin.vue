<template>
	<view>
		<camera device-position="front" flash="off" class="camera" @error="error" v-if="showCamera"></camera>
		<image mode="widthFix" class="image" :src="photoPath" v-if="showImage"></image>
		<view class="operate-container">
			<button type="primary" class="btn" @tap="clickBtn" :disabled="!canCheckin">{{btnText}}</button>
			<button type="warn" class="btn" @tap="afresh" :disabled="!canCheckin">重拍</button>
		</view>
		<view class="notice-container">
			<text class="notice">注意事项</text>
			<text class="desc">拍照签到的时候，必须要拍摄正面照片，并且拍照时不佩戴墨镜或者帽子，以免影响识别。</text>
		</view>
	</view>
</template>

<script>
	var QQMapWX = require("../../lib/qqmap-wx-jssdk.min.js"); 
	var qqmapsdk;
	export default {
		data() {
			return {
				canCheckin: true,
				photoPath: '',
				btnText: '拍照',
				showCamera: true,
				showImage: false
			} 
		},
		onShow:function(){
			let that = this
			that.ajax(
				that.url.validCanCheckIn,
				"GET",
				null,
				function(resp){
					let msg = resp.data.msg
					if(msg != ""){
						console.log(msg)
						that.canCheckin = false
						
						setTimeout(function(){
							uni.showToast({
								title:msg,
								icon:"none"
							})
						},500)
					}
				}
			)
		},
		onLoad:function(){
			qqmapsdk = new QQMapWX({
				key:"TPLBZ-D3BWD-C7M4T-PFURY-Y5QUK-5NBZ5"
			});
		},
		methods: {
			clickBtn:function(){
				let that = this;
				if(that.btnText == "拍照"){
					//获取相机上下文
					let ctx = uni.createCameraContext();
					ctx.takePhoto({
						quality:"high",
						success:function(resp){
							console.log(resp.tempImagePath);
							that.photoPath = resp.tempImagePath;  //保存拍照路径
							that.showCamera = false;	//相机关闭
							that.showImage = true;		//显示照片
							that.btnText = "签到";		//更改按钮 
						}
					})
				}else{
					//TODO 签到
					//等待提示
					uni.showLoading({
						title:"正在签到中，请稍后"
					})
					//30秒后隐藏
					setTimeout(function(){
						uni.hideLoading()
					},30000)
					uni.getLocation({
						type:"wgs84",
						success:function(resp){
							let latitude = resp.latitude; //获取纬度
							let longitude = resp.longitude; //获取经度
							//console.log(longitude)
							//console.log(latitude)
							qqmapsdk.reverseGeocoder({
								location : { latitude,longitude },
								success(resp){
									console.log(resp.result);
									let address = resp.result.address;
									let addressComponent = resp.result.address_component; 
									let nation = addressComponent.nation;
									let province = addressComponent.province;
									let city = addressComponent.city;
									let district = addressComponent.district;
									uni.uploadFile({
										url: that.url.checkin,
										filePath: that.photoPath,
										name: "photo",
										header:{
											token: uni.getStorageSync("token")
										},
										formData:{
											address: address,
											country: nation,
											province:province,
											city:city,
											district:district
										},
										success:function(resp){
											console.log(resp)
											if(resp.statusCode == 500 && resp.data != "考勤时间已过"){
												uni.hideLoading()
												uni.showModal({
													title:"提示信息",
													content:"当前系统不存在你的记录,是否使用当前这张图片作为模型?",
													success(res) {
														if(res.confirm){
															uni.uploadFile({
																url: that.url.createFaceModel,
																filePath: that.photoPath,
																name:"photo",
																header:{
																	token: uni.getStorageSync("token")
																},
																success(resp) {
																	if(resp.statusCode == 500){
																		uni.showToast({
																			title:resp.data,
																			icon:"none"
																		})
																	}else if(resp.statusCode == 200){
																		uni.showToast({
																			title:resp.data,
																			icon:"none"
																		})
																	}
																}
															})
														}
													}
												})
											}
											else if(resp.statusCode == 200){
												let data = JSON.parse(resp.data);
												let code = data.code;
												let msg = data.msg;
												if(code == 200){
													uni.hideLoading();
													uni.showToast({
														title:"签到成功",
														complete:function(){
															//TODO : 跳转签到统计页面														
															uni.navigateTo({
																url:'../checkin_result/checkin_result'
															});									
														}
													})
												}
											}
											else{
												uni.showToast({
													title:resp.data,
													icon:"none"
												})
											}
										}
									})
								}
							})
						}
					})
				}
			},
			afresh:function(){
				let that = this;
				that.showCamera = true;
				that.showImage = false;
				that.btnText = "拍照";
			}
		}
	}
</script>

<style lang="less">
	@import url("checkin.less");
</style>
