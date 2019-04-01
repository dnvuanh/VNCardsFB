var GameHelper = cc.Class({
    cardValue(card) 
    {
        return card / 4 | 0;
    },

    isSame(cards)
    {
        if(cards.length < 2) {
            return false;
        }

        for(let i = 1; i < cards.length; i++) {
            if(this.cardValue(cards[0]) != this.cardValue(cards[i])) {
                    return false;
                }
        }
    return true;
    },

    isStraight(cards)
    {
        if(cards.length < 3) {
            return false;
        }

        for(let i = 0; i < cards.length - 1; i++) {
            if(this.cardValue(cards[i]) - this.cardValue(cards[i+1]) != 1){
                return false;
            }
        }
        return true;
    },

    parseCards(cards) 
    {  
        cards.sort((a,b) => b - a);
        var result = {setType: Define.SetType.ERROR, numOfCard:"", topCard: ""};
        result.numOfCard = cards.length;
        result.topCard = cards[0];

        if(this.isStraight(cards))
        {
            result.setType = Define.SetType.STRAIGHT;
            return result;
        }
        
        switch (cards.length) {
        case 1:
            result.setType = Define.SetType.SINGLE;
            break;
        case 2:
            if(this.isSame(cards)) {
                result.setType = Define.SetType.PAIR;
            }
            break;
        case 3:
            if(this.isSame(cards)) {
                result.setType = Define.SetType.TRIPLE;
            }
            break;
        case 4:
            if(this.isSame(cards)) {
                result.setType = Define.SetType.QUADS;
            }
            break;
        case 6:
            if(this.isSame([cards[0], cards[1]]) &&
                this.isSame([cards[2], cards[3]]) &&
                this.isSame([cards[4], cards[5]]) &&
                this.isStraight([cards[0], cards[2], cards[4]])) {
                    result.setType = Define.SetType.THREEPAIRS;
                }
            break;
        case 8:
            if(this.isSame([cards[0], cards[1]]) &&
                this.isSame([cards[2], cards[3]]) &&
                this.isSame([cards[4], cards[5]]) &&
                this.isSame([cards[6], cards[7]]) &&
                this.isStraight([cards[0], cards[2], cards[4], cards[6]])) {
                    result.setType = Define.SetType.FOURPAIRS;
                }
            break;
        default:
        }
        return result;
    },

    validTurn(previousSet, current)
    {
        const HEO = 15;
        var currentSet = this.parseCards(current);
        if(currentSet.setType == Define.SetType.ERROR)  {
            return false;
        }
        if(previousSet === null) {
            return true;
        }
        cc.log(JSON.stringify(currentSet));
        if(previousSet.setType >= Define.SetType.THREEPAIRS){
            return currentSet.setType * 100 + currentSet.topCard > previousSet.setType * 100 + previousSet.topCard;
        } else if(this.cardValue(previousSet.topCard) == HEO && currentSet.setType >= Define.SetType.THREEPAIRS) {
            return true;
        } else if(currentSet.setType == previousSet.setType 
            && currentSet.numOfCard == previousSet.numOfCard 
            && currentSet.topCard > previousSet.topCard)  {
            return true;
        }
        return false;
    }
});

module.exports = new GameHelper();