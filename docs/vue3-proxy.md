---
date: 2020-09-22
title: 手写 Vue3 数据双向绑定 理解Proxy
tags:
  - proxy
  - Vue
describe: Vue3的 Proxy 最近貌似各大网红公众号都有发，我也来蹭蹭热度写一篇吧！我们也可以结合vue2来看看vue3到底发生了些什么变化。  
---

## 前言

> vue3的 Proxy 最近貌似各大网红公众号都有发，我也来蹭蹭热度写一篇吧！我们也可以结合vue2来看看vue3到底发生了些什么变化。  

## 目录结构

- Proxy是什么？
- 简单用法
- 尝试案例
- proxy - target 参数
- Proxy - handler 参数
- handler

  - get（）
  - set（）

- 什么叫做数据双向绑定？
- 简单实现数据渲染
- Proxy实现双向绑定
- 回顾 Vue2 双向绑定实现
- Proxy 解决了Vue2的哪些痛点
- Proxy 的缺陷
- 延伸阅读

## Proxy是什么？

`Proxy` 翻译过来就是代理的意思，何为代理呢？就是 用 `new` 创建一个目标对象（`traget`）的虚拟化对象，然后代理之后就可以拦截`JavaScript`引擎内部的底层对象操作；这些底层操作被拦截后会触发响应特定操作的陷阱函数。

## 简单用法

```js
const p = new Proxy(target, handler)
```

**target**

 要使用 `Proxy` 包装的目标对象（可以是任何类型的对象，包括原生数组，函数，甚至另一个代理）。

**handler**

 一个通常以函数作为属性的对象，各属性中的函数分别定义了在执行各种操作时代理 `p` 的行为。

  

