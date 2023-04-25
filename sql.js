module.exports = {
    sql_banner: `
    SELECT * FROM mc_banner
    `, //获取banner数据
    sql_list: ` 
    SELECT *
    FROM (
    SELECT  uu.user_id,username,avatar,PASSWORD,last_login_time,b.follower_count,followee_count,following_article_count,notification_unread,inbox_unread,headline,user_state,user_sex,article_id,title,content_mc_article,article_resource,article_type,comment_count,vote_up_count,vote_down_count,create_time,article_state,article_banner,comment_id,commentable_id,comment_user_id,content,vote_up_counts,vote_down_counts,create_times,comment_state,plname,plimg
        FROM mc_user  uu JOIN (
                    SELECT *
                    FROM mc_article a LEFT JOIN (
                                    SELECT  m1.comment_id,m1.commentable_id,m1.comment_user_id,m1.content,m1.vote_up_counts,m1.vote_down_counts,m1.create_times,m1.comment_state ,username 'plname',avatar 'plimg'
                                    FROM  mc_comment m1 LEFT JOIN (
                                                    SELECT *
                                                    FROM  mc_comment m5 JOIN mc_user u ON m5.comment_user_id=u.user_id
                                                    WHERE comment_state=1
                                                    ORDER BY vote_up_counts DESC
                                                    )m2 ON m1.comment_id=m2.comment_id 
        
        
                                    )  c ON c.commentable_id=a.article_id
                                  
                                    ORDER BY article_id DESC
                    ) b ON uu.user_id=b.user_id 
        GROUP BY article_id 
        ORDER BY article_id DESC
    )aaa LEFT JOIN (
        SELECT wen_id,duser_id dquserid
    FROM mc_dianz
    WHERE duser_id=? AND dianz_lei=0 
    ) bbb ON aaa.article_id=bbb.wen_id LEFT JOIN (
             
        SELECT pinglun_id,duser_id 
    FROM mc_dianz
    WHERE duser_id=? AND dianz_lei=1
    )hhhh ON aaa.comment_id=hhhh.pinglun_id
    WHERE article_state=1  AND article_banner!=1
    GROUP BY article_id
    LIMIT ?,5
`,// 获取动态并显示热门评论
    sql_quanbupinglun: `SELECT *
    FROM mc_comment c  JOIN (
    SELECT user_id,username,avatar
    FROM mc_user
    
    )u ON c.comment_user_id=u.user_id
    WHERE c.commentable_id=? AND c.comment_state=1`, //获取该动态的评论
    sql_qunabuhuifu: `
SELECT *
FROM mc_reply
WHERE commentable_id = ?
ORDER BY create_time ASC`,
    sql_userdianss: `
SELECT *
FROM mc_dianz
WHERE duser_id=?`,//获取用户点赞列表
    sql_look_z: `
    SELECT *
    FROM (
      SELECT user_id,username,avatar
    FROM mc_user
    )aaa  JOIN (
    SELECT *
    FROM (
        SELECT *
    FROM mc_article a LEFT JOIN (
        SELECT love_mbuser
    FROM mc_love
    WHERE love_user=?
    ) b ON a.article_id=b.love_mbuser WHERE a.article_id=?
    ) aa LEFT JOIN (
     SELECT wen_id
    FROM mc_dianz
    WHERE duser_id=? AND dianz_lei=0 AND wen_id=?
    )bb ON aa.article_id=bb.wen_id   
    )  bbb ON aaa.user_id=bbb.user_id
`, //动态发布用户详情
    sql_look_qb: `
SELECT *
FROM (
	SELECT u.user_id AS user_idmbiao,r.create_time,u.username usernamembiao,r.reply_id,r.reply_commentid
	FROM mc_reply  r  JOIN (
				SELECT username,user_id
				FROM mc_user
				) u ON u.user_id=r.reply_targetid
				WHERE commentable_id = ?
				ORDER BY create_time ASC
				) o JOIN (

				SELECT r.content,u.user_id AS user_idfq,r.create_time,u.username usernamefq,r.reply_id
				FROM mc_reply  r LEFT JOIN (
								SELECT username,user_id
								FROM mc_user
								) u ON u.user_id=r.user_id
	WHERE commentable_id = ?
	ORDER BY create_time ASC


)b ON  o.reply_id=b.reply_id 
`,//获取全部评论及回复点赞
    sql_huidong: `
INSERT INTO mc_comment VALUES (
    0,
    ?,
    ?,
    ?,
    0,
    0,
    ?,
    1
    )`,//回复动态
    sql_pinglunsum: `
SELECT comment_count
FROM mc_article
WHERE article_id=?`,//获取文章回复数
    sql_setpinglunsum: `
    UPDATE  mc_article SET comment_count=? WHERE article_id=?
    `,//修改文章回复数量
    sql_huifupl: `
    INSERT INTO mc_reply VALUES(
        0,?,?,?,?,?,0,0,?,1
        )`,//回复评论
    sql_dianz: `
        INSERT INTO mc_dianz
VALUES(
0,?,?,?,?,?
)`,//点赞
    sql_qxdianz: `
DELETE FROM mc_dianz WHERE duser_id=?  AND wen_id=? AND dianz_lei=?
`,//删除点赞
    sql_wedenglook: `
SELECT * 
FROM mc_article
WHERE article_id=`,//未登录用户查看动态
    sql_wendian: `SELECT vote_up_count
    FROM mc_article
    WHERE article_id=?`,//获取文章点赞数量
    sql_wendianset: `
    UPDATE mc_article SET vote_up_count=? WHERE article_id=?
    `,//更改文章点赞数量
    sql_csum: `SELECT vote_up_counts
FROM  mc_comment
WHERE comment_id=?`,//评论的赞数
    sql_setpinglun: `
UPDATE mc_comment SET vote_up_counts=? WHERE comment_id=?
`,
    sql_delcomentdian: `
    DELETE  FROM mc_dianz WHERE duser_id=? AND pinglun_id=? AND dianz_lei=1`,//删除评论点赞
    sql_delove: `DELETE  FROM mc_love WHERE love_user=? AND love_mbuser=?`,//删除收藏
    sql_loveadd: `INSERT INTO mc_love VALUES(0,?,?,?)`,//添加收藏
    sql_lovesum: `SELECT follower_count
    FROM mc_article
    WHERE article_id=?`,//查看文章的收藏数量
    sql_setlvoesum: `UPDATE mc_article SET follower_count=? WHERE article_id=?`,//修改文章收藏数量
    sql_lookuserd: `
    SELECT *
    FROM (
    SELECT  uu.user_id,username,avatar,PASSWORD,last_login_time,b.follower_count,followee_count,following_article_count,notification_unread,inbox_unread,headline,user_state,user_sex,article_id,title,content_mc_article,article_resource,article_type,comment_count,vote_up_count,vote_down_count,create_time,article_state,article_banner,comment_id,commentable_id,comment_user_id,content,vote_up_counts,vote_down_counts,create_times,comment_state,plname,plimg
        FROM mc_user  uu JOIN (
                    SELECT *
                    FROM mc_article a LEFT JOIN (
                                    SELECT  m1.comment_id,m1.commentable_id,m1.comment_user_id,m1.content,m1.vote_up_counts,m1.vote_down_counts,m1.create_times,m1.comment_state ,username 'plname',avatar 'plimg'
                                    FROM  mc_comment m1 LEFT JOIN (
                                                    SELECT *
                                                    FROM  mc_comment m5 JOIN mc_user u ON m5.comment_user_id=u.user_id
                                                    WHERE comment_state =1
                                                    ORDER BY vote_up_counts DESC
                                                    )m2 ON m1.comment_id=m2.comment_id 
        
        
                                    )  c ON c.commentable_id=a.article_id
                                  
                                    ORDER BY article_id DESC
                    ) b ON uu.user_id=b.user_id 
        GROUP BY article_id 
        ORDER BY article_id DESC
    )aaa LEFT JOIN (
        SELECT wen_id,duser_id dquserid
    FROM mc_dianz
    WHERE duser_id=? AND dianz_lei=0 
    ) bbb ON aaa.article_id=bbb.wen_id LEFT JOIN (
             
        SELECT pinglun_id,duser_id 
    FROM mc_dianz
    WHERE duser_id=? AND dianz_lei=1
    )hhhh ON aaa.comment_id=hhhh.pinglun_id
    WHERE article_state=1 AND user_id=?
    GROUP BY article_id
    `,//查看用户发表的动态
    sql_loveuser: `
    SELECT *
  FROM (
    SELECT *
    FROM (
    SELECT  uu.user_id,username,avatar,PASSWORD,last_login_time,b.follower_count,followee_count,following_article_count,notification_unread,inbox_unread,headline,user_state,user_sex,article_id,title,content_mc_article,article_resource,article_type,comment_count,vote_up_count,vote_down_count,create_time,article_state,article_banner,comment_id,commentable_id,comment_user_id,content,vote_up_counts,vote_down_counts,create_times,comment_state,plname,plimg
        FROM mc_user  uu JOIN (
                    SELECT *
                    FROM mc_article a LEFT JOIN (
                                    SELECT  m1.comment_id,m1.commentable_id,m1.comment_user_id,m1.content,m1.vote_up_counts,m1.vote_down_counts,m1.create_times,m1.comment_state ,username 'plname',avatar 'plimg'
                                    FROM  mc_comment m1 LEFT JOIN (
                                                    SELECT *
                                                    FROM  mc_comment m5 JOIN mc_user u ON m5.comment_user_id=u.user_id
                                                    WHERE comment_state =1
                                                    ORDER BY vote_up_counts DESC
                                                    )m2 ON m1.comment_id=m2.comment_id 
        
        
                                    )  c ON c.commentable_id=a.article_id
                                  
                                    ORDER BY article_id DESC
                    ) b ON uu.user_id=b.user_id 
        GROUP BY article_id 
        ORDER BY article_id DESC
    )aaa LEFT JOIN (
        SELECT wen_id,duser_id dquserid
    FROM mc_dianz
    WHERE duser_id=? AND dianz_lei=0 
    ) bbb ON aaa.article_id=bbb.wen_id LEFT JOIN (
             
        SELECT pinglun_id,duser_id 
    FROM mc_dianz
    WHERE duser_id=? AND dianz_lei=1
    )hhhh ON aaa.comment_id=hhhh.pinglun_id
    WHERE article_state=1  AND article_banner!=1
    
    GROUP BY article_id   ) sss JOIN (
SELECT *
FROM mc_love
WHERE love_user=?    
    ) yyy ON sss.article_id=yyy.love_mbuser  
    `,//查看用户收藏列表
    sql_diansumuser: `SELECT user_dian,username,uu.user_id
    FROM mc_user uu  JOIN (
    SELECT user_id
    FROM mc_article
    WHERE article_id=?
    ) cc ON uu.user_id=cc.user_id`,//获取用户点赞数
    sql_setdiansumuser: `UPDATE mc_user SET user_dian=? WHERE user_id=?`,//修改用户表点赞数
    sql_dianwenuser: `
    SELECT *
    FROM (
    SELECT  uu.user_id,username,avatar,PASSWORD,last_login_time,b.follower_count,followee_count,following_article_count,notification_unread,inbox_unread,headline,user_state,user_sex,article_id,title,content_mc_article,article_resource,article_type,comment_count,vote_up_count,vote_down_count,create_time,article_state,article_banner,comment_id,commentable_id,comment_user_id,content,vote_up_counts,vote_down_counts,create_times,comment_state,plname,plimg
        FROM mc_user  uu JOIN (
                    SELECT *
                    FROM mc_article a LEFT JOIN (
                                    SELECT  m1.comment_id,m1.commentable_id,m1.comment_user_id,m1.content,m1.vote_up_counts,m1.vote_down_counts,m1.create_times,m1.comment_state ,username 'plname',avatar 'plimg'
                                    FROM  mc_comment m1 LEFT JOIN (
                                                    SELECT *
                                                    FROM  mc_comment m5 JOIN mc_user u ON m5.comment_user_id=u.user_id
                                                    WHERE comment_state =1
                                                    ORDER BY vote_up_counts DESC
                                                    )m2 ON m1.comment_id=m2.comment_id 
        
        
                                    )  c ON c.commentable_id=a.article_id
                                   
                                    ORDER BY article_id DESC
                    ) b ON uu.user_id=b.user_id 
        GROUP BY article_id 
        ORDER BY article_id DESC
    )aaa LEFT JOIN (
        SELECT wen_id,duser_id dquserid,dianz_id wdianz_id
    FROM mc_dianz
    WHERE duser_id=? AND dianz_lei=0 
    ) bbb ON aaa.article_id=bbb.wen_id LEFT JOIN (
             
        SELECT pinglun_id,duser_id,dianz_id pdianz_id 
    FROM mc_dianz
    WHERE duser_id=? AND dianz_lei=1
    )hhhh ON aaa.comment_id=hhhh.pinglun_id
 WHERE wen_id IS NOT NULL AND article_state=1
    GROUP BY article_id
    ORDER BY wdianz_id DESC
    `,//获取用户点赞文章
    sql_deluserd: `
    UPDATE mc_article
SET article_state=?
WHERE article_id=?`,//删除用户动态
    sql_delove: `
DELETE FROM mc_love 
WHERE  love_user=? AND love_mbuser=?
`,//取消收藏
    sql_userxx: `   SELECT *
    FROM (
        SELECT username,
    avatar,
    follower_count,
    user_id,
    followee_count,
    headline,
    user_zh,
    user_dian,
    user_sx,
    tz_d,
    tz_p,
    tz_s,
    look_hz,
    look_gz,
    look_fs,
    user_shoutf,
    user_diantf,
    user_fatf
    FROM mc_user
    WHERE user_id=?
    ) aaa LEFT JOIN (
    SELECT mb_user_id
    FROM mc_guanz
    WHERE dq_user_id=?
    )bbb ON aaa.user_id=bbb.mb_user_id LEFT JOIN (SELECT *
    FROM mc_blacklist
    WHERE blacklist_user=? AND blacklist_mbuser=?) ccc ON ccc.blacklist_mbuser=aaa.user_id`,//获取用户信息
    sql_lahei: `SELECT blacklist_user,blacklist_mbuser
FROM mc_blacklist
WHERE blacklist_mbuser=? AND blacklist_user=?`,//拉黑的当前的用户名单
    sql_delcomment: `UPDATE mc_comment SET comment_state=? WHERE comment_id=?`,//删除评论
    sql_userhuoz: `
    SELECT *
    FROM (
    SELECT wen_id,duser_id,pinglun_id,dianz_lei,dianz_id
    FROM mc_dianz
    WHERE mbuser=?
    ) aa LEFT JOIN (
    SELECT article_id,title,comment_count,article_state
    FROM mc_article
    ) bb ON  aa.wen_id=bb.article_id LEFT JOIN (
    SELECT user_id,username,avatar
    FROM mc_user
    ) cc ON aa.duser_id=cc.user_id LEFT JOIN (
    SELECT content,comment_id,comment_user_id
    FROM mc_comment
    ) dd ON aa.pinglun_id=dd.comment_id AND aa.dianz_lei=1 LEFT JOIN (
    SELECT user_id cid,username cusername,avatar cava
    FROM mc_user
    ) ee ON ee.cid=dd.comment_user_id LEFT JOIN (
    SELECT username bename,user_id benid
    FROM mc_user
    WHERE user_id=?
    )ff ON aa.wen_id!=ff.bename||aa.wen_id=ff.bename
    WHERE article_state =1
    ORDER BY dianz_id DESC
    `,//查看用户获赞有文章评论
    sql_huoquguanz: ` 
    SELECT user_id,mb_user_id,guanz_id,guanz_time,avatar,username
FROM mc_user aa  JOIN (
SELECT mb_user_id,guanz_id,guanz_time
FROM mc_guanz
WHERE dq_user_id=?
) bb ON aa.user_id=bb.mb_user_id
    `,//获取关注列表
    sql_delguanzz: `DELETE  FROM mc_guanz
    WHERE guanz_id=?`,//删除关注
    sql_huoquuserguan: `SELECT followee_count
    FROM mc_user
    WHERE user_id=?`,//获取用户关注数量
    sql_setuserguanz: `UPDATE mc_user SET followee_count=? WHERE user_id=?`,//修改用户关注数量
    sql_huoquuserfen: `    SELECT user_id,mb_user_id,guanz_id,guanz_time,avatar,username,dq_user_id
    FROM mc_user aa  JOIN (
    SELECT mb_user_id,guanz_id,guanz_time,dq_user_id
    FROM mc_guanz
    WHERE mb_user_id=?
    ) bb ON aa.user_id=bb.dq_user_id`,//获取用户粉丝
    sql_quanfabiao: `SELECT user_fatf
    FROM mc_user
    WHERE user_id=?`,//用户查看发表权限
    sql_quanuserfabiao: `
    SELECT  uu.user_id,username,avatar,PASSWORD,last_login_time,b.follower_count,followee_count,following_article_count,notification_unread,inbox_unread,headline,user_state,user_sex,article_id,title,content_mc_article,article_resource,article_type,comment_count,vote_up_count,vote_down_count,create_time,article_state,article_banner,comment_id,commentable_id,comment_user_id,content,vote_up_counts,vote_down_counts,create_times,comment_state,plname,plimg
    FROM mc_user  uu JOIN (
                SELECT *
                FROM mc_article a LEFT JOIN (
                                SELECT  m1.comment_id,m1.commentable_id,m1.comment_user_id,m1.content,m1.vote_up_counts,m1.vote_down_counts,m1.create_times,m1.comment_state ,username 'plname',avatar 'plimg'
                                FROM  mc_comment m1 LEFT JOIN (
                                                SELECT *
                                                FROM  mc_comment m5 JOIN mc_user u ON m5.comment_user_id=u.user_id
                                                WHERE comment_state =1
                                                ORDER BY vote_up_counts DESC
                                                )m2 ON m1.comment_id=m2.comment_id 
    
    
                                )  c ON c.commentable_id=a.article_id
                              
                                ORDER BY article_id DESC
                ) b ON uu.user_id=b.user_id 
                WHERE b.user_id=? AND article_banner!=1 AND article_state =1
    GROUP BY article_id 
    ORDER BY article_id DESC
    `,//用户的发表不包括表白墙
    sql_usershoutf: `    SELECT user_shoutf
    FROM mc_user
    WHERE user_id=?`,//查看用户收藏权限
    sql_userdiantf: `
    SELECT user_diantf
    FROM mc_user
    WHERE user_id=?`,//查看用户点赞权限
    sql_banner: `SELECT *
    FROM mc_banner
    WHERE banner_id=?`,//板块详情
    sql_bannerdongt: `
    SELECT *
    FROM (
    SELECT  uu.user_id,username,avatar,PASSWORD,last_login_time,b.follower_count,followee_count,following_article_count,notification_unread,inbox_unread,headline,user_state,user_sex,article_id,title,content_mc_article,article_resource,article_type,comment_count,vote_up_count,vote_down_count,create_time,article_state,article_banner,comment_id,commentable_id,comment_user_id,content,vote_up_counts,vote_down_counts,create_times,comment_state,plname,plimg
        FROM mc_user  uu JOIN (
                    SELECT *
                    FROM mc_article a LEFT JOIN (
                                    SELECT  m1.comment_id,m1.commentable_id,m1.comment_user_id,m1.content,m1.vote_up_counts,m1.vote_down_counts,m1.create_times,m1.comment_state ,username 'plname',avatar 'plimg'
                                    FROM  mc_comment m1 LEFT JOIN (
                                                    SELECT *
                                                    FROM  mc_comment m5 JOIN mc_user u ON m5.comment_user_id=u.user_id
                                                    WHERE comment_state =1
                                                    ORDER BY vote_up_counts DESC
                                                    )m2 ON m1.comment_id=m2.comment_id 
        
        
                                    )  c ON c.commentable_id=a.article_id
                                  
                                    ORDER BY article_id DESC
                    ) b ON uu.user_id=b.user_id 
        GROUP BY article_id 
        ORDER BY article_id DESC
    )aaa LEFT JOIN (
        SELECT wen_id,duser_id dquserid
    FROM mc_dianz
    WHERE duser_id=? AND dianz_lei=0 
    ) bbb ON aaa.article_id=bbb.wen_id LEFT JOIN (
             
        SELECT pinglun_id,duser_id 
    FROM mc_dianz
    WHERE duser_id=? AND dianz_lei=1
    )hhhh ON aaa.comment_id=hhhh.pinglun_id
    WHERE article_state=1  AND article_banner!=1 AND article_banner=?
    GROUP BY article_id 
    LIMIT ?,5`,//获取板块的动态
    sql_banner_nm: `
    SELECT *
    FROM (
    SELECT  uu.user_id,username,avatar,PASSWORD,last_login_time,b.follower_count,followee_count,following_article_count,notification_unread,inbox_unread,headline,user_state,user_sex,article_id,title,content_mc_article,article_resource,article_type,comment_count,vote_up_count,vote_down_count,create_time,article_state,article_banner,comment_id,commentable_id,comment_user_id,content,vote_up_counts,vote_down_counts,create_times,comment_state,plname,plimg
        FROM mc_user  uu JOIN (
                    SELECT *
                    FROM mc_article a LEFT JOIN (
                                    SELECT  m1.comment_id,m1.commentable_id,m1.comment_user_id,m1.content,m1.vote_up_counts,m1.vote_down_counts,m1.create_times,m1.comment_state ,username 'plname',avatar 'plimg'
                                    FROM  mc_comment m1 LEFT JOIN (
                                                    SELECT *
                                                    FROM  mc_comment m5 JOIN mc_user u ON m5.comment_user_id=u.user_id
                                                    WHERE comment_state =1
                                                    ORDER BY vote_up_counts DESC
                                                    )m2 ON m1.comment_id=m2.comment_id 
        
        
                                    )  c ON c.commentable_id=a.article_id
                                  
                                    ORDER BY article_id DESC
                    ) b ON uu.user_id=b.user_id 
        GROUP BY article_id 
        ORDER BY article_id DESC
    )aaa LEFT JOIN (
        SELECT wen_id,duser_id dquserid
    FROM mc_dianz
    WHERE duser_id=1 AND dianz_lei=0 
    ) bbb ON aaa.article_id=bbb.wen_id LEFT JOIN (
             
        SELECT pinglun_id,duser_id 
    FROM mc_dianz
    WHERE duser_id=1 AND dianz_lei=1
    )hhhh ON aaa.comment_id=hhhh.pinglun_id
    WHERE article_state=1  AND article_banner=1 
    GROUP BY article_id 
    ORDER BY create_times  ASC
    LIMIT ?,5`,//获取表白墙的文章
    sql_addguan: `INSERT INTO mc_guanz
    VALUES 
    (
    0,
    ?,
    ?,
    ?
    )`,//添加关注
    sql_delguanz: `DELETE FROM mc_guanz WHERE  dq_user_id=?`,//删除关注
    sql_lookusersx: `SELECT user_sx
    FROM mc_user
    WHERE user_id=?`,//查看目标用户的私信权限
    swl_tongz: `SELECT *
    FROM (
    SELECT *
        FROM mc_letter
        WHERE letter_mbuser=? AND letter_state=0
    ) a JOIN (
     SELECT username,user_id
     FROM mc_user
    ) b ON   a.letter_user=b.user_id`,//查看该用户未读通知
    sql_rootduiimgs: `SELECT avatar
FROM mc_user
WHERE user_id=?`,//获取登录用户的头像
    sql_userlistimg: `    SELECT user_id,username,avatar,
    letter_id,
    letter_user,
    letter_mbuser,
    letter_title,
    letter_time,
    letter_ytime,
    letter_state,
    letter_in,
    letter_avatary,
    letter_lei
    FROM mc_user c JOIN (
        SELECT *
        FROM mc_letter
        WHERE letter_user =? AND letter_mbuser=?
    )  d ON c.user_id=d.letter_user
    
    ORDER BY letter_id DESC
    LIMIT 0,1`,//获取用户私信列表用户头像
    sql_updataxx: `UPDATE mc_letter SET letter_state=1 WHERE letter_id=?`,//更改信息状态
    sql_xieruhuifu: `INSERT INTO  mc_letter VALUES (?,?,?,?,?,?,?,?,?,?)`,//私信回复
    sql_userlisetimgtwo: `   SELECT user_id,username,avatar,
    letter_id,
    letter_user,
    letter_mbuser,
    letter_title,
    letter_time,
    letter_ytime,
    letter_state,
    letter_in,
    letter_avatary,
    letter_lei
    FROM mc_user c JOIN (
        SELECT *
        FROM mc_letter
        WHERE 
        letter_mbuser =? AND letter_user=?
    )  d ON c.user_id=d.letter_mbuser
    
    ORDER BY letter_id DESC
    LIMIT 0,1`,//获取用户私信列表头像二
    sql_huoloveguan: `SELECT *
    FROM mc_letter
    WHERE letter_mbuser=? AND letter_user=?`,//获取双方是否都有回复
    sql_sxcs: `    SELECT COUNT(count_user) js
    FROM  mc_count
    WHERE count_user=? AND count_mbuser=?`,//查看发送用户对目标用户的私信次数
    sql_sql_addcount: ` INSERT INTO mc_count VALUES(0,?,?)`,//添加用户回复次数
    sql_lahebibiao: `   SELECT COUNT(*) lh
    FROM mc_blacklist
    WHERE blacklist_user=? AND blacklist_mbuser=?`,//查看用户是否被拉黑
    sql_lisetime: `
    SELECT *
    FROM (
    SELECT  uu.user_id,username,avatar,PASSWORD,last_login_time,b.follower_count,followee_count,following_article_count,notification_unread,inbox_unread,headline,user_state,user_sex,article_id,title,content_mc_article,article_resource,article_type,comment_count,vote_up_count,vote_down_count,create_time,article_state,article_banner,comment_id,commentable_id,comment_user_id,content,vote_up_counts,vote_down_counts,create_times,comment_state,plname,plimg
        FROM mc_user  uu JOIN (
                    SELECT *
                    FROM mc_article a LEFT JOIN (
                                    SELECT  m1.comment_id,m1.commentable_id,m1.comment_user_id,m1.content,m1.vote_up_counts,m1.vote_down_counts,m1.create_times,m1.comment_state ,username 'plname',avatar 'plimg'
                                    FROM  mc_comment m1 LEFT JOIN (
                                                    SELECT *
                                                    FROM  mc_comment m5 JOIN mc_user u ON m5.comment_user_id=u.user_id
                                                    WHERE comment_state =1
                                                    ORDER BY vote_up_counts DESC
                                                    )m2 ON m1.comment_id=m2.comment_id 
        
        
                                    )  c ON c.commentable_id=a.article_id
                                  
                                    ORDER BY article_id DESC
                    ) b ON uu.user_id=b.user_id 
        GROUP BY article_id 
        ORDER BY article_id DESC
    )aaa LEFT JOIN (
        SELECT wen_id,duser_id dquserid
    FROM mc_dianz
    WHERE duser_id=? AND dianz_lei=0 
    ) bbb ON aaa.article_id=bbb.wen_id LEFT JOIN (
             
        SELECT pinglun_id,duser_id 
    FROM mc_dianz
    WHERE duser_id=? AND dianz_lei=1
    )hhhh ON aaa.comment_id=hhhh.pinglun_id
    WHERE article_state=1  AND article_banner!=1
    GROUP BY article_id
    ORDER BY create_time ASC
    LIMIT ?,5
    `,//首页列表事件正序
    slq_remlist: `
    SELECT *
    FROM (
    SELECT  uu.user_id,username,avatar,PASSWORD,last_login_time,b.follower_count,followee_count,following_article_count,notification_unread,inbox_unread,headline,user_state,user_sex,article_id,title,content_mc_article,article_resource,article_type,comment_count,vote_up_count,vote_down_count,create_time,article_state,article_banner,comment_id,commentable_id,comment_user_id,content,vote_up_counts,vote_down_counts,create_times,comment_state,plname,plimg
        FROM mc_user  uu JOIN (
                    SELECT *
                    FROM mc_article a LEFT JOIN (
                                    SELECT  m1.comment_id,m1.commentable_id,m1.comment_user_id,m1.content,m1.vote_up_counts,m1.vote_down_counts,m1.create_times,m1.comment_state ,username 'plname',avatar 'plimg'
                                    FROM  mc_comment m1 LEFT JOIN (
                                                    SELECT *
                                                    FROM  mc_comment m5 JOIN mc_user u ON m5.comment_user_id=u.user_id
                                                    WHERE comment_state =1 
                                                    ORDER BY vote_up_counts DESC
                                                    )m2 ON m1.comment_id=m2.comment_id 
        
        
                                    )  c ON c.commentable_id=a.article_id
                                  
                                    ORDER BY article_id DESC
                    ) b ON uu.user_id=b.user_id 
        GROUP BY article_id 
        ORDER BY article_id DESC
    )aaa LEFT JOIN (
        SELECT wen_id,duser_id dquserid
    FROM mc_dianz
    WHERE duser_id=? AND dianz_lei=0 
    ) bbb ON aaa.article_id=bbb.wen_id LEFT JOIN (
             
        SELECT pinglun_id,duser_id 
    FROM mc_dianz
    WHERE duser_id=? AND dianz_lei=1
    )hhhh ON aaa.comment_id=hhhh.pinglun_id
    WHERE article_state=1  AND article_banner!=1
    GROUP BY article_id
    ORDER BY vote_up_count DESC
    LIMIT ?,5
    `,//首页列表热门排序
    sql_bannerzhengxu: `
    SELECT *
    FROM (
    SELECT  uu.user_id,username,avatar,PASSWORD,last_login_time,b.follower_count,followee_count,following_article_count,notification_unread,inbox_unread,headline,user_state,user_sex,article_id,title,content_mc_article,article_resource,article_type,comment_count,vote_up_count,vote_down_count,create_time,article_state,article_banner,comment_id,commentable_id,comment_user_id,content,vote_up_counts,vote_down_counts,create_times,comment_state,plname,plimg
        FROM mc_user  uu JOIN (
                    SELECT *
                    FROM mc_article a LEFT JOIN (
                                    SELECT  m1.comment_id,m1.commentable_id,m1.comment_user_id,m1.content,m1.vote_up_counts,m1.vote_down_counts,m1.create_times,m1.comment_state ,username 'plname',avatar 'plimg'
                                    FROM  mc_comment m1 LEFT JOIN (
                                                    SELECT *
                                                    FROM  mc_comment m5 JOIN mc_user u ON m5.comment_user_id=u.user_id
                                                    WHERE comment_state =1
                                                    ORDER BY vote_up_counts DESC
                                                    )m2 ON m1.comment_id=m2.comment_id 
        
        
                                    )  c ON c.commentable_id=a.article_id
                                  
                                    ORDER BY article_id DESC
                    ) b ON uu.user_id=b.user_id 
        GROUP BY article_id 
        ORDER BY article_id DESC
    )aaa LEFT JOIN (
        SELECT wen_id,duser_id dquserid
    FROM mc_dianz
    WHERE duser_id=? AND dianz_lei=0 
    ) bbb ON aaa.article_id=bbb.wen_id LEFT JOIN (
             
        SELECT pinglun_id,duser_id 
    FROM mc_dianz
    WHERE duser_id=? AND dianz_lei=1
    )hhhh ON aaa.comment_id=hhhh.pinglun_id
    WHERE article_state=1  AND article_banner!=1 AND article_banner=?
    GROUP BY article_id
    ORDER BY create_time ASC
    LIMIT ?,5
    `,//板块时间正序
    sql_bannerrm: `
    SELECT *
    FROM (
    SELECT  uu.user_id,username,avatar,PASSWORD,last_login_time,b.follower_count,followee_count,following_article_count,notification_unread,inbox_unread,headline,user_state,user_sex,article_id,title,content_mc_article,article_resource,article_type,comment_count,vote_up_count,vote_down_count,create_time,article_state,article_banner,comment_id,commentable_id,comment_user_id,content,vote_up_counts,vote_down_counts,create_times,comment_state,plname,plimg
        FROM mc_user  uu JOIN (
                    SELECT *
                    FROM mc_article a LEFT JOIN (
                                    SELECT  m1.comment_id,m1.commentable_id,m1.comment_user_id,m1.content,m1.vote_up_counts,m1.vote_down_counts,m1.create_times,m1.comment_state ,username 'plname',avatar 'plimg'
                                    FROM  mc_comment m1 LEFT JOIN (
                                                    SELECT *
                                                    FROM  mc_comment m5 JOIN mc_user u ON m5.comment_user_id=u.user_id
                                                    WHERE comment_state =1
                                                    ORDER BY vote_up_counts DESC
                                                    )m2 ON m1.comment_id=m2.comment_id 
        
        
                                    )  c ON c.commentable_id=a.article_id
                                  
                                    ORDER BY article_id DESC
                    ) b ON uu.user_id=b.user_id 
        GROUP BY article_id 
        ORDER BY article_id DESC
    )aaa LEFT JOIN (
        SELECT wen_id,duser_id dquserid
    FROM mc_dianz
    WHERE duser_id=? AND dianz_lei=0 
    ) bbb ON aaa.article_id=bbb.wen_id LEFT JOIN (
             
        SELECT pinglun_id,duser_id 
    FROM mc_dianz
    WHERE duser_id=? AND dianz_lei=1
    )hhhh ON aaa.comment_id=hhhh.pinglun_id
    WHERE article_state=1  AND article_banner!=1 AND article_banner=?
    GROUP BY article_id
    ORDER BY vote_up_count DESC
    LIMIT ?,5
    `,//板块热门排序
    sql_tzroot: `SELECT tz_p,tz_d,tz_s
    FROM mc_user 
    WHERE user_id=?`,//获取用户的通知权限
    sql_tz: `    SELECT c.notification_id,c.receiver_id,c.sender_id,c.wen_id,c.question_id,c.answer_id,c.cjian_time,c.read_time,c.notification_state,article_id,
    title,content_mc_article,article_resource,article_type,comment_count,follower_count,vote_up_count,vote_down_count,create_time,
    article_state,article_banner,comment_id,commentable_id,comment_user_id,content,vote_up_counts,vote_down_counts,create_times,comment_state,username,e.user_id

    FROM (
      SELECT *
    FROM (
        SELECT *
    FROM mc_notification
    WHERE receiver_id=? AND read_time=0 AND wen_id!=0
    )a ,(
       SELECT *
    FROM mc_article
    ) b 
    WHERE a.wen_id=b.article_id
    ) c LEFT JOIN (
         SELECT *
    FROM (
        SELECT *
    FROM mc_notification
    WHERE receiver_id=? AND read_time=0 AND question_id!=0
    )a ,(
       SELECT *
    FROM mc_comment
    ) b 
    WHERE a.question_id=b.comment_id  
    ) d ON c.notification_id=d.notification_id
        JOIN (
SELECT username,user_id
FROM   mc_user
    ) e ON e.user_Id=c.sender_id`, //获取通知
    sql_settz: `UPDATE mc_notification SET read_time=1 WHERE notification_id=?`,//修改通知状态
    sql_setinformwd: `INSERT INTO mc_notification VALUES(0,?,?,?,0,0,?,0,1)`,//发送文章点赞通知
    sql_setinformpl: `INSERT INTO mc_notification VALUES(0,?,?,?,?,0,?,0,1)`,//发送评论点赞通知
    sql_setinformsc: `INSERT INTO mc_notification VALUES(0,?,?,?,0,0,?,0,0)`,//发送收藏通知
    sql_setinformfb: `INSERT INTO mc_notification VALUES(0,?,?,?,0,0,?,0,2)`,//发送文章被评论通知
    sql_setinformhf: `INSERT INTO mc_notification VALUES(0,?,?,?,?,?,?,0,2)`,//发送评论被回复通知
    sql_banner_nmdesc: `    SELECT *
    FROM (
    SELECT  uu.user_id,username,avatar,PASSWORD,last_login_time,b.follower_count,followee_count,following_article_count,notification_unread,inbox_unread,headline,user_state,user_sex,article_id,title,content_mc_article,article_resource,article_type,comment_count,vote_up_count,vote_down_count,create_time,article_state,article_banner,comment_id,commentable_id,comment_user_id,content,vote_up_counts,vote_down_counts,create_times,comment_state,plname,plimg
        FROM mc_user  uu JOIN (
                    SELECT *
                    FROM mc_article a LEFT JOIN (
                                    SELECT  m1.comment_id,m1.commentable_id,m1.comment_user_id,m1.content,m1.vote_up_counts,m1.vote_down_counts,m1.create_times,m1.comment_state ,username 'plname',avatar 'plimg'
                                    FROM  mc_comment m1 LEFT JOIN (
                                                    SELECT *
                                                    FROM  mc_comment m5 JOIN mc_user u ON m5.comment_user_id=u.user_id
                                                    WHERE comment_state=1
                                                    ORDER BY vote_up_counts DESC
                                                    )m2 ON m1.comment_id=m2.comment_id 
        
        
                                    )  c ON c.commentable_id=a.article_id
                                  
                                    ORDER BY article_id DESC
                    ) b ON uu.user_id=b.user_id 
        GROUP BY article_id 
        ORDER BY article_id DESC
    )aaa LEFT JOIN (
        SELECT wen_id,duser_id dquserid
    FROM mc_dianz
    WHERE duser_id=1 AND dianz_lei=0 
    ) bbb ON aaa.article_id=bbb.wen_id LEFT JOIN (
             
        SELECT pinglun_id,duser_id 
    FROM mc_dianz
    WHERE duser_id=1 AND dianz_lei=1
    )hhhh ON aaa.comment_id=hhhh.pinglun_id
    WHERE article_state=1  AND article_banner=1
    GROUP BY article_id 
    ORDER BY create_times  DESC
    LIMIT ?,5`,//表白墙文章正序
    sql_uprootsx: `UPDATE mc_user SET tz_s=? WHERE user_id=?`,//修改用户私信通知
    sql_uproot: `UPDATE mc_user SET user_sx=? WHERE user_id=?`,//修改私信权限
    sql_uprootlookdt: `UPDATE mc_user SET user_fatf=? WHERE user_id=?`,//设置动态查看权限
    sql_uprootlooksc: `UPDATE mc_user SET user_shoutf=? WHERE user_id=?`,//设置收藏查看权限
    sql_uprootdiantf: `UPDATE mc_user SET user_diantf=? WHERE user_id=?`,//设置点赞的查看权限
    sql_uproot_lookhz: `UPDATE mc_user SET look_hz=? WHERE user_id=?`,//设置浏览获赞权限
    sql_uproot_lookgz: `UPDATE mc_user SET look_gz=? WHERE user_id=?`,//设置关注浏览权限
    sql_uproot_lookfs: `UPDATE mc_user SET look_fs=? WHERE user_id=?`,//设置浏览粉丝权限
    sql_huishouzs: `    SELECT *
    FROM (
     SELECT *
    FROM mc_article
    WHERE user_id=? AND article_state=0
    )a JOIN (
 SELECT username,user_id,avatar
    FROM mc_user
    WHERE user_id=?    
    ) b ON a.user_id=b.user_id`,//查看回收站的文章
    sql_huifudontai: `UPDATE mc_article SET article_state=1 WHERE article_id=?`,//恢复动态
    sql_deldontai: `DELETE FROM mc_article WHERE article_id=?`,//彻底删除动态
    sql_deldontaic: `DELETE FROM mc_comment WHERE commentable_id=?`,//删除动态下的评论
    sql_deldontahf: `DELETE FROM mc_reply   WHERE commentable_id?`,//删除动态下的回复
    sql_balck: `SELECT *
    FROM (
SELECT user_id,username,avatar
FROM mc_user  
    ) a JOIN (
    SELECT *
    FROM mc_blacklist
    WHERE blacklist_user=?
    ) b ON a.user_id=b.blacklist_mbuser`,//查看用户的黑名单
    sql_delblack: `DELETE FROM mc_blacklist WHERE  blacklist_id=? `,//移除黑名单
    sql_lahei: `INSERT INTO mc_blacklist VALUES (0,?,?,?,0)`,//拉黑用户
    sql_jubaoadd: `INSERT INTO mc_report VALUES (?,?,?,?,?,?,?,?,?,?,?)`,//添加举报
    sqL_chauser: `SELECT user_id,username,avatar,user_sex,key_s
    FROM mc_user
    WHERE key_s=?`,//查询该用户是否注册过?
    sql_add_user: `INSERT INTO mc_user (user_id,username,avatar,user_sex,key_s,user_zh) VALUES(?,?,?,?,?,?) `,//添加用户
    sql_add_wen: `INSERT INTO mc_article
    (article_id,user_id,title,content_mc_article,article_resource,article_type,create_time,article_banner)
    VALUES(?,?,?,?,?,?,?,?)`,//添加文章
    sql_search_dt: `    SELECT *
    FROM (
    SELECT  uu.user_id,username,avatar,PASSWORD,last_login_time,b.follower_count,followee_count,following_article_count,notification_unread,inbox_unread,headline,user_state,user_sex,article_id,title,content_mc_article,article_resource,article_type,comment_count,vote_up_count,vote_down_count,create_time,article_state,article_banner,comment_id,commentable_id,comment_user_id,content,vote_up_counts,vote_down_counts,create_times,comment_state,plname,plimg
        FROM mc_user  uu JOIN (
                    SELECT *
                    FROM mc_article a LEFT JOIN (
                                    SELECT  m1.comment_id,m1.commentable_id,m1.comment_user_id,m1.content,m1.vote_up_counts,m1.vote_down_counts,m1.create_times,m1.comment_state ,username 'plname',avatar 'plimg'
                                    FROM  mc_comment m1 LEFT JOIN (
                                                    SELECT *
                                                    FROM  mc_comment m5 JOIN mc_user u ON m5.comment_user_id=u.user_id
                                                    WHERE comment_state =1 
                                                    ORDER BY vote_up_counts DESC
                                                    )m2 ON m1.comment_id=m2.comment_id 
        
        
                                    )  c ON c.commentable_id=a.article_id
                                  
                                    ORDER BY article_id DESC
                    ) b ON uu.user_id=b.user_id 
        GROUP BY article_id 
        ORDER BY article_id DESC
    )aaa LEFT JOIN (
        SELECT wen_id,duser_id dquserid
    FROM mc_dianz
    WHERE duser_id=? AND dianz_lei=0 
    ) bbb ON aaa.article_id=bbb.wen_id LEFT JOIN (
             
        SELECT pinglun_id,duser_id 
    FROM mc_dianz
    WHERE duser_id=? AND dianz_lei=1
    )hhhh ON aaa.comment_id=hhhh.pinglun_id
    WHERE article_state=1  AND article_banner!=1 AND title LIKE ? ||content_mc_article LIKE ?
    GROUP BY article_id    LIMIT ?,5`,//搜索动态事件降序
    sql_search_dtasc: ` SELECT *
    FROM (
    SELECT  uu.user_id,username,avatar,PASSWORD,last_login_time,b.follower_count,followee_count,following_article_count,notification_unread,inbox_unread,headline,user_state,user_sex,article_id,title,content_mc_article,article_resource,article_type,comment_count,vote_up_count,vote_down_count,create_time,article_state,article_banner,comment_id,commentable_id,comment_user_id,content,vote_up_counts,vote_down_counts,create_times,comment_state,plname,plimg
        FROM mc_user  uu JOIN (
                    SELECT *
                    FROM mc_article a LEFT JOIN (
                                    SELECT  m1.comment_id,m1.commentable_id,m1.comment_user_id,m1.content,m1.vote_up_counts,m1.vote_down_counts,m1.create_times,m1.comment_state ,username 'plname',avatar 'plimg'
                                    FROM  mc_comment m1 LEFT JOIN (
                                                    SELECT *
                                                    FROM  mc_comment m5 JOIN mc_user u ON m5.comment_user_id=u.user_id
                                                    WHERE comment_state =1
                                                    ORDER BY vote_up_counts DESC
                                                    )m2 ON m1.comment_id=m2.comment_id 
        
        
                                    )  c ON c.commentable_id=a.article_id
                                  
                                    ORDER BY article_id DESC
                    ) b ON uu.user_id=b.user_id 
        GROUP BY article_id 
        ORDER BY article_id DESC
    )aaa LEFT JOIN (
        SELECT wen_id,duser_id dquserid
    FROM mc_dianz
    WHERE duser_id=? AND dianz_lei=0 
    ) bbb ON aaa.article_id=bbb.wen_id LEFT JOIN (
             
        SELECT pinglun_id,duser_id 
    FROM mc_dianz
    WHERE duser_id=? AND dianz_lei=1
    )hhhh ON aaa.comment_id=hhhh.pinglun_id
    WHERE article_state=1  AND article_banner!=1 AND title LIKE ? ||content_mc_article LIKE ?
    GROUP BY article_id
    ORDER BY create_time ASC
    LIMIT ?,5`,//搜索动态时间升序
    sql_search_rm: `SELECT *
    FROM (
    SELECT  uu.user_id,username,avatar,PASSWORD,last_login_time,b.follower_count,followee_count,following_article_count,notification_unread,inbox_unread,headline,user_state,user_sex,article_id,title,content_mc_article,article_resource,article_type,comment_count,vote_up_count,vote_down_count,create_time,article_state,article_banner,comment_id,commentable_id,comment_user_id,content,vote_up_counts,vote_down_counts,create_times,comment_state,plname,plimg
        FROM mc_user  uu JOIN (
                    SELECT *
                    FROM mc_article a LEFT JOIN (
                                    SELECT  m1.comment_id,m1.commentable_id,m1.comment_user_id,m1.content,m1.vote_up_counts,m1.vote_down_counts,m1.create_times,m1.comment_state ,username 'plname',avatar 'plimg'
                                    FROM  mc_comment m1 LEFT JOIN (
                                                    SELECT *
                                                    FROM  mc_comment m5 JOIN mc_user u ON m5.comment_user_id=u.user_id
                                                    WHERE comment_state =1 
                                                    ORDER BY vote_up_counts DESC
                                                    )m2 ON m1.comment_id=m2.comment_id 
        
        
                                    )  c ON c.commentable_id=a.article_id
                                  
                                    ORDER BY article_id DESC
                    ) b ON uu.user_id=b.user_id 
        GROUP BY article_id 
        ORDER BY article_id DESC
    )aaa LEFT JOIN (
        SELECT wen_id,duser_id dquserid
    FROM mc_dianz
    WHERE duser_id=? AND dianz_lei=0 
    ) bbb ON aaa.article_id=bbb.wen_id LEFT JOIN (
             
        SELECT pinglun_id,duser_id 
    FROM mc_dianz
    WHERE duser_id=? AND dianz_lei=1
    )hhhh ON aaa.comment_id=hhhh.pinglun_id
    WHERE article_state=1  AND article_banner!=1  AND title LIKE ? ||content_mc_article LIKE ?
    GROUP BY article_id
    ORDER BY vote_up_count DESC 
    LIMIT ?,5`,//搜索动态热门
    sql_search_user: `SELECT user_id,avatar,user_zh,username
    FROM mc_user
    WHERE username LIKE ? ||user_zh LIKE ?`,//搜索用户
    sql_datumt: `SELECT *
    FROM mc_user
    WHERE user_id=?`,//获取用户信息
    sql_update_users: `UPDATE mc_user SET username=?,headline=?,user_sex=?,user_zh=? WHERE user_id=?`,//修改用户信息
    sql_chonfu_zh: `SELECT user_zh
    FROM mc_user
    WHERE user_zh=?`,//查询重复账号
    sql_updata_users_img: `UPDATE mc_user SET username=?,headline=?,user_sex=?,user_zh=?,avatar=? WHERE user_id=?`,//修改用户信息有iamge
    sql_root_enter: `SELECT *
    FROM mc_root
    WHERE root_user=?`,//查询该用户是否为管理员
    sql_look_reqpote: `SELECT *
    FROM (
    SELECT *
    FROM mc_report
    WHERE reportable_type=0 AND report_state=0
    
    ) a JOIN (
    SELECT *
    FROM mc_article
    ) b ON a.wen_id=b.article_id`,//查看被举报的动态
    sql_ju_db_t: `INSERT INTO mc_notification  (notification_id,receiver_id,sender_id,wen_id,cjian_time,read_time,notification_state) VALUES (0,?,1,?,?,0,?)`,//发送举报动态成功通知
    sql_delt_a: `UPDATE mc_article SET article_state=-1 WHERE article_id=?`,//删除文章 存在违规行为
    sql_jb_dtf: `UPDATE mc_report SET root_user_id=?,report_state=? WHERE report_id=?`,//修改举报的状态
    sql_jb_pl: `SELECT *
    FROM (
    SELECT *
    FROM mc_report
    WHERE reportable_type=1 AND report_state=0
    
    ) a JOIN (
    SELECT *
    FROM mc_comment
    ) b ON a.pinglun_id=b.comment_id`,//获取所有举报评论
    sql_ju_pl_t: `INSERT INTO mc_notification  (notification_id,receiver_id,sender_id,wen_id,cjian_time,read_time,notification_state,question_id) VALUES (0,?,1,?,?,0,?,?)`,//发送举报评论成功通知
    sql_pk_up: `UPDATE mc_comment SET comment_state=-1 WHERE comment_id=?`,
    sql_cha_cao: `    SELECT *
    FROM (
        SELECT user_id root_user,username
    FROM mc_user
    
    )a JOIN (
    SELECT *
    FROM (
    SELECT *
    FROM mc_report
    WHERE reportable_type=0 AND report_state!=0
    
    ) a JOIN (
    SELECT article_id,user_id wen_user_id,title,content_mc_article
    FROM mc_article
    ) b ON a.wen_id=b.article_id
    
    )b ON b.root_user_id=a.root_user
    ORDER BY report_id DESC
    `,//查询管理员动态处理记录
    sql_cha_pl: `    SELECT *
    FROM (
SELECT *
    FROM (
    SELECT *
    FROM mc_report
    WHERE reportable_type=1 AND report_state!=0
    
    ) a JOIN (
    SELECT *
    FROM mc_comment
    ) b ON a.pinglun_id=b.comment_id   
   
   
   
    ) a JOIN (
    SELECT *
    FROM mc_article
    ) b ON a.wen_id=b.article_id JOIN (
SELECT username,user_id
FROM mc_user    
    )c  ON  a.root_user_id=c.user_id`,//查询管理员评论处理记录
    sql_cha_del_dt: `SELECT *
    FROM (
    SELECT *
    FROM(
    SELECT user_id root_user,username
    FROM mc_user
    ) aa JOIN (SELECT *
    FROM mc_report
    WHERE reportable_type=0 AND report_state=1
    )  bb ON aa.root_user=bb.root_user_id
    
    ) a JOIN (
   
    SELECT *
    FROM (
    SELECT  uu.user_id,username,avatar,PASSWORD,last_login_time,b.follower_count,followee_count,following_article_count,notification_unread,inbox_unread,headline,user_state,user_sex,article_id,title,content_mc_article,article_resource,article_type,comment_count,vote_up_count,vote_down_count,create_time,article_state,article_banner,comment_id,commentable_id,comment_user_id,content,vote_up_counts,vote_down_counts,create_times,comment_state,plname,plimg
        FROM mc_user  uu JOIN (
                    SELECT *
                    FROM mc_article a LEFT JOIN (
                                    SELECT  m1.comment_id,m1.commentable_id,m1.comment_user_id,m1.content,m1.vote_up_counts,m1.vote_down_counts,m1.create_times,m1.comment_state ,username 'plname',avatar 'plimg'
                                    FROM  mc_comment m1 LEFT JOIN (
                                                    SELECT *
                                                    FROM  mc_comment m5 JOIN mc_user u ON m5.comment_user_id=u.user_id
                                                    WHERE comment_state =1
                                                    ORDER BY vote_up_counts DESC
                                                    )m2 ON m1.comment_id=m2.comment_id 
        
        
                                    )  c ON c.commentable_id=a.article_id
                                  
                                    ORDER BY article_id DESC
                    ) b ON uu.user_id=b.user_id 
        GROUP BY article_id 
        ORDER BY article_id DESC
    )aaa LEFT JOIN (
        SELECT wen_id,duser_id dquserid
    FROM mc_dianz
    WHERE duser_id=1 AND dianz_lei=0 
    ) bbb ON aaa.article_id=bbb.wen_id LEFT JOIN (
             
        SELECT pinglun_id,duser_id 
    FROM mc_dianz
    WHERE duser_id=1 AND dianz_lei=1
    )hhhh ON aaa.comment_id=hhhh.pinglun_id
    WHERE   article_banner!=1 AND article_state=-1
    GROUP BY article_id
    ORDER BY create_time ASC
   
    ) b ON a.wen_id=b.article_id
    GROUP BY article_id
    `,//查询被管理员删除的动态
    sql_huif_dt: `UPDATE mc_article SET article_state=1 WHERE article_id=?`,//恢复动态
    sql_huif_jub: `UPDATE mc_report  SET report_state=3 WHERE report_id=?`,//删除举报
    sql_huif_jbp: `    SELECT *
    FROM (
        SELECT *
    FROM mc_article
    
    )a JOIN (
        SELECT *
    FROM mc_comment
    WHERE comment_state=-1
    )b ON a.article_id=b.commentable_id`,//查询被删除的评论
    sql_huifu_pl: `UPDATE mc_comment SET comment_state=1 WHERE comment_id=?`,//恢复评论
    sql_huifu_jubp: `UPDATE mc_report  SET report_state=4 WHERE pinglun_id=?`,//回复举报表中对应的举报评论
    sql_tj_user: `    SELECT COUNT(*) user_sum
    FROM mc_user`,//统计用户人数
    sql_tj_dh_zong: `    SELECT COUNT(*) letter_sum
    FROM mc_letter`,//统计聊天表总条数
    sql_tj_dh_y: `      SELECT COUNT(*) letter_y
    FROM mc_letter
    WHERE letter_state=1`,//统计聊天表中已阅读信息条数
    sql_tj_wen_sum: `SELECT COUNT(*) wen_sum
    FROM mc_article`,//统计全部文章
    sql_tj_wen_z: `    SELECT COUNT(*) wen_z
    FROM mc_article
    WHERE  article_state=1`,//统计文章可看数
    sql_tj_ping_sum: `    SELECT (   SELECT COUNT(*) ping_sum
    FROM mc_comment)+(   SELECT COUNT(*) hui_sum
    FROM mc_reply) ping_sum`,//统计全部评论及回复
    sql_look_roots: `    SELECT *
    FROM (
      SELECT user_id,user_zh,username
    FROM mc_user
    ) a JOIN (
      SELECT *
    FROM mc_root
    ) b ON a.user_id=b.root_user`,//查看管理员
    sql_up_root: `UPDATE mc_root SET root_lei=? WHERE root_user=?`,//修改管理员权限
    sql_del_root: `DELETE FROM mc_root WHERE root_user=?`,//删除管理员
    sql_add_root: `INSERT INTO mc_root VALUES (0,?,1)`,//添加用户为管理员


    sql_my_lian: `SHOW STATUS LIKE '%Threads_connected%';`,//查看mysql当前连接数
    sql_my_zui: `SHOW VARIABLES LIKE '%max_connections%';`,//sql最大连接数
    sql_my_look: `SHOW PROCESSLIST;`,//查看具体连接项目
    sql_my_up_chao: `SET GLOBAL interactive_timeout =?;
    `,//设置超时时间
    sql_my_up_chaotwo: `SET GLOBAL wait_timeout = ?;`,//设置超时时间2
    sql_my_set_lianzuid: `set GLOBAL max_connections=?;`,//设置最大连接数
}