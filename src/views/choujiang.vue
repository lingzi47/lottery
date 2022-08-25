<template>
  <div class="choujiang">
    <div class="header">
      <p class="text" @click="xiangqing">活动说明</p>
    </div>
    <div class="main">
      <div class="box">
        <ul class="list">
          <li
            class="list-item"
            :class="{ active: item.id == currentId }"
            v-for="item in choujiangList"
            :key="item.id"
          >
            <button v-if="item.btn" @click="clickBtn">{{ item.btn }}</button>
            <span v-else>{{ item | prizeTxt }}</span>
          </li>
        </ul>
      </div>
      <p class="pk-val">
        <!-- <img :src="item.image" alt="" srcset=""> -->
        <span style="margin-left: 7px; width: 140px"> 等级:{{ lv }}</span>
        <span style="margin-left: 7px; width: 140px"> PK值:{{ pk }}</span>
        <span style="margin-left: 7px; width: 150px">
          钻石数:{{ diamonds }}</span
        >
      </p>
      <p class="bei" style="width: 300px">pk值翻倍倍数：{{ bei }}倍</p>
      <div id="fan">
        <img src="../assets/fan.png" style="width: 0.8rem" />
      </div>
    </div>
    <div class="controler">
      <div class="btn start" @click="clickBtn">钻石抽奖(5钻)</div>
      <div class="btn1" @click="chu()">pk值储蓄罐</div>
      <!-- <div class="btn notic" @click="xiangqing" style="font-size: 0.13rem">
        十抽(50钻增20pk值)
      </div> -->
    </div>
    <div class="record">
      <div class="list-bg"></div>
      <ul class="record-list" v-if="recordList.length > 0">
        <li
          class="record-item"
          v-for="(item, index) in recordList"
          :key="index"
        >
          <span>{{ item.luck_info }}PK值</span>
          <span>{{ item.created_at | filterTime }}</span>
        </li>
        <!-- <p>更多</p> -->
      </ul>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { antiShake } from "./utils/utils.js"; //防抖

