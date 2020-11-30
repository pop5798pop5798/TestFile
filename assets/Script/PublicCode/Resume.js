
cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // onLoad () {},

    start () {
        let _resume = this;
        let visProp = this.getHiddenProp();
        if (visProp) 
        {
            let evtname = visProp.replace(/[H|h]idden/, '') + 'visibilitychange';
            document.addEventListener(evtname, function () 
            {                
                let _state = document[_resume.getVisibilityState()];
                console.log("狀態: ", _state);
                if(_state == "hidden") {

                } else if (_state == "visible") {
                    // 在這裡呼叫調整畫面的function
                }
            }, false);
        }
    },

    // update (dt) {},

    getHiddenProp: function() {
        let prefixes = ['webkit','moz','ms','o'];
    
        // if 'hidden' is natively supported just return it
        if ('hidden' in document) return 'hidden';
        
        // otherwise loop over all the known prefixes until we find one
        for (var i = 0; i < prefixes.length; i++)
        {
            if ((prefixes[i] + 'Hidden') in document) 
                return prefixes[i] + 'Hidden';
        }
     
        // otherwise it's not supported
        return null;
    },

    getVisibilityState: function() {
        var prefixes = ['webkit', 'moz', 'ms', 'o'];
        if ('visibilityState' in document) return 'visibilityState';
        for (var i = 0; i < prefixes.length; i++) 
        {
            if ((prefixes[i] + 'VisibilityState') in document)
                return prefixes[i] + 'VisibilityState';
        }
        // otherwise it's not supported
        return null;
    },

    isHidden: function() {
        var prop = getHiddenProp();
        if (!prop) return false;
        
        return document[prop];
    },
});
