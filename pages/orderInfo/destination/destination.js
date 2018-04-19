

Page({
  data: {

    array_destination:['304场','门头沟','北京站','北京西站','北京南站','首都机场','南苑机场','南苑(科技一院)','唐家岭','易县','701库','三院','集团公司','其他地点'],
    index_destination:[0],
    destination:[''],
    destArray:[
      {id: 0, unique: 'unique_0'},
    ],
    styleArray:new Array(6)
  },

    onShow:function(options){
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    if(prevPage.data.dest.length!=0){
          this.setData({
              destArray:new Array(),
              index_destination:new Array(),
              destination:new Array()
          });
          var count=0;
        for(var item in prevPage.data.dest){
          this.data.destArray = this.data.destArray.concat([{id: count, unique: 'unique_' + count}]);
          count++;
          switch(prevPage.data.dest[item]){
              case '304场':
                this.data.destination=this.data.destination.concat('');
                this.data.index_destination=this.data.index_destination.concat([0]);
                break;
              case '门头沟':
                this.data.destination=this.data.destination.concat('');
                this.data.index_destination=this.data.index_destination.concat([1]);
                break;
              case '北京站':
                this.data.destination=this.data.destination.concat('');
                this.data.index_destination=this.data.index_destination.concat([2]);
                break;
              case '北京西站':
                this.data.destination=this.data.destination.concat('');
                this.data.index_destination=this.data.index_destination.concat([3]);
                break;
              case '北京南站':
                this.data.destination=this.data.destination.concat('');
                this.data.index_destination=this.data.index_destination.concat([4]);
                break;
              case '首都机场':
                this.data.destination=this.data.destination.concat('');
                this.data.index_destination=this.data.index_destination.concat([5]);
                break;
              case '南苑机场':
                this.data.destination=this.data.destination.concat('');
                this.data.index_destination=this.data.index_destination.concat([6]);
                break;
              case '南苑(科技一院)':
                this.data.destination=this.data.destination.concat('');
                this.data.index_destination=this.data.index_destination.concat([7]);
                break;
              case '唐家岭':
                this.data.destination=this.data.destination.concat('');
                this.data.index_destination=this.data.index_destination.concat([8]);
                break; 
              case '易县':
                this.data.destination=this.data.destination.concat('');
                this.data.index_destination=this.data.index_destination.concat([9]);
                break; 
              case '701库':
                this.data.destination=this.data.destination.concat('');
                this.data.index_destination=this.data.index_destination.concat([10]);
                break; 
              case '三院':
                this.data.destination=this.data.destination.concat('');
                this.data.index_destination=this.data.index_destination.concat([11]);
                break;
              case '集团公司':
                this.data.destination=this.data.destination.concat('');
                this.data.index_destination=this.data.index_destination.concat([12]);
                break;    
              default:
                this.data.destination=this.data.destination.concat(prevPage.data.dest[item]);
                this.data.index_destination=this.data.index_destination.concat([13]);
                break;
          }
        } 
    }
    this.setData({
      destArray:this.data.destArray,
      index_destination:this.data.index_destination,
      destination:this.data.destination
    })

  },
  radioChange: function(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },
  bindPickerDestination: function(e) {
    var id=e.target.dataset.itemId;
    this.data.index_destination[id]=e.detail.value;
    this.setData({
      index_destination: this.data.index_destination
    });
  },
  destInput:function(e){
    var id=e.target.dataset.itemId;
    this.data.destination[id]=e.detail.value;
    this.setData({
      destination:this.data.destination
    });
    if(this.data.destination[id]!=''){
      this.data.styleArray[id]='';
      this.setData({
        styleArray:this.data.styleArray
      })
    }
  },
  addOrigin:function(e){
    const length = this.data.destArray.length;
    if(length <= 5){
        this.data.destArray = this.data.destArray.concat([{id: length, unique: 'unique_' + length}]);
        this.data.index_destination=this.data.index_destination.concat([0]);
        this.data.destination=this.data.destination.concat('');
        this.setData({
          destArray: this.data.destArray,
          index_destination:this.data.index_destination
        });
        
      }else{
        wx.showModal({
          content: '最多6个出发地',
          showCancel:false,

        });
      } 
  },
  decOrigin:function(e){
    const length = this.data.destArray.length;
    if(length>=2){
        this.data.destArray.pop();
        this.data.index_destination.pop();
        this.setData({
          destArray: this.data.destArray,
          index_destination:this.data.index_destination
        })
    }else{
      wx.showModal({
          content: '最少1个出发地',
          showCancel:false,

        });
    }
  },
  onUnload:function(e){
        var pages = getCurrentPages();
        var currPage = pages[pages.length - 1];   //当前页面
        var prevPage = pages[pages.length - 2];  //上一个页面
        var dest=new Array();
        for(var item in this.data.index_destination){
          var value = this.data.index_destination[item];
          if(value<=this.data.array_destination.length-2){
            dest.push(this.data.array_destination[value]);
          }else{
            if(this.data.destination[item]!=''){
            dest.push(this.data.destination[item]);
            }
          }
        }
        prevPage.setData({
          dest: dest
        });
  },
  checkInput(){
    var ret=true;
    for(var item in this.data.index_destination){
      var value = this.data.index_destination[item];
      if(value>this.data.array_destination.length-2&&this.data.destination[item]==''){
          this.data.styleArray[item]='1rpx solid red';
          ret=false;
      }else{
          this.data.styleArray[item]='';
      }
    }
    this.setData({
      styleArray:this.data.styleArray
    });
    return ret;
  },
  saveAndBack:function(e){

    var check=this.checkInput();
    if(check){
          wx.navigateBack({
              delta: 1
            });
        }else{
          wx.showModal({
            title: '填写信息',
            content: '标红的为必填项，请完整填写！',
            showCancel: false
          });
        }
  }
}) 



