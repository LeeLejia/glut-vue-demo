<template>
  <div :id="$roodId" class="root-container">
    <div class="text" v-for="text in logs" :key="text">{{text}}</div>
  </div>
</template>

<script>
import sdk from "glut-app-sdk";

export default {
  name: "app",
  data() {
    return {
      logs: []
    };
  },
  created() {
    this.logs.push("小程序信息：");
    this.logs.push(JSON.stringify(sdk.getAppInfo()));
    sdk.setMenuList([
      {
        title: "菜单1",
        callback: () => {
          this.logs.push("点击了菜单1");
        }
      },
      {
        title: "菜单2",
        callback: () => {
          this.logs.push("点击了菜单2");
        }
      }
    ]);
    sdk.setEventListener("close", () => {
      this.logs.push("小程序关闭");
    });
    sdk.setEventListener("open", () => {
      this.logs.push("打开小程序");
    });
    sdk.setEventListener("doubleOpen", () => {
      this.logs.push("重复打开小程序");
    });
    sdk.setEventListener("mini", () => {
      this.logs.push("窗口被最小化");
    });
    sdk.setEventListener("max", () => {
      this.logs.push("窗口被最大化");
    });
    sdk.setEventListener("resize", () => {
      this.logs.push("窗口被最小化或者最大化");
    });
    sdk.saveConfig({ a: 2222222 });
    setTimeout(res => {
      sdk.readConfig({ a: "xx", c: "xx" }).then(res => {
        console.log(res);
      });
    }, 1000);
  },
  methods: {}
};
</script>

<style lang="scss" scoped >
.root-container {
  .text {
    text-align: left;
  }
}
</style>

