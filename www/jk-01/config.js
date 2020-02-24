// 设备信息
$(function() {
    initialValue = new Object();
    initialValue.g_iWndIndex = 0;
    initialValue.szDeviceIdentify = '';
    initialValue.deviceport = '';
    initialValue.rtspport = '';
    initialValue.channels = [];
    //登录参数
    initialValue.ip = '摄像头IP';
    initialValue.port = '80';
    initialValue.username = '登陆账号';
    initialValue.password = '登陆密码';
    t_init(initialValue);
    t_login(initialValue);
})
//windowheight = $(window).height();
// 初始化

// 全屏
function quanping() {
    WebVideoCtrl.I_FullScreen(true);
}

function t_init(initialValue) {
    // 检查插件是否已经安装过
    var iRet = WebVideoCtrl.I_CheckPluginInstall();
    if (-1 == iRet) {
        alert("您还未安装过插件！");
        return;
    }
    // 初始化插件参数及插入插件
    WebVideoCtrl.I_InitPlugin("100%", "780", {
        bWndFull: true,
        iPackageType: 2,
        iWndowType: 1,
        cbInitPluginComplete: function() {
            WebVideoCtrl.I_InsertOBJECTPlugin("divPlugin");
        }
    });
}
  
function t_login(initialValue) {
    if ("" == initialValue.ip || "" == initialValue.port) {
        return;
    }
    initialValue.szDeviceIdentify = initialValue.ip + "_" + initialValue.port;
    WebVideoCtrl.I_Login(initialValue.ip, 1, initialValue.port, initialValue.username, initialValue.password, {
        success: function(xmlDoc) {
            setTimeout(function() {
                t_getChannelInfo(initialValue);
                t_getDevicePort(initialValue);
            }, 10);
            setTimeout(function() {
                t_StartRealPlay(initialValue);
            }, 500)
        },
        error: function(status, xmlDoc) {}
    });
}
  
// 获取通道
function t_getChannelInfo(initialValue) {
    initialValue.channels = []
    if (null == initialValue.szDeviceIdentify) {
        return;
    }
    // 模拟通道
    WebVideoCtrl.I_GetAnalogChannelInfo(initialValue.szDeviceIdentify, {
        async: false,
        success: function(xmlDoc) {
            var oChannels = $(xmlDoc).find("VideoInputChannel");
            $.each(oChannels, function(i) {
                var id = $(this).find("id").eq(0).text(),
                    name = $(this).find("name").eq(0).text();
                if ("" == name) {
                    name = "Camera " + (i < 9 ? "0" + (i + 1) : (i + 1));
                }
                initialValue.channels.push({
                    id: id,
                    name: name
                })
            });
        },
        error: function(status, xmlDoc) {}
    });
    // 数字通道
    WebVideoCtrl.I_GetDigitalChannelInfo(initialValue.szDeviceIdentify, {
        async: false,
        success: function (xmlDoc) {
            var oChannels = $(xmlDoc).find("InputProxyChannelStatus");
 
            $.each(oChannels, function (i) {
                var id = $(this).find("id").eq(0).text(),
                    name = $(this).find("name").eq(0).text(),
                    online = $(this).find("online").eq(0).text()
                ip = $(this).find("ipAddress").eq(0).text(),
                    port = $(this).find("port").eq(0).text();
                if ("false" == online) { // 过滤禁用的数字通道
                    return true;
                }
                if ("" == name) {
                    name = "IPCamera " + (i < 9 ? "0" + (i + 1) : (i + 1));
                }
                var arr = {
                    "id": id,
                    "title": name,
                    "ipaddress": initialValue.szDeviceIdentify
                };
                IPaddress.push(arr);
            });
            console.log("获取数字通道成功！");
        },
        error: function (status, xmlDoc) {
            console.log("获取数字通道失败！");
        }
    });
    // 零通道
    WebVideoCtrl.I_GetZeroChannelInfo(initialValue.szDeviceIdentify, {
        async: false,
        success: function (xmlDoc) {
            var oChannels = $(xmlDoc).find("ZeroVideoChannel");
 
            $.each(oChannels, function (i) {
                var id = $(this).find("id").eq(0).text(),
                    name = $(this).find("name").eq(0).text();
                if ("" == name) {
                    name = "Zero Channel " + (i < 9 ? "0" + (i + 1) : (i + 1));
                }
                if ("true" == $(this).find("enabled").eq(0).text()) { // 过滤禁用的零通道
                    console.log("id:" + id + ",name:" + name);
                }
            });
            console.log("获取零通道成功！");
        },
        error: function (status, xmlDoc) {
            console.log("获取零通道失败！");
        }
    });
}
  
