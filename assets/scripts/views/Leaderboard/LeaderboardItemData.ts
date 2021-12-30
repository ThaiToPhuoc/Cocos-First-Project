
export default class LeaderboardItemData {

    display_rank: string = "";
    name: string = "";
    score: number = 0;

    constructor(rankPos: string, name: string, score: number) {
        this.display_rank = rankPos;
        this.name = name;;
        this.score = score;
    }
}
