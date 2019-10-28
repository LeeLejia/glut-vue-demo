<template>
  <div :id="$roodId" class="root-container" ref="root">
    <div class="search">
      <!-- @input="onSearch" -->
      <input class="input-box" v-model="docUrl" placeholder="Google Doc Link" />
      <el-button icon="el-icon-data-analysis" type="primary" circle @click="onSearch"></el-button>
    </div>
    <div class="desc">输入多语言Excel表格链接</div>
    <div class="history" v-if="!docUrl">
      <div class="empty desc" v-if="history.length === 0">empty!</div>
      <div class="item" v-for="item in history" :key="item" @click="docUrl=item,onSearch()">{{item}}</div>
    </div>
    <div class="row">
      <el-radio-group
        v-model="type"
        v-if="docUrl && report && report.warnList && report.warnList.length !== 0"
      >
        <el-radio :label="'verbose'">verbose</el-radio>
        <el-radio :label="'error'">error</el-radio>
        <el-radio :label="'warn'">warn</el-radio>
      </el-radio-group>
    </div>
    <div class="report" v-if="docUrl">
      <div class="wait" v-if="report && report.status">没检查到问题</div>
      <div class="item" v-for="warn in list" :key="warn.pos + warn.msg">
        <span class="level" :class="{error: warn.level==='error'}">{{warn.level}}</span>
        <span class="pos">{{warn.pos}}</span>
        <span class="msg">{{warn.msg}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import sdk from "glut-app-sdk";
import { check } from "./check.js";
export default {
  data() {
    return {
      wait: false,
      report: null,
      history: [],
      sheets: [],
      selectSheet: 0,
      docUrl: "",
      type: "verbose"
    };
  },
  computed: {
    list() {
      const type = this.type;
      if (type === "verbose")
        return (this.report && this.report.warnList) || [];
      if (type === "error") {
        return (
          (this.report &&
            this.report.warnList.filter(it => it.level === "error")) ||
          []
        );
      }
      if (type === "warn") {
        return (
          (this.report &&
            this.report.warnList.filter(it => it.level === "warn")) ||
          []
        );
      }
    }
  },
  created() {
    if (
      window.location.href.startsWith("https://docs.google.com/spreadsheets")
    ) {
      this.docUrl = window.location.href;
      this.onSearch();
    }
    this.history = JSON.parse(window.localStorage.getItem("URL_HISTORY")) || [];
  },
  methods: {
    onSearch() {
      if (!this.docUrl.startsWith("https://docs.google.com/spreadsheets")) {
        alert("请输入GoogleSheet链接");
        return;
      }
      const loading = this.$loading({
        lock: true,
        target: this.$refs.root,
        text: "检查中..",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.report = null;
      const urlSet = Array.from(new Set([this.docUrl, ...this.history])).slice(
        0,
        5
      );
      this.history = urlSet;
      window.localStorage.setItem("URL_HISTORY", JSON.stringify(urlSet));
      check(this.docUrl).then(res => {
        loading.close();
        if (res.status === 0) {
          alert("处理失败,请稍后重试");
          return;
        }
        this.report = (res.result && res.result.report) || null;
        console.log(res.result);
      });
    }
  }
};
</script>

<style lang="scss" scoped >
.root-container {
  padding: 10px 10px 20px 10px;
  ::-webkit-scrollbar {
    display: none;
  }

  width: 400px;
  height: 400px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow-y: hidden;
  align-items: center;

  .search {
    height: 32px;
    text-align: center;
  }

  .row {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 30px;
  }

  .selector {
    margin: 0 50px 0 10px;
    width: 140px;
  }

  .input-box {
    width: 300px;
    padding: 5px 20px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    border-radius: 21px;
    border: 1px solid rgb(187, 187, 187);
    outline: none;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

    &:focus {
      box-shadow: 1px 1px 2px 0 #c9c9c9;
    }
  }

  .refresh {
    width: 50px;
    height: 32px;
    margin-left: 15px;
    display: inline-block;
    font-size: 20px;
    cursor: pointer;
    &:active {
      font-size: 18px;
    }
  }

  .report {
    flex: 1;
    width: 380px;
    overflow-y: scroll;

    .item {
      margin-bottom: 20px;
      line-height: 25px;
      display: flex;
      flex-direction: row;

      .level {
        display: inline-block;
        padding: 0 5px;
        background: #9ad44d;
        color: white;
        border-radius: 5px;
        height: 25px;
      }
      .error {
        background: red;
        color: white;
      }
      .pos {
        margin: 0 5px;
        display: inline-block;
        border: 1px solid gray;
        font-weight: bold;
        padding: 0 5px;
        border-radius: 5px;
        height: 25px;
      }
      .msg {
        flex: 1;
        // display: inline-block;
      }
    }
  }

  .history {
    .empty {
      font-size: 18px;
    }
    .item {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 14px;
      color: gray;
      margin: 15px;
      width: 350;
      text-align: left;
      cursor: pointer;
      direction: rtl;
    }
  }

  .desc {
    font-size: 16px;
    text-align: center;
    padding: 10px;
    color: rgb(206, 206, 206);
  }

  ::-webkit-scrollbar {
    width: 0;
    display: none;
  }
}

// anim
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateY(10px);
  opacity: 0;
}
</style>

