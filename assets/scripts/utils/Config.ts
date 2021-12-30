export default class Config {

    public static START_BALANCE: number = 10000; 
    public static START_LEVEL: number = 1; 
    public static START_EXP_MAX: number = 50;  
    public static START_VOLUME_MUSIC: number = 0;  
    public static START_VOLUME_EFFECT: number = 0.5; 
    public static START_AUTO_BET: number = 0.5;   
    
    public static MIN_RANK: number = 0; 
    public static MAX_RANK: number = 12; 

    public static MIN_SUIT: number = 0; 
    public static MAX_SUIT: number = 3; 

    //space
    public static CARD_SPACE: number = -160;
    public static HAND_SPACE: number = 150;
    public static DRAW_CARD_SPACE: number = 35;

    //time
    public static NEXT_HAND_WAIT_TIME: number = 1.5;
    public static GET_CHIP_TIME: number = 1; 
    public static CARD_SLIDE_TIME: number = 0.1; 
    public static DRAW_CARD_TIME: number = 0.25; 
    public static HAND_SPLIT_TIME: number = 0.15;
    public static PAGE_VIEW_SCROLL_TIME: number = 0.5;
    public static BACKGROUND_SCROLL_TIME: number = 0.4;


    //daily reward
    public static DAILY_REWARD_COOLDOWN: number = 24; //hours  
    public static DAILY_REWARD_CHIP: number[] = [10000, 20000, 25000, 30000, 35000, 40000, 50000];
    
    //lucky spin
    public static LUCKY_SPIN_READY_TIME: number = 1; //minute
    public static LUCKY_SPIN_POOL_RESET_TIME: number = 7; //day

    public static LUCKY_SPIN_COLOR: number[] = [0, 8, 10, 2, 12, 4, 14, 6, 1, 7, 3, 13, 11, 5, 9];
    public static LUCKY_SPIN_BASE_CHIP: number[] = [100000, 50000, 40000, 25000, 20000, 12500, 10000, 8000, 5000, 4000, 
    3500, 3000, 2500, 2000, 1000];
    public static LUCKY_SPIN_Amount: number[] = [1, 2, 5, 16, 32, 60, 40, 70, 50, 100, 100, 100, 100, 100, 100];

    //shop config
    public static SHOP_ITEM_COUNT: number = 6;  
    public static SHOP_CHIP: number[] = [100000, 700000, 1600000, 4000000, 14000000, 38000000];
    public static SHOP_PRICE: number[] = [1, 5, 10, 20, 50, 100];
    public static SHOP_PACKAGE_NAME: string[] = ['chip01', 'chip05', 'chip10', 'chip20', 'chip50', 'chip100'];

    //stats dialog
    public static STATS_KEYS: string[] = ["HAND_PLAY","HAND_WIN","TOTAL_CHIP_BET","TOTAL_CHIP_WIN","WIN_RATE","HIGHEST_WIN_HIT","BLACKJACK_TIMES"];

    //daily quest
    public static QUEST: string[] = ["Q_PLAYED_TIMES","Q_WIN_TIMES","Q_HIT_TIMES","Q_WIN_STREAKS", "Q_SPLIT_TIMES"];
    public static QUEST_NUMBER: number[] = [10, 5, 25, 3, 10];
    public static QUEST_CHIP: number[] = [1000, 1000, 1000, 1000, 1000];
    public static QUEST_EXP: number[] = [100, 0, 100, 0, 100];

    /* public static QUEST_NUMBER: number[] = [1, 1, 1, 1, 1];
    public static QUEST_CHIP: number[] = [1000, 1000, 1000, 1000, 1000];
    public static QUEST_EXP: number[] = [100, 0, 100, 0, 100]; */

    public static QUEST_COOLDOWN: number = 24; //hours

    //achievement
    public static ACHIEVEMENT_KEY: string[] = ["HAND_PLAY","HAND_WIN","BET_TIMES", "HIT_TIMES", "BLACKJACK_TIMES", 
    "FIVE_CARD_WIN_TIMES", "SPLIT_TIMES", "LOSE_STREAK", "WIN_STREAK", "TOTAL_CHIP_WIN", "TOTAL_CHIP_BET", "INSURANCE_WIN_TIMES"];
    public static ACHIEVEMENT_PROGRESS: number[][] = [
        [10, 50, 100, 500, 1000, 5000, 10000, 50000, 500000, 1000000], 
        [5, 10, 50, 100, 500, 1000, 5000, 10000, 50000, 100000],
        [50, 100, 500, 1000, 5000, 10000, 50000, 100000, 500000, 1000000],
        [100, 200, 1000, 2000, 10000, 20000, 100000, 200000, 1000000, 2000000],
        [1, 5, 10, 50, 100, 500, 1000, 5000, 10000, 50000],
        [1, 5, 10, 50, 100, 500, 1000, 5000, 10000, 50000],
        [100, 200, 1000, 2000, 10000, 20000, 100000, 200000, 1000000, 2000000],
        [10, 20, 40, 80, 100, 200, 400, 800, 1000, 2000],
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        [10000, 100000, 500000, 1000000, 5000000, 10000000, 50000000, 100000000, 500000000, 1000000000],
        [10000, 100000, 500000, 1000000, 5000000, 10000000, 50000000, 100000000, 500000000, 1000000000],
        [1, 5, 10, 50, 100, 500, 1000, 5000, 10000, 50000],
    ];
    /* public static ACHIEVEMENT_PROGRESS: number[][] = [
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        [100, 1000, 5000, 10000, 50000, 100000, 500000, 1000000, 5000000, 10000000],
        [100, 1000, 5000, 10000, 50000, 100000, 500000, 1000000, 5000000, 10000000],
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 
    ]; */
    public static ACHIEVEMENT_CHIP: number[][] = [
        [1000, 5000, 10000, 50000, 100000, 200000, 500000, 1000000, 5000000, 10000000], 
        [1000, 5000, 10000, 50000, 100000, 200000, 500000, 1000000, 5000000, 10000000],
        [1000, 5000, 10000, 50000, 100000, 200000, 500000, 1000000, 5000000, 10000000],
        [1000, 5000, 10000, 50000, 100000, 200000, 500000, 1000000, 5000000, 10000000],
        [1000, 5000, 10000, 50000, 100000, 200000, 500000, 1000000, 5000000, 10000000],
        [1000, 5000, 10000, 50000, 100000, 200000, 500000, 1000000, 5000000, 10000000],
        [1000, 5000, 10000, 50000, 100000, 200000, 500000, 1000000, 5000000, 10000000],
        [1000, 5000, 10000, 50000, 100000, 200000, 500000, 1000000, 5000000, 10000000],
        [1000, 5000, 10000, 50000, 100000, 200000, 500000, 1000000, 5000000, 10000000],
        [1000, 5000, 10000, 50000, 100000, 200000, 500000, 1000000, 5000000, 10000000],
        [1000, 5000, 10000, 50000, 100000, 200000, 500000, 1000000, 5000000, 10000000],
        [1000, 5000, 10000, 50000, 100000, 200000, 500000, 1000000, 5000000, 10000000],
    ];
    public static ACHIEVEMENT_EXP: number[][] = [
        [10, 50, 100, 500, 1000, 2000, 5000, 10000, 50000, 100000], 
        [10, 50, 100, 500, 1000, 2000, 5000, 10000, 50000, 100000], 
        [10, 50, 100, 500, 1000, 2000, 5000, 10000, 50000, 100000], 
        [10, 50, 100, 500, 1000, 2000, 5000, 10000, 50000, 100000], 
        [10, 50, 100, 500, 1000, 2000, 5000, 10000, 50000, 100000], 
        [10, 50, 100, 500, 1000, 2000, 5000, 10000, 50000, 100000], 
        [10, 50, 100, 500, 1000, 2000, 5000, 10000, 50000, 100000], 
        [10, 50, 100, 500, 1000, 2000, 5000, 10000, 50000, 100000], 
        [10, 50, 100, 500, 1000, 2000, 5000, 10000, 50000, 100000], 
        [10, 50, 100, 500, 1000, 2000, 5000, 10000, 50000, 100000], 
        [10, 50, 100, 500, 1000, 2000, 5000, 10000, 50000, 100000], 
        [10, 50, 100, 500, 1000, 2000, 5000, 10000, 50000, 100000], 
    ];

    //room
    public static ROOM_MIN_BET: number[] = [100, 1000, 10000, 100000, 1000000, 10000000];
    public static ROOM_MAX_BET: number[] = [2000, 20000, 200000, 2000000, 20000000, 200000000];
    public static ROOM_WIN_XP: number[] = [10, 50, 250, 1250, 6250, 31250];
    public static ROOM_LOSE_XP: number[] = [2, 10, 50, 250, 1250, 6250];
    public static ROOM_DECK: number[] = [4, 4, 6, 6, 8, 8];

    //rank
    public static RANK_NAME: string[] = ["AMATEUR", "SEMI-PRO", "PRO", "EXPERT", "MASTER", "WORLDCLASS", "LEGEND", "DEVINE"];
    public static RANK_POINT: number[] = [100000, 500000, 1000000, 5000000, 10000000, 50000000, 100000000, Infinity];

    //select table
    public static TABLE_NAME: string[] = ["Atlantic City", "South Africa", "London", "Monte Carlo", "Macao", "Las Vegas"];
    public static TABLE_IMAGE: string[] = ["table_image_AtlanticCity", "table_image_SouthAfrica", "table_image_London", "table_image_MonteCarlo", "table_image_Macau", "table_image_Vegas"];
}
