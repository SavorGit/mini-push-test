// pages/interact/index.js
const util = require('../../utils/util.js')
const app = getApp()
var openid;
var box_mac;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: getApp().globalData.statusBarHeight,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    openid:'',
    hotel_name:'',   //酒楼名称
    room_name:'',    //包间名称
    box_mac: '',     //机顶盒mac
    is_link:0,       //是否连接酒楼电视
    happy_vedio_url: '',          //生日视频url
    happy_vedio_name: '',          //生日视频名称
    happy_vedio_title: '',          //生日视频标题
    showModal: false,   //显示授权登陆弹窗
    is_game_banner:0,  //是否显示猴子爬树游戏banner
    is_open_simple:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    var that = this;
    if (app.globalData.openid && app.globalData.openid != '') { 
      that.setData({
        openid: app.globalData.openid
      })
      openid = app.globalData.openid;
      //判断用户是否注册
      wx.request({
        url: app.globalData.api_url+'/smallapp21/User/isRegister',
        data: {
          "openid": app.globalData.openid,
          "page_id": 3
        },
        header: {
          'content-type': 'application/json'
        },
        success:function(res){
          wx.setStorage({
            key: 'savor_user_info',
            data: res.data.result.userinfo,
          })
        },
        fail: function (e) {
          wx.setStorage({
            key: 'savor_user_info',
            data: { 'openid': app.globalData.openid },
          })
        }
      });//判断用户是否注册结束
      wx.request({
        url: app.globalData.api_url +'/Smallapp/index/isHaveCallBox?openid=' + app.globalData.openid,
        headers: {
          'Content-Type': 'application/json'
        },
        success: function (rest) {
          var is_have = rest.data.result.is_have;
          if (is_have == 1) {//已经扫码链接电视
            that.setData({
              is_link:1,
              hotel_name:rest.data.result.hotel_name,
              room_name:rest.data.result.room_name,
              box_mac :rest.data.result.box_mac,
            })
            box_mac = rest.data.result.box_mac;
            getHotelInfo(rest.data.result.box_mac);
          }else {
            that.setData({
              is_link: 0,
              box_mac: '',
            })
            box_mac ='';
          }
        }
      })
    }else {
      app.openidCallback = openid => { 
        if (openid != '') { 
          that.setData({
            openid: openid
          })
          openid = openid;
          //判断用户是否注册
          wx.request({
            url: app.globalData.api_url +'/smallapp21/User/isRegister',
            data: {
              "openid": app.globalData.openid,
              "page_id": 3
            },
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              wx.setStorage({
                key: 'savor_user_info',
                data: res.data.result.userinfo,
              })
            }, 
            fail: function (e) {
              wx.setStorage({
                key: 'savor_user_info',
                data: { 'openid': openid},
              })
            }
          });//判断用户是否注册结束
          wx.request({
            url: app.globalData.api_url +'/Smallapp/index/isHaveCallBox?openid=' + openid,
            headers: {
              'Content-Type': 'application/json'
            },
            success: function (rest) {
              var is_have = rest.data.result.is_have;
              if (is_have == 1) {
                that.setData({
                  is_link: 1,
                  hotel_name: rest.data.result.hotel_name,
                  room_name: rest.data.result.room_name,
                  box_mac: rest.data.result.box_mac,
                })
                box_mac=rest.data.result.box_mac;
                getHotelInfo(rest.data.result.box_mac);
              }else {
                that.setData({
                  is_link: 0,
                  box_mac: '',
                })
                box_mac = '';
              }
            }
          })
        }
      }
    }
    function getHotelInfo(box_mac) {//获取链接的酒楼信息
      wx.request({
        url: app.globalData.api_url +'/Smallapp/Index/getHotelInfo',
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          box_mac: box_mac,
        },
        method: "POST",
        success: function (res) {
          that.setData({
            hotel_room: res.data.result.hotel_name + res.data.result.room_name,
            happy_vedio_url: res.data.result.vedio_url,
            happy_vedio_name: res.data.result.file_name,
            happy_vedio_title: res.data.result.name,
            is_open_simple: res.data.result.is_open_simple
          })
        }
      })
    }
    //是否显示猴子排数banner
    wx.request({
      url: app.globalData.api_url +'/Games/index/isViewGame',
      data:{
        game_id:2,
      },
      success:function(res){
        var is_game_banner = res.data.result.status;
        var img_url = res.data.result.img_url;
        that.setData({
          is_game_banner: is_game_banner,
          banner_img_url: img_url
        })
      }
    })
  },
  onGetUserInfo: function (res) { 
    var that = this;
    var user_info = wx.getStorageSync("savor_user_info");
    openid = user_info.openid;
    if (res.detail.errMsg =='getUserInfo:ok'){
      wx.request({
        url: app.globalData.api_url +'/smallapp21/User/register',
        data: {
          'openid': openid,
          'avatarUrl': res.detail.userInfo.avatarUrl,
          'nickName': res.detail.userInfo.nickName,
          'gender': res.detail.userInfo.gender
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          wx.setStorage({
            key: 'savor_user_info',
            data: res.data.result,
          });
          that.setData({
            showModal: false,
          })
        }
      })
    }
    /*else {
      wx.request({
        url: app.globalData.api_url+'/smallapp21/User/refuseRegister',
        data: {
          'openid': openid,
        },
        header: {
          'content-type': 'application/json'
        },
        success:function(res){
          if(res.data.code==10000){
            user_info['is_wx_auth'] =1;
            wx.setStorage({
              key: 'savor_user_info',
              data: user_info,
            })
            that.setData({
              showModal: false,
            })
          }else {
            wx.showToast({
              title: '拒绝失败,请重试',
              icon: 'none',
              duration: 2000
            });
          }
          
        }
      })
      
    }*/
  },
  //关闭授权弹窗
  closeAuth:function(){
    //关闭授权登陆埋点
    var that = this;
    that.setData({
      showModal: false,
    })
    var user_info = wx.getStorageSync("savor_user_info");
    openid = user_info.openid;
    console.log(box_mac);
    if (box_mac == 'undefined' || box_mac == undefined){
      box_mac = '';
    }
    wx.request({
      url: app.globalData.api_url +'/Smallapp21/index/closeauthLog',
      header: {
        'content-type': 'application/json'
      },
      data: {
        openid: openid,
        box_mac: box_mac,
      },
      
    })
  },
  
 
  //选择照片上电视
  chooseImage(e) {
    var that = this;
    var user_info = wx.getStorageSync("savor_user_info");
    if (user_info.is_wx_auth!=2){
      that.setData({
        showModal:true
      })
    }else {
      var box_mac = e.currentTarget.dataset.boxmac;
      var openid = e.currentTarget.dataset.openid;
      var is_open_simple = e.currentTarget.dataset.is_open_simple;
      if (box_mac == '') {
        wx.showModal({
          title: '提示',
          content: "您可扫码链接热点合作餐厅电视,使用此功能",
          showCancel: true,
          confirmText: '立即扫码',
          success: function (res) {
            if (res.confirm == true) {
              wx.scanCode({
                onlyFromCamera: true,
                success: (res) => {
                  console.log(res);
                  wx.navigateTo({
                    url: '/' + res.path
                  })
                }
              })
            }
          }
        });
      } else {
        wx.navigateTo({
          url: '/pages/forscreen/forimages/index?box_mac=' + box_mac + '&openid=' + openid + '&is_open_simple=' + is_open_simple,
        })
      } 
    }
  },
  //选择视频投屏
  chooseVedio(e) {
    var that = this
    var user_info = wx.getStorageSync("savor_user_info");
    if (user_info.is_wx_auth !=2) {
      that.setData({
        showModal: true
      })
    }else{
      var box_mac = e.currentTarget.dataset.boxmac;
      var openid = e.currentTarget.dataset.openid;
      var is_open_simple = e.currentTarget.dataset.is_open_simple;
      if (box_mac == '') {
        wx.showModal({
          title: '提示',
          content: "您可扫码链接热点合作餐厅电视,使用此功能",
          showCancel: true,
          confirmText: '立即扫码',
          success: function (res) {
            if (res.confirm == true) {
              wx.scanCode({
                onlyFromCamera: true,
                success: (res) => {
                  //console.log(res);
                  wx.navigateTo({
                    url: '/' + res.path
                  })
                }
              })
            }
          }
        });
      } else {
        wx.navigateTo({
          url: '/pages/forscreen/forvideo/index?box_mac=' + box_mac + '&openid=' + openid + '&is_open_simple=' + is_open_simple,
        })
      } 
    } 

    
  },
  boxShow(e) {//视频点播让盒子播放 生日歌
    var box_mac = e.currentTarget.dataset.boxmac;
    if (box_mac == '') {
      wx.showModal({
        title: '提示',
        content: "您可扫码链接热点合作餐厅电视,使用此功能",
        showCancel: true,
        confirmText: '立即扫码',
        success: function (res) {
          if (res.confirm == true) {
            wx.scanCode({
              onlyFromCamera: true,
              success: (res) => {
                //console.log(res);
                wx.navigateTo({
                  url: '/' + res.path
                })
              }
            })
          }
        }
      });
    }else {
      var openid = e.currentTarget.dataset.openid;
      var vediourl = e.currentTarget.dataset.vediourl;
      var forscreen_char = e.currentTarget.dataset.name;

      var index1 = vediourl.lastIndexOf("/");
      var index2 = vediourl.length;
      var filename = vediourl.substring(index1 + 1, index2);//后缀名
      var timestamp = (new Date()).valueOf();
      var mobile_brand = app.globalData.mobile_brand;
      var mobile_model = app.globalData.mobile_model;
      wx.request({
        url: app.globalData.netty_url +"/push/box",
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        data: {
          box_mac: box_mac,
          cmd: 'call-mini-program',
          msg: '{ "action": 5,"url":"' + vediourl + '","filename":"' + filename + '"}',
          req_id: timestamp
        },
        success: function (res) {
          wx.showToast({
            title: '点播成功,电视即将开始播放',
            icon: 'none',
            duration: 5000
          });
          wx.request({
            url: app.globalData.api_url +'/Smallapp/index/recordForScreenPics',
            header: {
              'content-type': 'application/json'
            },
            data: {
              openid: openid,
              box_mac: box_mac,
              action: 5,
              mobile_brand: mobile_brand,
              mobile_model: mobile_model,
              forscreen_char: forscreen_char,
              imgs: '["media/resource/' + filename + '"]'
            },
          });
        },
        fail: function (res) {
          wx.showToast({
            title: '网络异常,点播失败',
            icon: 'none',
            duration: 2000
          })
        }
      })
    }
    
  },
  showHappy(e) {//视频点播让盒子播放
    var box_mac = e.currentTarget.dataset.boxmac;
    var openid = e.currentTarget.dataset.openid;
    if (box_mac == '') {
      wx.showModal({
        title: '提示',
        content: "您可扫码链接热点合作餐厅电视,使用此功能",
        showCancel: true,
        confirmText: '立即扫码',
        success: function (res) {
          if (res.confirm == true) {
            wx.scanCode({
              onlyFromCamera: true,
              success: (res) => {
                //console.log(res);
                wx.navigateTo({
                  url: '/' + res.path
                })
              }
            })
          }
        }
      });
    }
    /*else {
      var openid = e.currentTarget.dataset.openid;
      var vediourl = e.currentTarget.dataset.vediourl;
      var forscreen_char = e.currentTarget.dataset.name;

      var index1 = vediourl.lastIndexOf("/");
      var index2 = vediourl.length;
      var filename = vediourl.substring(index1 + 1, index2);//后缀名
      var timestamp = (new Date()).valueOf();
      var mobile_brand = app.globalData.mobile_brand;
      var mobile_model = app.globalData.mobile_model;
      wx.request({
        url: "https://netty-push.littlehotspot.com/push/box",
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        data: {
          box_mac: box_mac,
          cmd: 'call-mini-program',
          msg: '{ "action": 5,"url":"' + vediourl + '","filename":"' + filename + '"}',
          req_id: timestamp
        },
        success: function (res) {
          wx.showToast({
            title: '点播成功,电视即将开始播放',
            icon: 'none',
            duration: 5000
          });
          wx.request({
            url: app.globalData.api_url+'/Smallapp/index/recordForScreenPics',
            header: {
              'content-type': 'application/json'
            },
            data: {
              openid: openid,
              box_mac: box_mac,
              action: 5,
              mobile_brand: mobile_brand,
              mobile_model: mobile_model,
              forscreen_char: forscreen_char,
              imgs: '["media/resource/' + filename + '"]'
            },
          });
        },
        fail: function (res) {
          wx.showToast({
            title: '网络异常,点播失败',
            icon: 'none',
            duration: 2000
          })
        }
      })
    }*/
    else {
      wx.navigateTo({
        url: '/pages/thematic/birthday/list?openid='+openid+'&box_mac='+box_mac,
      })
    }
  },
  //互动游戏
  hdgames(e) {
     var openid = e.currentTarget.dataset.openid;
     var box_mac = e.currentTarget.dataset.boxmac;
     if (box_mac == '') {
       wx.showModal({
         title: '提示',
         content: "您可扫码链接热点合作餐厅电视,使用此功能",
         showCancel: true,
         confirmText: '立即扫码',
         success: function (res) {
           if (res.confirm == true) {
             wx.scanCode({
               onlyFromCamera: true,
               success: (res) => {
                 //console.log(res);
                 wx.navigateTo({
                   url: '/' + res.path
                 })
               }
             })
           }
         }
       });
     }else {
       var mobile_brand = app.globalData.mobile_brand;
       var mobile_model = app.globalData.mobile_model;
      //  wx.navigateTo({
      //    url: '/pages/activity/turntable/index?box_mac=' + box_mac + '&openid=' + openid,
      //  })
        
        // wx.request({
        //   url: 'https://mobile.littlehotspot.com/Netty/index/index',
        //   data:{
        //     box_mac:box_mac,
        //     msg:'{"action":111}'
        //   },
        //   success:function(){
        //     wx.request({//发起互动游戏
        //       url: 'https://mobile.littlehotspot.com/Games/ClimbTree/launchGame',
        //       data: {
        //         game_id: 2,
        //         box_mac: box_mac
        //       },
             
        //     })
        //   }
        // })
        wx.navigateTo({
          url: '/pages/game/climbtree/index?box_mac='+box_mac+'&game_id=2'
        })
    }
    
  },
  //断开连接
  breakLink: function (e) {
    var that = this;
    openid = e.currentTarget.dataset.openid;
    box_mac = e.currentTarget.dataset.boxmac;
    var timestamp = (new Date()).valueOf();
    wx.request({
      url: app.globalData.api_url +'/Smallapp21/index/breakLink',
      header: {
        'content-type': 'application/json'
      },
      method: "POST",
      data: {
        box_mac: box_mac,
        openid:openid
      },
      success: function (res) {
        if(res.data.code==10000){
          that.setData({
            is_link: 0,
            box_mac: ''
          })
          wx.reLaunch({
            url: '../index/index'
          })
          wx.showToast({
            title: '断开成功',
            icon: 'none',
            duration: 2000
          })
        }else {
          wx.showToast({
            title: '断开失败',
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail: function (res) {
        wx.showToast({
          title: '网络异常，断开失败',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  forscreenHistory:function(e){
    var box_mac = e.currentTarget.dataset.boxmac;
    var openid  = e.currentTarget.dataset.openid;
    if (box_mac == '') {
      wx.showModal({
        title: '提示',
        content: "您可扫码链接热点合作餐厅电视,使用此功能",
        showCancel: true,
        confirmText: '立即扫码',
        success: function (res) {
          if (res.confirm == true) {
            wx.scanCode({
              onlyFromCamera: true,
              success: (res) => {
                //console.log(res);
                wx.navigateTo({
                  url: '/' + res.path
                })
              }
            })
          }
        }
      });
    }else {
      wx.navigateTo({
        url: '/pages/forscreen/history/list?openid='+openid+'&box_mac='+box_mac,
      })
    }
  },
  //遥控呼大码
  callQrCode: util.throttle(function (e) {
    openid = e.currentTarget.dataset.openid;
    box_mac = e.currentTarget.dataset.box_mac;
    var qrcode_img = e.currentTarget.dataset.qrcode_img;
    app.controlCallQrcode(openid, box_mac, qrcode_img);
  }, 3000),//呼大码结束
  //打开遥控器
  openControl: function (e) {
    var that = this;
    var qrcode_url = app.globalData.api_url +'/Smallapp/index/getBoxQr?box_mac=' + box_mac + '&type=3';
    that.setData({
      
      popRemoteControlWindow:true,
      qrcode_img: qrcode_url
    })
  },
  //关闭遥控
  closeControl: function (e) {
    var that = this;
    that.setData({
      
      popRemoteControlWindow:false,
    })

  },
  //遥控退出投屏
  exitForscreen: function (e) {
    openid = e.currentTarget.dataset.openid;
    box_mac = e.currentTarget.dataset.box_mac;
    app.controlExitForscreen(openid, box_mac);
  },
  //遥控调整音量
  changeVolume: function (e) {
    box_mac = e.currentTarget.dataset.box_mac;
    var change_type = e.currentTarget.dataset.change_type;
    app.controlChangeVolume(box_mac, change_type);

  },
  //遥控切换节目
  changeProgram: function (e) {
    box_mac = e.currentTarget.dataset.box_mac;
    var change_type = e.currentTarget.dataset.change_type;
    app.controlChangeProgram(box_mac, change_type);
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.onLoad()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})