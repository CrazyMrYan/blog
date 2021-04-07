---
date: 2020-08-04
title: 快速上手 Vue + 百度地图
tags:
  - Vue
  - 百度地图
describe: 地图也是很常见的一些需求了，今天老严带大家使用简单快速的上手的百度地图
---

## 前言

>  地图也是很常见的一些需求了，今天老严带大家使用简单快速的上手的百度地图 

**目录结构**

- 准备工作
- 1.创建脚手架
- 2.安装地图
- 3.在main中引入
- 4.简单使用百度地图
- 5.地图缩放
- 6.自定义地图样式
- 7.地图标注

## 准备工作

- 注册百度地图并且创建 `ak`  

  - 先进入 [http://lbsyun.baidu.com/](https://link.zhihu.com/?target=http%3A//lbsyun.baidu.com/) 官网注册账号
  - 然后去控制台 -> 我的应用 -> 创建应用
  - 复制访问应用中 `ak`

![](https://pic1.zhimg.com/v2-f74bd1d80742412e2d0873c1e633955c_b.jpg)

- `vue-cli`  

  - `cli` 就自行创建吧

  

- `npm`  

  - 安装 `node` 环境自带

## 1.创建脚手架

```shell
vue create baidumap
&&
cd baidumap
&&
yarn serve
```

## 2.安装地图

```shell
npm install vue-baidu-map
```

## 3.在main中引入

`ak`是在百度地图开发者平台申请的密钥 详见 [http://lbsyun.baidu.com/apiconsole/key](https://link.zhihu.com/?target=http%3A//lbsyun.baidu.com/apiconsole/key)

我们刚刚在前面的准备工作已经做完了这个 ak 直接复制粘贴到下面

```js
import BaiduMap from 'vue-baidu-map'
Vue.use(BaiduMap,{ak:'此处粘贴你的百度地图ak'})
```

## 4.简单使用百度地图

- 在home页面中

html

```html
<baidu-map
    id="allmap"
    @ready="mapReady">
</baidu-map>
```

js

```js
data(){
  return{
    point: "",
  }
},
methods:{
    mapReady({ BMap, map }) {
      // 选择一个经纬度作为中心点
      this.point = new BMap.Point(113.27, 23.13);
      map.centerAndZoom(this.point, 12);
    },
}
```

css

```css
/* 设定地图的大小 */
#allmap{
  height: 600px;
  width: 600px;
  margin: 0 auto;
}
```

![](https://pic3.zhimg.com/v2-0dbf16a4bae4047ff6224757cfa9638a_b.jpg)

## 5.地图缩放

刚刚写完这个简单的地图已经出来了，但是呢好像还不可以缩放

那让我们加上 `:scroll-wheel-zoom="true"`

```html
<baidu-map
    id="allmap"
    :scroll-wheel-zoom="true"
    @ready="mapReady">
</baidu-map>
```

再看看效果吧

![](https://pic4.zhimg.com/v2-efc5c8717a9a314fc6d7257309d5553f_b.jpg)

## 6.自定义地图样式

`MapStyle`

**属性类型描述**styleString个性化模板styleJsonObject个性化Json样式

html

```html
<baidu-map
   id="allmap"
   @ready="mapReady"
   :scroll-wheel-zoom="true"
   :mapStyle="mapStyle"
 >
</baidu-map>
```

js

```js
  data(){
    return{
      point: "",
      // 自定义样式
      mapStyle:{
        styleJson: [
          {
            featureType: "water",
            elementType: "geometry",
            stylers: {
              color: "#20ab6a",
            },
          },
        ],
      },
    }
  },
```

在下图中，我们不难发现这个河流、水流以及变成了 #20ab6a

![](https://pic3.zhimg.com/v2-f8944d5401e8964ee9b6f32061f3d582_b.jpg)

额... 这个河流颜色好像有点奇怪，还是换回来吧

## 7.地图标注

我们虽然做到了地图展示效果，但是没有标注的地图总感觉差那么一点点 `soul`

```text
<baidu-map
  id="allmap"
  @ready="mapReady"
  :scroll-wheel-zoom="true"
>
  <!-- bm-marker 就是标注点 定位在point的经纬度上 跳动的动画 -->
  <bm-marker :position="point" animation="BMAP_ANIMATION_BOUNCE">
  </bm-marker>
</baidu-map>
```

![](https://pic1.zhimg.com/v2-0721b59256f4e36e6c56f706923374ac_b.jpg)

也是简单的讲一讲，因为官网API挺详细的，我也就带大家入个门哈哈

API地址：[http://lbsyun.baidu.com/cms/jsapi/reference/lite.html](https://link.zhihu.com/?target=http%3A//lbsyun.baidu.com/cms/jsapi/reference/lite.html)

<Comment/>