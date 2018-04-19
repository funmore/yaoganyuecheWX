var sha1=require('../../../utils/sha1.js');
var app=getApp();
var api = app.data.api;

Page({
  data: {
  	item:new Object(),
    originLength:0,
    destLength:0,
  	loadingHidden:false,
  	role:0,
    companyName:'',
    remarkInTable:new Array(),
    reasonInTable:new Array(),
    array_yongCheLeiXing:['集体活动','科研生产','执纪','公务接待','应急'],
  },

  onLoad: function (query) {
			  //var id=query.id;
			  var that=this;
			  that.setData({
                    companyName:wx.getStorageSync('name'),
			              loadingHidden:false

			            });
			  if(wx.getStorageSync('role')=='company'||wx.getStorageSync('role')=='admin'){
			  	that.setData({
			  		role:0
			  	})
			  }else{
			  	that.setData({
			  		role:1
			  	})
			  }
              var timestamp = Date.parse(new Date());
              timestamp = timestamp / 1000;
              wx.request({
                  url: api + 'order/showOrderOne', //正吉url
                  data: {
                     token:wx.getStorageSync('token'),
                     t:timestamp,
                     s:sha1.hex_sha1(app.data.key+timestamp),

                     id:query.id

                  },
                  header: {
                      'content-type': 'application/json'
                  },
                  //method:'POST',
                  success: function(res) {
                    
                    if(res.data==0){   //单子被别人抢了
                        wx.showModal({
                        title: '订单出错',
                        content: '请重试',
                        showCancel: false
                      });

                    }else{
                      that.setData({
                      	item:res.data,
                        originLength:res.data.origin.length,
                        destLength:res.data.destination.length
                      })
                      that.setRemarkInTable(that.data.item.remark);
                      that.setReasonInTable(that.data.item.reason);

                    }
                    that.setData({
                      loadingHidden:true
                    })
                  }
                })
        },
    setRemarkInTable(remark){
      var remarkInTable=null;
      if(remark==''){
          remarkInTable="无";
      } else if(remark.length<=10){
        remarkInTable=remark;
      } else{
        remarkInTable=remark.substring(0,10)+"...";
      }
      this.setData({
        remarkInTable:remarkInTable
      })
    },
    setReasonInTable(reason){
      var reasonInTable=null;
      if(reason==''){
          reasonInTable="无";
      } else if(reason.length<=10){
        reasonInTable=reason;
      } else{
        reasonInTable=reason.substring(0,10)+"...";
      }
      this.setData({
        reasonInTable:reasonInTable
      })
    },
    checkInfo:function(e){
      var id=e.currentTarget.id;
      var title=null;
      var content=null;
      if(id=="ori"){
          title="出发地";
          content=this.data.item.origin.join("、");
      }else if(id=="dest"){
          title="目的地";
          content=this.data.item.destination.join("、");
      }else if(id=="lead"){
          title="领导";
          content=this.data.item.leaderinfo.join("、");
      }else if(id=="remark"){
          title="备注";
          content=this.data.item.remark;
      }else if(id="reason"){
          title="用车原因";
          content=this.data.item.reason;
      }
      wx.showModal({
        title: title,
        content:content,
        showCancel:false,
      });

  },
    calling:function(e){
      var type=parseInt(e.target.dataset.type);
      var phoneNum=0;
      if(type==1){ 
        phoneNum=this.data.item.mobilephone;      
      }else if(type==2){
        phoneNum=this.data.item.driverMobilephone;
      }else{
      }
      var isMatch=/\d{11}/.test(phoneNum);
      if(!isMatch){
          wx.showModal({
            title: '手机号非法！',
            content: '手机号非法，请联系25所调度',
            showCancel: false
          });
      }else{
        wx.makePhoneCall({
        phoneNumber: phoneNum 
        })
      }

    }
  
})