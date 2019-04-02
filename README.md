## Elibrary——一个基于以太坊和星际文件系统的去中心化的图书馆
### 提醒  因为ipfs公共网关不稳定，图书封面很大可能不能显示.

## 1 总览
本图书借阅平台可以实现去中心化的，分布式的，可溯源的图书借阅功能。
* >用户发布图书
* >借书
* >还书
* >读者和发布者都可以评论这本图书，并且打分，可以重复评论打分
* >用户检索图书(在"我的图书"和"图书主页"可以进行关键词检索和类型检索)
* >在我的图书里面可以查看我发布的图书，评论过的图书，借阅过的图书，归还过的图书
* >图书排序(借阅量排序，评分排序)
* >帮助中心(教程和作者联系方式)

### 1.1 发布图书
* >**发布图书**
![deployBook.png](https://github.com/wongnoubo/Elibrary/blob/master/docs/deployBook.png)

### 1.2 图书中心
* >**图书中心可以借阅图书**
![bookHome.png](https://github.com/wongnoubo/Elibrary/blob/master/docs/bookHome.png)

* >**借阅图书**
![testBorrowBook.gif](https://github.com/wongnoubo/Elibrary/blob/master/docs/testBorrowBook.gif)

* >**用户是不能借阅自己发布的书籍的**
![testBorrowMyBook.gif](https://github.com/wongnoubo/Elibrary/blob/master/docs/testBorrowMyBook.gif)

* >**不可以重复借阅同一本书**
![reBorrowBook.png](https://github.com/wongnoubo/Elibrary/blob/master/docs/reBorrowedBook.png)
### 1.3 我的图书
* >**在“我的图书”下面的借阅的图书里面是可以归还图书的，已经归还了的图书是不用归还的**
![returnBook.png](https://github.com/wongnoubo/Elibrary/blob/master/docs/returnBook.png)
![testReturnBook.gif](https://github.com/wongnoubo/Elibrary/blob/master/docs/testReturnBook.gif)
* >**评论图书(可以多次评论，发布者和普通用户的评论有所区分)**
![commentBook.png](https://github.com/wongnoubo/Elibrary/blob/master/docs/commentBook.png)
![comment.png](https://github.com/wongnoubo/Elibrary/blob/master/docs/comment.png)
### 1.4 图书排行
* >**图书排行支持借阅量排行；图书发布时间排行；评分排行(默认支持的是评分排行)**
![sortScore.png](https://github.com/wongnoubo/Elibrary/blob/master/docs/sortScore.png)
---
![sortBorrowNum.png](https://github.com/wongnoubo/Elibrary/blob/master/docs/sortBorrowNum.png)
---
![sortDate.png](https://github.com/wongnoubo/Elibrary/blob/master/docs/sortDate.png)
---
![testSort.gif](https://github.com/wongnoubo/Elibrary/blob/master/docs/testSort.gif)

### 1.5 帮助中心
* >**相关介绍和作者联系方式**
![help.png](https://github.com/wongnoubo/Elibrary/blob/master/docs/help.png)


## 2 运行前准备

<a name="8e98bd52"></a>
## 2.1 安装IPFS
* 下载ipfs压缩包

$ wget https://dist.ipfs.io/go-ipfs/v0.4.13/go-ipfs_v0.4.13_linux-amd64.tar.gz
* 解压

tar -zxvf go-ipfs_v0.4.13_linux-amd64.tar.gz
* 移动文件

$cd go-ipfs<br />$ sudo mv ipfs /usr/local/bin/ipfs
* 在本地计算机建立一个IPFS节点

ipfs init
* 跨域资源共享CORS配置

$ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["PUT", "GET", "POST", "OPTIONS"]'<br />$ ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["*"]'<br />
* 启动ipfs服务

$ ipfs deamon

* 浏览器访问IPFS节点

http://localhost:5001/webui
* [IPFS公共网关](https://ipfs.github.io/public-gateway-checker/)


<a name="f15fc2c3"></a>
## 2.2 安装truffle框架
* sudo apt-get install nodejs
* sudo apt-get install npm
* sudo npm install -g truffle
* 安装指定版本的truffle——sudo npm install -g truffle@"指定版本"

例子：sudo  npm install -g truffle@5.0.0


<a name="b9063e78"></a>
## 2.3 安装[ganache](https://truffleframework.com/ganache)测试框架

<a name="1dfd2bcd"></a>
## 2.4 安装以太坊浏览器插件[metamask](https://chrome.google.com/webstore/category/extensions)

* 下载安装插件![downloadMetamask.png](https://github.com/wongnoubo/Eshop/blob/master/images/downloadMetamask.png)

* metamask关联truffle框架

打开metamask——>设置——>显示助记词——>复制助记词

![metamask-ci.png](https://cdn.nlark.com/yuque/0/2019/png/237720/1553528051852-bcebf7c1-55fa-4fb5-b9d8-d1b27d7e45d3.png#align=left&display=inline&height=753&name=metamask-ci.png&originHeight=753&originWidth=452&size=22224&status=done&width=452)


打开ganache——>设置——>ACCOUNTS&KEYS<br />
![ganache-ci.png](https://github.com/wongnoubo/Elibrary/blob/master/docs/ganache-ci.png)


![ganache.png](https://github.com/wongnoubo/Elibrary/blob/master/docs/ganache.png)



<a name="d0617cd1"></a>
## 3 项目目录
* build

智能合约编译后生成的json文件
* contracts

智能合约
* migrations

智能合约部署脚本
* src（项目应用层和中间层）
* test

智能合约测试脚本

<a name="733d6c7b"></a>
## 4 项目运行
* 启动IPFS

ipfs deamon
* 启动ganache

./ganache<br />windows就直接双击ganahce.exe即可。
* 编译

truffle compile
* 部署

truffle migrate
* 安装项目依赖(第一次运行项目)

npm install
* 运行

npm run dev<br />会自动打开浏览器通过localhost:3000访问



<a name="8382c147"></a>
## 5 参考资料
* [游戏交易系统](https://github.com/littleredhat1997/Egame) **十分感谢！**
* [truffle官方教程宠物商店](https://truffleframework.com/tutorials/pet-shop)

---
有问题可以提issues，欢迎star、~
---



