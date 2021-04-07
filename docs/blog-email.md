---
date: 2021-01-26
title: Node.js之自动发送邮件 | 仅二十行代码即可
tags:
  - Node
  - 学习
describe: 想要每天发送邮件给自己女朋友嘛？来自程序员的小浪漫
---

## 前言

> 因为最近自己建站需要添加友链，又不想每次去改静态文件，所以抽出来一个表单，准备给大家填写自己的信息然后提交到后台审核，但是我需要一个邮件来通知大家已经审核通过了，所以我就需要一个发邮件的插件 `nodemailer`[0] ，当然大佬们已经知道了。因为平时node玩的比较少，所以也在这里记录一下 

## 先上效果图
![](http://img.lovemysoul.vip/images/blog-img-em.jpg)

老严你这标题党 ，说好的定时给女朋友发邮件的小浪漫呢？
咱不着急哈？后面会讲到，我们先试下自己手动一步一步的去使用这款插件 `nodemailer`

## 准备工作
我们发邮件会需要一个 SMTP 授权码！
我们需要去邮箱里面获取，这里我选择的是QQ邮箱（因为搜到的教程就是QQ的）
1. **进入QQ邮箱**


![](http://img.lovemysoul.vip/images/1611655032.jpg)

2. **选择账户**

![](http://img.lovemysoul.vip/images/1611655281(1).jpg)

3. **翻到POP3/IMAP/SMTP/Exchange/CardDAV/CalDAV服务**

![](http://img.lovemysoul.vip/images/1611655460.jpg)

4. **POP3/SMTP服务后面的开启**

![](http://img.lovemysoul.vip/images/1611655526(1).jpg)

5. **发送信息进行验证**

![](http://img.lovemysoul.vip/images/1611655695(1).jpg)

6. **复制授权码**

![](http://img.lovemysoul.vip/images/1611655817(1).jpg)

## 配置
stop 就是这里，别滑太快了

#### 创建一个文件夹
目录名各位请便

#### 创建入口文件
我这里命名时 app.js 各位自便

#### 初始化
```shell
npm init -y
```

#### 安装
```shell
npm install nodemailer
```
老严这里的 nodemailer 安装的是 `4.4.0` 的版本

#### package.js
完成之后大概长这样
```json
{
  "name": "nodeMailDemo",
  "version": "1.0.0",
  "description": "",
  "main": "app.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    // dev 这是老严自己加上去的哈
    "dev":"node app.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "nodemailer": "^4.4.0"
  }
}
```

## come baby
大家看黑板，现在这里是重点了哈，集中注意力
进入到 app.js 中
### 引入
```js
const nodemailer = require('nodemailer'); 
```
### 创建
```js
// 创建 nodemailer 配置
let transporter = nodemailer.createTransport({
    //支持列表： https://nodemailer.com/smtp/well-known/
    service: 'QQ', // 老严用的是 QQ
    port: 465, // SMTP 端口 这个不用管
    secureConnection: true, 
    auth: {
        user: '你的邮箱@qq.com',
        pass: '这里填写我们刚刚获取到的smtp授权码', 
    }
});
```
### 发送内容
```js
let mailOptions = {
    from: '"NickName" <你的邮箱@qq.com>', 
    to: '接收人的邮箱', 
    subject: '发文章的标题', /
    text: '这里填写你发送的内容'
    // html:'这里也可以写html'
};
```
### 执行发送
```js
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('邮件发送成功 ID：', info.messageId);
});
```
总共才 20 来行的代码到底行不行呢？

``` shell
node app.js
```

### 老严的配置
``` js
const nodemailer = require('nodemailer'); //发送邮件的node插件
function sendEmail (data){
    let transporter = nodemailer.createTransport({
        service: 'QQ', // 发送者的邮箱厂商，支持列表：https://nodemailer.com/smtp/well-known/
        port: 465, // SMTP 端口
        secureConnection: true, // SSL安全链接
        auth: {   //发送者的账户密码
            user: '2407488005@qq.com', //账户
            pass: 'smtp 授权码', //smtp授权码，到邮箱设置下获取
        }
    });
    let mailOptions = {
        from: '"悲伤日记" <2407488005@qq.com>', // 发送者昵称和地址
        to: data.email, // 接收者的邮箱地址
        subject: '悲伤日记 | 友链交换请求审核结果', // 邮件主题
        html: data.content
    };
    //发送邮件
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('邮件发送成功 ID：', info.messageId);
    }); 
}
// 这里是 nickName, createTime, link 通过 api 返回的参数进行动态填写的
let nickName, createTime, link;
nickName =  '严先生的博客'
createTime = '2021-01-26 15:20';
link = 'http://blog.lovemysoul.vip'

let data = {
    email:'491324693@qq.com',
    content:`<img style="width:100px;" src="http://blog.lovemysoul.vip/favicon.ico" alt="logo"/>
        <p style="text-indent: 2em;">亲爱的 ${ nickName } </p>
        <p style="text-indent: 2em;">您在${ createTime } 申请的 ${ link } 交换友链已经审核通过！已经自动创建成功！可以前往 <a href="http://blog.lovemysoul.vip/Friendship.html">悲伤日记</a> 进行查看。感谢您的支持！</p>
        <p style="text-indent: 2em;">祝您工作顺利，心想事成</p>
        <p style="text-align: right;">—— 悲伤日记</p>
        <p>如有疑问可以关注悲伤日记微信公众号进行协调 </p>
        <img style="width:150px" src="http://blog.lovemysoul.vip/_assets/beishang.0aa26ed3.jpg" alt="公众号二维码" srcset="">
    `
}
sendEmail(data) 
```

### 执行发送
```shell
node app.js
# or 
npm run dev
```
![](http://img.lovemysoul.vip/images/4003986e8fec078a7382d365b9ab9b1.png)

### Di~ 收到了！
![](http://img.lovemysoul.vip/images/2cc0357b9b7996c85c87e62de7e09ab.jpg)
打开一看
![](http://img.lovemysoul.vip/images/be9a332e4f1be7da74fc9f57d5577f7.jpg)


## 开始定时任务
因为我们执行完发送邮件之后，这个任务执行完成就已经关闭了。我们需要一个定时任务来给它一直跑 `node-schedule`

### 安装
```shell
npm install node-schedule
```

### 使用
```js
// 引入
var schedule = require('node-schedule');
// 定时执行
schedule.scheduleJob('10 * * * * *', ()=>{
    sendEmail(data)
});
```

### schedule 讲解
引用一名博主的讲解 [《Nodejs学习笔记（十二）--- 定时任务（node-schedule)》](https://www.cnblogs.com/zhongweiv/p/node_schedule.html)[2]
```html
*  *  *  *  *  *
┬ ┬ ┬ ┬ ┬ ┬
│ │ │ │ │  |
│ │ │ │ │ └ day of week (0 - 7) (0 or 7 is Sun)
│ │ │ │ └───── month (1 - 12)
│ │ │ └────────── day of month (1 - 31)
│ │ └─────────────── hour (0 - 23)
│ └──────────────────── minute (0 - 59)
└───────────────────────── second (0 - 59, OPTIONAL)

　　6个占位符从左到右分别代表：秒、分、时、日、月、周几

　　'*'表示通配符，匹配任意，当秒是'*'时，表示任意秒数都触发，其它类推

　　下面可以看看以下传入参数分别代表的意思

每分钟的第30秒触发： '30 * * * * *'

每小时的1分30秒触发 ：'30 1 * * * *'

每天的凌晨1点1分30秒触发 ：'30 1 1 * * *'

每月的1日1点1分30秒触发 ：'30 1 1 1 * *'

2016年的1月1日1点1分30秒触发 ：'30 1 1 1 2016 *'

每周1的1点1分30秒触发 ：'30 1 1 * * 1'
```

### 我们执行的是每分钟的第10秒钟发送邮件
![](http://img.lovemysoul.vip/images/20210127104500.png)

### 看看邮箱
![](http://img.lovemysoul.vip/images/20210127105600.jpg)

### 全部代码
```js
const nodemailer = require('nodemailer'); //发送邮件的node插件
var schedule = require('node-schedule');

function sendEmail (data){
    let transporter = nodemailer.createTransport({
        service: 'QQ', 
        port: 465, 
        secureConnection: true, 
        auth: {  
            user: '2407488005@qq.com', 
            pass: '授权码', 
        }
    });
    let mailOptions = {
        from: '"悲伤日记" <2407488005@qq.com>',
        to: data.email, 
        subject: '悲伤日记 | 友链交换请求审核结果', 
        html: data.content
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('邮件发送成功 ID：', info.messageId);
    }); 
}
let nickName, createTime, link ;
nickName =  '严先生的博客'
createTime = '2021-01-26 15:20';
link = 'http://blog.lovemysoul.vip'

let data = {
    email:'491324693@qq.com',
    content:`<img style="width:100px;" src="http://blog.lovemysoul.vip/favicon.ico" alt="logo"/>
        <p style="text-indent: 2em;">亲爱的 ${ nickName } </p>
        <p style="text-indent: 2em;">您在${ createTime } 申请的 ${ link } 交换友链已经审核通过！已经自动创建成功！可以前往 <a href="http://blog.lovemysoul.vip/Friendship.html">悲伤日记</a> 进行查看。感谢您的支持！</p>
        <p style="text-indent: 2em;">祝您工作顺利，心想事成</p>
        <p style="text-align: right;">—— 悲伤日记</p>
        <p>如有疑问可以关注悲伤日记微信公众号进行协调 </p>
        <img style="width:150px" src="http://blog.lovemysoul.vip/_assets/beishang.0aa26ed3.jpg" alt="公众号二维码" srcset="">
    `
}

schedule.scheduleJob('10 * * * * *', ()=>{
    sendEmail(data)
});
```
## 想要给女朋友整点小浪漫？
前面的都会了? 想要玩这个那还不简单，继续找轮子，老严在 GitHub 上找到了一个完美的 demo 亲测有效

demo ： https://github.com/Vincedream/NodeMail

直接克隆下来
```shell
git clone https://github.com/Vincedream/NodeMail.git
&
cd NodeMail
```
安装依赖

```shell
npm install
```

### 修改配置文件
进入到根目录的 main.js 然后修改刚刚我们说的配置
全部填写进去之后
``` shell
node main.js
```

注意 `startDay` 、`local` 这两个变量记得修改，不然我怕你会被家暴

自己也可以进行自定义一点东西这样会更好
如 邮件的主题 `EmailSubject`

我贴一下模板 感觉有点过分
``` js
let msgTitle = ["亲爱滴小宝贝！星期一了又是元气满满的一天 taim i'ngra leat",
                "小宝贝！熬过了昨天和一上午，还有三天半放假 I love you",
                "冲冲冲本周已经过完1/2了！今天也要要开开心心的噢 je t'aime",
                "周四了！不管你在哪里，我永远都在你转身的距离。 ich liebe dich",
                "哈哈哈，还有半天就要放假了！快坑老公吃大餐吧 σε αγαπώ se agapo",
                "你老公在旁边，直接喊他说爱你！哼"
]
```

单身狗暴击 * 9999999

发送时间 `EmailHour` 、 `EmialMinminute` 可以自己选择一下 如13：14 ，5：20 等等 我就不在这凑热闹了

### 执行一下这骚操作
```shell
node main.js
```
![](http://img.lovemysoul.vip/images/1611658756(1).jpg)

### 结果
![](http://img.lovemysoul.vip/images/1611658920(1).png)


## 注解地址
[0] https://github.com/nodemailer/nodemailer

[1] https://github.com/node-schedule/node-schedule

[2] https://www.cnblogs.com/zhongweiv/p/node_schedule.html

<Comment />