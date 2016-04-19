var http = require('http');
//加载fs模块
var fs = require('fs');
//加载socket包
var io = require('socket.io');
var query = require("querystring");
var url = require('url');
var num =0;
//设定此目录为主目录(根目录)
var documentRoot = __dirname;
//创建服务器
var httpServer = http.createServer();
httpServer.on('request',function(req, res) {
    var url = req.url;
    var file = documentRoot + url;
    fs.readFile(file, function(err, data) {
        if (err) {
            res.writeHeader(404, {
                'content-type' : 'text/html;charset="utf-8"'
            });
            res.write('<h1>404</h1><p>页面不存在</p>');
            res.end();
        } else {
            res.writeHeader(200, {
                'content-type' : 'text/html;charset="utf-8"'
            });
            res.write(data);
            res.end();
        }

        //当不用socket通信的时候就可以用以下的方式通过本地访问就可以保存图片
        //if (req.method.toUpperCase() == 'POST') {
        //    var str = '';
        //    //从缓存区中不断的从缓存区中读出数据
        //    req.on('data', function(chunk) {
        //        str += chunk;
        //    })
        //    //从缓存区中读出数据完成以后
        //    req.on('end', function() {
        //       var  imgdata = query.parse(str).imgdata;
        //        var base64Data = imgdata.replace(/^data:image\/\w+;base64,/, "");
        //        var dataBuffer = new Buffer(base64Data, 'base64');
        //        fs.writeFile(".png", dataBuffer);
        //    })
        //
        //}


    });

});
httpServer.listen(8881);
var socket = io.listen(httpServer);
//当一个客户端连接进来时就会触发一个connect事件对象，并且把当前连接的socket对象传入回调函数中
socket.sockets.on('connection',function(socket){
    //事件发送器，发送到客户端 socket.emit(事件名称，数据)
    socket.emit('hello', '您好，您已开启摄像头，请认真作答');
    socket.on('showImg',function(data){
        var base64Data = data.replace(/^data:image\/\w+;base64,/, "");
        var dataBuffer = new Buffer(base64Data, 'base64');
        num++;
        //当写出__dirname根目录时便可以找到指定的路径
        var filename = __dirname+'/image/'+ num+'.png';
        fs.exists(filename,function(isExists){
            if(!isExists){
                fs.writeFile(filename,dataBuffer,function(err){
                    if(err){
                        console.log('第'+filename+'个图片创建错误')
                    }else{
                        console.log('第'+filename+'个图片创建成功')
                    }
                })
            }else{
                console.log('图片'+filename+'已被替换')
                fs.writeFile(filename,dataBuffer,function(err){
                    if(err){
                        console.log('第'+filename+'个图片替换失败')
                    }else{
                        console.log('第'+filename+'个图片替换成功')
                    }
                })
            }
        });
        //var dirname = 'photoImage';
        //fs.exists(mkname,function(isExists){
        //    if(!isExists){
        //        fs.mkdir(mkname,function(err){
        //            if(err){
        //                console.log('出错了')
        //            }else{
        //                console.log('文件夹创建成功')
        //            }
        //        })
        //    }else{
        //        fs.writeFile(i+filename,dataBuffer,function(err){
        //            if(err){
        //                console.log('第'+i+'个图片创建错误')
        //            }else{
        //                console.log('第'+i+'个图片创建成功')
        //            }
        //        })
        //    }
        //})
    })
})
