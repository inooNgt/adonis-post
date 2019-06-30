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
 * 用户登出
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
 * 查找用户信息
 */
Route.get('/api/user/find', 'UserController.findUserByName')
/**
 * 查找用户发布的文章
 */
Route.get('/api/user/posts', 'UserController.getMyPosts')

/**
 * 修改用户头像
 */
Route.post('/api/user/avatar', 'UserController.avatar').middleware('auth')

/**
 * 文章列表
 */
Route.get('/api/posts', 'PostController.index')
/**
 * 文章详情
 */
Route.get('/api/posts/detail', 'PostController.detail')

/**
 * 发布文章
 */
Route.post('/api/post/create', 'PostController.post').middleware('auth')
/**
 * 修改文章
 */
Route.post('/api/post/update', 'PostController.update').middleware('auth')
/**
 * 删除文章
 */
Route.delete('/api/post/delete', 'PostController.delete').middleware('auth')

/**
 * 笔记列表
 */
Route.get('/api/notes', 'NoteController.index')
/**
 * 发布笔记
 */
Route.post('/api/note/create', 'NoteController.post').middleware('auth')
/**
 * 修改笔记
 */
Route.post('/api/note/update', 'NoteController.update').middleware('auth')
/**
 * 删除笔记
 */
Route.delete('/api/note/delete', 'NoteController.delete').middleware('auth')

/**
 * 文件列表
 */
Route.get('/api/files', 'FilemapController.files')
/**
 * 上传文件
 */
Route.post('/api/file/upload', 'FilemapController.upload')
