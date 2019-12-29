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

adonis 支持 session、Basic Auth、 API tokens 等多种认证方式，可以在 config/auth.js 中配置。本项目使用的是 API tokens，用户的 Token 需要存储到数据库的 token 表中，用户登录时可以获取 token 并存储到客户端中，当客户端请求需要认证的接口是需要在 http 头部加上 Authorization = Bearer <token>。

User 和 Token 模型：

User 和 Token 是一对多的关系，adonis Model 提供了 hasMany 和 belongsTo 来定义这种[关系](https://adonisjs.com/docs/4.1/relationships#_defining_relationship).

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

每篇文章由一个用户发布，用户可以发布多篇文章,所以 User 和 Post 也是一对多的关系。

User 和 Post 模型：

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

### [模型](https://adonisjs.com/docs/4.1/lucid#_creating_model)

Adonis 使用数据模型代替纯 SQL 操作数据，并且提供了功能强大的 API，包括建立数据关系、生命周期、Getters/setters、序列化数据、格式化数据等。

#### 创建模型

```shell
adonis make:model User
```

#### 使用模型

创建用户：

```javascript
const User = use('App/Models/User')

const user = new User()

user.username = 'virk'
user.password = 'some-password'

await user.save()
```

### 创建数据[migration](https://adonisjs.com/docs/4.1/migrations)

#### 创建表

```shell
adonis make:migration users
```

创建成功后可在 database/migrations 中修改表结构

```javascript
'use strict'

const Schema = use('Schema')

class UsersSchema extends Schema {
  up() {
    this.create('users', table => {
      table.increments()
      table.timestamps()
    })
  }

  down() {
    this.drop('users')
  }
}

module.exports = UsersSchema
```

### 运行 Migrations

```shell
adonis migration:run
```

注意需要先在 config/database.js 中配置好数据库

其他 Migrations 命令：

```shell
migration:rollback //回滚到上一次的设置
migration:refresh
migration:reset
```

### 控制器

控制器是模型层和视图层之间沟通的桥梁，其工作是使用对应模型进行数据处理，最后响应数据。

#### 创建控制器

```shell
adonis make:controller User --type http
```

#### 使用控制器

将路由交给对应控制器处理：

```javascript
Route.get(url, 'UserController.index')
```

路由的配置在 start/routes.js 文件中，[Using Route ](https://adonisjs.com/docs/4.1/routing).

### Lucid CRUD 操作

AdonisJs 具有开箱即用的 SQL 数据库，并提供统一的 Javascript API 与数据库进行交互。
Lucid 是 AdonisJs 查询数据库的解决方案， 它是将 SQL 数据存储和操作作为对象的架构模式,即通过 models 实例方法进行 CRUD 操作。

#### 新增

```javascript
const post = new Post()
post.title = 'Adonis 101'
post.body = 'Adonis 101 is an introductory guide for beginners.'
await post.save() // SQL Insert
```

#### 查询

```javascript
const postId = request.param('id')
const post = await Post.find(postId)
const posts = await Post.all()
```

#### 更新

```javascript
const post = await Post.findBy('id', 1)
post.body = 'Adding some new content'

await post.save() // SQL Update
```

#### 删除

```javascript
const post = await Post.findBy('id', 1)
await post.delete()
```

更多方法见：https://adonisjs.com/docs/4.1/lucid

### Postgresql

此项目使用 Postgresql 数据库存储数据。

#### 安装

```shell
sudo apt-get  upgrade
sudo apt-get install postgresql
```


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


### Nginx

### 安装
```shell
sudo apt-get install nginx
```
Ubuntu安装之后的文件结构为：
- 所有的配置文件都在/etc/nginx下，并且每个虚拟主机已经安排在了/etc/nginx/sites-available下
- 程序文件在/usr/sbin/nginx
- 日志放在了/var/log/nginx中
- 并已经在/etc/init.d/下创建了启动脚本nginx
- 默认的虚拟主机的目录设置在了/var/www/nginx-default

#### 判断Nginx配置是否正确
```shell
nginx -t -c /etc/nginx/nginx.conf
```
#### 启动
```shell
nginx -c /etc/nginx/nginx.conf
```
#### 快速停止
```shell
nginx -s stop
```
#### 配置文件修改重装载命令
```shell
nginx -s reload
```
