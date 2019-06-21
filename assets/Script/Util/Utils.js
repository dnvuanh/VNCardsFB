var Utils = cc.Class({
    generateId(window, screen, navigator)
    {
        function checksum(str) {
            var hash = 5381,
                i = str.length;
        
            while (i--) hash = (hash * 33) ^ str.charCodeAt(i);
        
            return hash >>> 0;
        }
    
        function map(arr, fn){
            var i = 0, len = arr.length, ret = [];
            while(i < len){
                ret[i] = fn(arr[i++]);
            }
            return ret;
        }
    
        return checksum([
            navigator.userAgent,
            [screen.height, screen.width, screen.colorDepth].join('x'),
            new Date().getTimezoneOffset(),
            !!window.sessionStorage,
            !!window.localStorage,
            map(navigator.plugins, function (plugin) {
                return [
                    plugin.name,
                    plugin.description,
                    map(plugin, function (mime) {
                        return [mime.type, mime.suffixes].join('~');
                    }).join(',')
                ].join("::");
            }).join(';')
        ].join('###'));
    },

    changeParent(node, newParent) 
    {
		if(node.parent == newParent) return;
		var getWorldRotation = function (node) {
			var currNode = node;
			var resultRot = currNode.rotation;
			do {
				currNode = currNode.parent;
				resultRot += currNode.rotation;
			} while(currNode.parent != null);
			resultRot = resultRot % 360;
			return resultRot;
		};

		var oldWorRot = getWorldRotation(node);
		var newParentWorRot = getWorldRotation(newParent);
		var newLocRot = oldWorRot - newParentWorRot;

        var oldWorPos = node.convertToWorldSpaceAR(cc.p(0,0));
		var newLocPos = newParent.convertToNodeSpaceAR(oldWorPos);

        node.parent = newParent;
        node.position = newLocPos;
		node.rotation = newLocRot;
    }
});

module.exports = new Utils();