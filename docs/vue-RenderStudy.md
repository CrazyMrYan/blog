---
date: 2020-09-07
title: 搞懂vue-render函数（入门篇）
tags:
  - Vue
  - Render
describe: 快速上手使用render函数
---

## 前言

> render 函数，大部分老油条，应该是比较了解了，但是可能有些初出茅庐的小年轻们，不是很了解，并且严老湿也去网上查阅了一些相关的文章，总结了一下，不够系统，所以今天简单聊一下，循环渐进

## render 函数是什么

 平常我们写 `<template>` 里面所使用模板HTML语法组建页面的，其实在 `vue` 中都会编译成 `render` 函数，因为`vue` 中采用的是 `虚拟DOM` 所以拿到template模板时也要转译成 `VNode`\(virtual node 虚拟节点\) 函数

**插一嘴 `虚拟DOM` 与 `真实DOM` 的区别**

 `虚拟DOM`不会进行排版与重绘操作 ，`虚拟DOM`就是把`真实DOM`转换为`Javascript`代码，并且`真实DOM`频繁操作排版、重绘效率相比`虚拟DOM` 效率会低很多，比如原生操作真实DOM浏览器会从构建`DOM树`开始从头到尾执行一遍流程。而`虚拟DOM`是用`Object`来代表一颗节点，这个`Object`叫做`VNode`，然后使用两个`VNode`进行对比，根据对比后的结果修改`真实DOM`。

浏览器渲染引擎工作流程

![浏览器渲染引擎工作流程](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/db83f0af50f441a89656ce6d80e5f342~tplv-k3u1fbpfcp-zoom-1.image)



虚拟`DOM` 与`VNode`又涉及到`diff`算法，所以我们先暂停这里，开始我们的正文，当然有兴趣的小伙伴们可以去查阅相关资料

## render 函数的使用

先看看我们平常vue中的写法

```html
<template>  
 <div>  
     <h1>严老湿</h1>  
    </div>  
</template> 
```
如果使用render函数将是怎样呢？

```html
<script>  
    export default {  
        render(createElement){  
            // createElement：  
            // 第一个参数是标签名类型必须是String  
            // 第二个是属性值 我们后面来讲，类型是Object  
            // 第三个是子级虚拟节点 (VNodes) 可以是String|Array  
            return createElement('h1',{},"严老湿")  
        }  
    }  
</script>
```



这样我们也是一样的可以实现 template 中的元素

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f7248c7e65e94c51bef035381bb20496~tplv-k3u1fbpfcp-zoom-1.image)



## 动态接收参数

修改以下上面的代码，我们再来试试

```html
<script>  
    export default {  
        props:{  
            tag:{  
                type:String,  
                required: true  
            }  
        },  
        render(createElement){  
            return createElement(this.tag,{},"严老湿")  
        }  
    }  
</script> 
```


在父组件中传值给子组件动态切换标签

```html
<sub-components tag="button"></sub-components>
```



![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9006b49d0d734a28a604702c893f563d~tplv-k3u1fbpfcp-zoom-1.image)



原来可以这样操作，那我们在玩点其他的呗

```html
<script>  
    export default {  
        props: {  
            tag: {  
                type: String,  
                required: true,  
            },  
            data: {  
                type: Array,  
                required:true  
            },  
        },  
        render(createElement) {  
            return createElement(this.tag, {},  
                // 嵌套到 this.tag 元素上  
                this.data.map(item=>  
                    createElement('li',{},item.toString())  
                )  
            );  
        },  
    };  
</script> 
```


父组件传值

```html
<sub-components tag="ul" :data="data"></sub-components> 
data:[
	"新冠病毒灭活疫苗首次亮相",
	"辽宁副省长卢柯拿下科学大奖",
	"阚清子说朱一龙神秘"
] 
```


看看效果

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fa0da8aed0664be7a42941dcb2ceeee9~tplv-k3u1fbpfcp-zoom-1.image)



## createElement 的属性

我们刚刚使用了`createElement`的第一个和第三个参数

现在来看看第二个参数，为什么拿到后面来讲了，因为里面的东西比较多

嗯？重头戏么

接着来看看就知道啦

### class

```html
<script>  
    export default {  
        props: {  
            tag: {  
                type: String,  
                required: true,  
            },  
            data: {  
                type: Array,  
                required:true  
            },  
        },  
        render(createElement) {  
            return createElement(this.tag, {},   
                this.data.map(item=>  
                    createElement('li',{  
                     // 首先上场的是class  
                        class:'child-element'  
                     // or  
                     // domProps: {className: "child-element"},  
                    },item.toString())  
                )  
            );  
        },  
    };  
</script>  
```



![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0cc9e1f27a464532a99e0804788a4258~tplv-k3u1fbpfcp-zoom-1.image)


我们给`li` 标签加上了class之后，可以直接在元素上看到 `child-element` ,然后想修改样式的呢，直接通过选择器修改就好了，这就不用多说了吧！

### on

再来看看事件系列

```html
<script>  
    export default {  
        props: {  
            tag: {  
                type: String,  
                required: true,  
            },  
            data: {  
                type: Array,  
                required:true  
            },  
        },  
        render(createElement) {  
            return createElement(this.tag, {},   
                this.data.map(item=>  
                    createElement('li',{  
                        domProps: {  
                            className: "child-element"  
                        },  
                     // 在on中我们可以写需要的事件  
                        on:{  
                            // 点击事件 点击打印 Pointer Event  
                            click:(e)=>{  
                                console.log(e)  
                            },  
                            // mouseover  
        					// mouseout  
                        }  
                    },item.toString())  
                )  
            );  
        },  
    };  
</script>  
```

打印结果：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2b0b8f8454a74c588fb3a32ed387d543~tplv-k3u1fbpfcp-zoom-1.image)



里面还有很多好玩的东西可以去看看 `vue2.0` 官方文档

https://cn.vuejs.org/v2/guide/render-function.html#createElement-\%E5\%8F\%82\%E6\%95\%B0

如 ：`style` 、 `attrs` 、`directives` 等等....

## vue组件

如果看过 render 源码的同学应该知道，我们刚刚所说的第一个参数 `tag` 不仅仅可以是标准的html标签。`tag` 可以分为正常html标签 | vue组件 两类 。之前已经学了html标签，接下来 我们来看看vue组件

首先我们新建一个 vue 组件
```html
<template>  
    <div>  
        {{content}}  
    </div>  
</template>  

<script>  
export default {  
    props:{  
        content:{  
            type:String  
        }  
    }  
}  
</script> 
```
在render函数页面中引入

```html
<script>  
    // 引入组件  
    import Widget from './Widget'  
    export default {  
        render(createElement) {  
            // 传入组件  
            return createElement(Widget, {  
                // 传值 content  
                props:{  
                    content:"hello CrazyYan"  
                }  
            });  
        },  
    };  
</script>
```



ok 返回到页面上，我们已经看到了组件

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/94e77b99098e4caaa39a86cddd24e630~tplv-k3u1fbpfcp-zoom-1.image)



我们学到这里，应该知道

- render函数的作用
- 它的简单使用方法
- 几个参数的作用



下次我们会讲到 如何手动写一个 简易版 `render` 
<Comment/>