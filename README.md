# cyan
    MEAN 架构网站系统
    
## 安装 git
    CentOS下

    yum install git

## 获取
    https://github.com/zlz/cyan.git

## 安装

### 安装 nodejs
    CentOS下

    curl --silent --location https://rpm.nodesource.com/setup_7.x | bash -
    yum -y install nodejs
    yum install gcc-c++ make

### 安装 mongodb
    CentOS下

    新建 /etc/yum.repos.d/mongodb-org-3.4.repo
    vi /etc/yum.repos.d/mongodb-org-3.4.repo
    
    文件内容
        [mongodb-org-3.4]
        name=MongoDB Repository
        baseurl=https://repo.mongodb.org/yum/redhat/$releasever/mongodb-org/3.4/x86_64/
        gpgcheck=1
        enabled=1
        gpgkey=https://www.mongodb.org/static/pgp/server-3.4.asc

    安装
    yum install -y mongodb-org

    配置自启动
    chkconfig mongod on

    相关命令
    service mongod stop
    service mongod restart

    远程连接开启
    vi /etc/mongod.conf
    修改内容
        bindIp: 127.0.0.1 --->  bindIp: 0.0.0.0

    数据库备份、恢复
        mkdir mdbbak
        cd mdbak
        mongodump (备份)
        mongorestore (恢复)

### 安装系统
    1. 进入项目文件夹 cd cyan
    2. npm install
    3.1 一般安装 npm run bower
    3.2 Linux系统root权限下 bower --allow-root install

## 调试
    npm run dev

## 部署
    npm start

## 运行
    npm run server