var sha1=require('../../utils/sha1.js');
var app=getApp();
var api = app.data.api;
Page({
  data:{
    tabs: ['型号审批','管理审批', '已审批'],
    stv: {
      windowWidth: 0,
      lineWidth: 0,
      offset: 0,
      tStart: false
    },
    activeTab: 0,
    stateLength:new Array(2),
    stateLengthFlag:false,
    role:0,  //role=1  管理  role=2 型号
    //wx.getStorageSync('privileges')==1||wx.getStorageSync('second_privileges')==1
    //state: 0：待审查； 1：待派车 2：待确认  3：待评价  4：已完成
    orderArray:new Array(),
    loadingHidden:false,
    hasRefresh:false
  },
  countLength() {
    var stateLength=new Array(0,0,0);
    var orderArray=this.data.orderArray;
    for(var item in orderArray){
      if(orderArray[item]!=null){
      var state=orderArray[item].state;
      if(state==8||state==9){
        stateLength[0]++
      }else if(state==10){
        stateLength[1]++;
      }else if(state>=20){
        stateLength[2]++;
      }else{
      }
    }
    }
    this.setData({
        stateLength:stateLength,
        stateLengthFlag:true
      });
  },
  approvalShow(){
    var that =this;
    that.setData({
      loadingHidden:false
    });
    var timestamp = Date.parse(new Date());
            timestamp = timestamp / 1000;
            wx.request({
                url: api + 'order/approvalShow', //正吉url 获取订单
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
                    orderArray: res.data,
                    loadingHidden:true  
                  });
                  that.countLength();
                  //处理订单codd end 
                }
              })
          },

  onShow:function(options){
    if(wx.getStorageSync('privileges')==1||wx.getStorageSync('second_privileges')==1)
    {
            if(wx.getStorageSync('privileges')==1){
              this.setData({
                role:1
              });
            }
            if(wx.getStorageSync('second_privileges')==1){
              this.setData({
                role:2
              });
            }
            if(wx.getStorageSync('privileges')==1&&wx.getStorageSync('second_privileges')==1){
              this.setData({
                role:3
              });
            }
            this.approvalShow();  
    }else{
      wx.showModal({
                title: '无信息',
                content: '您尚不具有审批权限',
                showCancel: false,
                success:function(e){
                  wx.switchTab({
                    url: '../order/order'
                  })
                }
              });
    }
  },
  
  onLoad:function(options){
    //联调使用
   //this.getBasicInfo();
   try {
      let {tabs} = this.data; 
      var res = wx.getSystemInfoSync()
      this.windowWidth = res.windowWidth;
      this.data.stv.lineWidth = this.windowWidth / this.data.tabs.length;
      this.data.stv.windowWidth = res.windowWidth;
      this.setData({stv: this.data.stv})
      this.tabsCount = tabs.length;
    } catch (e) {
    }

  },
 
  refresh:function(e){
      var that =this;
      that.setData({
        hasRefresh:true
      })
    var timestamp = Date.parse(new Date());
            timestamp = timestamp / 1000;
            wx.request({
                url: api + 'order/approvalShow', //正吉url 获取订单
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
                    orderArray: res.data,
                    hasRefresh:false  
                  });
                  that.countLength();
                  //处理订单codd end 
                }
              })
  },
  _updateSelectedPage(page) {
    let {tabs, stv, activeTab} = this.data;
    activeTab = page;
    this.setData({activeTab: activeTab})
    stv.offset = stv.windowWidth*activeTab;
    this.setData({stv: this.data.stv});
  },
  handlerTabTap(e) {
    this._updateSelectedPage(e.currentTarget.dataset.index);
  },
  checkOrder:function(e){
    var item=e.currentTarget.dataset.item;
       wx.navigateTo({
         url: '../indexInfo/checkOrder/checkOrder?id='+item.id
        })
  },
  disapproval:function(e){
    var orderToSend=new Array();
    var item=e.currentTarget.dataset.item;
    orderToSend.push(item);
    wx.showModal({
        content: '审批拒绝所选用车申请？',
        success: function(res) {
            if(res.confirm){
              wx.navigateTo({
                          url: '../approvalInfo/disapprovalproc/disapprovalproc?orderToSend='+JSON.stringify(orderToSend)
                        });
            }
        }
    });
},
  approval:function(e){
    var formId = e.detail.formId;
    var item=e.currentTarget.dataset.item;
    var idx=e.currentTarget.dataset.idx;
    var that =this;
    wx.showModal({
        content: '审批通过用车申请？',
        success: function(res) {
            if(res.confirm){
              
              var timestamp = Date.parse(new Date());
              timestamp = timestamp / 1000;
              wx.request({
                  url: api + 'order/approval', //审批通过
                  data: {
                     token:wx.getStorageSync('token'),
                     t:timestamp,
                     s:sha1.hex_sha1(app.data.key+timestamp),
                     
                     formId:formId,
                     approval:true,
                     approvalId:item.id
                  },
                  header: {
                      'content-type': 'application/json'
                  },
                  //method:'POST',
                  success: function(res) {
                    //return 0 indicates success
                    if(res.data==0){

                      wx.showModal({
                        title: '此申请已被审批',
                        content: '请选择其他申请！',
                        showCancel: false
                      });
                      that.data.orderArray[idx].selected=!that.data.orderArray[idx].selected;
                      that.setData({
                        orderArray:that.data.orderArray
                      })
                      
                    }else if(res.data==1){
                      wx.showToast({
                        title: '审批成功',
                        icon: 'success',
                        duration: 1000
                      });
                      that.approvalShow(); 
                    }else{

                    }
                  }
                })
            }
        }
    });
  }
})