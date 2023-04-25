const express = require('express')
const app = express()
const cors = require('cors')
const mysql = require('mysql')
const home = require('./home')
const user = require('./user')
const banner = require('./banner')
const path = require('path')
const fs = require('fs')
const corsConfig = {
    origin: '*',
    credentials: true,
}
const usehome = (req, res, next) => {
    app.use('/home', home)
    next()
}
const useuser = (req, res, next) => {
    app.use('/user', user)
    next()
}
const usebanner = (req, res, next) => {
    app.use('/banner', banner)
    next()
}

app.use(cors(corsConfig))
const my = (req, res, next) => {
    req.db = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'Leyue'
    })
    next()
}
app.use(my, usehome, useuser, usebanner)

app.get('/img*', (req, res) => {
    const url = req.url
    console.log(url);
    const fpath = path.join(__dirname, url) //使用path中join方法拼接完整路径


    fs.readFile(fpath, (err, dataStr) => {
        if (err) return res.end(`<h1>读取失败</h1>`);
        res.end(dataStr) //把dataStr中的数据放在浏览器页面显示
    })

})
app.get('/video*', (req, res) => {
    const url = req.url
    console.log(url);
    const fpath = path.join(__dirname, url) //使用path中join方法拼接完整路径


    fs.readFile(fpath, (err, dataStr) => {
        if (err) return res.end(`<h1>读取失败</h1>`);
        res.end(dataStr) //把dataStr中的数据放在浏览器页面显示
    })

})

app.listen(80, () => {
    console.log('http://127.0.0.1');
})

process.on('uncaughtException', function (err) {
    //打印出错误 
    console.log(err);
    //打印出错误的调用栈方便调试 
    console.log('999888999', err.stack);
});