<script>
export default {
  onLaunch: function () {
    console.log('App Launch');
  },
  onShow: function () {
    console.log('App Show');
  },
  onHide: function () {
    console.log('App Hide');
  },
};
</script>

<style lang="scss">
/*每个页面公共css */
/* 引入 kangaroo-uni 主题：品牌色 -> wot-ui CSS 变量 */
@import 'kangaroo-uni/theme/index.scss';
</style>
