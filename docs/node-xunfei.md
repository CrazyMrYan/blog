---
date: 2021-08-27
title: Node + 讯飞语音 定时播放天气预报音频
tags:
  - 树莓派
  - Node
  - 讯飞
describe: 最近看了几篇文章，总觉得自己没发挥树莓派的作用，于是就琢磨着，哎，灵光一闪，整一个早晨叫醒服务，于是便有了本篇水文。
---

## 前言

>  最近看了几篇文章，总觉得自己没发挥树莓派的作用，于是就琢磨着，哎，灵光一闪，整一个早晨叫醒服务，于是便有了本篇水文。

## 功能

每天早上八点钟，定时播放音频（音频内容为当天天气预报和空气质量），播放完成之后继续等待到明天的八点钟播放。

## 技术

开始本来是想加个客户端的，但是一想先先直接跑个服务就用的node试试，所以本文只需要你会用js就行

1. node（服务）
2. 讯飞语音（转音频）
3. play（播放语言）
4. 聚合api（天气预报接口）
5. scheduleJob（定时任务）



## 准备工作

我们需要文字识别转成音频，讯飞是可以白嫖的

### 讯飞语音

请先在讯飞注册账号及 > 创建应用 > 实名认证

https://passport.xfyun.cn/

然后去控制台找到**服务接口认证信息**

https://console.xfyun.cn/services/tts

找到需要的 key

![](https://i.loli.net/2021/08/27/DL1fVJmNeAQ6IBX.png)

### 聚合数据

天气预报api，如果有你也可以用其他的，这个也是白嫖

就不做重点讲了



## 快速上手

初始化项目

```bash
npm init -y
```

然后安装我们需要的依赖, 下面是依赖的版本

```json
{
  "name": "node-jiaoxing",
  "version": "1.0.0",
  "description": "",
  "main": "src/index.js",
  "scripts": {
    "dev": "node src/index.js"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "node-schedule": "^2.0.0",
    "request": "^2.88.2",
    "websocket": "^1.0.31"
  }
}
```

安装依赖

``` bash
npm insatll
```



### 创建lib文件夹

>  创建一个 `lib` 文件夹，放入所别人封装好的`讯飞`的资源

#### index.js

```js
const fs = require("fs");
const WebSocketClient = require('websocket').client;
const { getWssInfo, textToJson } = require('./util');

const xunfeiTTS = (auth, business, text, fileName, cb) => {
  let audioData = [];

  const client = new WebSocketClient();
  client.on('connect', (con) => {
    con.on('error', error => {
      throw (error);
    });

    con.on('close', () => {
      const buffer = Buffer.concat(audioData);
      fs.writeFile(fileName, buffer, (err) => {
        if (err) {
          throw (err);
          cb(err);
        } else {
          cb(null, 'OK');
        }
      });
    })

    con.on('message', (message) => {
      if (message.type == 'utf8') {
        const ret = JSON.parse(message.utf8Data);
        audioData.push(Buffer.from(ret.data.audio, 'base64'));
        if (ret.data.status == 2) {
          con.close();
        }
      }
    });

    if (con.connected) {
      const thejson = textToJson(auth, business, text);
      con.sendUTF(thejson);
    }
  });

  client.on('connectFailed', error => {
    throw (error);
  });

  const info = getWssInfo(auth);
  client.connect(info.url);
}

module.exports = xunfeiTTS;
```

#### util.js

```js
function btoa(text) {
  return Buffer.from(text, "utf8").toString("base64");
}

function getWssInfo(auth, path = "/v2/tts", host = "tts-api.xfyun.cn") {
  const { app_skey, app_akey } = auth;
  const date = new Date(Date.now()).toUTCString();
  const request_line = `GET ${path} HTTP/1.1`;

  const signature_origin = `host: ${host}\ndate: ${date}\n${request_line}`;

  let crypto = require("crypto");

  const signature = crypto
    .createHmac("SHA256", app_skey)
    .update(signature_origin)
    .digest("base64");

  const authorization_origin = `api_key="${app_akey}",algorithm="hmac-sha256",headers="host date request-line",signature="${signature}"`;
  const authorization = btoa(authorization_origin);

  const thepath = `${path}?authorization=${encodeURIComponent(
    authorization
  )}&host=${encodeURIComponent(host)}&date=${encodeURIComponent(date)}`;

  const final_url = `wss://${host}${thepath}`;

  return { url: final_url, host: host, path: thepath };
}

function textToJson(auth, businessInfo, text) {
  const common = { app_id: auth.app_id };

  const business = {};
  business.aue = "raw";
  business.sfl = 1;
  business.auf = "audio/L16;rate=16000";
  business.vcn = "xiaoyan";
  business.tte = "UTF8";
  business.speed = 50;
  Object.assign(business, businessInfo);

  const data = { text: btoa(text), status: 2 };

  return JSON.stringify({ common, business, data });
}

