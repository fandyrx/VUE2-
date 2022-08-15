# Vue2-backend-finished
Vue2 尚品汇后台

bug:1. 登录页 addroute 路由重复未修改,有空再做

  
2.项目场景：尚硅谷后台管理系统首页使用的是本地mock的数据，即data.json文件中的数据。
问题描述：在vue.config.js进行如下配置之后，出现无法登录的问题。
点击登录，弹出错误提示信息是Error:timeout of 5000ms exceeded。

// 开启mock数据
before: require('./mock/mock-server.js'),
原因分析：开始以为是网络的问题，几次重跑都无法登录，之后我以为大概是服务器挂掉的问题，隔了1天之后发现还是无法登录。然后尝试删除掉上面配置的那行代码，发现一下子就登录进去了，结果当然就是mock的数据不开启的话，虽然可以登录成功，但是无法动态展示mock数据。最后，通过查阅vue-element-admin文档关于本地 Mock 数据与线上数据切换的内容解决该问题。

解决方法：
// 将main.js中的环境变量production修改为development
if (process.env.NODE_ENV === 'development') {
const { mockXHR } = require('../mock')
mockXHR()
}

// 将vue.config.js中下面这行代码注释掉
// before: require('./mock/mock-server.js')

————————————————
版权声明：本文为CSDN博主「urnotwangPder」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。
原文链接：https://blog.csdn.net/urnotwang/article/details/122529430
