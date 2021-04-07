---
date: 2020-11-02
title: vue 奇淫技巧
tags:
  - Vue
  - 学习
describe: 很多小玩意小技巧都是自己慢慢实践出来的,所以做个小笔记
---

## 目录

* 1.v-for 循环对象
* 2.动态事件
* 3.“双向绑定” .sync
* 4.获取原始DOM事件
* 5.小型状态管理仓库
* 6.构造器 Vue.extend



## 1.v-for 循环对象

有时候我们接口所返回数据的是一个对象，但是如果属性太多了，且是一个list，咱们不能一个一个写吧

像这样

```html
<p>{{obj.id}}</p>
<p>{{obj.name}}</p>
<p>{{obj.age}}</p>
...
```

那如果有更多呢！

老严今年年初之前就碰到过一个接口返回的数据是这样

```json
{
    data1:"xxx",
    data2:"xxx",
    data3:"xxx",
    data4:"xxx",
    data5:"xxx",
    ...
    data72:"xxx",
}
```

一个一个复制？来看看 `v-for` 的操作吧



html

```html
<div id="app">
    <p v-for="(val, key, index) in info">{{index}} - {{key}} - {{val}}</p>
</div>
```

js

```js
new Vue({
    el: '#app',
    data: {
        info: {
            'id': 1,
            'name': '严老师',
            'age': '24'
        }
    }
})
```

![image-20201102113141326](http://crazy-x-lovemysoul-x-vip.img.abc188.com/images/image-20201102113141326.png)



## 2.动态事件

某些业务场景下，我们需要动态修改事件

我们可以这样来

html

```html
<div id="app">
    <!-- 动态绑定 event -->
    <input v-on:[event] = "print" v-model="text" />
     <!-- 点击之后改为 input -->
    <button v-on:click="event = 'input'">Switching events</button>
</div>
```

js

```js
new Vue({
    el: '#app',
    data: {
        text:"",
        event: 'focus'
    },
    methods:{
        print () {
            console.log(this.text)
        }
    }
    
})
```



##  3.”双向绑定“  .sync修饰符

在项目中，我们经常会操作修改父子组件，我们可能需要对一个 prop 进行“双向绑定”。

或许 2.3.0+ 新增 的 `.sync` 语法糖能够帮到你

html

```html
<div id="app">
    <p>{{title}}</p>
    <component-text v-bind:title.sync="title"></component-text>
</div>
```

js

```js
// 组件
Vue.component('componentText', {
    props: ['title'],
    template: `<button @click="modifyData">modifyData {{title}} </button>`,
    methods: {
        modifyData() {
            // 通知父组件 我们要修改 title 改为 hello
            this.$emit('update:title', 'hello')
        }
    },
})
new Vue({
    el: '#app',
    data: {
        title: 'default'
    }
})
```

看看效果

![vuex](http://crazy-x-lovemysoul-x-vip.img.abc188.com/images/vuex.gif)





##  4.获取原始DOM事件

有时候需要在模板中需要获取到原始的 `DOM事件` 

html

```html
<div id="app">
    <!-- 传入 $event -->
    <button @click="getEvent($event)">$event</button>
</div>
```

js

```js
new Vue({
    el: '#app',
    methods:{
        getEvent(e){
            console.log(e)
        }
    }
})
```



![image-20201102124528479](http://crazy-x-lovemysoul-x-vip.img.abc188.com/images/image-20201102124528479.png)



## 5.小型状态管理仓库

`vuex` 好用吗？ 答案是肯定的，但是不是大型项目使用 `vuex` ,显得过于繁琐冗余 ，所以推荐使用 2.6.0 新增的 ` Vue.observable()`

返回的对象可以直接用于 `渲染函数` 和 `计算属性` 内，并且会在发生变更时触发相应的更新。也可以作为最小化的跨组件状态存储器，用于简单的场景

```js
//observable.js
import Vue from 'vue';

export let store = Vue.observable({name:'store 中的老严'});
export let mutations={
    changeName(name){
        store.name=name;
    }
}
```

home.vue

```html
<template>
  <div>
    <p>{{ name }}</p>
    <button @click="changeName(nameONE)"> 修改name </button>
  </div>
</template>  

<script>
import { store, mutations } from "../observable";
export default {
  data() {
    return {
      nameONE: "Home页面的老严",
    };
  },
  computed: {
    name() {
      return store.name;
    },
  },
  methods: {
    changeName: mutations.changeName,
  },
};
</script>  
```

看看效果吧

![vuex1](http://crazy-x-lovemysoul-x-vip.img.abc188.com/images/vuex1.gif)

## 6.构造器 Vue.extend

在实际业务开发中我们很少使用 `Vue.extend` ,基本上是独立组件开发会使用到它，当然如果你觉得 extend 写法符合你的开发思维，加油你是最棒的

html

``` html
<div id="baidu"></div>
<baidu></baidu>
```

js

```js
let baiduExtend = Vue.extend({
    template: "<p><a :href='linkUrl'>{{linkName}}</a></p>",
    data: ()=> {
        return {
            linkName: '百度',
            linkUrl: 'https://www.baidu.com'
        }
    }
})
//扩展实例构造器是需要挂载的，我们再进行一次挂载
new baiduExtend().$mount('baidu');
//还可以通过HTML标签上的id或者class来生成扩展实例构造器
new baiduExtend().$mount('#baidu');
```

结果就是这样了

``` html
<p><a href="https://www.baidu.com">百度</a></p>
<p><a href="https://www.baidu.com">百度</a></p>
```

![image-20201102142018152](http://crazy-x-lovemysoul-x-vip.img.abc188.com/images/image-20201102142018152.png)



## 参考

* https://cn.vuejs.org/v2/api/#Vue-observable
* https://cn.vuejs.org/v2/guide/components-custom-events.html#sync-%E4%BF%AE%E9%A5%B0%E7%AC%A6
* https://cn.vuejs.org/v2/api/index.html#Vue-extend

<Comment/>