module.exports = {
  btoa,
  getWssInfo,
  textToJson
};
```



### 创建src文件夹

主入口文件

#### index.js

```js
// 引入路径模块
const path = require("path");
const { promisify } = require("util");
// 讯飞TTS
const xunfeiTTS = require("../lib/index");
const tts = promisify(xunfeiTTS);
// 转换音频
const openGreetings = async (app_id, app_skey, app_akey, text) => {
  const auth = { app_id, app_skey, app_akey };
  // 讯飞 api 参数配置
  // 接口文档 https://www.xfyun.cn/doc/tts/online_tts/API.html
  const business = {
    aue: "lame", // 音频编码
    sfl: 1, // 开启流式返回
    speed: 50,// 语速
    pitch: 50, // 高音
    volume: 100,// 音量
    bgs: 0 // 背景音乐
  };
  // 存储文件的路径
  const file = path.resolve('./src/good-morning.wav');
  try {
    // 执行请求
    await tts(auth, business, text, file).then(res => {});
  } catch (e) {
    console.log("test exception", e);
  }
};
openGreetings('讯飞的APPID', '讯飞的APISecret', '讯飞的APIKey', '早上好，帅气的严老湿')
```

### 测试一波

执行 `npm run dev` 可以看到，执行完成之后，已经在src目录下面创建了 `good-morning.wav` 音频

![](https://i.loli.net/2021/08/28/aWGyHhTu5E2PZse.png)

戴好耳机，迫不及待的打开音频，传来`早上好，帅气的严老湿`

> 我们到这里就已经完成了讯飞语言的接入



## 问候语修改

我们不可能一直是早上好吧

所以我们需要根据系统的时间来

```js
const greetings = {
  "7, 10": ["早上好", "上午"],
  "11,13": ["中午好", "中午"],
  "14,17": ["下午好", "下午"],
  "18,23": ["晚上好", "晚上"],
}

