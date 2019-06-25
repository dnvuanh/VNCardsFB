var Loading = require("Loading");
var UIManager = cc.Class({
    extends: cc.Component,

    properties: {
        loadingscreen: Loading,
        MenuGame: require("MenuGame"),
        transitionFrame: cc.Node,
        transitionTime: 0.1
    },
    
    statics:
    {
        instance: null,
    },
    
    onLoad()
    {
        UIManager.instance = this;
        this.MenuStack = [];
        this.PopupStack = [];
        this.CurrentMenu = null;
        this.CurrentPopup = null;
        this.transitionFrame.active = true;
        this.transitionFrame.opacity = 255;
    },

    start()
    {
        this.showMenu("MenuMain");
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
        this.transitionFrame.active = true;
        this.transitionFrame.runAction(cc.fadeIn(this.transitionTime));
        this.node.runAction(cc.sequence(cc.delayTime(this.transitionTime), cc.callFunc(()=>{
            let menu = this.node.getChildByName(menuName);
            if (menu != null)
            {
                menu.getComponent("MenuScene").Show();
                this.MenuStack.push(menuName);
                this.CurrentMenu = menuName;
            }
            
            if (this.MenuStack.length > 1)
            {
                if (!menu.getComponent("MenuScene").IsPopup())
                {
                    let lastMenu = this.node.getChildByName(this.MenuStack[this.MenuStack.length - 2]).getComponent("MenuScene");
                        lastMenu.getComponent("MenuScene").Hide();
                }

                if (closeCurrent)
                    this.MenuStack.splice(this.MenuStack.length - 2,1);
            }
        }), cc.callFunc(()=>{
            this.transitionFrame.runAction(cc.sequence(cc.fadeOut(this.transitionTime), cc.callFunc(()=>{
                this.transitionFrame.active = false;
            })));
        })))
        
        //return menu;
    },

    showPopup(popupName)
    {
        let popup = this.node.getChildByName(popupName).getComponent("PopupScene");
        if (!this.CurrentPopup)
        {
            popup.Show();
            this.CurrentPopup = popupName;
        }
        else
        {
            this.PopupStack.push(popupName);
        }
        return popup;
    },

    closeCurrentPopup()
    {
        if (this.CurrentPopup)
        {
            let popup = this.node.getChildByName(this.CurrentPopup).getComponent("PopupScene");
                popup.Hide();
            this.CurrentPopup = null;

            if (this.PopupStack.length > 0)
            {
                let nextPopup = this.PopupStack.pop();
                this.showPopup(nextPopup);
            }
        }
    },

    closeCurrentMenu()
    {
        this.transitionFrame.active = true;
        this.transitionFrame.runAction(cc.fadeIn(this.transitionTime));
        this.node.runAction(cc.sequence(cc.delayTime(this.transitionTime), cc.callFunc(()=>{
            if (this.MenuStack.length > 1)
            {
                let nextMenu = this.node.getChildByName(this.MenuStack[this.MenuStack.length-2]);
                    nextMenu.getComponent("MenuScene").Show();
            }
            
            let menu = this.node.getChildByName(this.CurrentMenu);
                menu.getComponent("MenuScene").Hide();
            
            this.MenuStack.splice(this.MenuStack.length-1, 1);
            this.CurrentMenu = this.MenuStack[this.MenuStack.length];
        }), cc.callFunc(()=>{
            this.transitionFrame.runAction(cc.sequence(cc.fadeOut(this.transitionTime), cc.callFunc(()=>{
                this.transitionFrame.active = false;
            })));
        })))
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
    
    playerEnterSeat(playerInfo, seat, additionalInfo, isReady)
    {
        this.MenuGame.playerEnterSeat(playerInfo, seat, additionalInfo, isReady);
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

    updateResult(scores, winner, remainCards)
    {
        this.MenuGame.updateResult(scores, winner, remainCards);
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

    refreshSeats()
    {
        this.MenuGame.refreshSeats();
    },

    getPlayerSeat(playerId)
    {
        return this.MenuGame.getPlayerSeat(playerId);
    },

    setRoomId(roomId)
    {
        this.MenuGame.setRoomId(roomId);
    },
});
