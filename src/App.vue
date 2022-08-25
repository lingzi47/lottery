<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  components: {},
};
</script>


<style lang="less">
#app {
  background-color: #eee;
  min-height: 100%;
  font-size: 0.16rem;
}
/* 
  如果需要设置字体号为 16px 需要多少 rem

  1rem 为 100px

  ?rem/1rem = 16px/100px

  .16rem
*/
html,
body {
  height: 100%;
  font-size: 100px !important;
}
</style>
