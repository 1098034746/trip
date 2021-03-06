// 引入资源文件
var express = require('express')
var createError = require('http-errors')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')

// 引入 indexRouter.js 路由 配置文件
var indexRouter = require('./routes/index')
// 引入 user 路由 配置文件


var app = express()  // 用 express 创建一个 App 应用