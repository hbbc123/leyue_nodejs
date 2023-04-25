const sql = require('./sql')
const fn = require('./fn')
const multer = require('multer')
const express = require('express')
const router = express.Router()
const request = require('request')

var https = require('https');
const timeout = require("connect-timeout")
var fs = require('fs');
var AipContentCensorClient = require("baidu-aip-sdk").contentCensor;

// 设置APPID/AK/SK
var APP_ID = "26337956";
var API_KEY = "ZTolSE91x0fqMFguU8AFm9Vz";
var SECRET_KEY = "eyH7DS9m1pYABHu1tfgkQr8LroPmxpL0";

// 新建一个对象，建议只保存一个对象调用服务接口
var client = new AipContentCensorClient(APP_ID, API_KEY, SECRET_KEY);



router.get('/condition', (req, res) => {
    const user = req.query.user
    let userd = []
    const arr = []
    req.db.query(sql.sql_lookuserd, [user, user, user], (err, dataStr) => {
        if (dataStr) {

            dataStr.forEach(val => {
                if (val.article_type == 1 && val.article_state == 1) {
                    val.article_resource = val.article_resource.split(',')
                    arr.push(val)
                } else if (val.article_state == 1) {
                    arr.push(val)
                }

            })
            console.log(arr);
            const newarr = []
            if (arr.length > 0) {
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
            res.send('拉取失败')
        }
    })

})
router.get('/love', (req, res) => {
    const arr = []
    const user = req.query.user
    req.db.query(sql.sql_loveuser, [user, user, user], (err, dataStr) => {
        console.log(dataStr[0]);
        if (dataStr[0]) {
            if (dataStr[0].love_user) {

                dataStr.forEach(val => {
                    if (val.article_type == 1) {
                        val.article_resource = val.article_resource.split(',')
                        arr.push(val)
                    } else {
                        arr.push(val)
                    }

                })
                console.log('新', arr);
                const newarr = []
                arr.forEach(val => {
                    if (val.love_user) {
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
                console.log('bug', arr);
                res.send(newarr)
            }

        } else {
            res.send([])
        }

    })
})
router.get('/dian', (req, res) => {

    const arr = []
    const user = req.query.user
    req.db.query(sql.sql_dianwenuser, [user, user], (err, dataStr) => {
        if (dataStr) {

            dataStr.forEach(val => {
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
            res.send('拉取失败')
        }
    })

})

router.get('/deldt', (req, res) => {
    const aid = req.query.aid
    console.log(req.query);
    req.db.query(sql.sql_deluserd, [0, parseInt(aid)], (err, dataSrt) => {
        if (dataSrt) {
            res.send('删除成功')
        } else {
            console.log(err);
            res.send('删除失败')
        }
    })
})

router.get('/delove', (req, res) => {
    const obj = req.query
    console.log(obj);
    req.db.query(sql.sql_delove, [obj.user, obj.aid], (err, dataSrt) => {
        req.db.query(sql.sql_lovesum, obj.aid, (err, dataStrr) => {
            if (dataStrr) {
                let sum = dataStrr[0].follower_count
                sum--
                req.db.query(sql.sql_setlvoesum, [sum, obj.aid], (err, datas) => {
                    res.send('取消收藏成功')
                    console.log('3', err);
                })
            } else {
                res.send('取消收藏失败')
            }
        })
    })
})
router.get('/user', (req, res) => {
    console.log(req.query);
    req.db.query(sql.sql_userxx, [req.query.user, req.query.benuser, req.query.benuser, req.query.user], (err, dataSrt) => {
        console.log(err);
        res.send(dataSrt)

    })
})
router.get('/delc', (req, res) => {
    req.db.query(sql.sql_delcomment, [0, req.query.cid], (err, dataStr) => {
        req.db.query(sql.sql_pinglunsum, req.query.aid, (err, data) => {
            let sum = data[0].comment_count
            sum--
            req.db.query(sql.sql_setpinglunsum, [sum, req.query.aid], (err, dataStrr) => {
                if (dataStrr) {
                    res.send(dataStr)
                } else {
                    res.send('删除评论失败')
                }
            })
        })

    })
})


router.get('/three', (req, res) => {
    console.log(req.query);
    const obj = req.query
    if (obj.lei == 0) {
        req.db.query(sql.sql_userhuoz, [obj.user, obj.user], (err, dataStr) => {
            res.send(dataStr)
        })
    } else if (obj.lei == 1) {
        console.log(obj.user);
        req.db.query(sql.sql_huoquguanz, obj.user, (err, dataSrt) => {

            res.send(dataSrt)
        })
    } else if (obj.lei == 2) {
        req.db.query(sql.sql_huoquuserfen, obj.user, (err, dataSrt) => {

            res.send(dataSrt)
        })
    }
})

router.get('/delguanz', (req, res) => {
    const obj = req.query

    if (obj.tf != '0') {

    } else {

        req.db.query(sql.sql_delguanzz, obj.gid, (err, dataSrt) => {
            if (dataSrt) {
                req.db.query(sql.sql_huoquuserguan, obj.user, (err, dataStrr) => {
                    let sum = dataStrr[0].followee_count
                    sum--
                    if (dataStrr) {
                        req.db.query(sql.sql_setuserguanz, [sum, obj.user], (err, dataStrrr) => {
                            res.send('取消收藏成功')
                        })
                    }
                })
            }
        })
    }
})


router.get('/buser', (req, res) => {
    const obj = req.query
    console.log(obj.user);
    req.db.query(sql.sql_quanfabiao, obj.user, (err, data) => {
        console.log(data[0]);
        if (data[0].user_fatf) {
            req.db.query(sql.sql_quanuserfabiao, obj.user, (err, dataStr) => {
                console.log(dataStr[0]);
                if (dataStr[0]) {
                    const arr = []
                    dataStr.forEach(val => {
                        if (val.article_type == 1) {
                            val.article_resource = val.article_resource.split(',')
                            arr.push(val)
                        } else {
                            arr.push(val)
                        }
                    })
                    res.send(arr)
                } else {
                    res.send('0')
                }
            })

        } else {
            res.send('-1')
        }
    })
})

router.get('/busershou', (req, res) => {
    const obj = req.query
    req.db.query(sql.sql_usershoutf, obj.user, (err, dataStr) => {
        console.log(dataStr[0]);
        if (dataStr[0].user_shoutf) {
            res.send('1')
        } else {
            res.send('0')
        }
    })
})

router.get('/userdiantf', (req, res) => {
    const obj = req.query
    req.db.query(sql.sql_userdiantf, obj.user, (err, dataStr) => {

        console.log(dataStr[0]);
        if (dataStr[0].user_diantf == 1) {
            res.send('1')
        } else {
            res.send('0')
        }
    })
})

router.get('/addguan', (req, res) => {
    const obj = req.query
    if (obj.tf) {
        req.db.query(sql.sql_addguan, [obj.user, obj.mid, Date.now()], (err, dataSrt) => {
            if (dataSrt) {
                req.db.query(sql.sql_huoquuserguan, obj.user, (err, dataSrt) => {
                    let sum = dataSrt[0].followee_count
                    sum++
                    req.db.query(sql.sql_setuserguanz, [sum, obj.user], (err, dataStrr) => {
                        if (dataStrr) {
                            res.send('成功添加关注')
                        }
                    })
                })


            } else {
                res.send('添加关注失败')
            }
        })
    } else {
        res.db.query(sql.sql_delguanz, obj.user, (err, dataSrt) => {
            if (dataSrt) {
                req.db.query(sql.sql_huoquuserguan, obj.user, (err, dataSrt) => {
                    let sum = dataSrt[0].followee_count
                    sum--
                    req.db.query(sql.sql_setuserguanz, [sum, obj.user], (err, dataStrr) => {
                        if (dataStrr) {
                            res.send('取关成功')
                        }
                    })
                })


            } else {
                res.send('取关失败')
            }
        })
    }
})


router.get('/rootsx', (req, res) => {
    const obj = res.query
    console.log(obj);
    req.db.query(sql.sql_lookusersx, obj.mid, (err, dataSrt) => {
        if (dataSrt) {
            res.send(dataSrt)
        }
    })
})


router.get('/xx', (req, res) => {
    const obj = req.query
    req.db.query(sql.swl_tongz, obj.user, (err, dataStr) => {
        res.send(dataStr)
    })
})

router.get('/img', (req, res) => {
    req.db.query(sql.sql_rootduiimgs, req.query.user, (err, dataSrt) => {
        if (dataSrt) {
            console.log(dataSrt);
            res.send(dataSrt)
        }
    })
})


router.get('/listdui', (req, res) => {
    const he = JSON.parse(req.query.mid)
    console.log(he);
    const son = JSON.parse(req.query.son)
    let arr = []
    console.log(he);
    if (he.length > 0) {
        he.forEach((val, s) => {
            req.db.query(sql.sql_userlistimg, [val, req.query.user], (err, dataSrt) => {
                if (dataSrt[0]) {
                    arr.push(dataSrt[0])
                    console.log('liebiosdf', dataSrt[0]);

                }
                if (s + 1 == he.length) {
                    if (son.length > 0) {

                        son.forEach((sonss, k) => {
                            req.db.query(sql.sql_userlisetimgtwo, [sonss, req.query.user], (err, dataSrt) => {
                                if (dataSrt[0]) {

                                    arr.push(dataSrt[0])
                                }
                                if (k + 1 == son.length) {
                                    console.log(888);
                                    res.send(arr)
                                }
                            })
                        })

                    } else {
                        console.log('直接走一层循环', arr);
                        res.send(arr)
                    }

                }
            })
        })
    } else {
        if (son.length > 0) {

            son.forEach((sonss, k) => {
                req.db.query(sql.sql_userlisetimgtwo, [sonss, req.query.user], (err, dataSrt) => {
                    if (dataSrt[0]) {

                        arr.push(dataSrt[0])
                    }
                    if (k + 1 == son.length) {
                        console.log(888);
                        res.send(arr)
                    }
                })
            })

        } else {
            console.log('直接走一层循环', arr);
            res.send(arr)
        }
    }









})


router.get('/time', (req, res) => {
    const arr = JSON.parse(req.query.lid)
    console.log(req.query);
    arr.forEach((val, k) => {
        req.db.query(sql.sql_updataxx, val, (err, dataSrt) => {
            console.log(err);
            console.log(dataSrt);
            if (k + 1 == arr.length) {
                res.send('修改信息状态成功')
            }
        })
    })

})

router.get('/sxie', (req, res) => {
    const obj = req.query
    console.log(obj);
    let jj
    const arr = JSON.parse(req.query.val)
    const lei = arr[9]
    req.db.query(sql.sql_lahebibiao, [obj.mid, obj.user], (err, da) => {
        if (!da[0].lh) {
            req.db.query(sql.sql_huoloveguan, [obj.user, obj.mid], (err, datastr) => {
                console.log('zg', datastr);
                if (datastr.length > 0 && lei != 1) {

                    client.textCensorUserDefined(req.query.text).then(function (data) {

                        if (data.conclusion == '合规') {

                            console.log(arr);
                            req.db.query(sql.sql_xieruhuifu, [...arr], (err, dataSrt) => {
                                console.log(err);
                                console.log(dataSrt);
                                res.send('回复成功')
                            })
                        } else {
                            res.send(data)
                        }

                    }, function (e) {
                        console.log(e);
                        res.send(e)
                    });
                } else if (lei != 1) {

                    req.db.query(sql.sql_sxcs, [obj.user, obj.mid], (err, data) => {
                        jj = data[0].js
                        if (data[0].js >= 3) {
                            res.send('-1')
                        } else {
                            client.textCensorUserDefined(req.query.text).then(function (data) {

                                if (data.conclusion == '合规') {

                                    console.log(arr);
                                    req.db.query(sql.sql_xieruhuifu, [...arr], (err, dataSrt) => {
                                        if (dataSrt) {
                                            jj++
                                            req.db.query(sql.sql_sql_addcount, [obj.user, obj.mid], (err, dataStrr) => {
                                                if (dataStrr) {
                                                    let ss = 3 - jj
                                                    res.send(`在对方回复或关注前 你还可以发送${ss}条消息`)
                                                }
                                            })
                                        }
                                    })
                                } else {
                                    res.send(data)
                                }

                            }, function (e) {
                                console.log(e);
                                res.send(e)
                            });
                        }
                    })
                } else if (datastr.length > 0 && lei == 1) {
                    req.db.query(sql.sql_xieruhuifu, [...arr], (err, dataSrt) => {
                        console.log(err);
                        console.log(dataSrt);
                        res.send('回复成功')
                    })
                } else if (lei == 1) {
                    req.db.query(sql.sql_sxcs, [obj.user, obj.mid], (err, data) => {
                        jj = data[0].js
                        if (data[0].js >= 3) {
                            res.send('-1')
                        } else {
                            req.db.query(sql.sql_xieruhuifu, [...arr], (err, dataSrt) => {

                                if (dataSrt) {
                                    jj++
                                    req.db.query(sql.sql_sql_addcount, [obj.user, obj.mid], (err, dataStrr) => {
                                        if (dataStrr) {
                                            let ss = 3 - jj
                                            res.send(`在对方回复或关注前 你还可以发送${ss}条消息`)
                                        }
                                    })
                                }
                            })
                        }
                    })

                }
            })
        } else {
            res.send('-2')
        }
    })
})
router.get('/tz', (req, res) => {
    console.log('通知', req.query.user);
    req.db.query(sql.sql_tzroot, req.query.user, (err, datastr) => {
        console.log('通知返回', datastr);
        console.log(err);
        res.send(datastr)
    })
})
router.post('/fimage', multer({ dest: 'video' }).single('file'), (req, res) => {

    fs.renameSync(req.file.path, `video/${req.file.originalname}`)
    let videoUrl = `http://www.leyue.xyz/video/${req.file.originalname}`;



    let imageData = fs.readFileSync(`video/${req.file.originalname}`)//获取文件
    let imageDataToBase64 = imageData.toString('base64')//转为base64放入数组

    client.imageCensorUserDefined(imageDataToBase64, 'base64').then(function (data) {
        console.log('<imageCensorUserDefined>: ' + JSON.stringify(data));


        data.videoUrl = videoUrl


        res.send(obj)

    }, function (e) {
        console.log(e)
    });
})

router.get('/inform', (req, res) => {
    req.db.query(sql.sql_tz, [req.query.user, req.query.user], (err, datastr) => {
        console.log(req.query);
        if (datastr) {
            res.send(datastr)
        } else {
            res.send('0')
        }
    })
})
router.get('/set_inform', (req, res) => {
    req.db.query(sql.sql_settz, req.query.id, (err, dataSrt) => {
        res.send(dataSrt)
    })
})
router.get('/uproot', (req, res) => {
    const obj = req.query
    let chaxun
    if (obj.i == 1) {
        chaxun = sql.sql_uprootsx
    } else if (obj.i == 2) {
        chaxun = sql.sql_uproot
    } else if (obj.i == 3) {
        chaxun = sql.sql_uprootlookdt
    } else if (obj.i == 4) {
        chaxun = sql.sql_uprootlooksc
    } else if (obj.i == 5) {
        chaxun = sql.sql_uprootdiantf
    }
    else if (obj.i == 6) {
        chaxun = sql.sql_uproot_lookhz
    }
    else if (obj.i == 7) {
        chaxun = sql.sql_uproot_lookgz
    }
    else if (obj.i == 8) {
        chaxun = sql.sql_uproot_lookfs
    }
    req.db.query(chaxun, [parseInt(obj.tf), parseInt(obj.user)], (err, dataSrt) => {
        console.log(err);
        if (dataSrt) {
            res.send(dataSrt)
        }
    })
})

router.get('/recycle', (req, res) => {
    const obj = req.query
    console.log(obj);
    req.db.query(sql.sql_huishouzs, [parseInt(obj.user), parseInt(obj.user)], (err, datastr) => {
        console.log(err);
        console.log(datastr);
        if (datastr) {
            if (datastr.length > 0) {

                const arr = []
                datastr.forEach((val, k) => {
                    if (val.article_type == 1 && val.article_state == 0) {
                        val.article_resource = val.article_resource.split(',')
                        arr.push(val)
                    } else if (val.article_state == 0) {
                        arr.push(val)
                    }
                    if (datastr.length - 1 == k) {

                        res.send(arr)
                    }
                })

            } else {
                res.send('0')
            }
        } else {
            res.send('200')
        }
    })
})
router.get('/hfdontai', (req, res) => {
    req.db.query(sql.sql_huifudontai, req.query.aid, (err, dataSrt) => {
        console.log(err);
        if (dataSrt) {
            res.send('1')
        } else {
            res.send('0')
        }

    })
})
router.get('/deldongtai', (req, res) => {
    req.db.query(sql.sql_deldontai, parseInt(req.query.aid), (err, datastr) => {
        if (datastr) {
            req.db.query(sql.sql_deldontaic, parseInt(req.query.aid), (err, dataStrr) => {
                if (dataStrr) {
                    req.db.query(sql.sql_deldontahf, parseInt(req.query.aid), (err, dataStrr) => {
                        if (dataStrr) {
                            res.send('ok')
                        }
                    })
                }
            })
        } else {
            res.send('200')
        }
    })
})
router.get('/black', (req, res) => {
    req.db.query(sql.sql_balck, req.query.user, (err, datastr) => {
        if (datastr) {
            res.send(datastr)
        }
    })
})
router.get('/blackdel', (req, res) => {
    req.db.query(sql.sql_delblack, req.query.mid, (err, dataSrt) => {
        if (dataSrt) {
            res.send(dataSrt)
        }
    })
})

router.get('/lahei', (req, res) => {
    const obj = req.query
    req.db.query(sql.sql_lahei, [obj.user, obj.mid, Date.now()], (err, dataSrt) => {
        if (dataSrt) {
            res.send('ok')
        }
    })
})
router.get('/jubao', (req, res) => {
    console.log(req.query);
    const obj = req.query
    let arr = []
    if (obj.lei == 0) {
        arr = [0, obj.user, obj.lei, obj.aid, obj.mid, Date.now(), obj.text, 0, 0, 0, null]

    } else if (obj.lei == 1) {

        arr = [0, obj.user, obj.lei, 1, obj.mid, Date.now(), obj.text, 0, 0, obj.aid, null]
    } else if (obj.lei == 2) {
        console.log(obj);
        arr = [0, obj.user, obj.lei, 2, obj.mid, Date.now(), obj.text, 0, 0, 0, null]
    }
    req.db.query(sql.sql_jubaoadd, arr, (err, dataSrt) => {
        console.log(err);
        console.log(dataSrt);
        if (dataSrt) {
            res.send(dataSrt)
        } else {
            res.send(err)
        }
    })

})
let httpsBody
router.get('/add_user', (req, res) => {
    const bbs = res
    // req.db.query(sql.sql_add_user,)
    const key = req.query.key
    console.log(key);
    https.get(`https://api.weixin.qq.com/sns/jscode2session?appid=wx553fb3fbef9809b3&secret=c639daff48f118dc8dc45c4526ae3b89&js_code=${key}&grant_type=authorization_code`, (res) => {
        res.on('data', (d) => {
            bbs.send(d)
        })
        res.on('end', () => {


        })

    })

})

router.get('/cha', (req, res) => {
    req.db.query(sql.sqL_chauser, req.query.key, (err, dataSrt) => {
        console.log(err);
        if (dataSrt) {
            if (dataSrt.length > 0) {
                res.send(dataSrt)
            } else {
                res.send('0')
            }

        }
        console.log(dataSrt);
    })
})
router.get('/add', (req, res) => {
    const obj = req.query
    console.log(obj);
    function randomNum(minNum, maxNum) {
        switch (arguments.length) {
            case 1:
                return parseInt(Math.random() * minNum + 1, 10);
                break;
            case 2:
                return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
                break;
            default:
                return 0;
                break;
        }
    }

    req.db.query(sql.sql_add_user, [obj.time, obj.username, obj.avatarUrl, obj.sex, obj.key, randomNum(0, 100000000000)], (err, datastr) => {
        console.log(err);
        if (datastr) {
            res.send('1')
        }
    })
})
router.post('/add_dt', multer({ dest: 'video' }).single('file'), (req, res) => {

    fs.renameSync(req.file.path, `video/${req.file.originalname}`)

    let videoUrl = `http://www.leyue.xyz/img/${req.file.originalname}`;


    let imageData = fs.readFileSync(`video/${req.file.originalname}`)//获取文件
    let imageDataToBase64 = imageData.toString('base64')//转为base64放入数组

    client.imageCensorUserDefined(imageDataToBase64, 'base64').then(function (data) {
        console.log('<imageCensorUserDefined>: ' + JSON.stringify(data));
        data.videoUrl = videoUrl
        res.send(data)
    }, function (e) {
        console.log(e)
    });
})
router.get('/add_aid', (req, res) => {
    const obj = req.query
    const str = obj.title + obj.content_mc_article
    client.textCensorUserDefined(str).then(function (data) {

        if (data.conclusion == '合规') {

            req.db.query(sql.sql_add_wen, [0, obj.user_id, obj.content_mc_article, obj.title, obj.article_resource, obj.article_type, Date.now(), obj.article_banner], (err, dataSrt) => {
                console.log(err);
                if (dataSrt) {
                    res.send('1')
                }
            })
        } else {
            res.send(data)
        }

    }, function (e) {
        console.log(e);
        res.send(e)
    });

})
router.get('/search_dt', (req, res) => {


    let limit
    req.db.query(sql.sql_userdian, req.query.user, (err, dataStr) => {

        userd = dataStr
    })
    if (req.query.i == 0) {
        limit = sql.sql_search_dt
        console.log(888);
    } else if (req.query.i == 1) {
        console.log(9999);
        limit = sql.sql_search_dtasc
    } else if (req.query.i == 2) {
        limit = sql.sql_search_rm
        console.log(00);
    }
    req.db.query(limit, [req.query.user, req.query.user, `%${req.query.text}%`, `%${req.query.text}%`, parseInt(req.query.limit)], (err, dataStry) => {
        const arr = []
        console.log(err);

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
router.get('/search_user', (req, res) => {
    const obj = req.query
    req.db.query(sql.sql_search_user, [`%%${obj.text}%`, `%%${obj.text}%`], (err, dataStr) => {
        if (dataStr) {
            res.send(dataStr)
        }
    })
})
router.get('/datunm', (req, res) => {
    req.db.query(sql.sql_datumt, req.query.user, (err, dataSrt) => {
        console.log(err);
        console.log(dataSrt);
        if (dataSrt) {
            res.send(dataSrt)
        }
    })
})
router.get('/updata_user', (req, res) => {
    const obj = req.query
    console.log(obj);
    const str = obj.username + obj.headline
    client.textCensorUserDefined(str).then(function (data) {
        console.log(data);
        if (data.conclusion == '合规') {
            console.log(45);
            req.db.query(sql.sql_chonfu_zh, obj.user_zh, (err, datastr) => {
                if (datastr.length == 0 || obj.yuser == 1) {
                    if (obj.tf == 0) {
                        console.log(8888);
                        req.db.query(sql.sql_update_users, [obj.username, obj.headline, obj.user_sex, parseInt(obj.user_zh), obj.user_id], (err, datastr) => {
                            console.log(err);
                            console.log(datastr);

                            res.send('1')

                        })
                    } else {
                        req.db.query(sql.sql_updata_users_img, [obj.username, obj.headline, obj.user_sex, parseInt(obj.user_zh), obj.avatar, obj.user_id], (err, datastr) => {
                            console.log(err);
                            console.log(datastr);
                            res.send(datastr)

                        })
                    }
                } else {
                    res.send('0')
                }
            })

        } else {
            res.send(data)
        }

    }, function (e) {
        console.log(e);
        res.send(e)
    });



})
router.get('/bai_text', (req, res) => {
    const obj = req.query
    const str = obj.text + obj.title
    client.textCensorUserDefined(str).then(function (data) {

        if (data.conclusion == '合规') {

            res.send('1')
        } else {
            res.send(data)
        }

    }, function (e) {
        console.log(e);
        res.send(e)
    });
})












router.post('/video', multer({ dest: 'img' }).single('file'), (req, res) => {
    console.log(req.file.path);
    console.log('文件名', req.file);
    fs.renameSync(req.file.path, `img/${req.file.originalname}`)

    let videoName = 'name';
    let videoUrl = `http://www.leyue.xyz/img/${req.file.originalname}`;

    let extId = 'id';
    client.videoCensorUserDefined(videoName, videoUrl, extId).then(function (data) {
        console.log('<imageCensorUserDefined>: ' + JSON.stringify(data));

        const video = JSON.parse(data)
        const obj = {
            a: 0,
            video,
            videoUrl
        }
        if (video.msg = '未命中视频黑库') {
            obj.a = 1
            res.send(obj)
        } else {
            res.send(obj)

        }
    }, function (e) {

    });
})

router.post('/setvideo', (req, res) => {


})
router.get('/syss', multer({ dest: 'img' }).single('file'), (req, res) => {
    fs.renameSync(req.file.path, `img/${req.file.originalname}`)



    let imageData = fs.readFileSync(`img/${req.file.originalname}`)//获取文件
    res.send(imageData)
})

router.get('/leyue_root_enter', (req, res) => {
    req.db.query(sql.sql_root_enter, req.query.user, (err, dataStr) => {
        if (dataStr.length > 0) {
            res.send(dataStr)
        } else {
            res.send('0')
        }
    })
})
router.get('/root_report', (req, res) => {
    const i = req.query.i
    let lei
    if (i == 0) {
        lei = sql.sql_look_reqpote
    } else if (i == 1) {
        lei = sql.sql_jb_pl
    }
    req.db.query(lei, (err, dataStr) => {
        res.send(dataStr)
    })
})
router.get('/ju_dt_t', (req, res) => {
    const obj = req.query

    console.log(obj);
    if (obj.tf == 11) {
        req.db.query(sql.sql_ju_db_t, [obj.user, obj.wen_id, Date.now(), 4], (err, dataSrt) => {
        })
        req.db.query(sql.sql_ju_db_t, [obj.mid, obj.wen_id, Date.now(), 10], (err, dataSrt) => {
        })
        req.db.query(sql.sql_delt_a, obj.wen_id, (err, dataSrt) => {
        })
        req.db.query(sql.sql_jb_dtf, [obj.ben_user, 1, obj.jb_id], (err, dataSrt) => { })
        res.send('1')
    } else if (obj.tf == 10) {
        req.db.query(sql.sql_ju_db_t, [obj.user, obj.wen_id, Date.now(), 5], (err, dataSrt) => {
        })
        req.db.query(sql.sql_jb_dtf, [obj.ben_user, 2, obj.jb_id], (err, dataSrt) => { })
        res.send('1')
    } else if (obj.tf == 21) {
        req.db.query(sql.sql_ju_pl_t, [obj.user, obj.wen_id, Date.now(), 6, obj.c_id], (err, dataSrt) => {
        })
        req.db.query(sql.sql_jb_dtf, [obj.ben_user, 1, obj.jb_id], (err, dataSrt) => { })
        req.db.query(sql.sql_ju_pl_t, [obj.mid, obj.wen_id, Date.now(), 11, obj.c_id], (err, dataSrt) => {
        })
        req.db.query(sql.sql_pk_up, obj.c_id, (err) => { console.log('kkkk', err, obj.c_id); })
        req.db.query(sql.sql_pinglunsum, obj.wen_id, (err, dataStr) => {
            let i = dataStr[0].comment_count
            i--
            console.log(i);
            req.db.query(sql.sql_setpinglunsum, [i, obj.wen_id], (err, data) => {
                console.log(err, data, i);
            })
        })
        res.send('1')
    } else if (obj.tf == 20) {
        req.db.query(sql.sql_ju_pl_t, [obj.user, obj.wen_id, Date.now(), 7, obj.c_id], (err, dataSrt) => {
        })
        req.db.query(sql.sql_jb_dtf, [obj.ben_user, 2, obj.jb_id], (err, dataSrt) => { })
        res.send('1')
    }
})

router.get('/root_cao', (req, res) => {
    let lei
    const i = req.query.i
    console.log(i);
    if (i == 0) {
        lei = sql.sql_cha_cao
    } else if (i == 1) {
        lei = sql.sql_cha_pl
    }
    req.db.query(lei, (err, dataStr) => {
        res.send(dataStr)
    })
})

router.get('/root_h_dt', (req, res) => {
    const i = parseInt(req.query.i)


    if (i == 0) {
        const arr = []
        req.db.query(sql.sql_userdian, req.query.user, (err, dataStr) => {
            userd = dataStr
            req.db.query(sql.sql_cha_del_dt, [req.query.user, req.query.user], (err, dataStry) => {



                if (req.query.user) {
                    console.log('看长度222', dataStry);
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
    } else {
        req.db.query(sql.sql_huif_jbp, (err, datastr) => {
            res.send(datastr)
        })
    }
})

router.get('/hui_dt', (req, res) => {
    const obj = req.query
    req.db.query(sql.sql_huif_dt, obj.aid, () => { })
    req.db.query(sql.sql_huif_jub, obj.ju_id, () => { })
    req.db.query(sql.sql_ju_db_t, [obj.user, obj.aid, Date.now(), 13], (err, data) => {
        console.log(err);
        console.log(data);
    })
})


router.get('/hui_pl', (req, res) => {
    const obj = req.query
    req.db.query(sql.sql_huifu_pl, obj.cid, (err, data) => {
        console.log(err);
        console.log(data);
    })
    req.db.query(sql.sql_huifu_jubp, obj.cid, (err, data) => {
        console.log(err);
        console.log(data);
    })
    req.db.query(sql.sql_ju_db_t, [obj.user, obj.aid, Date.now(), 13], (err, data) => {
        console.log(err);
        console.log(data);
    })
    res.send('1')
})
router.get('/tj', (req, res) => {
    const obj = {}
    req.db.query(sql.sql_tj_user, (err, dataSrt) => {
        obj.user_sum = dataSrt[0].user_sum
        req.db.query(sql.sql_tj_dh_zong, (err, dataStr) => {
            obj.dh_sum = dataStr[0].letter_sum
            req.db.query(sql.sql_tj_dh_y, (err, dataStrr) => {
                obj.dh_y = dataStrr[0].letter_y
                req.db.query(sql.sql_tj_wen_sum, (err, dataStr) => {
                    obj.wen_sum = dataStr[0].wen_sum
                    req.db.query(sql.sql_tj_wen_z, (err, datas) => {
                        obj.wen_z = datas[0].wen_z
                        req.db.query(sql.sql_tj_ping_sum, (err, datas) => {
                            obj.ping_sum = datas[0].ping_sum
                            res.send(obj)
                        })
                    })
                })
            })
        })
    })
})
router.get('/admin_look', (req, res) => {
    req.db.query(sql.sql_look_roots, (err, dataSrt) => {
        res.send(dataSrt)
    })
})
router.get('/up_root', (req, res) => {
    console.log(req.query);
    const obj = req.query
    req.db.query(sql.sql_up_root, [obj.lei, obj.user], (err, data) => {
        res.send(data)
    })
})
router.get('/del_root', (req, res) => {
    req.db.query(sql.sql_del_root, req.query.user, (err, data) => {
        res.send(data)
    })
})
router.get('/add_root', (req, res) => {
    console.log(req.query);
    req.db.query(sql.sql_add_root, req.query.user, (err, data) => {
        console.log(err);
        res.send('1')
    })
})





router.get('/updatamy', (req, res) => {
    const obj = {}
    req.db.query(sql.sql_my_lian, (err, data) => {
        obj.qdlian = data
        req.db.query(sql.sql_my_zui, (err, data) => {
            obj.zui = data
            req.db.query(sql.sql_my_look, (err, data) => {
                obj.look = data
                res.send(obj)
            })
        })
    })
})
router.get('/chaotime', (req, res) => {
    const time = parseInt(req.query.time)
    console.log(7777);
    req.db.query(sql.sql_my_up_chao, time, (err, data) => {
        console.log(err);
        console.log(data);
        if (data) {
            req.db.query(sql.sql_my_up_chaotwo, time, (err, data) => {
                console.log(err);
                console.log(data);
                if (data) {
                    res.send('ok')
                }
            })
        }
    })
})
router.get('/zuidalian', (req, res) => {
    const max = parseInt(req.query.zui)

    req.db.query(sql.sql_my_set_lianzuid, max, (err, data) => {
        if (data) {
            res.send('ok')
        }
    })
})

module.exports = router