var Define = require("Define");

function GameHelper()
{
    
}

var cardValue = function(card) 
{
    return card / 4 | 0;
}

var isSame = function(cards)
{
    if(cards.length < 2) {
        return false;
    }

    for(var i = 1; i < cards.length; i++) {
        if(cardValue(cards[0]) != cardValue(cards[i])) {
                return false;
            }
    }
    return true;
}

var isStraight = function(cards)
{
    if(cards.length < 3) {
        return false;
    }

    for(var i = 0; i < cards.length - 1; i++) {
        if(cardValue(cards[i]) - cardValue(cards[i+1]) != 1){
            return false;
        }
    }
    return true;
}

var compareGreater = function(a, b) 
{ 
    return b - a;
}

GameHelper.prototype.validTurn = function(previousCards, currentCards)
{
    var HEO = 15;
    var current = parseCards(currentCards);
    if(current.setType == Define.SetType.ERROR)  {
        return false;
    }
    if(previousCards === null) {
        return true;
    }
    var previous = parseCards(previousCards);
    if(previous.setType >= Define.SetType.THREEPAIRS){
        return current.setType * 100 + current.topCard > previous.setType * 100 + previous.topCard;
    } else if(cardValue(previous.topCard) == HEO && current.setType >= Define.SetType.THREEPAIRS) {
        return true;
    } else if(current.setType == previous.setType 
        && current.numOfCard == previous.numOfCard 
        && current.topCard > previous.topCard)  {
        return true;
    }
    return false;
}

var parseCards = function(cards)
{
    cards.sort(compareGreater);
    var result = {setType: Define.SetType.ERROR, numOfCard:"", topCard: ""};
    result.numOfCard = cards.length;
    result.topCard = cards[0];

    if(isStraight(cards))
    {
        result.setType = Define.SetType.STRAIGHT;
        return result;
    }
    
    switch (cards.length) {
    case 1:
        result.setType = Define.SetType.SINGLE;
        break;
    case 2:
        if(isSame(cards)) {
            result.setType = Define.SetType.PAIR;
        }
        break;
    case 3:
        if(isSame(cards)) {
            result.setType = Define.SetType.TRIPLE;
        }
        break;
    case 4:
        if(isSame(cards)) {
            result.setType = Define.SetType.QUADS;
        }
        break;
    case 6:
        if(isSame([cards[0], cards[1]]) &&
            isSame([cards[2], cards[3]]) &&
            isSame([cards[4], cards[5]]) &&
            isStraight([cards[0], cards[2], cards[4]])) {
                result.setType = Define.SetType.THREEPAIRS;
            }
        break;
    case 8:
        if(isSame([cards[0], cards[1]]) &&
            isSame([cards[2], cards[3]]) &&
            isSame([cards[4], cards[5]]) &&
            isSame([cards[6], cards[7]]) &&
            isStraight([cards[0], cards[2], cards[4], cards[6]])) {
                result.setType = Define.SetType.FOURPAIRS;
            }
        break;
    default:
    }
    return result;
}

var IsPig = function(cardIdx)
{
    return cardValue(cardIdx) == 15;
}

var FourPigs = function(cards)
{
    cards.sort(compareGreater);
    if(IsPig(cards[3]))
    {
        return true;
    }
    return false;
}

var DragonStraight = function(cards)
{
    var weight = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var CARD_QUANTITY = 13;
    var singleCount = 0;
    for(var i = 0; i < CARD_QUANTITY; i++)
    {
        var card = cardValue(cards[i]) - 3;
        if(!IsPig(cards[i]) && weight[card] == 0)
        {
           singleCount++;
           weight[card]++;
        }
    }
    return singleCount == 12;
}

var FiveContinuousPairs = function(cards)
{
    var weight = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var CARD_QUANTITY = 13;
    for(var i = 0; i < CARD_QUANTITY; i++)
    {
        weight[cardValue(cards[i]) - 3]++;
    }
    
    for(var i = 0, lastIdx = CARD_QUANTITY - 6; i < lastIdx; i++)
    {
        if(weight[i] > 2 && weight[i+1] > 2 && weight[i+2] > 2 && weight[i+3] > 2 && weight[i+4] > 2)
        {
            return true;
        }
    }
    return false;
}

var SixPairs = function(cards)
{
    var weight = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var CARD_QUANTITY = 13;
    var pairCount;
    for(var i = 0; i < CARD_QUANTITY; i++)
    {
        var card = cardValue(cards[i]) - 3;
        if(weight[card] < 2)
        {
            weight[card]++;
            if(weight[card] == 2)
            {
                pairCount++;
            }
        }
    }
    return pairCount > 5;
}

GameHelper.prototype.isInstantWin = function(cards)
{
    if(FourPigs(cards) || DragonStraight(cards) || FiveContinuousPairs(cards) || SixPairs(cards))
    {
        return true;
    }
    return false;
}

module.exports = new GameHelper();