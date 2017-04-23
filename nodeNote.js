nodeJS——服务器

http——协议

request	请求	输入-请求的信息
response	响应	输出-输出的东西

Crypto	加密
Events	事件
Net	网络操作
OS	操作系统信息
Path	处理文件路径
Stream	流操作
Timers	定时器
ZLIB	压缩


------------------------------http模块-------------------------------------->
const http=require('http');

var server=http.createServer(function (req, res){
  switch(req.url){
    case '/1.html':
      res.write("111111");
      break;
    case '/2.html':
      res.write("2222");
      break;
    default:
      res.write('404');
      break;
  }

  res.end();
});

//监听——等着
//端口-数字
server.listen(8080);


------------------------------fs模块----------------------------------------->
readFile(文件名, function (err, data){})
writeFile(文件名, 内容, function (err){})
const http=require('http');
const fs=require('fs');

var server=http.createServer(function (req, res){
  //req.url=>'/index.html'
  //读取=>'./www/index.html'
  //  './www'+req.url
  var file_name='./www'+req.url;

  fs.readFile(file_name, function (err, data){
    if(err){
      res.write('404');
    }else{
      res.write(data);
    }
    res.end();
  });
});

server.listen(8080);


-------------------------------url模块------------------------------------->

-----GET方式获取和发送数据；---------------------->

const http=require('http');
const urlLib=require('url');

http.createServer(function (req, res){
  var obj=urlLib.parse(req.url, true);

  var url=obj.pathname;
  var GET=obj.query;

  console.log(url, GET);

  //req获取前台请求数据
  res.write('aaa');
  res.end();
}).listen(8080);

-----POST获取数据的模块'querystring'---------------------->
GET和POST方式获取和发送数据对比
const http=require('http');
const fs=require('fs');
const querystring=require('querystring');
const urlLib=require('url');

var server=http.createServer(function (req, res){
  //GET
  var obj=urlLib.parse(req.url, true);
  var url=obj.pathname;
  const GET=obj.query;
  //POST
  var str='';
  req.on('data', function (data){
    str+=data;
  });
  req.on('end', function (){
    const POST=querystring.parse(str);
    /*
    url——要什么
    GET——get数据
    POST——post数据
    */
    //文件请求
    var file_name='./www'+url;
    fs.readFile(file_name, function (err, data){
      if(err){
        res.write('404');
      }else{
        res.write(data);
      }
      res.end();
    });
  });
});

server.listen(8080);


----------------------------http&fs&url&querystring综合小例子---------------------->
const http=require('http');
const fs=require('fs');
const querystring=require('querystring');
const urlLib=require('url');

var users={};   //{"blue": "123456", "zhangsan": "123456", "lisi": "321321"}

var server=http.createServer(function (req, res){
  //解析数据
  var str='';
  req.on('data', function (data){
    str+=data;
  });
  req.on('end', function (){
    var obj=urlLib.parse(req.url, true);

    const url=obj.pathname;
    const GET=obj.query;
    const POST=querystring.parse(str);

    //区分——接口、文件
    if(url=='/user'){   //接口
      switch(GET.act){
        case 'reg':
          //1.检查用户名是否已经有了
          if(users[GET.user]){
            res.write('{"ok": false, "msg": "此用户已存在"}');
          }else{
            //2.插入users
            users[GET.user]=GET.pass;
            res.write('{"ok": true, "msg": "注册成功"}');
          }
          break;
        case 'login':
          //1.检查用户是否存在
          if(users[GET.user]==null){
            res.write('{"ok": false, "msg": "此用户不存在"}');
          //2.检查用户密码
          }else if(users[GET.user]!=GET.pass){
            res.write('{"ok": false, "msg": "用户名或密码有误"}');
          }else{
            res.write('{"ok": true, "msg": "登录成功"}');
          }
          break;
        default:
          res.write('{"ok": false, "msg": "未知的act"}');
      }
      res.end();
    }else{              //文件
      //读取文件
      var file_name='./www'+url;
      fs.readFile(file_name, function (err, data){
        if(err){
          res.write('404');
        }else{
          res.write(data);
        }
        res.end();
      });
    }
  });
});

server.listen(8080);

---------------------------------------模块的规则(npm的使用)----------------------------------->
1.模块里面
	require——引入
	exports——输出
	module.exports——批量输出

	exports.xxx=??;
	exports.xxx=??;
	exports.xxx=??;

	module.exports={
		xxx:	??,
		xxx:	??,
		xxx:	??
	};


