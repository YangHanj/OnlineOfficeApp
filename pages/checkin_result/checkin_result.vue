<template>
	<view class="page">
		<view class="summary-container">
			<view class="user-info"> 
				<image :src="photo" mode="widthFix" class="photo"></image>
				<view class="info">
					<text class="username">{{name}}</text>
					<text class="dept">隶属部门:{{deptName==null?"":deptName}}</text>
				</view>
			</view>
			<view class="date">{{date}}</view>
		</view>
		<view class="result-container">
			<view class="left">
				<image src="../../static/icon-6.png" mode="widthFix" class="icon-timer"></image>
				<image src="../../static/icon-6.png" mode="widthFix" class="icon-timer"></image>
				<view class="line"></view>
			</view>
			<view class="right">
				<view class="row">
					<text class="start">上班 (时间: {{attendanceTime}})</text>
				</view>
				<view class="row">
					<text class="checkin-time">签到时间 ({{checkinTime}})</text>
					<text class="checkin-result green other" v-if="status=='正常'">{{status}}</text>
					<text class="checkin-result yellow other" v-if="status!='正常'">{{status}}</text>
				</view>
				<view class="row">
					<image src="../../static/icon-7.png" mode="widthFix" class="icon-small"></image>
					<text class="desc">{{address}}</text>
					<text class="checkin-result green" v-if="risk=='低风险'">{{risk}}</text>
					<text class="checkin-result red" v-if="risk!='低风险'">{{risk}}</text>
				</view>
				<view class="row">
					<image src="../../static/icon-8.png" mode="widthFix" class="icon-small"></image>
					<text class="desc">身份验证</text>
					<text class="checkin-result green">通过</text>
				</view>
				<view class="row">
					<text class="end">下班 (时间: {{closingTime}})</text>
				</view>
			</view>
		</view> 
		<view class="checkin-report">
			<image src="../../static/big-icon-1.png" mode="widthFix" class="big-icon"></image>
			<view class="report-title">
				<text class="days">{{checkinDays}}</text>
				<text class="unit">天</text>
			</view>
			<view class="sub-title">
				<text>累计签到</text>
				<view class="line"></view>
			</view>
				<view class="calendar-container">
				<view class="calendar" v-for="one in weekCheckin" :key="one.day">
					<image src="../../static/icon-9.png" mode="widthFix" class="calendar-icon" v-if="one.type=='工作日'"></image>
					<image src="../../static/icon-10.png" mode="widthFix" class="calendar-icon" v-if="one.type=='节假日'"></image>
					<text class="day">{{one.day}}</text>
					<text class="result green" v-if="one.status == '正常'">{{one.status}}</text>
					<text class="result yellow" v-if="one.status=='迟到'">{{one.status}}</text>
					<text class="result red" v-if="one.status=='缺勤'">{{one.status}}</text>
					<text class="result blue" v-if="one.status=='待签'">{{one.status}}</text>
				</view>
			</view> 
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				name:"XXX", 
				photo: "https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLW2kf2ddpsDxThMtfARpPUMcP48CwzLGEVflOiaesq32Jp1Rfdgc2dRKdVUqfLAfDNXCC5FQEoWIw/132",
				deptName:"管理部",
				address:"北京市朝阳区",
				status:"正常",
				risk:"高风险",
				checkinTime:"00:00",
				date:"0000年00月00日",
				attendanceTime:"00:00",
				closingTime:"00:00",
				checkinDays:0,
				weekCheckin:[
					{type:"工作日",day:"周一",status:"正常"},
					{type:"工作日",day:"周二",status:"迟到"},
					{type:"工作日",day:"周三",status:"待签"},
					{type:"工作日",day:"周四",status:"缺勤"},
					{type:"工作日",day:"周五",status:"缺勤"},
					{type:"节假日",day:"周六",status:""},
					{type:"节假日",day:"周日",status:""}
				]
			}
		},
		onShow:function(){
			let that = this;
			that.ajax(this.url.searchTodayCheckin,'GET',null,function(resp){
				//console.log(resp);
				let result  =resp.data.result;
				that.name = result.name;
				that.photot = result.photo;
				that.deptName = result.deptName;
				that.address = result.address;
				that.date = result.date;
				that.attendanceTime = result.attendanceTime;
				that.closingTime = result.closingTime;
				that.checkinTime = result.checkinTime;
				that.status = result.status;
				that.risk = result.risk;
				that.checkinDays = result.checkinDays;
				that.weekCheckin = result.weekCheckin;
			})
		},
		methods: {
			
		}
	}
</script>

<style lang="less">
	@import url("checkin_result.less");
</style>
