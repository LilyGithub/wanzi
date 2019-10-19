Component({
  properties: {
    showType:String,
    goodsInfo: Object,
    onClick: {
      type: Function
    }
  },

  data: {

  },
  methods: {
    itemClick: function(){
      console.info("jfdkl");
      this.data.onClick(this.data.goodsInfo);
    }
  }
});