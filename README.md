# Adonis Post

使用 AdonisJs 开发的 Nodejs 文章发布系统。

已实现功能：

- 登录/注册/注销
- 发布文章
- 上传头像
- 获取文章列表及文章详情
- 更新文章

### Postgresql 相关

此项目使用 Postgresql 数据库存储数据。

#### 配置

在 Linux 系统上按装 postgresql 后需要进行一些配置以便远程查询。

1.修改监听地址

```shell
vim /etc/postgresql/9.5/main/postgresql.conf
```

将#listen_addresses = 'localhost'改为 listen_addresses = ' 0.0.0.0'

2.修改可访问的用户 ip 段

```shell
vim /etc/postgresql/9.5/main/pg_hba.conf
```

文档末尾加上 host all all 0.0.0.0/0 md5

#### 启动、停止、重启

```shell
sudo /etc/init.d/postgresql start|stop|restart
```
