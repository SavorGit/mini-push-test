// pages/forscreen/history/video.js
const util = require('../../../utils/util.js')
const app = getApp()
var box_mac;
var openid;
var api_url = app.globalData.api_url;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: getApp().globalData.statusBarHeight,
    video_url: '',
    video_name: '',
    is_replay_disabel: false,
    showControl: false, //显示授权登陆弹窗,
    is_box_show: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options);
    
    var that = this;
    var user_info = wx.getStorageSync("savor_user_info");
    //var res_id = options.res_id; //资源id
    var video_url = options.video_url;
    var duration = options.duration;
    var forscreen_url = options.forscreen_url;
    var resource_id = options.resource_id;
    var filename = options.filename;
    box_mac = options.box_mac;
    openid = user_info.openid;
    
    that.setData({
      video_url: video_url,
      duration:duration,
      forscreen_url: forscreen_url,
      resource_id: resource_id,
      filename: filename,
      openid: openid,
    })

    //wx.hideShareMenu();
      console.log(api_url)
    wx.request({
      url: api_url + '/Smallapp/index/isHaveCallBox?openid=' + openid,
      headers: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
        console.log(res)
        if (res.data.code == 10000 && res.data.result.is_have == 1) {
          that.setData({
            is_open_simple: res.data.result.is_open_simple,
          })
        }
      }
    })


    


  },
  
  //电视播放
  replayHistory: function (e) {
    console.log(e);
    var that = this;
    var user_info = wx.getStorageSync("savor_user_info");
    //console.log(user_info);
    var avatarUrl = user_info.avatarUrl;
    var nickName = user_info.nickName;
    var forscreen_char = '';
    var mobile_brand = app.globalData.mobile_brand;
    var mobile_model = app.globalData.mobile_model;
    //console.log(e);
    var openid = e.target.dataset.openid;
    var box_mac = e.target.dataset.box_mac;
    var forscreen_url = e.target.dataset.forscreen_url;
    var resource_id = e.target.dataset.resource_id;
    var filename = e.target.dataset.filename;
    //var res_type = e.target.dataset.res_type;
    //var res_list = e.target.dataset.historylist;
    //var res_len = res_list.length;
    var forscreen_id = (new Date()).valueOf();  //投屏id
    var action = 8;  //重新播放

    wx.request({
      url: api_url + '/smallapp21/User/isForscreenIng',
      headers: {
        'Content-Type': 'application/json'
      },
      method: "POST",
      data: { box_mac: box_mac },
      success: function (res) {
        var is_forscreen = res.data.result.is_forscreen;
        if (is_forscreen == 1) {
          wx.showModal({
            title: '确认要打断投屏',
            content: '当前电视正在进行投屏,继续投屏有可能打断当前投屏中的内容.',
            success: function (res) {
              if (res.confirm) {
               //视频投屏
                  
                    wx.request({
                      url: api_url + '/Smallapp/index/recordForScreenPics',
                      header: {
                        'content-type': 'application/json'
                      },
                      data: {
                        openid: openid,
                        box_mac: box_mac,
                        action: action,

                        mobile_brand: mobile_brand,
                        mobile_model: mobile_model,
                        forscreen_char: forscreen_char,
                        imgs: '["' + forscreen_url+ '"]',
                        resource_id: resource_id,
                        resource_type: 2,
                        res_sup_time: 0,
                        res_eup_time: 0,
                        resource_size: 0,
                        is_pub_hotelinfo: 0,
                        is_share: 0,
                        forscreen_id: forscreen_id,
                        duration: 0,
                      },
                      success: function (ret) {

                      }
                    });

                    wx.request({
                      url: api_url + '/Netty/Index/index',
                      headers: {
                        'Content-Type': 'application/json'
                      },
                      method: "POST",
                      data: {
                        box_mac: box_mac,
                        msg: '{ "action":2, "url": "' + forscreen_url + '", "filename":"' + filename + '","openid":"' + openid + '","resource_type":2,"video_id":"' + resource_id + '","avatarUrl":"' + avatarUrl + '","nickName":"' + nickName + '","forscreen_id":"' + forscreen_id + '"}',
                      },
                      success: function (result) {

                        wx.showToast({
                          title: '重投成功,电视即将开始播放',
                          icon: 'none',
                          duration: 2000
                        });
                      },
                      fail: function (res) {
                        wx.showToast({
                          title: '网络异常,点播失败',
                          icon: 'none',
                          duration: 2000
                        })
                      }
                    });
                  
                
              } else {

              }
            }
          })
        } else {
          //视频投屏
            
              wx.request({
                url: api_url + '/Smallapp/index/recordForScreenPics',
                header: {
                  'content-type': 'application/json'
                },
                data: {
                  openid: openid,
                  box_mac: box_mac,
                  action: action,

                  mobile_brand: mobile_brand,
                  mobile_model: mobile_model,
                  forscreen_char: forscreen_char,
                  imgs: '["' + forscreen_url + '"]',
                  resource_id: resource_id,
                  resource_type: 2,
                  res_sup_time: 0,
                  res_eup_time: 0,
                  resource_size: 0,
                  is_pub_hotelinfo: 0,
                  is_share: 0,
                  forscreen_id: forscreen_id,
                  duration: 0,
                },
                success: function (ret) {

                }
              });

              wx.request({
                url: api_url + '/Netty/Index/index',
                headers: {
                  'Content-Type': 'application/json'
                },
                method: "POST",
                data: {
                  box_mac: box_mac,
                  msg: '{ "action":2, "url": "' + forscreen_url + '", "filename":"' + filename + '","openid":"' + openid + '","resource_type":2,"video_id":"' + resource_id + '","avatarUrl":"' + avatarUrl + '","nickName":"' + nickName + '","forscreen_id":"' + forscreen_id + '"}',
                },
                success: function (result) {

                  wx.showToast({
                    title: '重投成功,电视即将开始播放',
                    icon: 'none',
                    duration: 2000
                  });
                },
                fail: function (res) {
                  wx.showToast({
                    title: '网络异常,点播失败',
                    icon: 'none',
                    duration: 2000
                  })
                }
              });
            
          
        }
      }
    })



  },//电视播放失败
  //遥控呼大码
  callQrCode: util.throttle(function(e) {
    openid = e.currentTarget.dataset.openid;
    box_mac = e.currentTarget.dataset.box_mac;
    var qrcode_img = e.currentTarget.dataset.qrcode_img;
    app.controlCallQrcode(openid, box_mac, qrcode_img);
  }, 3000), //呼大码结束
  //打开遥控器
  openControl: function(e) {
    var that = this;
    var qrcode_url = api_url + '/Smallapp/index/getBoxQr?box_mac=' + box_mac + '&type=3';
    that.setData({

      showControl: true,
      qrcode_img: qrcode_url
    })
  },
  //关闭遥控
  closeControl: function(e) {
    var that = this;
    that.setData({

      showControl: false,
    })

  },
  //遥控退出投屏
  exitForscreen: function(e) {
    openid = e.currentTarget.dataset.openid;
    box_mac = e.currentTarget.dataset.box_mac;
    app.controlExitForscreen(openid, box_mac);
  },
  //遥控调整音量
  changeVolume: function(e) {
    box_mac = e.currentTarget.dataset.box_mac;
    var change_type = e.currentTarget.dataset.change_type;
    app.controlChangeVolume(box_mac, change_type);

  },
  //遥控切换节目
  changeProgram: function(e) {
    box_mac = e.currentTarget.dataset.box_mac;
    var change_type = e.currentTarget.dataset.change_type;
    app.controlChangeProgram(box_mac, change_type);
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },


})