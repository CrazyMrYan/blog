---
date: 2020-09-28
title: 自己动手写一个render函数
tags:
  - Vue
  - Render
describe: 简单实现一下 vue 的 render 函数
---

## 前言

在这个之前我们需要了解render是什么？

可以去之前的文章里面看看 [《 搞懂vue-render函数（入门篇）》](https://mp.weixin.qq.com/s/BU0enxmsnUyw0qZ-_5D2hA)

废话不多说，快快快 上车！！！

## 定义一个对象

先定义一个数据对象来作为我们的数据

``` js
let data = {
    tag:"h2",
    props:{},
    children:"严老湿"
}
```

`tag` 作为标签名，`props` 作为属性对象，`children` 作为子元素或者文本节点

哈哈哈 还是老套路 先写一个 `h2` 标签试试水



## 获取根节点挂载

这个So Easy啦

```html
<div id="app"></div>
```

```js
// app 作为我们的根节点
let app = document.querySelector('#app')
```

获取到 `app` 节点之后呢？ 我们是不是需要 `appendChild` 我们第一步定义的 `data` 对象

```js
// 此时还没有render这个函数
app.appendChild(render(data))
```

这个 `render` 函数就是我们今天要写的重要内容



## 开始重头戏 

**天才第一步 ，先定义一个 `render` 函数**

``` js
// 接收传入的参数
const render = (options) = >{
    // 获取数据中的标签并创建
    let el = document.createElement(options.tag);
	// 打印el
	console.log(el) // <h2></h2>
	// 将节点返回
	return el
}
app.appendChild(render(data))
```



![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/67897ee6918a4138b454295baf72b68d~tplv-k3u1fbpfcp-zoom-1.image)

此时我们的元素已经创建成功，接下来我们需要做的就是，把它的文本，渲染上去。

**渲染文本节点**

将 `children` 赋值给到节点文本内容

``` js
const render = (options) = >{
    let el = document.createElement(options.tag);
	// 我们在这里传入 children 文本
	el.textContent = options.children
	return el
}
app.appendChild(render(data))
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/30440792170b4d0bb314220c9297423b~tplv-k3u1fbpfcp-zoom-1.image)



严老湿 ：好了，`render` 写完了，下课吧！

童鞋 ：等等！！ 就这？？？



开个玩笑 当然不是啦！这写得也真是太简陋了吧



## 升级render

刚刚我们其实已经写了一个简陋版本的render 有很多问题！

* `children` 如果是数组，多个子元素呢?
* 如果`props` 里面有属性呢？
* 我还想要点事件触发函数呢？

....



还有很多问题，所以我们来加强一下，冲鸭!!!



## props参数

我们现在先来升级一下 `props` 参数，如我们需要在元素上加 `class` 、`id` 、`on`

**首先是一号选手 `class`**

我们先将数据中的`props`中新增一个`class` 且 它的值为 `myClass`

```js
let data = {
    tag:"h2",
    props:{
        class:"myClass"
    },
    children:"严老湿"
}
```

数据改造好了，我们来看看 `render` 改如何升级

```js
const render = (options) = >{
    let el = document.createElement(options.tag);
	// 判断是否是对象，并且不是null
	if(typeof options.props === 'object' && options.props !== null){
    	for(key in options.props){
            // 拿到 props 中的 key、val
            vla = options.props[key];
            // 给元素添加指定的属性
            el.setAttribute(key, vla);
        }
    }
	el.textContent = options.children;
	return el
}
app.appendChild(render(data))
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7ee5eca2c2f144728b2c9399ca698d6b~tplv-k3u1fbpfcp-zoom-1.image)

这样我们就已经完成了`class`的添加

老湿，那ID呢？

等等，我拿下锤子...



**第二位选手 `id`**

id其实都不用说了，就改改数据而已，So Easy

```js
let data = {
    tag:"h2",
    props:{
        class:"myClass",
        id:"myId"
    },
    children:"严老湿"
}
```


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/492958ecab054e2c829593274f6d07fa~tplv-k3u1fbpfcp-zoom-1.image)




**props的最后一位选手 `on`**

`on` 里面是用来绑定事件的，所以我们不能跟`class`与 `id` 同等对待。渣男！区别对待

还是先改造数据，我们加上 `on-click` 

