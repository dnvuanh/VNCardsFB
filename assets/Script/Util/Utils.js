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
    }
});

module.exports = new Utils();