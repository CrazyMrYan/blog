---
date: 2021-01-13
title: 测试 goPrint 局部打印
tags:
  - 打印
  - 插件
describe: 测试局部打印页面
---

`goPrint` 已经全局注册了，放心食用！

记住需要使用 `<!--startPrint-->` 开头，以 `<!--endPrint-->` 结尾

``` html
# 在文章中使用
<!--startPrint-->
- 这是要打印的内容
- 测试数据xxxxx
<!--endPrint-->

# Print 组件直接放上去
<Print />
```

点击左侧的打印按钮即可

<!--startPrint-->

- 这是要打印的内容
- 测试数据xxxxx
<!--endPrint-->

<Print />