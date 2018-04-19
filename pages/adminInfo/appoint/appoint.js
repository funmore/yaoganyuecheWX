var sha1=require('../../../utils/sha1.js');
var app=getApp();
var api = app.data.api;
Page({
  data: {
    array_company:new Array(),
    index_company:0,
  	orderToSend:new Array()
  },
  onLoad:function(query){
  	var orderToSend=JSON.parse(query.orderToSendStr);
  	this.setData({
  		orderToSend:orderToSend
  	});
    this.getCompany();
  	var a =1;
  },
  getCompany(){
      var that =this;
      var timestamp = Date.parse(new Date());
              timestamp = timestamp / 1000;
              wx.request({
                  url: api + 'company/getCompany', //正吉url 获取订单
                  data: {
                     token:wx.getStorageSync('token'),
                     t:timestamp,
                     s:sha1.hex_sha1(app.data.key+timestamp)                   
                  },
                  header: {
                      'content-type': 'application/json'
                  },
                  //method:'GET',
                  success: function(res) {
                    //处理订单code
                    that.setData({
                      array_company: res.data
                    });
                  }
                });
  },
  bindPickerCompany:function(e){
    this.setData({
      index_company:e.detail.value
    })
  },
  Appoint:function(e){
      var formId = e.detail.formId;
      var companyIdToSend=this.data.array_company[this.data.index_company].id;
      var orderIdToSend=new Array();
      for(var item in this.data.orderToSend){
        orderIdToSend.push(this.data.orderToSend[item].id);
      }
      var orderIdToSendStr=JSON.stringify(orderIdToSend); 
    wx.showModal({
        content: '发送指派订单？',
        success: function(res) {
            if(res.confirm){
              var timestamp = Date.parse(new Date());
              timestamp = timestamp / 1000;
              wx.request({
                  url: api + 'order/adminAppoint', //正吉url
                  data: {
                     token:wx.getStorageSync('token'),
                     t:timestamp,
                     s:sha1.hex_sha1(app.data.key+timestamp),

                     companyIdToSend:companyIdToSend,
                     orderIdToSendStr:orderIdToSendStr,          
                     formId:formId

                  },
                  header: {
                      'content-type': 'application/json'
                  },
                  //method:'POST',
                  success: function(res) {
                    if(res.data==0){
                      wx.showToast({
                        title: '指派成功',
                        icon: 'success',
                        mask:'true',
                        duration: 1000
                      });
                      wx.switchTab({
                          url: '../../admin/admin'
                        })
                    }else{
                      wx.redirectTo({
                        url:'../orderInfo/orderFail/orderFail'
                      })
                    }
                  }
                })
            }
        }
    });   
  }
})