const getTimeInfo = () => {
  const TIME = new Date()
  // 年月日
  let year = TIME.getFullYear()
  let month = TIME.getMonth() + 1
  let date = TIME.getDate()
  // 时分
  let hours = TIME.getHours()
  let minutes = TIME.getMinutes()
  // 生成的问候文本
  let greetingsStr = ""
  // 遍历定义的问候数据
  for (const key in greetings) {
    if(hours >= key.split(",")[0] && hours <= key.split(",")[1]) {
      let greetingsKey = greetings[key]
      greetingsStr = `${greetingsKey[0]},现在是${greetingsKey[1]},${hours}点，${minutes}分`
    }
  }
  // 中午好，现在是中午12点，12分，今天是2021年，8月，28日
  return `${greetingsStr},今天是${year}年，${month}月，${date}日`
}
```

现在我们拿到的数据就是`中午好，现在是中午12点，12分，今天是2021年，8月，28日` 

在执行转换音频的时候，我们可以动态调用 getTimeInfo 拿到当前的文本传递过去转成音频

```js
openGreetings('讯飞的APPID', '讯飞的APISecret', '讯飞的APIKey', getTimeInfo())
```



## 自动播放

当我创建好音频后，我希望立刻播放

### 引入play资源

所以我们需要使用一个库 [play](https://github.com/Marak/play.js) , 老严也是直接拿资源，然后放入lib文件夹中，叫play.js

```js
if(typeof exports === 'undefined'){
  var play = {
    sound: function ( wav ) {
      debug.log(wav);
      var e = $('#' + wav);
      debug.log(e);
      $('#alarm').remove();
      $(e).attr('autostart',true);
      $('body').append(e);
      return wav;
    }
  };
}
else{
  var colors = require('colors'), 
      child_p = require('child_process'),
      exec = child_p.exec,
      spawn = child_p.spawn,
      ee = require('events'),
      util = require('util');
  var Play = exports.Play = function Play() {
    var self = this;

    if (!(this instanceof Play)) {
      return new Play();
    }
    ee.EventEmitter.call(this);
    this.playerList = [
      'afplay',
      'mplayer',
      'mpg123',
      'mpg321',
      'play',
    ];
    this.playerName = false;
    this.checked = 0;
    var i = 0, child;
    for (i = 0, l = this.playerList.length; i < l; i++) {
      if (!this.playerName) {
        (function inner (name) {
        child = exec(name, function (error, stdout, stderr) {
          self.checked++;
          if (!self.playerName && (error === null || error.code !== 127 )) {
            self.playerName = name;
            self.emit('checked');
            return;
          }
          if (name === self.playerList[self.playerList.length-1]) {
            self.emit('checked');
          }
        });
        })(this.playerList[i]);
      } 
      else {
        break;
      }
    }
  };
  util.inherits(Play, ee.EventEmitter);
  Play.prototype.usePlayer = function usePlayer (name) {
    this.playerName = name;
  }
  Play.prototype.sound = function sound (file, callback) {
    var callback = callback || function () {};
    var self = this;
    if (!this.playerName && this.checked !== this.playerList.length) {
      this.on('checked', function () {
        self.sound.call(self, file, callback);
      });
      return false;
    }
    if (!this.playerName && this.checked === this.playerList.length) {
      console.log('No suitable audio player could be found - exiting.'.red);
      console.log('If you know other cmd line music player than these:'.red, this.playerList);
      console.log('You can tell us, and will add them (or you can add them yourself)'.red);
      this.emit('error', new Error('No Suitable Player Exists'.red, this.playerList));
      return false;
    }
    var command = [file],
        child = this.player = spawn(this.playerName, command);
    console.log('playing'.magenta + '=>'.yellow + file.cyan);
    child.on('exit', function (code, signal) {
      if(code == null || signal != null || code === 1) {
        console.log('couldnt play, had an error ' + '[code: '+ code + '] ' + '[signal: ' + signal + '] :' + this.playerName.cyan);
        this.emit('error', code, signal);
      }
      else if ( code == 127 ) {
        console.log( self.playerName.cyan + ' doesn\'t exist!'.red );
        this.emit('error', code, signal);
      }
      else if (code == 2) {
        console.log(file.cyan + '=>'.yellow + 'could not be read by your player:'.red + self.playerName.cyan)
        this.emit('error', code, signal);
      }
      else if (code == 0) {
        console.log( 'completed'.green + '=>'.yellow + file.magenta);
        callback();
      }
      else {
        console.log( self.playerName.cyan + ' has an odd error with '.yellow + file.cyan);
        console.log(arguments);
        emit('error');
      }
    });
    this.emit('play', true);
    return true;
  }
}
```

### 使用play

在 src/ index.js 文件中引入

```js
// 播放器
const play = require('../lib/play').Play();
```

在 `openGreetings` 中执行转换音频完成之后播放文件 `play.sound(file);`

```js
const openGreetings = async (app_id, app_skey, app_akey, text) => {
    const auth = { app_id, app_skey, app_akey };
    const business = {
        aue: "lame",
        sfl: 1,
        speed: 50,
        pitch: 50,
        volume: 100,
        bgs: 0
    };
    const file = path.resolve("./src/good-morning.wav");
    try {
        await tts(auth, business, text, file).then(res => {
        	 // 执行播放
           play.sound(file);
        });
    } catch (e) {
        console.log("test exception", e);
    }
};
```

### 测试一下

执行 `npm run dev`

执行开始，先去转换音频，然后自动开始播放

![](https://i.loli.net/2021/08/28/EAuUYFMk7O6IKXT.png)

### 加需求

播放完成之后，我还需要播放一段我喜欢的音乐

这让我很为难啊，得加钱！“加个毛，play.js 有播放完成的 callback”

```js
play.sound(file, function(){
  	// 上一个播放完成之后，我们开始播放一首《小鸡小鸡》-王蓉
    play.sound('./src/xiaojixiaoji.m4a')
});
```

这个音乐资源应该不用教学了吧，随便去扒拉两首自己喜欢的歌，常见的格式都可以 m4a,mp3,wav等等

**有条件的同学** 可以找声音甜美的妹子，录一个喊你起床的音频，放在播放问候语之前，效果更佳



## 天气预报

天气预报，我这里是用的聚合数据的，当然如果你有其他的天气预报 api 也可以，老严这里只是做个简单的示例

```js
// 请求
const request = require('request');
```

然后调用

```js
// 获取天气的城市
const city = "长沙"
let text
request(`http://apis.juhe.cn/simpleWeather/query?city=${encodeURI(city)}&key=聚合数据key`,
    (err, response, body) => {
        if (!err && response.statusCode == 200){
          let res = JSON.parse(body).result.realtime
          text = `
            ${getTimeInfo()}，
            接下来为您播报${city}实时天气预报，
            今天，长沙天气为${res.info}天，
            室外温度为${res.temperature}度，
            室外湿度为百分之${res.humidity}，
            ${res.direct}，
            ${res.power}，
            天气预报播放完毕，
            接下来播放您喜欢的音乐
          `
          openGreetings('讯飞的APPID', '讯飞的APISecret', '讯飞的APIKey', text)
        } 
    }
)
```

拿到的文本就是这样的

    中午好,现在是中午,12点，27分,今天是2021年，8月，28日，
    接下来为您播报长沙实时天气预报，
    今天，长沙天气为晴天，
    室外温度为27度，
    室外湿度为百分之76，
    南风，
    3级，
    天气预报播放完毕，
    接下来播放您喜欢的音乐
## 定时任务

为什么要定时任务，因为我们的需求是，每天早上八点钟播放，所以我们用到了 `schedule`

`schedule` 之前也有讲过，在几个月前的[《Node.js之自动发送邮件 | 仅二十行代码即可》](https://juejin.cn/post/6922279418714914824#heading-17)邮件中也提到过

因为我们在前面已经下载了，我们只需要引入就好了

### 引入

```js
const schedule = require('node-schedule');
```

### 使用

```js
// 定时每天8点0分0秒执行
schedule.scheduleJob('0 0 8 * * *', ()=>{
    request(`http://apis.juhe.cn/simpleWeather/query?city=${encodeURI(city)}&key=聚合数据key`,
        (err, response, body) => {
            if (!err && response.statusCode == 200){
              let res = JSON.parse(body).result.realtime
              text = `
                ${getTimeInfo()}，
                接下来为您播报${city}实时天气预报，
                今天，长沙天气为${res.info}天，
                室外温度为${res.temperature}度，
                室外湿度为百分之${res.humidity}，
                ${res.direct}，
                ${res.power}，
                天气预报播放完毕，
                接下来播放您喜欢的音乐
              `
              openGreetings('讯飞的APPID', '讯飞的APISecret', '讯飞的APIKey', text)
            } 
        }
    )
});
```



## 贴上index.js 所有代码

```js
// 引入路径模块
const path = require("path");
const { promisify } = require("util");
// 讯飞TTS
const xunfeiTTS = require("../lib/index");
const tts = promisify(xunfeiTTS);
// 播放器
const play = require("../lib/play").Play();
// 请求
const request = require("request");
// 定时任务
const schedule = require('node-schedule');
// 问候语及时间
const greetings = {
  "7, 10": ["早上好", "上午"],
  "11,13": ["中午好", "中午"],
  "14,17": ["下午好", "下午"],
  "18,23": ["晚上好", "晚上"]
};

