var Loading = require("Loading");
var UIManager = cc.Class({
    extends: cc.Component,

    properties: {
        loadingscreen: Loading,
        MenuGame: require("MenuGame"),
    },
    
    statics:
    {
        instance: null,
    },
    
    onLoad()
    {
        UIManager.instance = this;
        this.MenuStack = [];
        this.CurrentMenu = null;
    },

    start()
    {
        GameMgr.instance.onInit();
    },

    showLoading(display)
    {
        if (display)
            this.loadingscreen.show();
        else
            this.loadingscreen.hide();
    },
    
    showMenu(menuName, closeCurrent=true)
    {
        let menu = this.node.getChildByName(menuName);
        if (menu != null)
        {
            menu.active = true;
            this.MenuStack.push(menuName);
            this.CurrentMenu = menuName;
        }
        
        if (this.MenuStack.length > 1)
        {
            let lastMenu = this.node.getChildByName(this.MenuStack[this.MenuStack.length - 2]);
                lastMenu.active = false;

            if (closeCurrent)
                this.MenuStack.splice(this.MenuStack.length - 2,1);
        }
        return menu;
    },
    
    closeCurrentMenu()
    {
        if (this.MenuStack.length > 1)
        {
            let nextMenu = this.node.getChildByName(this.MenuStack[this.MenuStack.length-2]);
                nextMenu.active = true;
        }
        
        let menu = this.node.getChildByName(this.CurrentMenu);
            menu.active = false;
        
        this.MenuStack.splice(this.MenuStack.length-1, 1);
        this.CurrentMenu = this.MenuStack[this.MenuStack.length];
    },

    closeAllMenu()
    {
        let childs = this.node.children;
            childs.forEach(element => {
                element.active = false;
            });
    },

    initOnlineList()
    {
        this.onlineList.Init();
    },

    addPlayer(player)
    {
        this.MenuGame.addPlayer(player);
    },

    removePlayer(player)
    {
        console.log(player);
        this.MenuGame.removePlayer(player);
    },
    
    playerEnterSeat(playerInfo, seat)
    {
        this.MenuGame.playerEnterSeat(playerInfo, seat);
    },

    playerLeaveSeat(seat)
    {
        this.MenuGame.playerLeaveSeat(seat);
    },

    setHost(playerId)
    {
        this.MenuGame.setHost(playerId);
    },

    enableStartButton(enable) 
    {
        this.MenuGame.enableStartButton(enable);
    },

    onCardsReceived(cards, playAnim)
    {
        this.MenuGame.onCardsReceived(cards, playAnim);
    },

    getSelectedCards()
    {
        return this.MenuGame.getSelectedCards();
    },

    onTurnChange(playerId, startTime, timeout)
    {
        this.MenuGame.onTurnChange(playerId, startTime, timeout);
    },

    checkThrowable()
    {
        this.MenuGame.checkThrowable();
    },

    onThrowSuccess(playerId, cards)
    {
        this.MenuGame.onThrowSuccess(playerId, cards);
    },

    onGameWaiting()
    {
        this.MenuGame.onGameWaiting();
    },

    onGameOver()
    {
        this.MenuGame.onGameOver();
    },

    displayResult(scores, playerWinId, playersCards)
    {
        this.MenuGame.displayResult(scores, playerWinId, playersCards);
    },

    onPlayerReady(playerId, isReady)
    {
        this.MenuGame.onPlayerReady(playerId, isReady);
    },

    onPlayerRegisterLeave(isLeave)
    {
        this.MenuGame.onPlayerRegisterLeave(isLeave);
    },

    onGameStateReady(timeStamp)
    {
        this.MenuGame.onGameStateReady(timeStamp);
    },

    onGameStart()
    {
        this.MenuGame.onGameStart();
    },

    refreshSeats(Seats)
    {
        this.MenuGame.refreshSeats(Seats);
    }
});