export default {
  data() {
    return {
      choujiangList: [],
      pkValue: 0,
      timer: null,
      currentId: -1,
      isBusy: false,
      lv: "",
      diamonds: "",
      pk: "",

      token: "", //用户ID
      isIos: false,
      times: 8, // 转动圈数
      prize_data: null,
      recordList: [], //中奖纪录

      bei: "",
    };
  },

  filters: {
    prizeTxt(item) {
      if (parseInt(item.pk)) {
        return item.pk + item.unit;
      }
      return "再来一次";
    },

    filterTime(time) {
      let arr = time.split(" ");
      return (
        arr[0].split("-").join("/") +
        " " +
        arr[1].slice(0, arr[1].lastIndexOf(":"))
      );
    },
  },

  created() {
    var url = window.location.href;
    this.url = url;
    var token = url.split("=")[1];
    this.token = token;
    console.log("用户token", this.token);
    if (this.deviceType() == 1) {
      this.isIos = true;
    }
    this.init();
    this.getRecordList();
    this.pkzhi();
  },
  //引入防抖文件

  methods: {
    chu: antiShake(function () {
      this.b();
    }),

    b() {
      if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
        let message = {
          method: "bei", //进入pk值罐
          param1: "bei",
        };
        // window.webkit.messageHandlers.pullUpAd.postMessage(message);
        window.webkit.messageHandlers.webViewApp.postMessage(message);
      } else if (navigator.userAgent.match(/android/i)) {
        // this.$toast("进入pk值罐");
        question.gogo(); //进入pk值罐
      }
    },
    pkzhi() {
      //pk值 和等级
      axios
        .post("https://yujian02.xyz/api/task/pkinfo", {
          token: this.token,
        })
        .then((res) => {
          console.log("钻石数量", res.data.data.diamonds);
          console.log("pk值", res.data.data.pk_lv);
          console.log("等级", res.data.data.pk_value);
          this.pk = res.data.data.pk_value;
          this.lv = res.data.data.pk_lv;
          this.diamonds = res.data.data.diamonds;
        });
      //pk值罐的等级
      axios
        .post("https://yujian02.xyz/api/task/poolinfo", {
          token: this.token,
        })
        .then((res) => {
          console.log("pk值罐等级", res.data.data.bei);
          this.bei = res.data.data.bei;
        });
    },
    deviceType() {
      var u = navigator.userAgent,
        app = navigator.appVersion;
      var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Linux") > -1; //g
      var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      if (isAndroid) {
        return 2;
      }
      if (isIOS) {
        return 1;
      }
    },

    init() {
      axios
        .post("https://yujian02.xyz/api/task/lucklist", { token: this.token })
        .then((res) => {
          // console.log(res);
          var jsonStr = res.data.data.luckjson;
          var jsonObj = JSON.parse(jsonStr);
          jsonObj.forEach((item) => {
            item.unit = "PK值";
          });
          jsonObj.splice(4, 0, {
            id: 10,
            btn: "抽奖",
          });
          this.choujiangList = jsonObj;
          console.log("奖项列表", this.choujiangList);
        });
    },
    xiangqing() {
      this.$router.push({
        path: "/home",
      });
    },
    run() {
      let order = [0, 1, 2, 5, 8, 7, 6, 3];
      let idx = 0;
      let times = 0;
      this.currentId = 0;
      this.timer = setInterval(() => {
        this.currentId = order[idx++];
        if (idx >= order.length) {
          idx = 0;
          times++;
        }
        if (times == this.times) {
          this.stop();
        }
      }, 50);
    },

    stop() {
      clearInterval(this.timer);
      this.timer = null;
      this.isBusy = false;
      this.currentId = this.prize_data.id;
      let prize = this.choujiangList.find(
        (item) => item.id == this.prize_data.id
      );
      if (parseInt(prize.pk)) {
        this.$toast("恭喜抽中" + prize.pk + "PK值,奖励已存入储蓄罐");

        this.pkValue += parseInt(prize.pk);
        this.getRecordList();
        this.pkzhi();
      } else {
        this.$toast("再来一次");
      }
      if (this.currentId == 8) {
        setTimeout(() => {
          this.choujiang(true);
        }, 1000);
      }
    },

    clickBtn() {
      this.choujiang();
    },

    choujiang(isFree = false) {
      if (this.isBusy) {
        this.$toast("请稍后再试");
        return;
      }
      this.isBusy = true;
      //抽奖
      axios
        .post("https://yujian02.xyz/api/task/luckpool", {
          token: this.token,
          phone: this.isIos ? 20 : 10,
          free: isFree ? 10 : 20,
        })
        .then((res) => {
          console.log("中奖信息", res.data.info);
          if (res.data.state == 201) {
            this.$toast("钻石不足!");
          } else if (res.data.state == 10) {
            this.prize_data = res.data.info; //已经拿到中奖信息，页面展示，等抽奖结束后，将弹窗弹出
            this.run();
          }
        })
        .catch((err) => {
          this.isBusy = false;
        });
    },

    getRecordList() {
      //获取中奖列表
      axios
        .post("https://yujian02.xyz/api/task/lucklog", {
          page: 1,
          limit: 20,
          token: this.token,
        })
        .then((res) => {
          // console.log(res.data);
          if (res.data.status == 10) {
            this.recordList = res.data.content.filter(
              (item) => parseInt(item.luck_info) > 0
            );
            console.log("中奖列表", this.recordList);
            if (!this.pkValue) {
              this.pkValue = this.recordList.reduce(
                (memo, curr) => memo + parseInt(curr.luck_info),
                0
              );
            }
          }
        });
    },
  },
};
</script>

