'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.on('/').render('home')

/**
 * 用户注册
 */
Route.post('/api/user/register', 'UserController.register').middleware('guest')

/**
 * 用户登录
 */
Route.post('/api/user/login', 'UserController.login').middleware('guest')

/**
 * 用户登录
 */
Route.post('/api/user/logout', 'UserController.logout').middleware('auth')

/**
 * 用户上传文件
 */
Route.post('/api/user/file', 'UserController.userfile').middleware('auth')

/**
 * 获取用户信息
 */
Route.get('/api/user', 'UserController.index').middleware('auth')

/**
 * 修改用户头像
 */
Route.post('/api/user/avatar', 'UserController.avatar').middleware('auth')

/**
 * 文章列表
 */
Route.get('/api/posts', 'PostController.index')

/**
 * 发布文章
 */
Route.post('/api/post', 'PostController.post').middleware('auth')
