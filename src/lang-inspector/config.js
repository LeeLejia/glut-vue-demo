// lilejia@bigo.sg

module.exports = {
  // UI以英文为准;
  uiLang: "en",
  // 短文本比较，标志过长短标题，前端处理短文本时可能没考虑多语言溢出;
  shortTextCompare: {
    which: [10, 20], // 短文本长度范围
    scale: 1.8 // 超过2的字符长度就提示
  }
};
