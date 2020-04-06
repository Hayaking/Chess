const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('./webpack.config');

const app = new (require('express'))();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const compiler = webpack(config);
app.use(webpackDevMiddleware(compiler, {noInfo: true, publicPath: config.output.publicPath}));
app.use(webpackHotMiddleware(compiler));

app.use(function (req, res) {
    res.sendFile(__dirname + '/index.html')
});


// 开启监听
let currentState={};
let userPool = new Map();
http.listen(3000, function () {
    console.log('服务监听端口: 3000')
});

io.on('connection', (socket) => {
    console.log('客户端连接成功:', socket.id);
    if (currentState != null) {
        socket.emit('message', currentState);
    }
    // socket.on('sign', name => {
    //     console.log('客户端' + socket.id + '注册名:' + name);
    //     userPool.set(name, socket.id);
    //     let arr = [];
    //     userPool.forEach((value, key) => {
    //         arr.push(key);
    //     });
    //     currentState.userList = arr;
    //     io.emit('message', currentState);
    // });
    // socket.on('disconnected', () => {
    //     console.log('断开连接:', socket.id);
    //     let arr = [];
    //     userPool.forEach((value, key) => {
    //         if (value === socket.id) userPool.delete(key);
    //         else arr.push(key);
    //     });
    //     currentState.userList = arr;
    //     io.emit('message', currentState);
    // });

    socket.on('change_state', msg => {
        console.log('收到来自客户端' + socket.id + '的消息:', msg);
        currentState = msg;
        // 向除了当前客户端以外的客户端广播
        socket.broadcast.emit('message', msg);
        // io.emit('message', msg);
    });
    // socket.on('reset', () => {
    //     console.log('收到来自客户端' + socket.id + '的重置棋盘消息:');
    //     currentState = {};
    //     io.emit('reset'); // 通过io向全体广播当前状态
    // })
});
