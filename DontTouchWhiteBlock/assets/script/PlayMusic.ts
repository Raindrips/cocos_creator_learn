const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
  @property([cc.AudioClip])
  audioClip: cc.AudioClip[] = [];

  profile: number[];

  listMusic: Array<number[]>; //曲谱集合
  musicId: number = 0;

  onLoad() {
    this.listMusic = new Array<number[]>();
    this.node.on("playNext", this.playNext, this);
  }

  setProfile(profile: number[]) {
    this.profile = profile;
  }

  start() {
    //简谱
    //  let profile1 = [1, 2, 3, 1, 1, 2, 3, 1, 3, 4, 5, 0, 3, 4, 5, 0, 5, 6, 5, 4, 3, 1, 0, 5, 6, 5, 4, 3, 1, 0, 5, 3, 1, 0, 5, 3, 1, 0];
    let profile1 = [
      1, 2, 3, 1, 1, 2, 3, 1, 3, 4, 5, 3, 4, 5, 5, 6, 5, 4, 3, 1, 5, 6, 5, 4, 3,
      1, 5, 3, 1, 5, 3, 1,
    ];
    //  let star = [1, 1, 5, 5, 6, 6, 5, 0, 4, 4, 3, 3, 2, 2, 1, 0, 5, 5, 4, 4, 3, 3, 2, 0, 5, 5, 4, 4, 3, 3, 2, 0]
    let star = [
      1, 1, 5, 5, 6, 6, 5, 4, 4, 3, 3, 2, 2, 1, 5, 5, 4, 4, 3, 3, 2, 5, 5, 4, 4,
      3, 3, 2,
    ];
    this.listMusic.push(star);
    // this.listMusic.push(profile1);
    this.setProfile(this.listMusic[this.musicId]);
  }
  timer: number = 0.5;
  interval: number = 0;

  step: number = 0;
  update(dt: number) {
    //自动播放代码
    this.interval += dt;
    if (this.interval > this.timer) {
      //this.playerNext();
      this.interval -= this.timer;
    }
  }
  playNext() {
    this.playIndex(this.profile[this.step]);
    this.step++;
    if (this.step >= this.profile.length) {
      this.step = 0;
      this.changeNextMusic();
    }
  }

  changeNextMusic() {
    this.musicId = (this.musicId + 1) % this.listMusic.length;
    this.setProfile(this.listMusic[this.musicId]);
  }

  playIndex(i: number) {
    i = this.clamp(i, 0, this.audioClip.length);
    if (i == 0) return;
    cc.audioEngine.stopAll();
    cc.audioEngine.playEffect(this.audioClip[i], false);
  }
  clamp(val: number, min: number, max: number) {
    if (val < min) {
      return min;
    }
    if (val > max) {
      return max;
    }
    return val;
  }
}
