# 校园论坛小程序接口

后端基于nodejs 由于编写时后端没有写接口文档 导致该项目只能用于交作业，但是有一定的学习价值

## 使用方法

​	需要node环境



## 下载此项目依赖

```
npm install
```

## 数据库导入数据

```
导入leyue.sql语句
```

## 设置服务器端口在index.js中

```
app.listen(80, () => {
    console.log('http://127.0.0.1');
})
```



## 修改index.js 按需求配置

```
    req.db = mysql.createPool({
        host: 'localhost',//主机名
        user: 'root',//用户名
        password: 'root',//密码
        database: 'Leyue'//所操作的数据库
    })
```


### 运行此项目

```
node index,js
```
