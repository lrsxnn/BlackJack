var AudioManager = require('AudioManager');
var LoginData = require('jlmj_login_data');
var hall_audio_mgr = require('hall_audio_mgr').Instance();

cc.Class({
    extends: cc.Component,

    properties: {
        musicSlider: cc.Slider,
        musicProgerss: cc.ProgressBar,
        soundSlider: cc.Slider,
        soundProgress: cc.ProgressBar,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        var musicVolume = AudioManager.getInstance().m_nMusicVolume;
        var soundVolume = AudioManager.getInstance().m_nSoundVolume;
        this.musicSlider.progress = musicVolume;
        this.musicProgerss.progress = musicVolume;
        this.soundSlider.progress = soundVolume;
        this.soundProgress.progress = soundVolume;
    },

    start() {

    },

    sliderMusic(event, data) {
        this.musicProgerss.progress = event.progress;
    },

    sliderSound(event, custom) {
        this.soundProgress.progress = event.progress;
    },

    okBtn() {
        hall_audio_mgr.com_btn_click();
        AudioManager.getInstance().setMusicVolume(this.musicSlider.progress);
        AudioManager.getInstance().setSoundVolume(this.soundSlider.progress);
        cc.dd.UIMgr.destroyUI(this.node);
    },

    closeBtn() {
        hall_audio_mgr.com_btn_click();
        cc.dd.UIMgr.destroyUI(this.node);
    },

    changeAccount() {
        hall_audio_mgr.com_btn_click();
        if (cc.sys.platform == cc.sys.MOBILE_BROWSER) {
            wx.closeWindow();
            return;
        }
        LoginData.Instance().saveRefreshToken('');
        cc.dd.SceneManager.enterLoginScene();
    },
});
