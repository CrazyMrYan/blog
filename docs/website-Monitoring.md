---
date: 2021-01-29
title: 网站监控笔记（一） — Performance
tags:
  - 监控
  - 性能优化
describe: 网站监控是到底是监控的啥？我们为什么要监控？
---

<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=100% height=100  src="//music.163.com/outchain/player?type=2&id=28613314&auto=0&height=66"></iframe>

## What is website monitoring?

什么是`网站监控`？其实我们主要是实时监控`网站性能`，是否存在`异常资源`、`请求`、`代码出错` 、`页面加载消耗时长` 等 一系列问题！如果出现这些问题，你能不能及时定位问题原因? 在之前的 [《如何优化祖传代码》](http://blog.lovemysoul.vip/docs/vue-Optimize.html#%E4%B8%BA%E4%BB%80%E4%B9%88%E8%A6%81%E4%BC%98%E5%8C%96%EF%BC%9F) 这篇文章中我也有讲到`客户流失率`，感兴趣的同学可以去看看。只不过是针对于网页打开速度的，那如果你页面请求资源都错误了如 `js`、 `css`、`request` 发生错误了呢？不能及时定位问题，那岂不是GG了。主要是最近一直在考虑做一个性能监控产品，老严也是特别在乎这一块的内容。

## 主要作用
-  测DNS污染检测
-  网站打开速度检测
-  网站资源出现异常
-  感知到业务出错的概率
-  发布后对性能有否存在影响
-  了解业务的稳定性
-  对访问用户进行分析


## 如何做？
1. 性能监控
2. 资源异常
3. 辅助插件
4. 记录日志
5. 监控平台
6. 捕捉异常
7. 资源阻塞


今天我们来讲解一下 第一个性能监控（主要是围绕 js 中 performance api讲解）,因为关乎性能方面东西确实太多了

## Go！
![](http://img.lovemysoul.vip/images/74d687c76ce9be01bad92404fa2b5f8.png)

## 网站性能监听 

## 什么是 performance ？

我们可以先了解一下 [Performance [0]](https://developer.mozilla.org/zh-cn/docs/web/api/performance)，做网站监控必备之一

MDN 这样描述 Performance :

> `Performance` 接口可以获取到当前页面中与性能相关的信息。它是 High Resolution Time API 的一部分，同时也融合了 Performance Timeline API、[Navigation Timing API](https://developer.mozilla.org/en-US/docs/Web/API/Navigation_timing_API)、 [User Timing API](https://developer.mozilla.org/en-US/docs/Web/API/User_Timing_API) 和 [Resource Timing API](https://developer.mozilla.org/en-US/docs/Web/API/Resource_Timing_API)。

## performance 属性

先看看是个啥东西

```js
console.log(window.performance)
```

![](http://img.lovemysoul.vip/images/image-20210129154803890.png)

可以看到输出了 `Performance ` 对象，里面包含了几个属性，分别是

1. <s>memory</s>  预期跨浏览器支持不佳。

![](http://img.lovemysoul.vip/images/image-20210129164039689.png)

```js
// 上下文内可用堆的最大体积，以字节计算。
jsHeapSizeLimit
// 已分配的堆体积，以字节计算。
totalJSHeapSize
// 当前 JS 堆活跃段（segment）的体积，以字节计算。
usedJSHeapSize

```

2. <s>eventCounts</s> 预期跨浏览器支持不佳。



****

3. timing 

4. navigation

5. timeOrigin

6. onresourcetimingbufferfull

因为 `memory` 、`与eventCounts` 的支持性不是很好，所以我们先略过，感兴趣的朋友可以去 MDN 瞧瞧

**那我们接下来将这四个**

- timing 

- navigation

- timeOrigin

- onresourcetimingbufferfull

### performance.timing 

timing 是个啥玩意？ 

接着打印一下看看

![](http://img.lovemysoul.vip/images/image-20210129160224186.png)

大家也可以配合这张图来看看
![](http://img.lovemysoul.vip/images/16112863371891.jpg)

performance .timing 对象包含延迟相关的性能信息。

因为东西太多，我们分离一些重要的信息出来讲解


```js
let t = performance.timing;
页面加载完成所耗时间 = t.loadEventEnd - t.navigationStart;
解析 DOM树 时间 = t.domComplete - t.responseEnd;
资源加载完成时间 = t.responseEnd - t.requestStart
TCP建立连接完成时间 = t.connectEnd - t.connectStart
```

**作用： 可以监听这些数值，判断网页加载性能**



虽然现在好像要废弃了，但是现在还是可以用的



### performance.navigation

还是来打印一下

![](http://img.lovemysoul.vip/images/image-20210129163241241.png)

第一个是 `redirectCount` 是重定向次数

第二个是 `type  ` 判断是页面是从哪里加载的

```js
type
//0：网页通过点击链接、地址栏输入、表单提交、脚本操作等方式加载
//1：网页通过“重新加载”按钮或者location.reload()方法加载
//2：网页通过“前进”或“后退”按钮加载
//255：其他来源的加载
```

**作用：可以用作统计网页访问方式及来源，以及是否重定向**



### performance.resourcetimingbufferfull

属性是一个在resourcetimingbufferfull事件触发时会被调用的 event handler 。它的值是一个手动设置的回调函数，这个回调函数会在浏览器的资源时间性能缓冲区满时执行。

**官方例子**：

```js
function buffer_full(event) {
  console.log("WARNING: Resource Timing Buffer is FULL!");
  performance.setResourceTimingBufferSize(200);
}
function init() {
  // Set a callback if the resource buffer becomes filled
  performance.onresourcetimingbufferfull = buffer_full;
}
<body onload="init()">
```



## performance 方法

方法也是很多的，大家可以看看

![](http://img.lovemysoul.vip/images/image-20210129165609974.png)

我们也挑几个出来遛一遛

### performance.now()

返回当前到页面打开时刻的耗时，精确到千分之一毫秒

```js
performance.now()
```

![](http://img.lovemysoul.vip/images/image-20210129153807815.png)

**作用：监控页面资源请求耗时**



### performance.getEntries() 

对网页发起的所有HTTP请求耗时信息统计后，以数组方式返回

```js
performance.getEntries()
```

![](http://img.lovemysoul.vip/images/image-20210129173711265.png)

**作用：监控请求资源请求耗时**



### performance.mark()

建立测速标记

```js
performance.mark("mySetTimeout-start");
```



### performance.measure()

用于计算标记之间的时间戳

```js
performance.measure(
	"mySetTimeout",
	"mySetTimeout-start",
	"mySetTimeout-end"
);
```



### performance.clearMarks() 

清除测速标记

```js
performance.clearMarks();
```



### 小demo

引用官网例子

```js
// 以一个标记开始。
performance.mark("mySetTimeout-start");

// 等待一些时间。
setTimeout(function() {
  // 标记时间的结束。
  performance.mark("mySetTimeout-end");

  // 测量两个不同的标记。
  performance.measure(
    "mySetTimeout",
    "mySetTimeout-start",
    "mySetTimeout-end"
  );

  // 获取所有的测量输出。
  // 在这个例子中只有一个。
  var measures = performance.getEntriesByName("mySetTimeout");
  var measure = measures[0];
  console.log("setTimeout milliseconds:", measure.duration)

  // 清除存储的标记
  performance.clearMarks();
  performance.clearMeasures();
}, 1000);
```
输出
![](http://img.lovemysoul.vip/images/1612061312(1).jpg)

**作用：可以计算某段代码执行速度**

## 总结一下
我们在以上的对 `performance` 的简单了解之后我们可以选择自己需要监控的数据，如xxx资源加载太慢或是页面加载速度进行上报，并记录 log 上报，进行进行日数据归档。下一篇将会讲，如何监听网站资源异常。


## 实战一波
我们将前面讲到的所需的可以写成一个监控函数返回一个对象，然后执行上报[1]
```js
function getPerformanceTiming() {
    var performance = window.performance;
    var t = performance.timing;
    var gather = {};
    //【重要】页面加载完成的时间
    //【原因】这几乎代表了用户等待页面可用的时间
    gather.loadPage = t.loadEventEnd - t.navigationStart;
    //【重要】解析 DOM 树结构的时间
    //【原因】反省下你的 DOM 树嵌套是不是太多了！
    gather.domReady = t.domComplete - t.responseEnd;
    //【重要】重定向的时间
    //【原因】拒绝重定向！比如，http://example.com/ 就不该写成 http://example.com
    gather.redirect = t.redirectEnd - t.redirectStart;
    //【重要】DNS 查询时间
    //【原因】DNS 预加载做了么？页面内是不是使用了太多不同的域名导致域名查询的时间太长？
    // 可使用 HTML5 Prefetch 预查询 DNS ，见：[HTML5 prefetch](http://segmentfault.com/a/1190000000633364)            
    gather.lookupDomain = t.domainLookupEnd - t.domainLookupStart;
    //【重要】读取页面第一个字节的时间
    //【原因】这可以理解为用户拿到你的资源占用的时间，加异地机房了么，加CDN 处理了么？加带宽了么？加 CPU 运算速度了么？
    // TTFB 即 Time To First Byte 的意思
    // 维基百科：https://en.wikipedia.org/wiki/Time_To_First_Byte
    gather.ttfb = t.responseStart - t.navigationStart;
    //【重要】内容加载完成的时间
    //【原因】页面内容经过 gzip 压缩了么，静态资源 css/js 等压缩了么？
    gather.request = t.responseEnd - t.requestStart;
    //【重要】执行 onload 回调函数的时间
    //【原因】是否太多不必要的操作都放到 onload 回调函数里执行了，考虑过延迟加载、按需加载的策略么？
    gather.loadEvent = t.loadEventEnd - t.loadEventStart;
    // DNS 缓存时间
    gather.appcache = t.domainLookupStart - t.fetchStart;
    // 卸载页面的时间
    gather.unloadEvent = t.unloadEventEnd - t.unloadEventStart;
    // TCP 建立连接完成握手的时间
    gather.connect = t.connectEnd - t.connectStart;
    // 请求资源集合
    gather.requestResources = performance.getEntries()
    return gather;
}
```
![](http://img.lovemysoul.vip/images/1612062279(1).jpg)


## 注解地址

[0] https://developer.mozilla.org/zh-cn/docs/web/api/performance

[1] https://blog.csdn.net/p312011150/article/details/93748456

## 最后
如有错误，望各位不吝赐教。
<Comment />