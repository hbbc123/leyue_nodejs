const router = require("./home")

function alist(id, user, req, res, sql) {
    let num = []
    req.db.query(sql.sql_quanbupinglun, id, (err, dataStr) => {
        const arr = dataStr
        let big = []
        if (req.query.he != 0) {
            arr.forEach((val, k) => {
                arr[k].son = []
            })
            req.db.query(sql.sql_userdianss, user, (err, dataStr) => {
                big = dataStr
            })



            req.db.query(sql.sql_look_qb, [id, id], (err, dataStrr) => {

                num = dataStrr
                arr.forEach((val, k) => {
                    num.forEach(son => {
                        if (val.comment_id == son.reply_commentid) {
                            arr[k].son.push(son)
                        }
                    })
                })
                if (big.length > 1) {
                    console.log('_______', arr);
                    console.log('________', big);
                    arr.forEach((val, k) => {
                        big.forEach(son => {
                            if (val.comment_id == son.pinglun_id && son.dianz_lei == 1) {
                                arr[k].pinglun_love = 1
                            } else {

                                if (arr[k].pinglun_love == 1) { } else { arr[k].pinglun_love = 0 }

                            }
                        })
                    })
                }
                res.send(arr)
            })
        } else {
            res.send('123')
        }
    })
}


function dianz(obj, sql, res, req) {
    console.log(req.query);
    if (parseInt(obj.tf)) {
        console.log('点赞');
        req.db.query(sql.sql_dianz, [obj.user, obj.wid, obj.wid, obj.lei, obj.mbuser], (err, dataStr) => {
            if (!parseInt(obj.lei)) {
                console.log(9999999);
                req.db.query(sql.sql_wendian, obj.wid, (err, dataStrr) => {
                    req.db.query(sql.sql_diansumuser, obj.wid, (err, dataSt) => {
                        let he = dataSt[0].user_dian
                        he++
                        if (dataSt) {
                            req.db.query(sql.sql_setdiansumuser, [he, dataSt[0].user_id], (err, dataStrrrr) => {

                            })
                        }
                    })
                    if (dataStrr[0]) {
                        let sum = dataStrr[0].vote_up_count
                        console.log(dataStrr[0].vote_up_count);
                        sum++
                        req.db.query(sql.sql_wendianset, [sum, obj.wid], (err, dataStrrr) => {
                            if (dataStrrr) {

                                req.db.query(sql.sql_setinformwd, [obj.mbuser, obj.user, obj.wid, Date.now()], (err, da) => {
                                    console.log(err);
                                    if (da) {
                                        res.send('点赞成功')
                                    }
                                })

                            }
                        })
                    } else {
                        res.send('点赞失败')
                    }
                })
            } else {
                req.db.query(sql.sql_csum, obj.wid, (err, dataStrrr) => {
                    if (dataStrrr[0]) {
                        let sum = dataStrrr[0].vote_up_counts
                        console.log('12312', sum);
                        sum++
                        console.log('看看obj的数据', obj);
                        req.db.query(sql.sql_setpinglun, [sum, obj.wid], (err, dataStrrr) => {
                            if (dataStrrr) {
                                req.db.query(sql.sql_setinformpl, [obj.mbuser, obj.user, obj.aid, obj.wid, Date.now()], (err, da) => {
                                    console.log(err);
                                    if (da) {
                                        res.send('点赞成功')
                                    }
                                })

                            }
                        })
                    } else {
                        res.send('点赞失败')

                    }
                })

            }
        })
    } else {
        console.log('取消');
        if (!parseInt(obj.lei)) {

            req.db.query(sql.sql_qxdianz, [obj.user, obj.wid, obj.lei], (err, dataStr) => {
                req.db.query(sql.sql_wendian, obj.wid, (err, dataStrr) => {
                    if (dataStrr[0]) {
                        let sum = dataStrr[0].vote_up_count
                        sum--
                        req.db.query(sql.sql_wendianset, [sum, obj.wid], (err, dataStrrr) => {
                            req.db.query(sql.sql_diansumuser, obj.wid, (err, dataSt) => {
                                let he = dataSt[0].user_dian
                                he--
                                if (dataSt) {
                                    req.db.query(sql.sql_setdiansumuser, [he, dataSt[0].user_id], (err, dataStrrrr) => {
                                        console.log(454545);
                                    })
                                }
                            })
                            if (dataStrrr) {
                                res.send('取消点赞成功')
                            }
                        })
                    } else {
                        res.send('取消点赞失败')

                    }
                })
            })
        } else {
            req.db.query(sql.sql_delcomentdian, [obj.user, obj.wid], (err, dataSt) => {
                if (dataSt) {
                    req.db.query(sql.sql_csum, obj.wid, (err, dataStrrr) => {
                        if (dataStrrr[0]) {
                            let sum = dataStrrr[0].vote_up_counts
                            console.log(sum);
                            sum--

                            req.db.query(sql.sql_setpinglun, [sum, obj.wid], (err, dataStrrr) => {
                                if (dataStrrr) {
                                    res.send('取消点赞')
                                }
                            })
                        } else {
                            res.send('取消点赞失败')

                        }
                    })

                }

            })


        }
    }
}


module.exports = {
    alist,
    dianz,
}