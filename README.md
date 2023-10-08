# 萤火商城V2.0开源版 [uni-app端]

#### 项目介绍
萤火商城V2.0，是2021年全新推出的一款轻量级、高性能、前后端分离的电商系统，支持微信小程序 + H5+ 公众号 + APP，前后端源码完全开源，看见及所得，完美支持二次开发，可学习可商用，让您快速搭建个性化独立商城。

    如果对您有帮助，您可以点右上角 “Star” 收藏一下 ，获取第一时间更新，谢谢！

#### 源码下载
1. 主商城端（又称后端、服务端，PHP开发 用于管理后台和提供api接口）

    下载地址：[https://gitee.com/xany/yoshop2.0](https://gitee.com/xany/yoshop2.0)

2. 用户端（也叫客户端、前端，uniapp开发 用于生成H5和微信小程序）

    下载地址：[https://gitee.com/xany/yoshop2.0-uniapp](https://gitee.com/xany/yoshop2.0-uniapp)

#### 如何使用uni-app端

##### 一、导入uniapp项目

    1. 首先下载HBuilderX并安装，地址：https://www.dcloud.io/hbuilderx.html
    2. 打开HBuilderX -> 顶部菜单栏 -> 文件 -> 导入 -> 从本地目录导入 -> 选择uniapp端项目目录
    3. 找到config.js文件，找到里面的apiUrl项，填入已搭建的后端url地址
    4. 打开manifest.json文件，选择微信小程序配置，填写小程序的appid

##### 二、本地调试

    1. 打开HBuilderX -> 顶部菜单栏 -> 运行 -> 运行到浏览器 -> Chrome
    2. 如果请求后端api时 提示跨域错误，可安装Chrome插件：【Allow CORS: Access-Control-Allow-Origin】，地址：https://chrome.google.com/webstore/detail/allow-cors-access-control/lhobafahddgcelffkeicbaginigeejlf

##### 三、打包发行（H5）

    1. 打开HBuilderX -> 顶部菜单栏 -> 发行 -> 网站H5-手机版
    2. 打包后的文件路径：/unpackage/dist/build/h5
    3. 将打包完成的所有文件 复制到商城后端/pulic目录下，全部替换

##### 四、打包发行（微信小程序）

    1. 下载微信开发者工具并安装，地址：https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html
    2. 打开HBuilderX -> 顶部菜单栏 -> 发行 -> 小程序-微信
    3. 打包后的文件路径：/unpackage/dist/build/mp-weixin
    5. 打开微信开发者工具 导入 打包完成的项目
    6. 检查没有运行错误，在右上方上传小程序


#### UNIAPP-页面展示
![前端展示](https://images.gitee.com/uploads/images/2021/0316/215102_7bcb0802_2166072.png "前端展示.png")

#### 系统演示
![前端演示二维码](https://images.gitee.com/uploads/images/2021/0316/104516_3778337e_2166072.png "111.png")




#### 版权须知

1. 允许个人学习研究使用，支持二次开发，允许商业用途（仅限自运营）。
2. 允许商业用途，但仅限自运营，如果商用必须保留版权信息，望自觉遵守。
3. 不允许对程序代码以任何形式任何目的的再发行或出售，否则将追究侵权者法律责任。


本项目包含的第三方源码和二进制文件之版权信息另行标注。

版权所有Copyright © 2017-2021 By 萤火科技 (https://www.yiovo.com) All rights reserved。





