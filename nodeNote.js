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


------------------------------http模块---------------------------------------->
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

----------------------------------------------------jade模板引擎-------------------------------------------->
-----main.js------------->

const jade=require('jade');
const fs=require('fs');

var str =jade.renderFile('./views/index.jade',{pretty:true,name:"变量"});//变量直接在后面添加，在jade模板中使用

fs.writeFile('./build/index.html',str,function(err){
	if(err){
		console.log('编译失败');
	}else{
		console.log('编译成功');
	}
});

-----index.jade------------->
doctype
html
  head
  meta(charset="utf-8")  
  style.
    div{width:100px;height:100px;background:#CCC;text-align:center;line-height:100px;float:left;margin:10px auto}
    div.last{clear:left}
  body
    -var a=0;
    while a<12
      if a%4==0 &&a!=0
        div.last=a++
      else
        div=a++

-----jdae语法-------------->
1 根据缩进，规定层级
2 属性放在()里面，多个属性逗号分隔
3 内容空个格，直接往后堆 也可以#{变量} 还可以直接="内容"或者变量
4 .后面代表所有子级原样输出   也可以用include 直接引入文件( include a.js)
5 |后面是单行原样输出
6 -代表后面跟的是语句
7 !表示将标签原样输出

----------------------------------------------------Ejs模板引擎-------------------------------------------->
const ejs=require('ejs');
var str =jade.renderFile('./views/index.ejs',{name:"变量"},function  (err,data) {
  // body...
});
<%= name%>
<% include "文件地址" %>

----------------------------------------------------multer中间件-------------------------------------------->
小例子：
-----HTML部分----------------------->
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title></title>
  </head>
  <body>
    <form action="http://localhost:8080/" method="post" enctype="multipart/form-data">
      文件：<input type="file" name="f1" /><br>
      <input type="submit" value="上传">
    </form>
  </body>
</html>

-----js部分----------------------->
const express=require('express');
const bodyParser=require('body-parser');
const multer=require('multer');
const fs=require('fs');
const pathLib=require('path');//node自带模块  用来解析路径
/*var str='c:\\wamp\\www\\a.html';
var obj=path.parse(str);
//base      文件名部分
//ext       扩展名
//dir       路径
//name      文件名部分
console.log(obj);*/

var objMulter=multer({dest: './www/upload/'});//multer中间件  用来上传图片等文件数据
var server=express();
//错误 bodyParser只能用来解析post普通的json类型的数据
//server.use(bodyParser.urlencoded({extended: false}));
server.use(objMulter.any());

server.post('/', function (req, res){
  //新文件名
  //'./www/upload/dfb33662df86c75cf4ea8197f9d419f9' + '.png'
  var newName=req.files[0].path+pathLib.parse(req.files[0].originalname).ext;

  fs.rename(req.files[0].path, newName, function (err){ //fs.rename("旧名字"，"新名字",function回调)
    if(err)
      res.send('上传失败');
    else
      res.send('成功');
  });

  //1.获取原始文件扩展名
  //2.重命名临时文件
});

server.listen(8080);

--------------------------------------------模板引擎适配consolidate------------------------------------------------>
模板引擎：适配
1.consolidate

consolidate=require('consolidate');
三步配置走：
server.set('view engine', 'html'); //设置模板引擎输出的文件类型
server.set('views', '模板文件目录'); //设置模板文件的位置
server.engine('html', consolidate.ejs);//设置使用的模板引擎

server.get('/', function (req, res){
  res.render('模板文件', 数据);//res.render相当于res.send 向页面输出数据
});

---------------------------------------------router路由----------------------------------------------------------------->
var server=express();
var router1=express.Router();
server.use('/user', router1);

var router11=express.Router();
router1.use('/user_mod', router11);
router1.use('/user_reg', function (){});
http://www.xxxx.com/user/user_mod/1.html
http://www.xxxx.com/user/user_reg
http://www.xxxx.com/user/user_login

router11.get('./1.html',function  (req,res) {
  // body...
})

var router2=express.Router();
server.use('/news', router2);
http://www.xxxx.com/news/list.html
http://www.xxxx.com/news/post
http://www.xxxx.com/news/content
router2.get('./list.html',function  (req,res) {
  // body...
})
var router3=express.Router();
server.use('/item', router3);
http://www.xxxx.com/item/buy.html
http://www.xxxx.com/item/mod
http://www.xxxx.com/item/del
router3.get('./buy.html',function  (req,res) {
  // body...
})