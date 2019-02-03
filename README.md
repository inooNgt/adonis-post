# Adonis Post

使用 AdonisJs 开发的 Nodejs 文章发布系统。

已实现功能：

- 登录/注册/注销
- 发布文章
- 上传头像
- 获取文章列表及文章详情
- 更新文章

在线地址：http://inoongt.tech/

### 构建
1. 在根目录下新建环境配置文件.env
2. 安装依赖
```shell
yarn 
```
3. 启动
```shell
yarn serve
```

### 登录认证

adonis支持session、Basic Auth、 API tokens等多种认证方式，可以在config/auth.js中配置。本项目使用的是API tokens，用户的Token需要存储到数据库的token表中，用户登录时可以获取token并存储到客户端中，当客户端请求需要认证的接口是需要在http头部加上Authorization = Bearer 	<token>。

User和Token模型：

User和Token是一对多的关系，adonis Model提供了hasMany和belongsTo来定义这种[关系](https://adonisjs.com/docs/4.1/relationships#_defining_relationship).

app/Models/Token.js
```javascript 
const Model = use('Model')

class Token extends Model {
  user() {
    return this.belongsTo('App/Model/User')
  }
}

```

app/Models/User.js
```javascript 
const Model = use('Model')

class User extends Model {
  tokens() {
    return this.hasMany('App/Models/Token')
  }
}

```

### 文章


每篇文章由一个用户发布，用户可以发布多篇文章,所以User和Post也是一对多的关系。

User和Post模型：

app/Models/Post.js
```javascript 
const Model = use('Model')

class Post extends Model {
  user() {
    return this.belongsTo('App/Model/User')
  }
}

```

app/Models/User.js
```javascript 
const Model = use('Model')

class User extends Model {
  tokens() {
    return this.hasMany('App/Models/Token')
  }
  posts() {
    return this.hasMany('App/Models/Post')
  }
}

```

### Postgresql 相关

此项目使用 Postgresql 数据库存储数据。

#### 配置

在 Linux 系统上按装 postgresql 后需要进行一些配置以便远程访问。

1. 修改监听地址

```shell
vim /etc/postgresql/9.5/main/postgresql.conf
```

将#listen_addresses = 'localhost'改为 listen_addresses = ' 0.0.0.0'

2. 修改可访问的用户 ip 段

```shell
vim /etc/postgresql/9.5/main/pg_hba.conf
```

文档末尾加上 host all all 0.0.0.0/0 md5

3. 修改防火墙设置，允许某端口访问

```shell
sudo ufw allow  5432/tcp
```

#### 启动、停止、重启

```shell
sudo /etc/init.d/postgresql start|stop|restart
```
