"use strict";
cc._RF.push(module, 'c8f00BKqNNGzLGxlZAjVkvn', 'GameHelper');
// Script/Util/GameHelper.js

"use strict";

var Define = require("Define");
var GameHelper = cc.Class({
    cardValue: function cardValue(card) {
        return card / 4 | 0;
    },
    isSame: function isSame(cards) {
        if (cards.length < 2) {
            return false;
        }

        for (var i = 1; i < cards.length; i++) {
            if (this.cardValue(cards[0]) != this.cardValue(cards[i])) {
                return false;
            }
        }
        return true;
    },
    isStraight: function isStraight(cards) {
        if (cards.length < 3) {
            return false;
        }

        for (var i = 0; i < cards.length - 1; i++) {
            if (this.cardValue(cards[i]) - this.cardValue(cards[i + 1]) != 1) {
                return false;
            }
        }
        return true;
    },
    parseCards: function parseCards(cards) {
        cards.sort(function (a, b) {
            return b - a;
        });
        var result = { setType: Define.SetType.ERROR, numOfCard: "", topCard: "" };
        result.numOfCard = cards.length;
        result.topCard = cards[0];

        if (this.isStraight(cards)) {
            result.setType = Define.SetType.STRAIGHT;
            return result;
        }

        switch (cards.length) {
            case 1:
                result.setType = Define.SetType.SINGLE;
                break;
            case 2:
                if (this.isSame(cards)) {
                    result.setType = Define.SetType.PAIR;
                }
                break;
            case 3:
                if (this.isSame(cards)) {
                    result.setType = Define.SetType.TRIPLE;
                }
                break;
            case 4:
                if (this.isSame(cards)) {
                    result.setType = Define.SetType.QUADS;
                }
                break;
            case 6:
                if (this.isSame([cards[0], cards[1]]) && this.isSame([cards[2], cards[3]]) && this.isSame([cards[4], cards[5]]) && this.isStraight([cards[0], cards[2], cards[4]])) {
                    result.setType = Define.SetType.THREEPAIRS;
                }
                break;
            case 8:
                if (this.isSame([cards[0], cards[1]]) && this.isSame([cards[2], cards[3]]) && this.isSame([cards[4], cards[5]]) && this.isSame([cards[6], cards[7]]) && this.isStraight([cards[0], cards[2], cards[4], cards[6]])) {
                    result.setType = Define.SetType.FOURPAIRS;
                }
                break;
            default:
        }
        return result;
    },
    validTurn: function validTurn(previous, current) {
        var HEO = 15;
        if (previous === null) {
            return true;
        }
        if (previous.setType >= Define.SetType.THREEPAIRS) {
            return current.SetType * 100 + current.topCard > previous.SetType * 100 + previous.topCard;
        } else if (this.cardValue(previous.topCard) == HEO && current.setType >= Define.SetType.THREEPAIRS) {
            return true;
        } else if (current.setType == previous.setType && current.numOfCard == previous.numOfCard && current.topCard > previous.topCard) {
            return true;
        }
        return false;
    }
});

module.exports = new GameHelper();

cc._RF.pop();