2.npm
	帮咱们下载模块
	自动解决依赖

3.node_modules
	模块放这里

-----上传自己的模块功能到npm------------>
npm init     //初始化
npm publish  //上传
npm --force unpublish //删除

-----定义一个自己的模块----------------->
exports.sum=function (){
  var res=0;
  for(var i=0;i<arguments.length;i++){
    res+=arguments[i];
  }
  return res;
};
exports.div=function (a, b){
  return a/b;
};



--------------------------------------express框架：----------------------------------------------->
1.依赖中间件
2.接收请求
  get/post/use
  get('/地址', function (req, res){});
3.非破坏式的
  req.url
4.static用法
  const static=require('express-static');
  server.use(static('./www'));

-----express  GET例子------------------------------>

const express=require('express');
const expressStatic=require('express-static');
var server=express();
server.listen(8080);

//用户数据
var users={
  'blue': '123456',
  'zhangsan': '654321',
  'lisi': '987987'
};
server.get('/login', function (req, res){ //GET请求直接req.query
  var user=req.query['user'];
  var pass=req.query['pass'];

  if(users[user]==null){
    res.send({ok: false, msg: '此用户不存在'}); //相当于res.write(),但是可以直接写json
  }else{
    if(users[user]!=pass){
      res.send({ok: false, msg: '密码错了'});
    }else{
      res.send({ok: true, msg: '成功'});
    }
  }
});
server.use(expressStatic('./www')); //访问静态文件

-----express  POST例子-------------------------------->
const express=require('express');
const querystring=require('querystring');
const bodyParser=require('body-parser');//需要引用中间件body-parser
var server=express();
server.listen(8080);
-----自己实现实现POST获取数据-------->
/*server.use(function (req, res, next){ //next()实现链式操作
  var str='';
  req.on('data', function (data){
    str+=data;
  });
  req.on('end', function (){
    req.body=querystring.parse(str);

    next();
  });
});*/
-----body-parser中间件实现POST获取数据------>
server.use(bodyParser.urlencoded({
	extended: false,                //扩展模式
    limit:    2*1024*1024           //限制-2M
}));
server.use('/', function (req, res){
  console.log(req.body);
});


------将自己实现的POST获取数据封成中间件------>
const querystring=require('querystring');
module.exports={
  aaa: function (){
    return function (req, res, next){
      var str='';
      req.on('data', function (data){
        str+=data;
      });
      req.on('end', function (){
        req.body=querystring.parse(str);

        next();
      });
    };
  }
};
使用自己的中间件
const express=require('express');
const bodyParser2=require('./libs/my-body-parser');
var server=express();
server.listen(8080);
server.use(bodyParser2.aaa());
server.use('/', function (req, res){
  console.log(req.body);
});


----------------------------------------cookie与session---------------------------------------------->

session依赖于cookie

------cookie----------------------->
a.发送cookie
res.secret='字符串';
res.cookie(名字, 值, {path: '/', maxAge: 毫秒, signed: true});

b.读取cookie
cookie-parser中间件
server.use(cookieParser('秘钥'));
server.use(function (){
	req.cookies		未签名版
	req.signedCookies	签名版
});

c.删除cookie
res.clearCookie(名字);

d.例子
const express=require('express');
const cookieParser=require('cookie-parser');
var server=express();
//cookie
server.use(cookieParser('wesdfw4r34tf'));//任意字符串
server.use('/', function (req, res){
  res.clearCookie('user');
  res.send('ok');
});
server.listen(8080);

------session----------------------->
//delete req.session

const express=require('express');
const cookieParser=require('cookie-parser');
const cookieSession=require('cookie-session');

var server=express();
//cookie
var arr=[];
for(var i=0;i<100000;i++){
  arr.push('sig_'+Math.random());
}
server.use(cookieParser("dasdkas"));

server.use(cookieSession({
  name: 'sess',
  keys: arr,
  maxAge: 2*3600*1000
}));

server.use('/', function (req, res){
  res.cookie("user","snasan",{signed:true});
  res.cookie("user1","sisi",{signed:false});
  //res.clearCookie('user');
  if(req.session['count']==null){
    req.session['count']=1;
  }else{
    req.session['count']++;
  }
  //console.log(req);
  console.log(req.signedCookies);
  console.log(req.cookies);
  console.log(req.session['count']);
  delete req.session['count'];
  console.log(req.session['count']);
  res.send('ok');
});

server.listen(8080);