<style lang="less" scoped>
.choujiang {
  background-image: url("../assets/1.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 100vh;
  padding-bottom: 3.1rem;
}
.header {
  background-image: url("../assets/game1.png");
  background-size: cover;
  background-position: top center;
  background-repeat: no-repeat;
  height: 1.9rem;
  position: relative;
}
.main {
  background-image: url("../assets/2.jpg");
  background-size: cover;
  background-position: top center;
  background-repeat: no-repeat;
  height: 3.5rem;
  padding-top: 0.25rem;

  .box {
    width: 3rem;
    height: 3rem;
    margin: 0 auto;
  }
  #fan {
    position: relative;
    img {
      position: absolute;
      top: -0.5rem;
      right: 0.2rem;
    }
  }
  .list {
    width: 100%;
    height: 100%;
    display: flex;
    flex-wrap: wrap;

    &.active {
      box-shadow: #e7e56c 0 0 6px;
    }

    &-item {
      width: 0.9rem;
      height: 0.9rem;
      margin: 0.05rem;
      background-color: rgb(239, 71, 88);
      box-shadow: rgb(229 217 217) 0 0 14px inset;
      border-radius: 6px;
      overflow: hidden;
      position: relative;

      &.active {
        box-shadow: #e7e56c 0 0 10px, #e7e56c 0 0 10px inset;
      }
    }
    button {
      width: 100%;
      height: 100%;
      background-color: #e7e56c;
      border: none;
      outline: none;
      color: rgb(206, 71, 71);
      font-weight: 700;
      font-size: 0.18rem;
      &:active {
        background-color: #c7c562;
      }
    }
    span {
      display: inline-block;
      width: 100%;
      text-align: center;
      position: absolute;
      bottom: 0.14rem;
      color: #fff;
    }
  }
  .bei {
    margin-top: 0.1rem;

    font-size: 0.15rem;

    margin-left: 0.28rem;
    color: #e7e56c;
  }
  .pk-val {
    margin-top: 0.6rem;

    width: 300px;

    font-size: 0.15rem;
    margin-left: 0.2rem;
    color: #e7e56c;
  }
  .pk-val1 {
    margin-top: 0.6rem;
    text-align: left;
    font-size: 0.15rem;
    padding-left: 0.2rem;
    color: #e7e56c;
  }
}
.text {
  position: absolute;
  top: 1.8rem;
  right: 0.35rem;
  font-size: 0.15rem;
  color: white;
  border-bottom: 1px solid white;
}

.controler {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 0 0.3rem;
  padding: 0.85rem 0 0 0;
  .btn {
    width: 1.46rem;
    height: 0.45rem;
    text-align: center;
    line-height: 0.4rem;
    font-size: 0.16rem;
    color: white;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    background-image: url("../assets/anniu1.png");
  }
}
.btn1 {
  width: 1.46rem;
  height: 0.45rem;
  text-align: center;
  line-height: 0.4rem;
  font-size: 0.16rem;
  color: #f24c5c;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  background-image: url("../assets/anniu.png");
}
.record {
  background-position: top center;
  background-size: contain;
  background-repeat: no-repeat;
  background-image: url("../assets/zhong.png");
  height: 0.7rem;
  padding-top: 0.9rem;
  position: relative;

  .list-bg {
    background-position: top center;
    background-size: contain;
    background-repeat: no-repeat;
    background-image: url("../assets/he.png");
    height: 0.31rem;
    width: 3.4rem;
    position: absolute;
    top: 0.8rem;
    left: 50%;
    transform: translateX(-50%);
  }

  &-list {
    padding: 0.3rem 0.05rem 0.1rem;
    background-color: #fff;
    width: 3rem;
    margin: 0 auto;

    position: relative;
    border-radius: 0 0 6px 6px;
    box-shadow: 4px 0 8px rgb(206, 200, 200);
    max-height: 2.6rem;
    overflow: scroll;
    p {
      text-align: center;
      margin-top: 0.2rem;
      opacity: 0.5;
    }
  }
  &-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.12rem;
    span:first-child {
      color: rgb(168, 61, 61);
    }
  }
}
</style>