![](https://pic1.zhimg.com/v2-c2d0fcdc0e98ada08f6e07438a581e6c_b.jpg)

  

## 尝试案例

讲再多，看再多，不如写写再说

## Proxy - target 参数

```js
// 定义一个空对象
let data = {};
// 创建一个 Proxy , 将 data 作为目标对象
let proxy = new Proxy(data, {});
// 修改Proxy 代理对象的name属性
proxy.name = '严老湿';
console.log(proxy); // { name: '严老湿' }
console.log(data); // { name: '严老湿' }
```

看了上面的案例，现在的你应该已经大概知道这个 `Proxy` 的目标对象（`target`）是怎么使用的了

## Proxy - handler 参数

`handler` 单独抽离出来作为一个大标题是因为里面的内容有点多

## handler

`handler` 对象是一个容纳一批特定属性的占位符对象。它包含有 `Proxy` 的各个捕获器（trap）。它里面的参数有太多了，我们就拿会用到几个讲讲吧！有像深究的同学可以去看看文档 `Proxy handler` \[1\]

**handler.set**

`handler.set()` 方法用于拦截设置属性值的操作。

文档上面呢基本上就是这样写的

```js
// 定义一个对象
let data = {
  name: "严老湿",
  age: '24'
};
// handler 抽离出来
let handler = {
  set(target, prop, value) {
    console.log(target, prop, value)
  }
}
let p = new Proxy(data, handler);
p.age = 18;
```

个人习惯直接这样写

```js
// 定义一个对象
let data = {
  name: "严老湿",
  age: '24'
};
// 创建一个 Proxy , 将 data 作为目标对象
let p = new Proxy(data, {
  set(target, prop, value) {
    // target = 目标对象
    // prop = 设置的属性
    // value = 修改后的值
    console.log(target, prop, value)
    // { name: '严老湿', age: '24' } 'age' 18
  }
});
// 直接修改p就可以了
p.age = 18;
console.log(data)
// { name: '严老湿', age: '24' }
```

在我们设置值的时候会触发里面的 `set` 方法；

我们已经捕捉到修改后的 属性 以及 他的值

但是打印data 并没有发生任何变化，那这还有啥用呢？

请看官方示例`handler.set()`\[2\]

在示例中出现了一个 `Reflect.set()`\[3\]

```js
return Reflect.set(...arguments);
```

**Reflect**

`Reflect`对象与`Proxy`对象一样，也是 ES6 为了操作对象而提供的新 API \[4\]

我们需要在 `handler.set()` 中 `return` 一个 `Reflect.set(...arguments)` 来进行赋值给目标对象。

_Reflect.set_

`Reflect.set`方法设置`target`对象的`name`属性等于`value`。如果`name`属性设置了赋值函数，则赋值函数的`this`绑定`receiver`。

_Reflect.get_

`Reflect.get`方法查找并返回`target`对象的`name`属性，如果没有该属性，则返回`undefined`。

```js
let data = {
  name: "严老湿",
  age: '24'
};

let p = new Proxy(data, {
  set(target, prop, newV) {
    // target = 目标对象
    // prop = 设置的属性
    // newV = 修改后的值
    return Reflect.set(...arguments)
  }
});
p.age = 18;
console.log(data)
// { name: '严老湿', age: 18 }
```

就像这样，已经打印成功了

**handler.get**

刚刚我们已经将 set 理解的已经差不多了，get还会难么？我们来看看

```js
let data = {
  name: "严老湿",
  age: '24'
};

let p = new Proxy(data, {
  get(target, prop) {
    // target = 目标对象
    // prop = 获取的属性
    console.log(target, prop)
    // { name: '严老湿', age: '24' } 'age'
    return Reflect.get(...arguments)
    // 这里的 Reflect.get 我们在上面已经讲到了
  }
});
// 获取
console.log(p.age)
// 24
```

## 什么叫数据双向绑定？

> 当数据发生变化的时候，视图也就发生变化，当视图发生变化的时候，数据也会跟着同步变化。  

上栗子：

html

```html
<h2 class="app"></h2>
```

js

```js
// 获取元素
let app = document.querySelector('.app');
// 定义 data
let data = {
    name: "严老湿",
    age: 24
};
// 替换成data.age 此时我们页面上应该是有个24
app.innerHTML = data.age;
// 我们在这里修改 age 
data.age = 21;
console.log(data);
// {name: "严老湿", age: 21}
```

这样看确实没啥毛病

但是呢在 `vue` 中，我们在下面异步修改data中的值，页面上的值不应该是跟着一起变化的么？虽然`data` 对象已经发生变化，但是它并不能触发一些其他操作；

```html
<div id="Foo">
    <h2>hello {{msg}}</h2>
    <input type="text" v-model="msg">
</div>
<script src="https://cdn.jsdelivr.net/npm/vue@2.6.12"></script>
<script>
    let vm = new Vue({
        el: '#Foo',
        data: {
            msg: "严家辉"
        }
    });
</script>
```

  

![](https://pic2.zhimg.com/v2-70935e8fc74695d36aa5392cc1dea159_b.jpg)

  

我们现在对双向绑定有了一个基本的认知。

## 简单实现数据渲染

等会儿我们实现双向绑定，在此之前我们做一个数据渲染过程，也简单的了解一下其原理

因为内容有点多，所以讲解呢全部在注释里面

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
    <script src="./src/index.js"></script>
</head>
<body>
    <div id="app">{{name}} 
        <h2>{{age}}</h2>
    </div>
    <script>
        let vm = new Reactive({
            // 挂载元素
            el:"#app",
            data:{
                name:"严老湿",
                age:24
            }
        });
    </script>
</body>
</html>
```

`index.js`

```js
class Reactive{
    // 接收参数
    constructor(options){
        this.options = options;
        // data 赋值
        this.$data = this.options.data;
        // 挂载元素
        this.el = document.querySelector(this.options.el)
        // 调用 compile 函数
        this.compile(this.el)
    }
    // 渲染数据
    compile(el){
        // 获取el的子元素
        let child = el.childNodes;
        // 遍历判断是否存在文本
        [...child].forEach(node=>{
            // 如果node的类型是TEXT_NODE
            if(node.nodeType === 3){
                // 拿到文本内容
                let txt = node.textContent;
                // 正则匹配{{}} 空格
                let reg = /\{\{\s*([^\s\{\}]+)\s*\}\}/g;
                if(reg.test(txt)){
                    let $1 = RegExp.$1;
                    this.$data[$1] && (node.textContent=txt.replace(reg,this.$data[$1]))
                }
            // 如果node的类型是ELEMENT_NODE
            }else if(node.nodeType === 1){
                // 递归执行
                this.compile(node)
            }
        })
    }
}
```

  

![](https://pic3.zhimg.com/v2-9665415016a54f4ea4238f2f325237aa_b.png)

  

  

![](https://pic1.zhimg.com/v2-343981cf96a05702e96ae61c3e443c0c_b.jpg)

  

一个简单并且潦草一点的的渲染数据功能已经完成了

## Proxy实现双向绑定

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
    <script src="./src/index.js"></script>
</head>
<body>
    <div id="app">{{name}} 
        <h2>{{age}}</h2>
        <input type="text" v-model="name">
        {{name}}
    </div>
    <script>
        let vm = new Reactive({
            // 挂载元素
            el: "#app",
            data: {
                name: "严老湿",
                age: 24,
            }
        });
    </script>
</body>
</html>
```

`index.js`

```js
// EventTarget [6]
class Reactive extends EventTarget {
  // 接收参数
  constructor(options) {
    super();
    this.options = options;
    // data 赋值
    this.$data = this.options.data;
    // 挂载元素
    this.el = document.querySelector(this.options.el);
    // 调用 compile 函数
    this.compile(this.el);
    // 调用双向绑定
    this.observe(this.$data);
  }
  // 双向绑定
  observe(data) {
    // 备份this
    let _this = this;
    // 接收目标对象进行代理
    this.$data = new Proxy(data, {
      set(target, prop, value) {
        // 创建一个自定义事件 CustomEvent [5]
        // 事件名称使用的是 prop 
        let event = new CustomEvent(prop, {
          // 传入新的值
          detail: value
        })
        // 派发 event 事件
        _this.dispatchEvent(event);
        return Reflect.set(...arguments);
      }
    })
  }
  // 渲染数据
  compile(el) {
    // 获取el的子元素
    let child = el.childNodes;
    // 遍历判断是否存在文本
    [...child].forEach(node => {
      // 如果node的类型是TEXT_NODE
      if (node.nodeType === 3) {
        // 拿到文本内容
        let txt = node.textContent;
        // 正则匹配
        let reg = /\{\{\s*([^\s\{\}]+)\s*\}\}/g;
        if (reg.test(txt)) {
          let $1 = RegExp.$1;
          this.$data[$1] && (node.textContent = txt.replace(reg, this.$data[$1]))
          // 绑定自定义事件
          this.addEventListener($1, e => {
            // 替换成传进来的 detail
            node.textContent = txt.replace(reg, e.detail)
          })
        }
        // 如果node的类型是ELEMENT_NODE
      } else if (node.nodeType === 1) {
        // 获取attr 
        let attr = node.attributes;
        // 判断是否存在v-model属性
        if (attr.hasOwnProperty('v-model')) {
          // 获取v-model中绑定的值
          let keyName = attr['v-model'].nodeValue;
          // 赋值给元素的value
          node.value = this.$data[keyName]
          // 绑定事件
          node.addEventListener('input', e => {
            // 当事件触发的时候我们进行赋值
            this.$data[keyName] = node.value
          })
        }
        // 递归执行
        this.compile(node)
      }
    })
  }
}
```

  

![](https://pic4.zhimg.com/v2-e9317220ee1c2b7eb3a77d04e3c32e6f_b.jpg)

  

这样我们就实现了一个双向绑定的小 demo ，当然代码还不够严谨，比如`v-model`的元素筛选都还不够完善，只是带大家简单的了解一下实现逻辑

## 回顾 Vue2 双向绑定实现

vue2 大部分同学刷题也经常会碰到 ，我们接下来看看vue2如何实现的呢

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title></title>
</head>
<body>
    <h2 id="txt"></h2>
    <input type="text" id="el">
    <script>
        let obj = {};
        // 获取节点
        let el = document.querySelector('#el');
        let txt = document.querySelector('#txt');
        Object.defineProperty(obj, 'foo', {
            set: function (newValue) {
                // 修改后的值 进行赋值
                txt.innerHTML = newValue;
            }
        });
        // 绑定事件
        el.addEventListener('input', e => {
            // 赋值给obj数据
            obj.foo = e.target.value;
        });
    </script>
</body>
</html>
```

  

![](https://pic1.zhimg.com/v2-a7845f3f302dc71a39f67563f591c270_b.jpg)

  

## Proxy解决了vue2的哪些痛点

- `Object.defineProperty`只能劫持对象的属性，而Proxy是直接代理对象；
- `Object.defineProperty`对新增属性需要手动进行`Observe`；
- `vue2.x`无法监控到数组下标的变化,因为`vue2`放弃了这个特性；
- Proxy支持13种拦截操作，这是`defineProperty`所不具有的；

## Proxy的缺陷

其他的不想多说，就一个 兼容真的挺难受的，硬伤了

  

![](https://pic1.zhimg.com/v2-750c2cb93c4a8db9097ffb4cb617dc10_b.jpg)

  

## 延伸阅读

\[1\] [https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global\_Objects/Proxy/handler](https://link.zhihu.com/?target=https%3A//developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler)

\[2\] [https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global\_Objects/Proxy/handler/set](https://link.zhihu.com/?target=https%3A//developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/set)

\[3\] [https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global\_Objects/Reflect/set](https://link.zhihu.com/?target=https%3A//developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect/set)

\[4\] [https://www.cnblogs.com/zczhangcui/p/6486582.html](https://link.zhihu.com/?target=https%3A//www.cnblogs.com/zczhangcui/p/6486582.html)

\[5\] [https://developer.mozilla.org/zh-CN/docs/Web/API/CustomEvent](https://link.zhihu.com/?target=https%3A//developer.mozilla.org/zh-CN/docs/Web/API/CustomEvent)

\[6\] [https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget](https://link.zhihu.com/?target=https%3A//developer.mozilla.org/zh-CN/docs/Web/API/EventTarget)

<Comment/>