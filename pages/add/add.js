var sha1=require('../../utils/sha1.js');
var currentDT=require('../../utils/currentDT.js');
var app=getApp();
var api = app.data.api;
// var origin=require('../orderInfo/origin/origin.js');
Page({
  data: {
    date: '',
    dateCurr:'',
    date2after:'',
    time: '',
    time30minutes:'',


    array_applyType:['申请用车流程','事后补单流程'],
    index_applyType:0,

    array_yongCheLeiXing:['集体活动','科研生产','执纪','公务接待','应急'],
    index_yongCheLeiXing: 0,
    index_isOffWorkTime:0,



    array_carType:['客车','货车'],
    index_carType:0,

    array_van:['厢车','敞车','客货两用'],
    index_van:0,

    array_isleader:['否','是'],
    index_isleader:0,

    leaders:new Array(),
    index_oneOrTwoWay: 0,
    index_isTakeProduct:0,
    array_manager:new Array(),
    index_manager:0,

    // reasonForKeYan:'乘车事由',
    reason:'',
    reasonInTable:'',
    workers:'',
    origin:new Array(),
    dest:new Array(),

    applyer:wx.getStorageSync('name'),
    passenger:'',
    passengerTel:'',
    notes:'',
    originStyle:'',
    destStyle:'',
    reasonStyle:'',
    passengerStyle:'',
    passengerTelStyle:'',
    passengerNumStyle:'',
    leadersStyle:'',
    timeStyle:'',

    passengerNum:0


  },

  onShow:function(e){
      if(wx.getStorageSync('role')=='company'){
              wx.showModal({
                        title: '无信息',
                        content: '您尚不具有员工权限',
                        showCancel: false,
                        success:function(e){
                  
                          wx.switchTab({
                            url: '../company/company'
                          })
                        }
                      });
      }
      if(this.data.origin.length!=0){
              this.setData({
                originStyle:''
              })
            }
      if(this.data.dest.length!=0){
        this.setData({
          destStyle:''
        })
      }
      var isLeadersNull=this.data.leaders.length==0&&this.data.index_isleader==1
      if(!isLeadersNull){
        this.setData({
          leadersStyle:''
        })
      }
      this.setReasonInTable(this.data.reason)

  },
    setReasonInTable(reason){
      var reasonInTable=null;
     if(reason.length<=10){
        reasonInTable=reason;
      } else {
        reasonInTable=reason.substring(0,10)+"...";
      }
      this.setData({
        reasonInTable:reasonInTable
      })
    },
  getManager(){
      var that =this;
      var timestamp = Date.parse(new Date());
              timestamp = timestamp / 1000;
              wx.request({
                  url: api + 'employee/getManager', //正吉url 获取订单
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
                      array_manager: res.data
                    });
                  }
                });
  },
  checkTimeright(){
    var data=this.data;
    var isTimeOk=true;
    var dateString=data.date+' '+data.time+':00';
    dateString=dateString.replace(/-/g, '/'); 
    var use_time=new Date(dateString);
    var apply_time=new Date();
    var time=use_time.getTime()-apply_time.getTime();   //申请时间和当前时间的差
    if(data.index_applyType==0){
          if(time<1000*60*30)   //1000*60*60*0.5
          { 
            isTimeOk=false;
          }else{
            isTimeOk=true;
          }
    }else{
      if(time<0)   //1000*60*60*0.5
          { 
            isTimeOk=true;
          }else{
            isTimeOk=false;
          }
    }
    return isTimeOk;
  },
  onLoad:function(e){
    this.getManager();
    var current_time=new Date();
    var yyyy_mm_dd=currentDT.currentDate(current_time);
    var hh_mm=currentDT.currentTime(current_time);
    
    var twodayafterm=current_time.getTime()+1000*60*60*48;
    var twodayafter=new Date(twodayafterm);
    var yyyy_mm_dd_2dayafter=currentDT.currentDate(twodayafter);


    this.setData({
      date:yyyy_mm_dd,
      dateCurr:yyyy_mm_dd,
      date2after:yyyy_mm_dd_2dayafter,
      time:hh_mm
    });
    this.setData({
      applyer:wx.getStorageSync('name')
    })

  },
  applyerInput:function(e){
    this.setData({
      applyer:e.detail.value
    })
  },
  bindPickerApplyTypeChange:function(e){
    this.setData({
      index_applyType:e.detail.value
    })
  },
  bindPickerManagerChange:function(e){
    this.setData({
      index_manager:e.detail.value
    });
  },


  passengerInput:function(e){
    this.setData({
      passenger:e.detail.value
    })
    if(this.data.passengerInput!=''){
      this.setData({
        passengerStyle:''
      })
    }
  },
  minus:function(e){
    var passengerNum=this.data.passengerNum;
    if(!passengerNum){

    }else{
    this.setData({
      passengerNum:passengerNum-1
    })
    }
  },
  plus:function(e){
    var passengerNum=this.data.passengerNum;
    this.setData({
      passengerNum:passengerNum+1
    })
   var isPassengerNum=this.checkPassengerNum();
    if(isPassengerNum==true){
      this.setData({
        passengerNumStyle:''
      })
    }
  },
  passengerTelInput:function(e){
    this.setData({
      passengerTel:e.detail.value
    })
    if(this.data.passengerTelInput!=''){
      this.setData({
        passengerTelStyle:''
      })
    }
  },
  bindPickerYongcheleixingChange: function(e) {
    // var reason=null;
    // if(e.detail.value==0){
    //   reason=this.data.array_reason[this.data.index_reason];
    // }else if(e.detail.value==1){
    //   reason=this.data.reasonForKeYan;
    // }
    this.setData({
      index_yongCheLeiXing: e.detail.value,
      //reason:reason
    });
    // if(this.data.reason!=''){
    //   this.setData({
    //     reasonStyle:''
    //   })
    // }
  },
  // reasonInput:function(e){
  //   this.setData({
  //       reason:e.detail.value
  //   });
  //   if(this.data.reason!=''){
  //     this.setData({
  //       reasonStyle:''
  //     })
  //   }
  // },
  // bindReasonChange:function(e){
  //   this.setData({
  //     index_reason:e.detail.value,
  //     reason:this.data.array_reason[e.detail.value]
  //   });
  // },
  notesInput:function(e){
    this.setData({
      notes:e.detail.value
    })
  },

  bindDateChange: function(e) {
    this.setData({
      date: e.detail.value
    });
    var isTimeOk=this.checkTimeright();
    if(isTimeOk){
      this.setData({
        timeStyle:''
      })
    }
  },
  bindTimeChange: function(e) {
    this.setData({
      time: e.detail.value
    })
    var isTimeOk=this.checkTimeright();
    if(isTimeOk){
      this.setData({
        timeStyle:''
      })
    }
  },


  bindCarChange:function(e){
    this.setData({
      index_carType:e.detail.value
    })
  },
  bindVanChange:function(e){
    this.setData({
      index_van:e.detail.value
    })
  },
  bindIsLeaderChange:function(e){
    this.setData({
      index_isleader:e.detail.value
    })
  },
  switchOneOrTwoWayChange: function(e) {
    var index=0;
    if(e.detail.value){
      index=1;
    }else{
      index=0;
    }
    this.setData({
      index_oneOrTwoWay: index
    })
  },
  switchIsTakeProductChange: function(e) {
    var index=0;
    if(e.detail.value){
      index=1;
    }else{
      index=0;
    }
    this.setData({
      index_isTakeProduct: index
    })
  },
  switchIsOffWorkTimeChange:function(e){
    var index=0;
    if(e.detail.value){
      index=1;
    }else{
      index=0;
    }
    this.setData({
      index_isOffWorkTime:index
    })
  },
  bindWorkerNeedsInput: function(e) {
    this.setData({
      workers: e.detail.value
    })
  },
  checkInfo:function(e){
      var id=e.currentTarget.id;
      var title=null;
      var content=null;
      if(id=="ori"){
          title="出发地";
          content=this.data.origin.join("、");
      }else if(id=="dest"){
          title="目的地";
          content=this.data.dest.join("、");
      }else if(id=="lead"){
          title="领导";
          content=this.data.leaders.join("、");
      }
      wx.showModal({
        title: title,
        content:content,
        showCancel:false,
      });

  },
  checkPassengerNum(){
        var isPassengerNum=true;
        if(this.data.index_yongCheLeiXing==0){
          if(this.data.passengerNum<4)
            isPassengerNum=false;
        }else{
          if(this.data.passengerNum<1)
            isPassengerNum=false;
        }
        return isPassengerNum;
  },
  checkInput(){

    var data=this.data;
    var isTimeOk=true;
    var dateString=data.date+' '+data.time+':00';
    dateString=dateString.replace(/-/g, '/'); 
    var use_time=new Date(dateString);
    var apply_time=new Date();
    var time=use_time.getTime()-apply_time.getTime();   //申请时间和当前时间的差
    if(data.index_applyType==0){
          if(time<1000*60*30)   //1000*60*60*0.5
          { 
            isTimeOk=false;
          }else{
            isTimeOk=true;
          }
    }else{
      if(time<0)   //1000*60*60*0.5
          { 
            isTimeOk=true;
          }else{
            isTimeOk=false;
          }
    }

    var isPassengerNum=this.checkPassengerNum();
    if(isPassengerNum==false){
      this.setData({
        passengerNumStyle:'1rpx solid red'
      })
    }


    if(!isTimeOk){
      this.setData({
        timeStyle:'1rpx solid red'
      })
    }else{
      this.setData({
        timeStyle:''
      })
    }

    if(!this.data.origin.length){
      this.setData({
        originStyle:'1rpx solid red'
      })
    }else{
      this.setData({
        originStyle:''
      })
    }
    if(!this.data.dest.length){
        this.setData({
        destStyle:'1rpx solid red'
      })
    }else{
      this.setData({
        destStyle:''
      })
    }
    if(this.data.passenger==''){
        this.setData({
          passengerStyle:'1rpx solid red'
        })
    }else{
      this.setData({
          passengerStyle:''
        })
    }
    var isReasonRight=true;
    if(this.data.reason.length<10){
      this.setData({
        reasonStyle:'1rpx solid red'
      });
      isReasonRight=false;
    }else{
      this.setData({
          reasonStyle:''
        })
    }

    var isLeadersNull=this.data.leaders.length==0&&this.data.index_isleader==1;
    if(isLeadersNull){
      this.setData({
        leadersStyle:'1rpx solid red'
      })
    }else{
      this.setData({
        leadersStyle:''
      })
    }
    
    //查看电话号码是否符合11位
    
    var isMatch=/\d{11}/.test(this.data.passengerTel);
    if(!isMatch){
        this.setData({
          passengerTelStyle:'1rpx solid red'
        })
    }else{
      this.setData({
          passengerTelStyle:''
        })
    }
    var isOtherRight=isPassengerNum&&!isLeadersNull&&this.data.origin.length&&this.data.dest.length&&this.data.passenger!=''&&isMatch&isReasonRight;
    if(isOtherRight&&isTimeOk){
      return true;
    }else{
      wx.showModal({
                              title: '申请信息有误',
                              content: '申请用车流程用车时间需在申请时间半小时后/事后补单流程用车时间需在申请时间之前/标红的为必填项，请完整填写',
                              showCancel: false
                            });

      }    
      return false;
    },
  applyForCar:function(e){
    var formId = e.detail.formId;
    var data=this.data;
    var that=this;
    if(data.passengerNum>=2){
        var passenger=data.passenger+'等'+String(data.passengerNum)+'人';
    }else{
        var passenger=data.passenger;
    }

    wx.showModal({
        content: '确定提交用车申请？',
        success: function(res) {
            if(res.confirm&&that.checkInput()){

              var timestamp = Date.parse(new Date());
              timestamp = timestamp / 1000;
              var originStr=JSON.stringify(data.origin);
              var destStr=JSON.stringify(data.dest);
              var leadersStr=data.index_isleader==1 ?  JSON.stringify(data.leaders):null;
              var manager=(data.index_yongCheLeiXing==1? data.array_manager[data.index_manager].id:2000);
              var van=(data.index_carType==1 ? data.array_van[data.index_van]:'');
              wx.request({
                  url: api + 'order/create', //正吉url
                  data: {
                     token:wx.getStorageSync('token'),
                     t:timestamp,
                     s:sha1.hex_sha1(app.data.key+timestamp),
                     
                     usetime:data.date+' '+data.time+':00',
                     applyType:data.index_applyType,
                     type:data.index_yongCheLeiXing,
                     manager:manager,
                     reason: data.reason,   //补全
                     istakeproduct:data.index_isTakeProduct,
                     passenger:passenger,
                     mobilephone:data.passengerTel,
                     isweekend:data.index_isOffWorkTime,
                     isreturn:data.index_oneOrTwoWay,
                     workers:data.workers,

                     isVan:data.index_carType,
                     vanType:van,
                     isLeader:data.index_isleader,
                     leaderInfo:leadersStr,

                     origin:originStr,
                     dest:destStr,
                     remark:data.notes,
                     formId:formId
                  },
                  header: {
                      'content-type': 'application/json'
                  },
                  //method:'POST',
                  success: function(res) {
                    if(res.data.state==10||res.data.state==8){
                      
                      wx.redirectTo({
                            url: '../orderInfo/orderSuccess/orderSuccess',
                            fail:function(e){
                              wx.redirectTo({
                                url:'../orderInfo/orderFail/orderFail'
                              })
                            }
                          })
                    }else{
                      wx.showToast({
                        title: '申请订单失败',
                        icon: 'warn',
                        duration: 1000
                      });
                      wx.switchTab({
                        url: '../order/order'
                      });
                    }
                  }
                })
            }
        }
    });
    
  }
})


          
          
