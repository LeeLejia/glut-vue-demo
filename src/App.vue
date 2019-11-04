<template>
  <div :id="$roodId" class="root-container" ref="root">
    <div class="search">
      <!-- @input="onHandle" -->
      <input class="url-input-box" v-model="docUrl" placeholder="Google Doc Link" />
      <img class="on-handle" @click="onHandle" src="@/assets/img/bt.svg" />
    </div>
    <div class="desc" v-if="!docUrl && !report">输入多语言Excel表格链接</div>
    <div class="report-info" v-else v-for="item in report.reportList" :key="item.msg">{{item.msg}}</div>
    <div class="history" v-if="!docUrl">
      <div class="empty desc" v-if="history.length === 0">empty!</div>
      <div class="item" v-for="item in history" :key="item" @click="docUrl=item,onHandle()">{{item}}</div>
    </div>
    <div
      class="option-row"
      v-if="docUrl && report && report.warnList && report.warnList.length !== 0"
    >
      <el-radio-group v-model="type">
        <el-radio :label="'verbose'">verbose</el-radio>
        <el-radio :label="'error'">error</el-radio>
        <el-radio :label="'warn'">warn</el-radio>
      </el-radio-group>
      <el-select v-model="lang" placeholder="选择语言" class="select-lang">
        <el-option key="default" label="全部语言" value="-1"></el-option>
        <el-option
          v-for="(item, idx) in (report && report.langList || [])"
          :key="item"
          :label="item"
          :value="idx"
        ></el-option>
      </el-select>
    </div>
    <div class="report" v-if="docUrl">
      <div class="no-report" v-if="report && report.status">没检查到问题</div>
      <div class="no-report" v-else-if="report && !report.status && list.length === 0">该选项不存在问题</div>
      <div
        class="item"
        :class="`item-${warn.level}`"
        v-for="warn in list"
        :key="warn.pos + warn.msg"
      >
        <span class="level">{{warn.level}}</span>
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
      lang: "-1",
      type: "verbose"
    };
  },
  computed: {
    list() {
      const type = this.type;
      let reportType = [];
      if (type === "verbose") {
        reportType = (this.report && this.report.warnList) || [];
      }
      if (type === "error") {
        reportType =
          (this.report &&
            this.report.warnList.filter(it => it.level === "error")) ||
          [];
      }
      if (type === "warn") {
        reportType =
          (this.report &&
            this.report.warnList.filter(it => it.level === "warn")) ||
          [];
      }
      const lang = this.lang - 0;
      if (lang === -1) {
        return reportType;
      }
      return reportType.filter(
        it => (it.pos || "").split("-")[1] === String.fromCharCode(66 + lang)
      );
    }
  },
  created() {
    sdk.readConfig({ history: [] }).then(({ history }) => {
      this.history = history;
    });
  },
  mounted() {
    if (
      window.location.href.startsWith("https://docs.google.com/spreadsheets")
    ) {
      this.docUrl = window.location.href;
    }
  },
  methods: {
    onHandle() {
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
      sdk.saveConfig({ history: urlSet });
      check(this.docUrl).then(res => {
        console.log("report:", res);
        loading.close();
        if (res.status !== 0) {
          alert("处理失败,请稍后重试");
          return;
        }
        this.report = res.result || null;
        console.log(res.result);
      });
    }
  }
};
</script>
<style lang="scss">
body {
  /deep/ .el-loading-text {
    text-align: center;
  }
  /deep/ .el-loading-mask {
    z-index: 99;
  }
  .el-select-dropdown.el-popper {
    z-index: 9999 !important;
  }
}
</style>
<style lang="scss" scoped >
.root-container {
  width: 420px;
  height: 480px;
  padding: 10px 10px 0 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow-y: hidden;
  align-items: center;
  font-size: 14px;

  ::-webkit-scrollbar {
    display: none;
  }

  .search {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;

    .on-handle {
      display: inline-block;
      width: 45px;
      height: 45px;
      border-radius: 50%;
      text-align: center;
      line-height: 45px;
      transition: all 1s;
      margin-left: 8px;
      text-align: center;
      border: 1px solid gray;

      &:hover {
        color: #6767e6;
        transform: rotate(360deg);
      }
    }

    .url-input-box {
      width: 250px;
      padding: 5px 20px;
      height: 20px;
      line-height: 20px;
      text-align: center;
      border-radius: 21px;
      font-size: 13px;
      border: 1px solid rgb(187, 187, 187);
      outline: none;
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

      &:focus {
        box-shadow: 1px 1px 2px 0 #c9c9c9;
      }
    }
  }

  .report-info {
    font-size: 13px;
    color: green;
    padding: 10px;
    text-align: left;
    width: 100%;
  }

  .option-row {
    width: 95%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 10px;
    z-index: 10000;

    /deep/ .el-radio {
      color: #606266;
    }

    /deep/ .el-input__inner {
      height: 30px;
      padding: 0 5px;
    }

    /deep/ .el-select__caret {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .select-lang {
      width: 100px;
      margin-left: 12px;
    }
  }

  .report {
    flex: 1;
    width: 380px;
    overflow-y: scroll;

    .no-report {
      text-align: center;
      margin: 30px;
      color: rgb(187, 187, 187);
    }

    .item {
      margin-bottom: 8px;
      line-height: 25px;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      .level {
        font-weight: bold;
        width: 40px;
        flex-shrink: 0;
      }

      .pos {
        width: 60px;
        margin: 0 5px;
        font-weight: bold;
      }

      .msg {
        flex: 1;
      }
    }

    .item-warn {
      .level {
        color: green;
      }
      .pos {
        color: #ef9e23;
      }
      .msg {
        color: green;
      }
    }

    .item-error {
      .level {
        color: #ca1616;
      }
      .pos {
        color: #ef9e23;
      }
      .msg {
        color: #ca1616;
      }
    }
  }

  .history {
    width: 95%;
    .empty {
      font-size: 14px;
    }
    .item {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 12px;
      color: gray;
      margin: 15px;
      text-align: left;
      cursor: pointer;
      direction: rtl;
    }
  }

  .desc {
    font-size: 13px;
    text-align: center;
    padding: 10px;
    color: rgb(206, 206, 206);
  }

  ::-webkit-scrollbar {
    width: 0;
    display: none;
  }
}
</style>

