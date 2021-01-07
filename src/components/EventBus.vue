<script>
export default {
  data() {
    return {
      orderSuccese: false,
    };
  },
  created() {
    // this.$bus.$on('orderSuccese', (status) => {
    //   console.log("🚀 ~ EventBus: orderSuccese status", status)
    //   this.orderStatus(status);
    // })
  },
  beforeDestroy() {
    // [銷毀監聽事件]
    console.log('⛑️銷毀監聽事件: orderSuccese');
    // 如果要指定哪個監聽對應方法，就需要傳入第二個參數(對應$on設定的方法)
    this.$bus.$off('orderSuccese');
  },
  methods: {
    orderStatus(status) {
      this.orderSuccese = status;
    },
  },
}
</script>
