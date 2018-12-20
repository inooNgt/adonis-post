# Adonis fullstack application

This is the fullstack boilerplate for AdonisJs, it comes pre-configured with.

1. Bodyparser
2. Session
3. Authentication
4. Web security middleware
5. CORS
6. Edge template engine
7. Lucid ORM
8. Migrations and seeds

## Setup

Use the adonis command to install the blueprint

```bash
adonis new yardstick
```

or manually clone the repo and then run `npm install`.

### Migrations

Run the following command to run startup migrations.

```js
adonis migration:run
```

### Postgresql

#### 配置

1.修改监听地址

```
vim /etc/postgresql/9.5/main/postgresql.conf
```

将#listen_addresses = 'localhost'改为 listen_addresses = ' 0.0.0.0'

2.修改可访问的用户 ip 段

```
vim /etc/postgresql/9.5/main/pg_hba.conf
```

文档末尾加上 host all all 0.0.0.0/0 md5

#### 在 window 查看远程端口是否开放

```
telnet HOST PORT

```

将# listen_addresses = 'localhost'改为 listen_addresses = '0.0.0.0'

#### 启动、停止、重启

```
sudo /etc/init.d/postgresql start|stop|restart
```

#### 查看状态

```
sudo netstat -ntlup

```
