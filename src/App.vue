<template>
  <div :id="$rootId">
    <div class="demo-desc">该demo测试在不同站点发起跨域请求</div>
    <div class="test-cross-container">
      <div class="test-bing">
        <h3>bing测试</h3>
        <div class="test-content">{{bing}}</div>
      </div>
      <div class="test-baidu">
        <h3>百度测试</h3>
        <div class="test-content">{{baidu}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import sdk from "glut-app-sdk";

export default {
  data() {
    return {
      bing: "loading...",
      baidu: "loading..."
    };
  },
  created() {
    // prettier-ignore
    // @ts-ignore
    sdk.fetch('https://cn.bing.com/').then((res) => {
      this.bing = res;
    });
    // prettier-ignore
    sdk.fetch('https://www.baidu.com').then((res) => {
      this.baidu = res;
    });
  }
};
</script>

<style lang="scss">
.test-cross-container {
  width: 600px;
  height: 300px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
}
.demo-desc {
  margin: 10px 20px;
  color: #444242;
  text-align: center;
}
.test-bing,
.test-baidu {
  width: 270px;
  height: 270px;
  background: white;
  padding: 4px;
}
h3 {
  text-align: center;
  margin: 4px;
}
.test-content {
  max-width: 100%;
  max-height: 230px;
  overflow-y: scroll;
  text-align: left;
  word-break: break-word;
}
</style>