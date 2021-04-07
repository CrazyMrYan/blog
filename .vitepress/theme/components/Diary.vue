<template>
  <div class="body">
    <section class="intro">
        <div class="container">
            <h1>Update log &darr;</h1>
        </div>
    </section>
    <section class="timeline">
      <ul>
        <li>
          <div>
            <time>2021-01-31</time>
            开启网站订阅功能，可选微信消息和邮件来订阅本站
            <img src="../images/1612260590(1).jpg" >
          </div>
        </li>
        <li>
          <div>
            <time>2021-01-28</time>
            添加h5页面用于申请友链，同步后台管理系统审核友链功能&开启网站log记录
            <img src="../images/1612261458(1).jpg" >
          </div>
        </li>
        <li>
          <div>
            <time>2021-01-26</time>
            将分类和归档页面进行美化
            <img src="../images/1612260771(1).jpg" >
          </div>
        </li>
        <li>
          <div>
            <time>2021-01-24</time>
            添加首屏背景图，和个人介绍小卡片
            <img src="../images/1612260843(1).jpg" >
          </div>
        </li>
        <li>
          <div>
            <time>2021-01-22</time>
            买了个新的辣鸡服务器，并开通了blog二级域名作为博客网站
            <img src="../images/1612261042(1).jpg" >
          </div>
        </li>
        <li>
          <div><time>2021-01-21</time> 完成友链功能！
            <img src="../images/1612261185(1).jpg" >
          </div>
        </li>
        <li>
          <div>
            <time>2021-01-16</time> 添加了局部打印图片放大和黑白模式切换功能
            <img src="../images/black.jpg" >
          </div>
        </li>
        <li>
          <div>
            <time>2021-01-05</time> Home 页文章列表分页功能&修复图片路径问题
            <img src="../images/1612261359(1).jpg" >
          </div>
        </li>
        <li>
          <div>
            <time>2021-01-03</time> 打开了 docs 文件夹上传 git，给 gitalk
            选择中文语言。
          </div>
        </li>
        <li>
          <div>
            <time>2021-01-02</time> 修复底部组件问题，并且完善了部分文档内容。
          </div>
        </li>
        <li>
          <div>
            <time>2021-01-01</time>
            1.将 gitalk 进行了配置，并且发布了使用 gitalk 笔记
            <br />
            2.添加公用底部组件
            <br />
            3.将博客放到了自己的域名上
          </div>
        </li>
        <li>
          <div>
            <time>2020-12-31</time>
            开始准备建站！找到了一个比较适合自己的框架，放了几篇文章并打包后丢到了GitHubPages
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      timeline: [
        {
          time: 2021,
          chilred: [
            {
              time: "2020-01-29",
              title: "掘金2020年度创作者(7)",
              content: "今天是投票的最后一天啦",
            },
            {
              time: "2020-01-27",
              title: "写文章暴露邮箱了",
              content:
                "今天写一篇文章结果暴露邮箱了，这群熊孩子们就直接copy我的代码，给我发邮件，紧急修改之后终于稳住了",
            },
          ],
        },
        {
          time: 2020,
          chilred: [
            {
              time: "2020-08-03",
              title: "今天认识了一位大佬",
              content:
                "今天星期四了，广州这天气开了空调还不算太热，闲逛各路文章之时，发现一清奇博主文章写的不错，于是加了个好友,聊了几句之后发现，这博主真厉害！自叹不如",
            },
            {
              time: "2020-08-03",
              title: "今天认识了一位大佬",
              content: "",
            },
          ],
        },
      ],
    };
  },
  mounted() {
    (function () {
      "use strict";

      // define variables
      var items = document.querySelectorAll(".timeline li");

      // check if an element is in viewport
      // http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport
      function isElementInViewport(el) {
        var rect = el.getBoundingClientRect();
        return (
          rect.top >= 0 &&
          rect.left >= 0 &&
          rect.bottom <=
            (window.innerHeight || document.documentElement.clientHeight) &&
          rect.right <=
            (window.innerWidth || document.documentElement.clientWidth)
        );
      }

      function callbackFunc() {
        for (var i = 0; i < items.length; i++) {
          if (isElementInViewport(items[i])) {
            items[i].classList.add("in-view");
          }
        }
      }
      // listen for events
      window.addEventListener("load", callbackFunc);
      window.addEventListener("resize", callbackFunc);
      window.addEventListener("scroll", callbackFunc);
    })();
  },
};
</script>
<style  scoped>
*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.body {
  font: normal 16px/1.5 "Helvetica Neue", sans-serif;
  color: #fff;
  overflow-x: hidden;
}

/* INTRO SECTION
–––––––––––––––––––––––––––––––––––––––––––––––––– */

.intro {
  background: #F45B69;
  padding: 100px 0;
  margin-top: 60px;
}

.container {
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

h1 {
  font-size: 2.5rem;
  color: #fff;
}

/* TIMELINE
–––––––––––––––––––––––––––––––––––––––––––––––––– */

.timeline ul {
  padding: 50px 0;
}

.timeline ul li {
  list-style-type: none;
  position: relative;
  width: 6px;
  margin: 0 auto;
  padding-top: 50px;
  background: #99cccc;
}

.timeline ul li::after {
  content: "";
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: inherit;
}

.timeline ul li div {
  position: relative;
  bottom: 0;
  width: 320px;
  padding: 15px;
  background: #F45B69;
}

.timeline ul li div::before {
  content: "";
  position: absolute;
  bottom: 7px;
  width: 0;
  height: 0;
  border-style: solid;
}

.timeline ul li:nth-child(odd) div {
  left: 45px;
}

.timeline ul li:nth-child(odd) div::before {
  left: -15px;
  border-width: 8px 16px 8px 0;
  border-color: transparent #F45B69 transparent transparent;
}

.timeline ul li:nth-child(even) div {
  left: -359px;
}

.timeline ul li:nth-child(even) div::before {
  right: -15px;
  border-width: 8px 0 8px 16px;
  border-color: transparent transparent transparent #F45B69;
}

time {
  display: block;
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 8px;
}

/* EFFECTS
–––––––––––––––––––––––––––––––––––––––––––––––––– */

.timeline ul li::after {
  transition: background 0.5s ease-in-out;
}

.timeline ul li.in-view::after {
  background: #F45B69;
}

.timeline ul li div {
  visibility: hidden;
  opacity: 0;
  transition: all 0.5s ease-in-out;
}

.timeline ul li:nth-child(odd) div {
  transform: translate3d(200px, 0, 0);
}

.timeline ul li:nth-child(even) div {
  transform: translate3d(-200px, 0, 0);
}

.timeline ul li.in-view div {
  transform: none;
  visibility: visible;
  opacity: 1;
}

/* GENERAL MEDIA QUERIES
–––––––––––––––––––––––––––––––––––––––––––––––––– */

@media screen and (max-width: 900px) {
  .timeline ul li div {
    width: 250px;
  }
  .intro{
      display: none;
  }
  .timeline ul li:nth-child(even) div {
    left: -289px;
    /*250+45-6*/
  }
}

@media screen and (max-width: 600px) {
  .timeline ul li {
    margin-left: 20px;
  }

  .timeline ul li div {
    width: calc(100vw - 145px);
  }

  .timeline ul li:nth-child(even) div {
    left: 45px;
  }

  .timeline ul li:nth-child(even) div::before {
    left: -15px;
    border-width: 8px 16px 8px 0;
    border-color: transparent #F45B69 transparent transparent;
  }
}
img {
  width: 100%;
  margin-top: 15px;
}
</style>