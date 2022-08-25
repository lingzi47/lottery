<template>
  <div>
    <van-nav-bar
      title="活动说明"
      left-text=""
      left-arrow
      @click-left="onClickLeft"
    />
    <p class="yi">一、活动主题：钻石抽奖</p>
    <p class="yi">二、活动规则</p>
    <p class="er">
      1.钻石抽奖：使用钻石进行抽奖，每次抽奖消耗5钻石，可获得PK值奖励）
    </p>
    <p class="er">2.活动所得PK值可进行累加进行PK值等级的增长</p>
    <p class="er">
      3.PK值发放方式：PK值在储蓄罐中进行储存，用户可通过钻石抽奖页面的“翻倍”按钮对储蓄罐中的PK值进行增加，点击“翻倍”按钮后，用户观看广告增加储蓄罐中的PK值，最高可将储蓄罐中的PK值提升一倍。用户可通过手动操作的方式直接将储蓄罐中的PK值提出进行等级增加，每日0点，系统会将前一日储蓄罐中的PK值自动提出进行等级增加。
    </p>
    <p class="yi">三、PK值说明</p>
    <p class="er">
      PK值用于提升PK值等级，用于在钻石雨活动中领取钻石，PK值等级越高，获得钻石数量越大。
    </p>
    <p class="yi">四、注意事项</p>
    <p class="er">1.最终解释权归本公司所有。</p>
  </div>
</template>


<script>
export default {
  name: "Project2Home",

  data() {
    return {};
  },

  mounted() {},

  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
  },
};
</script>

<style scoped>
.yi {
  margin: 10px 15px;
  font-size: 15px;
}
.er {
  margin: 5px 10px;
  font-size: 14px;
}
</style>