

Page({
  data: {

      reason:'',
  },
  onShow:function(options){
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    var placeholder='';
    if(prevPage.data.reason!='')
    this.setData({
      reason:prevPage.data.reason,
    })

  },
   bindTextAreaInput: function(e) {
    this.setData({
      reason:e.detail.value,
    })
  },
  onUnload:function(e){
        var pages = getCurrentPages();
        var currPage = pages[pages.length - 1];   //当前页面
        var prevPage = pages[pages.length - 2];  //上一个页面
        prevPage.setData({
          reason: currPage.data.reason
        });
  },

  saveAndBack:function(e){

        var pages = getCurrentPages();
        var currPage = pages[pages.length - 1];   //当前页面
        var prevPage = pages[pages.length - 2];  //上一个页面
        prevPage.setData({
          reason: currPage.data.reason
        });
        wx.navigateBack({
            delta: 1
          });
      }
}) 