const getTimeInfo = () => {
  const TIME = new Date();
  // 年月日
  let year = TIME.getFullYear();
  let month = TIME.getMonth() + 1;
  let date = TIME.getDate();
  // 时分
  let hours = TIME.getHours();
  let minutes = TIME.getMinutes();
  // 生成的问候文本
  let greetingsStr = "";
  // 遍历定义的问候数据
  for (const key in greetings) {
    if (hours >= key.split(",")[0] && hours <= key.split(",")[1]) {
      let greetingsKey = greetings[key];
      greetingsStr = `${greetingsKey[0]},现在是${greetingsKey[1]},${hours}点，${minutes}分`;
    }
  }
  // 中午好，现在是中午12点，12分，今天是2021年，8月，28日
  return `${greetingsStr},今天是${year}年，${month}月，${date}日`;
};

const openGreetings = async (app_id, app_skey, app_akey, text) => {
  const auth = { app_id, app_skey, app_akey };
  // 讯飞 api 参数配置
  const business = {
    aue: "lame",
    sfl: 1,
    speed: 50,
    pitch: 50,
    volume: 100,
    bgs: 0
  };
  // 存储文件的路径
  const file = path.resolve("./src/good-morning.wav");
  try {
    // 执行请求
    await tts(auth, business, text, file).then(res => {
      play.sound(file, function() {
        play.sound("./src/xiaojixiaoji.m4a");
      });
    });
  } catch (e) {
    console.log("test exception", e);
  }
};

const city = "长沙";
let text;
schedule.scheduleJob("0 0 8 * * *", () => {
  request(
    `http://apis.juhe.cn/simpleWeather/query?city=${encodeURI(city)}&key=聚合key`,
    (err, response, body) => {
      if (!err && response.statusCode == 200) {
        let res = JSON.parse(body).result.realtime;
        text = `
        ${getTimeInfo()}，
        接下来为您播报${city}实时天气预报，
        今天，长沙天气为${res.info}天，
        室外温度为${res.temperature}度，
        室外湿度为百分之${res.humidity}，
        ${res.direct}，
        ${res.power}，
        天气预报播放完毕，
        接下来播放您喜欢的音乐
      `;
			openGreetings('讯飞的APPID', '讯飞的APISecret', '讯飞的APIKey', text)
      }
    }
  );
});

```



## 完结撒花

到了这里，执行 `npm run dev` ，就相当于你开了一个闹钟,但是前提是你得保证服务不会停

今天早上我就是被这玩意叫醒的，但是推荐大家不要把声音开太大了

本来是想装到树莓派上去的，但是树莓派的音频接口出了点问题，所以没装上

然后我就装在了自己的电脑上



## 参考文档

- https://www.xfyun.cn/doc/tts/online_tts/API.html

- https://github.com/Marak/play.js
- https://www.npmjs.com/package/xf-tts-socket