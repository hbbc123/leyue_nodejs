const sql = require('./sql')
const fn = require('./fn')
const express = require('express')
const router = express.Router()
const request = require('request')
var https = require('https');
var qs = require('querystring');
var AipContentCensorClient = require("baidu-aip-sdk").contentCensor;

// 设置APPID/AK/SK
var APP_ID = "26337956";
var API_KEY = "ZTolSE91x0fqMFguU8AFm9Vz";
var SECRET_KEY = "eyH7DS9m1pYABHu1tfgkQr8LroPmxpL0";

// 新建一个对象，建议只保存一个对象调用服务接口
var client = new AipContentCensorClient(APP_ID, API_KEY, SECRET_KEY);


router.get('/xq', (req, res) => {
    const obj = req.query
    console.log(123123);
    req.db.query(sql.sql_banner, obj.i, (err, dataStr) => {
        if (dataStr) {
            res.send(dataStr)
        } else {
            res.send('0')
        }
    })
})
router.get('/dongtai', (req, res) => {



    let limit
    if (req.query.i == 0) {
        limit = sql.sql_bannerdongt
    } else if (req.query.i == 1) {
        limit = sql.sql_bannerzhengxu
    } else if (req.query.i == 2) {
        limit = sql.sql_bannerrm
    }



    let userd = []
    if (req.query.user) {
        req.db.query(sql.sql_userdian, req.query.user, (err, dataStr) => {

            userd = dataStr
        })
    } else {
        req.query.user = 0
    }
    console.log('52', req.query);
    req.db.query(limit, [req.query.user, req.query.user, req.query.lei, parseInt(req.query.limit)], (err, dataStry) => {
        const arr = []
        console.log(err);
        console.log(dataStry);
        console.log('____________________________');
        if (req.query.user) {
            dataStry.forEach(val => {
                if (val.article_type == 1) {
                    val.article_resource = val.article_resource.split(',')
                    arr.push(val)
                } else {
                    arr.push(val)
                }

            })
            const newarr = []
            arr.forEach(val => {
                if (val.wen_id) {
                    val.wenlove = 1
                } else {
                    val.wenlove = 0
                }
                if (val.pinglun_id) {
                    val.pinglove = 1
                } else {
                    val.pinglove = 0
                }
                newarr.push(val)
            })

            res.send(newarr)
        } else {
            dataStry.forEach(val => {
                if (val.article_type == 1) {
                    val.article_resource = val.article_resource.split(',')
                    arr.push(val)
                } else {
                    arr.push(val)
                }
            })
            res.send(arr)
        }

    })
})

router.get('/nm', (req, res) => {
    const obj = req.query
    let sql_limit
    if (obj.i == 0) {
        sql_limit = sql.sql_banner_nm
    } else if (obj.i == 1) {
        sql_limit = sql.sql_banner_nmdesc
    }
    req.db.query(sql_limit, parseInt(obj.limit), (err, dataStr) => {
        console.log('_____');
        console.log(dataStr);
        console.log(err);
        const arr = []
        console.log();
        dataStr.forEach((val, k) => {
            if (val.article_type == 1) {
                val.article_resource = val.article_resource.split(',')
                arr.push(val)
            } else {
                arr.push(val)
            }
            if (dataStr.lenght - 1 == k) {
                console.log(778899);
            }

        })
        res.send(arr)

    })
})


module.exports = router