```js
let data = {
    tag:"h2",
    props:{
        class:"myClass",
        id:'myId',
        on:{
            // 传入点击事件
            click:(e)=>{
                console.log(e)
            }
        }
    },
    children:"严老湿"
}
```

数据改造完成，我们接着升级 `render`

```js
const render = (options) = >{
    let el = document.createElement(options.tag);
	if(typeof options.props === 'object' && options.props !== null){
    	for(key in options.props){
            vla = options.props[key];
            // 如果key等于on
            if(key === "on"){
                // 将on对象赋值给 incident
                incident = options.props[key]
                for(k in incident){
                    // 给元素绑定事件传入Event
                    el.addEventListener(k,e=>incident[k](e))
                }
            }else{
                // 其他的都进来这里
            	el.setAttribute(key, vla);
            }
        }
    }
	el.textContent = options.children;
	return el
}
app.appendChild(render(data))
```

点击标签之后看看打印

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/af1ba1c29bd041d986ab3f20cd1d1b04~tplv-k3u1fbpfcp-zoom-1.image)

是不是也是很简单

到这里我们就已经完成了这个 `props` 里面经常会用到的一些操作了。



## 多个子元素

有时候我们的数据中可能不止一个元素，那如果`children` 是一个数组呢？

那我们就不能直接赋值给元素的 `textContent` 了，继续加判断。

我们还是一样的先修改数据，将 `children` 改为一个数组，结构呢还是个之前一样

```js
let data = {
    tag:"ul",
    props:{
        class:"myClass",
        id:'myId',
    },
    children:[
        {
            tag: 'li',
            props: {
                class: "list",
            },
            children: "4万面五星红旗挂上武汉街头"
        }, {
            tag: 'li',
            props: {
                class: "list",
            },
            children: "机场水门最高礼遇迎接烈士遗骸"
        }
    ]
}
```

数据结构修改完成之后了，我们接下来修改 `render` 函数

``` js
const render = (options) = >{
    let el = document.createElement(options.tag);
	if(typeof options.props === 'object' && options.props !== null){
    	for(key in options.props){
            vla = options.props[key];
            if(key === "on"){
                incident = options.props[key]
                for(k in incident){
                    el.addEventListener(k,e=>incident[k](e))
                }
            }else{
            	el.setAttribute(key, vla);
            }
        }
    }
	// 在内容赋值这里我们做一个判断
	// 如果 children 是一个数组
	if (options.children instanceof Array) {
        // 我们进行 forEach 遍历一下
        options.children.forEach((item)=>{
            // 进行递归 render 函数，传入 
            el.appendChild(render(item));
        });
    }else{
        // 如果不是数据，我们进行赋值
        el.textContent = options.children
    }
	return el
}
app.appendChild(render(data))
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/000f9efd1f9a4f00b14293b01f42d3d7~tplv-k3u1fbpfcp-zoom-1.image)

是不是已经渲染成功呢？



## 全部代码

给大家贴一下全部代码吧！

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>老严讲render</title>
</head>
<body>
    <div id="app"></div>
    <script>
        const app = document.querySelector('#app')
        let data = {
            tag: "ul",
            props: {
                class: "myClass",
                id: 'myId',
            },
            children: [
                {
                    tag: 'li',
                    props: {
                        class: "list",
                    },
                    children: "4万面五星红旗挂上武汉街头"
                }, {
                    tag: 'li',
                    props: {
                        class: "list",
                    },
                    children: "机场水门最高礼遇迎接烈士遗骸"
                }
            ]
        }
        const render = (options) => {
            let el = document.createElement(options.tag);
            if (typeof options.props === 'object' && options.props !== null) {
                for (key in options.props) {
                    vla = options.props[key];
                    if (key === "on") {
                        incident = options.props[key]
                        for (k in incident) {
                            el.addEventListener(k, e => incident[k](e))
                        }
                    } else {
                        el.setAttribute(key, vla);
                    }
                }
            }
            if (options.children instanceof Array) {
                options.children.forEach((item) => {
                    el.appendChild(render(item));
                });
            } else {
                el.textContent = options.children
            }
            return el;
        };
        app.appendChild(render(data));
    </script>
</body>
</html>
```



## 总结

* 我们写的代码是比较简陋的，没那么多判断逻辑，但是我们已经将render的简单实现学会了

<Comment/>