// 获取端口
function t_getDevicePort(initialValue) {
    if (null == initialValue.szDeviceIdentify) {
        return;
    }
    var oPort = WebVideoCtrl.I_GetDevicePort(initialValue.szDeviceIdentify);
    if (oPort != null) {
        initialValue.deviceport = oPort.iDevicePort;
        initialValue.rtspport = oPort.iRtspPort;
    }
}
  
// 开始预览
function t_StartRealPlay(initialValue) {
    var oWndInfo = WebVideoCtrl.I_GetWindowStatus(initialValue.g_iWndIndex),//获取当前窗口的状态
        iChannelID = initialValue.channels[0].value
  
    if (null == initialValue.szDeviceIdentify) {
        return;
    }
  
    var startRealPlay = function() {
        WebVideoCtrl.I_StartRealPlay(initialValue.szDeviceIdentify, {
            iRtspPort: initialValue.rtspport,
            iStreamType: 1,
            iChannelID: iChannelID,
            bZeroChannel: false,
            success: function() {},
            error: function(status, xmlDoc) {
                if (403 === status) {} else {}
            }
        });
    };
  
    if (oWndInfo != null) { // 已经在播放了，先停止
        WebVideoCtrl.I_Stop({
            success: function() {
                startRealPlay();
            }
        });
    } else {
        startRealPlay();
    }
}

function openshengying(){
    I_SetVolume(100); //设置音量
    I_OpenSound(); //打开声音
}

function closeshengying(){
    I_CloseSound(); //关闭声音
}

function jt_tiaojiaojia(){ //调焦加
    I_PTZControl(10, false,4);
    I_PTZControl(10, true,4);
}

function jt_tiaojiaojian(){ //调焦减
    I_PTZControl(11, false,4);
    I_PTZControl(11, true,4);
}

function jt_jiaojujia(){ //焦距加
    I_PTZControl(12, false,4);
    I_PTZControl(12, true,4);
}

function jt_jiaojujian(){ //焦距减
    I_PTZControl(13, false,4);
    I_PTZControl(13, true,4);
}

function jt_shang(){ //镜头向上移动
    I_PTZControl(1, false,4);
    I_PTZControl(1, true,4);
}

function jt_xia(){ //镜头向下移动
    I_PTZControl(2, false,4);
    I_PTZControl(2, true,4);
}

function jt_zuo(){ //镜头向左移动
    I_PTZControl(3, false,4);
    I_PTZControl(3, true,4);
}

function jt_you(){ //镜头向右移动
    I_PTZControl(4, false,4);
    I_PTZControl(4, true,4);
}

function jt_zuoshang(){ //镜头向左上移动
    I_PTZControl(5, false,4);
    I_PTZControl(5, true,4);
}

function jt_zuoxia(){ //镜头向左下移动
    I_PTZControl(6, false,4);
    I_PTZControl(6, true,4);
}

function jt_youshang(){ //镜头向右上移动
    I_PTZControl(7, false,4);
    I_PTZControl(7, true,4);
}

function jt_youxia(){ //镜头向右下移动
    I_PTZControl(8, false,4);
    I_PTZControl(8, true,4);
}

