import LevelData from "./LevelData";

//关卡数据管理器
export default class LevelManager {

    currentLevelData: LevelData                     //当前关卡数据
    userData: number                         //用户数据

    levelDataList: LevelData[]               //所有关卡数据


    constructor(jsonData: any) {
        if (jsonData == null) {
            // 关卡数据为空
            cc.error('level data is null');
            return;
        }
        this.levelDataList = jsonData;
        this.userData = cc.sys.localStorage.getItem('userData');
        if (this.userData == null) {
            this.userData = 1;
        }
        this.currentLevelData = this.levelDataList[this.userData - 1];
    }

    getLevelData() {
        return this.currentLevelData;
    }

    getUserData() {
        return this.userData;
    }

    //载入游戏数据
    loadLevel(level: number) {
        this.currentLevelData = this.levelDataList[level];
        this.userData=level+1;
    }

    //保存游戏数据
    saveLevel() {
        cc.sys.localStorage.setItem('userData', this.userData);
    }
}