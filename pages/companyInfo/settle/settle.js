var sha1=require('../../../utils/sha1.js');
var currentDT=require('../../../utils/currentDT.js');
var app=getApp();
var api = app.data.api;
Page({
  data: {

    start_date: '',
    start_time: '',


    end_date: '',
    end_time: '',

    mileage:0.0,

    gq_fee:0.0,
    pause_fee:0.0,
    gs_fee:0.0,
    account:0.0,
    notes:'',

    array_car:new Array(),
    index_car:0,

    array_driver:new Array(),
    index_driver:0,

  	orderToSend:new Array(),
    companyRole:wx.getStorageSync('name'),
    outerAccountStyle:'',
    milesStyle:'',
    gsStyle:'',
    gqStyle:'',
    pauseStyle:''
  },
  onLoad:function(query){
  	var orderToSend=JSON.parse(query.orderToSend);
    var current_time=new Date();
    var yyyy_mm_dd=currentDT.currentDate(current_time);
    var hh_mm=currentDT.currentTime(current_time);
    this.setData({
      start_date:yyyy_mm_dd,
      end_date:yyyy_mm_dd,
      start_time:hh_mm,
      end_time:hh_mm
    });
  	this.setData({
  		orderToSend:orderToSend,
      companyRole:wx.getStorageSync('name')
  	});
  },

  notesInput:function(e){
    this.setData({
      notes:e.detail.value
    })
  },
  bindStartDateChange: function(e) {
    this.setData({
      start_date: e.detail.value
    })
  },
  bindStartTimeChange: function(e) {
    this.setData({
      start_time: e.detail.value
    })
  },

  bindEndDateChange: function(e) {
    this.setData({
      end_date: e.detail.value
    })
  },
  bindEndTimeChange: function(e) {
    this.setData({
      end_time: e.detail.value
    })
  },




  actualMilesInput:function(e){
    this.setData({
        mileage:e.detail.value
    })
  },

  gqFeeInput:function(e){
    this.data.account-=this.data.gq_fee;
    this.data.account+=parseInt(e.detail.value);
    this.setData({
        gq_fee:parseInt(e.detail.value),
        account:this.data.account
    })
  },
  pauseFeeInput:function(e){
    this.data.account-=this.data.pause_fee;
    this.data.account+=parseInt(e.detail.value);
    this.setData({
        pause_fee:parseInt(e.detail.value),
        account:this.data.account
    })
  },
  gsFeeInput:function(e){
    this.data.account-=this.data.gs_fee;
    this.data.account+=parseInt(e.detail.value);
    this.setData({
        gs_fee:parseInt(e.detail.value),
        account:this.data.account
    })
  },

  totalInput:function(e){
    this.setData({
      account:parseInt(e.detail.value),
      gs_fee:0,
      gq_fee:0,
      pause_fee:0
    })
  },
  bindPickerCar:function(e){
    this.setData({
      index_car:e.detail.value
    })
  },
  bindPickerDriver:function(e){
    this.setData({
      index_driver:e.detail.value
    })
  },
  checkOuter(){
    //里程
    var reg=new RegExp("^[0-9]+(.[0-9]{1,3})?$");
    var isMileMatch= reg.test(this.data.mileage);
    if(!isMileMatch){
      this.setData({
        milesStyle:'1rpx solid red'
      })
    }else{
      this.setData({
        milesStyle:''
      })
    }

    var isAccountMatch=reg.test(String(this.data.account));
      if(!isAccountMatch){
      this.setData({
        outerAccountStyle:'1rpx solid red'
      })
    }else{
      this.setData({
        outerAccountStyle:''
      })
    }
    if(isMileMatch&&isAccountMatch){
      return true;
    }else{
            wx.showModal({
            title: '填写信息',
            content: '标红的为必填项，请完整填写！',
            showCancel: false
          });
          return false;
    }
  },
  checkIner(){
    var reg=new RegExp("^[0-9]+(.[0-9]{1,3})?$");
    var isMileMatch= reg.test(this.data.mileage);
    if(!isMileMatch){
      this.setData({
        milesStyle:'1rpx solid red'
      })
    }else{
      this.setData({
        milesStyle:''
      })
    }

    var isGsMatch=reg.test(String(this.data.gs_fee));
    if(!isGsMatch){
      this.setData({
        gsStyle:'1rpx solid red'
      })
    }else{
      this.setData({
        gsStyle:''
      })
    }

    var isGqMatch=reg.test(String(this.data.gq_fee));
    if(!isGqMatch){
      this.setData({
        gqStyle:'1rpx solid red'
      })
    }else{
      this.setData({
        gqStyle:''
      })
    }

    var isPauseMatch=reg.test(String(this.data.pause_fee));
    if(!isPauseMatch){
      this.setData({
        pauseStyle:'1rpx solid red'
      })
    }else{
      this.setData({
        pauseStyle:''
      })
    }

    if(isMileMatch&&isGqMatch&&isGsMatch&&isPauseMatch){
      return true;
    }else{
            wx.showModal({
            title: '填写信息',
            content: '标红的为必填项，请完整填写！',
            showCancel: false
          });
          return false;
    }

  },
  Settle:function(e){
      var formId     = e.detail.formId;
      var order_id   = this.data.orderToSend[0].id;
      var start_time = this.data.start_date+' '+this.data.start_time+':00';
      var end_time   = this.data.end_date+' '+this.data.end_time+':00';
      var mileage    = this.data.mileage;
      var gq_fee     = this.data.gq_fee;
      var pause_fee  = this.data.pause_fee;
      var gs_fee     = this.data.gs_fee;
      var account    = this.data.account;
      var notes      = this.data.notes;


      var that=this;
    wx.showModal({
        content: '确定结算订单？',
        success: function(res) {
            if(res.confirm&&((that.data.companyRole=="所内"&&that.checkIner())||(that.data.companyRole!="所内"&&that.checkOuter()))){
              var timestamp = Date.parse(new Date());
              timestamp = timestamp / 1000;
              wx.request({
                  url: api + 'company/orderSettle', //正吉url
                  data: {
                     token:wx.getStorageSync('token'),
                     t:timestamp,
                     s:sha1.hex_sha1(app.data.key+timestamp),

                     order_id:order_id,
                     start_time:start_time,
                     end_time:end_time,
                     mileage:mileage,
                     gq_fee:gq_fee,
                     pause_fee:pause_fee,
                     gs_fee:gs_fee,
                     account:account,
                     remark: notes,
                     formId:formId

                  },
                  header: {
                      'content-type': 'application/json'
                  },
                  //method:'POST',
                  success: function(res) {
                    if(!res.data){
                      wx.switchTab({
                      url: '../../company/company'
                    })
                    }else{
                      wx.showModal({
                          title: '结算失败',
                          content: '请重试！',
                          showCancel: false,
                          success:function(res){
                            if(res.confirm){
                              wx.navigateTo({
                                url: '../settle/settle?orderToSend='+JSON.stringify(that.data.orderToSend)
                              });
                            }
                          }

                        });
                    }
                    
                  }
                })
            }
        }
    });   
  }
})