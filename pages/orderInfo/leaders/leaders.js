

Page({
  data: {
    leaders:new Array(),
    items: [
      {name: 'a', value: '赵家琛'},
      {name: 'b', value: '张世溪'},
      {name: 'c', value: '董胜波'},
      {name: 'd', value: '许绍青'},
      {name: 'e', value: '王宏强'},
      {name: 'f', value: '齐颖'},
      {name: 'g', value: '杨刚'},
      {name: 'h', value: '黄宜虎'},
      {name: 'i', value: '刘春利'},
      {name: 'j', value: '张强'}
      
    ]
  },

    onShow:function(options){
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
  },
   checkboxChange: function(e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value);
    this.setData({
      leaders:e.detail.value
    })
    console.log('radio发生change事件，携带value值为：', this.data.leaders);

  },

 

  onUnload:function(e){
        var pages = getCurrentPages();
        var currPage = pages[pages.length - 1];   //当前页面
        var prevPage = pages[pages.length - 2];  //上一个页面
        prevPage.setData({
          leaders: currPage.data.leaders
        });
  },

  saveAndBack:function(e){

        var pages = getCurrentPages();
        var currPage = pages[pages.length - 1];   //当前页面
        var prevPage = pages[pages.length - 2];  //上一个页面
        prevPage.setData({
          leaders: currPage.data.leaders
        });
        wx.navigateBack({
            delta: 1
          });
      }

}) 



