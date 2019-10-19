// components/goodsList/goodsList.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    goodsList:Object,
    showType:String,
    queryParam:Object,
    refreshFunc:{
      type:Function
    },
    loadFunc:{
      type:Function
    },
    itemClick:{
      type:Function
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    rowSize:{ //横向排列大小值
      goodsItemWidth: app.globalData.width / 2 - 2 * 3,
      goodsItemHeight: (app.globalData.width / 2 - 2 * 3)/2 * 3
    },
    bindItemClick:null
  },
  lifetimes: {
    attached: function () {
      this.setData({
        bindItemClick: this.bindItemClick.bind(this)
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    bindItemClick:function(goods){
      this.properties.itemClick(goods);
    },
    loadFunc:function(){
      if(this.properties.loadFunc)this.properties.loadFunc();
    },
    refreshFunc:function(){
      if(this.properties.refreshFunc)this.properties.refreshFunc();
    }
  }
})
