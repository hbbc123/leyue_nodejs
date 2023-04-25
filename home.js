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



router.get('/banner', (req, res) => {
    req.db.query(`SELECT * FROM mc_banner`, (err, dataStr) => {

        res.send(dataStr)
    })
})
router.get('/list', (req, res) => {
    console.log(req.query);
    let limit
    req.db.query(sql.sql_userdian, req.query.user, (err, dataStr) => {

        userd = dataStr
    })
    if (req.query.i == 0) {
        limit = sql.sql_list
    } else if (req.query.i == 1) {
        limit = sql.sql_lisetime
    } else if (req.query.i == 2) {
        limit = sql.slq_remlist
    }
    req.db.query(limit, [req.query.user, req.query.user, parseInt(req.query.limit)], (err, dataStry) => {
        const arr = []


        if (req.query.user) {
            console.log('看长度', dataStry);
            if (dataStry) {
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
                res.send([])
            }
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




router.get('/look', (req, res) => {
    console.log(req.query);
    const id = req.query.id
    const user = req.query.user
    fn.alist(id, user, req, res, sql)

})

router.get('/look_z', (req, res) => {
    console.log(req.query);
    if (req.query.user) {
        req.db.query(sql.sql_look_z, [req.query.user, req.query.aid, req.query.user, req.query.aid,], (err, dataStr) => {
            if (dataStr[0].article_type == 1) {
                dataStr[0].article_resource = dataStr[0].article_resource.split(',')
            }
            res.send(dataStr)
        })
    } else {
        req.db.query(sql.sql_wedenglook, req.query.aid, (err, dataStrr) => {
            if (dataStrr[0].article_type == 1) {
                dataStrr[0].article_resource = dataStrr[0].article_resource.split(',')
            }
            res.send(dataStrr)
        })
    }
})
router.get('/sql_huidong', (req, res) => {

    // req.db.query(qsl.sql_huidong,)
})
router.get('/baidu_wen', (req, res) => {
    console.log(req.query);
    req.db.query(sql.sql_lahei, [req.query.user, req.query.mid], (err, data) => {

        if (!data) {
            client.textCensorUserDefined(req.query.text).then(function (data) {

                if (data.conclusion == '合规') {
                    req.db.query(sql.sql_huidong, [req.query.article_id, req.query.user, req.query.text, Date.now()], (err, dataStr) => {
                        if (dataStr) {
                            req.db.query(sql.sql_pinglunsum, req.query.article_id, (err, dataStrr) => {

                                const sum = ++dataStrr[0].comment_count
                                req.db.query(sql.sql_setpinglunsum, [sum, req.query.article_id], (err, dataStrrr) => {
                                    if (dataStrrr) {
                                        req.db.query(sql.sql_setinformfb, [req.query.mid, req.query.user, req.query.article_id, Date.now()], (err, da) => {

                                        })
                                        fn.alist(req.query.article_id, req.query.user, req, res, sql)
                                    }
                                })
                            })

                        } else {
                            res.send('发表失败')
                        }
                    })
                } else {
                    res.send(data)
                }

            }, function (e) {
                res.send(e)
            });
        } else {
            res.send('0')
        }
    })

})

router.get('/huifu', (req, res) => {
    // req.db.query(sql_huifupl,)

    const obj = req.query
    req.db.query(sql.sql_lahei, [req.query.user, req.query.mid], (err, data) => {
        if (!data) {
            client.textCensorUserDefined(req.query.text).then(function (data) {
                if (data.conclusion == '合规') {
                    req.db.query(sql.sql_huifupl, [obj.wid, obj.mid, obj.pid, obj.user, obj.text, Date.now()], (err, dataStr) => {
                        if (dataStr) {
                            req.db.query(sql.sql_pinglunsum, obj.wid, (err, dataStrr) => {

                                const sum = ++dataStrr[0].comment_count
                                req.db.query(sql.sql_setpinglunsum, [sum, obj.wid], (err, dataStrrr) => {
                                    if (dataStrrr) {
                                        req.db.query(sql.sql_setinformhf, [obj.mid, obj.user, obj.aid, obj.wid, obj.pid, Date.now()], (err, da) => {

                                        })
                                        fn.alist(obj.wid, req.query.user, req, res, sql)
                                    }
                                })
                            })
                        }
                    })
                } else {
                    res.send(data)
                }
            }, function (e) {

            });
        } else {

            res.send('0')
        }

    })

})

router.get('/dianz', (req, res) => {
    const obj = req.query

    fn.dianz(obj, sql, res, req)
})
router.get('/love', (req, res) => {
    const obj = req.query
    if (!parseInt(obj.tf)) {
        req.db.query(sql.sql_delove, [obj.user, obj.wid], (err, dataStr) => {

            if (dataStr) {
                req.db.query(sql.sql_lovesum, obj.wid, (err, dataStrr) => {
                    if (dataStrr) {
                        let sum = dataStrr[0].follower_count
                        sum--

                        req.db.query(sql.sql_setlvoesum, [sum, obj.wid], (err, dataStrrr) => {
                            if (dataStrrr) {
                                res.send('取消收藏成功')
                            } else {
                                res.send('取消收藏失败')

                            }
                        })
                    } else {
                        res.send('取消收藏失败')
                    }
                })

            } else {
                res.send('取消收藏失败')
            }
        })
    } else {

        req.db.query(sql.sql_loveadd, [obj.user, obj.wid, Date.now()], (err, dataStrr) => {
            if (dataStrr) {
                req.db.query(sql.sql_lovesum, obj.wid, (err, dataStrr) => {
                    if (dataStrr) {
                        let sum = dataStrr[0].follower_count
                        sum++
                        req.db.query(sql.sql_setlvoesum, [sum, obj.wid], (err, dataStrrr) => {
                            if (dataStrrr) {
                                req.db.query(sql.sql_setinformsc, [obj.mbuser, obj.user, obj.wid, Date.now()], (err, da) => {

                                    if (da) {
                                        res.send('成功添加收藏')
                                    }
                                })

                            } else {
                                res.send('添加收藏失败')

                            }
                        })
                    } else {
                        res.send('添加收藏失败')
                    }
                })
            } else {
                res.send('添加收藏失败')
            }
        })
    }
})

module.exports = router