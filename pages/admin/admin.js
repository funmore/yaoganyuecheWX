var sha1=require('../../utils/sha1.js');
var app=getApp();
var api = app.data.api;
//state: 8：型号订单待型号管理员审批  9：型号订单待科室领导审批  10:管理订单待科室领导审批    20：待派车到司机接单  21：所内派车 22-28:所外派车  23：所外指派  35：所外抢单
//       39：待确认(未确认车型和司机)    40：待确认（已确认车型和司机）待评价待结算   41：已确认未结算（评价与否未知） 43：已确认未结算（评价与否未知）调度确认费用后调度不同意  44:调度确认费用
//       50：已完成 0：已取消 1:40  51：型号订单审批被型号管理员拒绝  52:型号订单审批被领导理拒绝  53：管理订单审批被科室领导拒绝  
Page({
  data:{
    tabs: ['待调度', '调度中','已调度','待确认','已完成'],
    stv: {
      windowWidth: 0,
      lineWidth: 0,
      offset: 0,
      tStart: false
    },
    activeTab: 0,
    selectedAllStatus:false,
    selectedAllStatusRetreat:false,
    stateLength:new Array(3),
    stateLengthFlag:false,
    orderArray:new Array(),
    loadingHidden:false,
    hasRefresh:false,
    windowHeight:0,
    scrollHeight:0,
    sendtoAdminHeight:0    
  },
    countLength() {
    var stateLength=new Array(0,0,0,0,0);
    var orderArray=this.data.orderArray;
    for(var item in orderArray){
        if(orderArray[item]!=null){
        var state=orderArray[item].state;
        if(state==20){
          stateLength[0]++;
        }else if(state>20&&state<39){
          stateLength[1]++;
        }else if(state>=39&&state<=42){
          stateLength[2]++;
        }else if(state==43||state==44){
          stateLength[3]++;
        }else if(state>44||state==1){
          stateLength[4]++
        }else{

        }
      }
    }
    this.setData({
        stateLength:stateLength,
        stateLengthFlag:true
      });
  },
  adminShow(){
    this.setData({
                    loadingHidden:false
                  })
    var that=this;

    var timestamp = Date.parse(new Date());
            timestamp = timestamp / 1000;
            wx.request({
                url: api + 'order/adminShow', //正吉url 获取订单
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
                    loadingHidden:true,
                    selectedAllStatusRetreat:false,
                    selectedAllStatus:false  
                  });
                  that.countLength();
                }
              })
  },
  onReady:function(options){
    var that= this;
    wx.getSystemInfo({
                  success: function (res) {
                    var windowHeight=res.windowHeight;
                    var platform=res.platform;
                    if(platform==='ios'){
                      windowHeight=windowHeight-48;
                    }
                    windowHeight=windowHeight-8;
                    var scrollHeight=parseInt(windowHeight*0.86);
                    var sendtoAdminHeight=parseInt(windowHeight*0.14);
                    that.setData({
                      windowHeight:windowHeight,
                      scrollHeight:scrollHeight,
                      sendtoAdminHeight:sendtoAdminHeight
                  })
                  }
                });
  },
  onShow:function(options){
        if(wx.getStorageSync('role')=='admin')
            {
                this.adminShow();
            }else{
              wx.showModal({
                        title: '无信息',
                        content: '您尚不具有调度权限',
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
                url: api + 'order/adminShow', //正吉url 获取订单
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
                    hasRefresh:false,
                    selectedAllStatusRetreat:false,
                    selectedAllStatus:false  
                  });
                  that.countLength();
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
  bindCheckbox:function(e){
      var index =  parseInt(e.currentTarget.dataset.index);
      var selected =this.data.orderArray[index].selected;
      var orderArray=this.data.orderArray;
      orderArray[index].selected=!selected;
      this.setData({
        orderArray:orderArray
      });
    },
  bindSelectAll:function(e){
    var selectedAllStatus = this.data.selectedAllStatus;
    selectedAllStatus=!selectedAllStatus;
    var orderArray = this.data.orderArray;
          for (var i = 0; i < orderArray.length; i++) {
            if(orderArray[i].state==20){
              orderArray[i].selected = selectedAllStatus;
            }       
    }
    this.setData({
                  orderArray:orderArray,
                  selectedAllStatus:selectedAllStatus
              });
  },
  bindSelectAllRetreat:function(e){
    var selectedAllStatusRetreat = this.data.selectedAllStatusRetreat;
    selectedAllStatusRetreat=!selectedAllStatusRetreat;
    var orderArray = this.data.orderArray;
          for (var i = 0; i < orderArray.length; i++) {
            if(orderArray[i].state>20&&orderArray[i].state<36){
              orderArray[i].selected = selectedAllStatusRetreat;
            }       
    }
    this.setData({
                  orderArray:orderArray,
                  selectedAllStatusRetreat:selectedAllStatusRetreat
              });
  },
  goRetreat:function(e){
    var orderToSend = new Array();
      for(var item in this.data.orderArray){
        if(this.data.orderArray[item].state >20&&this.data.orderArray[item].state <36&& this.data.orderArray[item].selected == true){
              orderToSend.push(this.data.orderArray[item].id);
        }
      }
      var that =this;
      that.setData({
                  loadingHidden:false
                });
       var timestamp = Date.parse(new Date());
          timestamp = timestamp / 1000;
          wx.request({
              url: api + 'order/adminRetreat',
              data: {
                 token:wx.getStorageSync('token'),
                 t:timestamp,
                 s:sha1.hex_sha1(app.data.key+timestamp),
                
                 orderIdToSendStr:JSON.stringify(orderToSend)
                 
              },
              header: {
                  'content-type': 'application/json'
              },
              success: function(res) {
                      if(res.data==0){
                        that.adminShow();
                      // var timestamp = Date.parse(new Date());
                      //         timestamp = timestamp / 1000;
                      //         wx.request({
                      //             url: api + 'order/adminShow', //获取订单
                      //             data: {
                      //                token:wx.getStorageSync('token'),
                      //                t:timestamp,
                      //                s:sha1.hex_sha1(app.data.key+timestamp)
                      //             },
                      //             header: {
                      //                 'content-type': 'application/json'
                      //             },
                      //             //method:'GET',
                      //             success: function(res) {
                      //               //处理订单code
                      //               that.setData({
                      //                 orderArray: res.data,
                      //                 loadingHidden:true
                      //               });
                      //               that.countLength();
                      //               //处理订单codd end 
                      //             }
                      //           })
                    }else{
                      wx.redirectTo({
                        url:'../orderInfo/orderFail/orderFail'
                      })
                    }
              }
            })
  },
  goAppoint:function(e){
      var orderToSend = new Array();
      for(var item in this.data.orderArray){
        if(this.data.orderArray[item].state == 20&& this.data.orderArray[item].selected == true){
              orderToSend.push(this.data.orderArray[item]);
        }
      }
      var orderToSendStr=JSON.stringify(orderToSend);
      wx.navigateTo({
          url: '../adminInfo/appoint/appoint?orderToSendStr='+orderToSendStr
        })
  },
  goCompete:function(e){
      var orderToSend = new Array();
      for(var item in this.data.orderArray){
        if(this.data.orderArray[item].state == 20&& this.data.orderArray[item].selected == true){
              orderToSend.push(this.data.orderArray[item].id);
        }
      }
      var that =this;
      that.setData({
                  loadingHidden:false
                });
      var timestamp = Date.parse(new Date());
          timestamp = timestamp / 1000;
          wx.request({
              url: api + 'order/adminCompete',
              data: {
                 token:wx.getStorageSync('token'),
                 t:timestamp,
                 s:sha1.hex_sha1(app.data.key+timestamp),
                
                 orderIdToSendStr:JSON.stringify(orderToSend)
                 
              },
              header: {
                  'content-type': 'application/json'
              },
              success: function(res) {
                      if(res.data==0){
                        that.adminShow();
                      // var timestamp = Date.parse(new Date());
                      //         timestamp = timestamp / 1000;
                      //         wx.request({
                      //             url: api + 'order/adminShow', //获取订单
                      //             data: {
                      //                token:wx.getStorageSync('token'),
                      //                t:timestamp,
                      //                s:sha1.hex_sha1(app.data.key+timestamp)
                      //             },
                      //             header: {
                      //                 'content-type': 'application/json'
                      //             },
                      //             //method:'GET',
                      //             success: function(res) {
                      //               //处理订单code
                      //               that.setData({
                      //                 orderArray: res.data,
                      //                 loadingHidden:true
                      //               });
                      //               that.countLength();
                      //               //处理订单codd end 
                      //             }
                      //           })
                    }else{
                      wx.redirectTo({
                        url:'../orderInfo/orderFail/orderFail'
                      })
                    }
              }
            })
  },
  cancelOrder:function(e){
    var tabIndex=parseInt(e.currentTarget.dataset.tabIndex);    
    var orderIdToCancel=new Array();
    var orderArray=this.data.orderArray;
    for (var i = 0; i < orderArray.length; i++) {
      if(orderArray[i].state==20&&orderArray[i].selected==true){
          orderIdToCancel.push(orderArray[i].id);
        }
      }
    var that =this;
    wx.showModal({
        content: '确定取消所选用车申请？',
        success: function(res) {
            if(res.confirm){
              that.setData({
                  loadingHidden:false
                });
              var timestamp = Date.parse(new Date());
              timestamp = timestamp / 1000;
              var orderIdToCancelStr=JSON.stringify(orderIdToCancel);
              wx.request({
                  url: api + 'order/cancel', //取消
                  data: {
                     token:wx.getStorageSync('token'),
                     t:timestamp,
                     s:sha1.hex_sha1(app.data.key+timestamp),
                     
                     cancelId:orderIdToCancelStr
                  },
                  header: {
                      'content-type': 'application/json'
                  },
                  //method:'POST',
                  success: function(res) {
                    //return 0 indicates success
                    if(res.data==0){
                      var timestamp = Date.parse(new Date());
                              timestamp = timestamp / 1000;
                              wx.request({
                                  url: api + 'order/show', //获取订单
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
  },
    disapproval:function(e){
    var orderToSend=new Array();
    var item=e.currentTarget.dataset.item;
    orderToSend.push(item);
    wx.showModal({
        content: '审批拒绝报价？',
        success: function(res) {
            if(res.confirm){
              wx.navigateTo({
                          url: '../adminInfo/disapprovalproc/disapprovalproc?orderToSend='+JSON.stringify(orderToSend)
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
        content: '审批通过报价？',
        success: function(res) {
            if(res.confirm){
              
              var timestamp = Date.parse(new Date());
              timestamp = timestamp / 1000;
              wx.request({
                  url: api + 'order/adminApproval', //审批通过
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
                      that.adminShow(); 
                    }else{

                    }
                  }
                })
            }
        }
    });
  }

  //022-23300900
})