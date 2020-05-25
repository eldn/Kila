


export class EventObject {
    _listeners: Object;

    getClassName() : string{
        return "EventObject";
    }

    /**
     * @language=en
     * Add an event listenser.
     * @param {String} type Event type to listen.
     * @param {Function} listener Callback function of event listening.
     * @param {Boolean} once Listen on event only once and no more response after the first response?
     * @returns {Object} The Event itself. Functions chain call supported.
     */
    on(type : string, listener : Function, once ?: boolean){
        var listeners = (this._listeners = this._listeners || {});
        var eventListeners = (listeners[type] = listeners[type] || []);
        for(var i = 0, len = eventListeners.length; i < len; i++){
            var el = eventListeners[i];
            if(el.listener === listener) return;
        }
        eventListeners.push({listener:listener, once:once});
        return this;
    }

    /**
     * @language=en
     * Remove one event listener. Remove all event listeners if no parameter provided, and remove all event listeners on one type which is provided as the only parameter.
     * @param {String} type The type of event listener that want to remove.
     * @param {Function} listener Event listener callback function to be removed.
     * @returns {Object} The Event itself. Functions chain call supported.
     */
    off(type ?: string, listener ?: Function){
        //remove all event listeners
        if(arguments.length == 0){
            this._listeners = null;
            return this;
        }

        var eventListeners = this._listeners && this._listeners[type];
        if(eventListeners){
            //remove event listeners by specified type
            if(arguments.length == 1){
                delete this._listeners[type];
                return this;
            }

            for(var i = 0, len = eventListeners.length; i < len; i++){
                var el = eventListeners[i];
                if(el.listener === listener){
                    eventListeners.splice(i, 1);
                    if(eventListeners.length === 0) delete this._listeners[type];
                    break;
                }
            }
        }
        return this;
    }

    /**
     * @language=en
     * Send events. If the first parameter is an Object, take it  as an Event Object.
     * @param {String} type Event type to send.
     * @param {Object} detail The detail (parameters go with the event) of Event to send.
     * @returns {Boolean} Whether Event call successfully.
     */
    fire(type : any, detail ?: any){
        var event, eventType;
        if(typeof type === 'string'){
            eventType = type;
        }else{
            event = type;
            eventType = type.type;
        }

        var listeners = this._listeners;
        if(!listeners) return false;

        var eventListeners = listeners[eventType];
        if(eventListeners){
            var eventListenersCopy = eventListeners.slice(0);
            event = event || new EventObjectNode(eventType, this, detail);
            if(event._stopped) return false;

            for(var i = 0; i < eventListenersCopy.length; i++){
                var el = eventListenersCopy[i];
                el.listener.call(this, event);
                if(el.once) {
                    var index = eventListeners.indexOf(el);
                    if(index > -1){
                        eventListeners.splice(index, 1);
                    }
                }
            }

            if(eventListeners.length == 0) delete listeners[eventType];
            return true;
        }
        return false;
    }
};


export class EventObjectNode{

    type: null;
    target: null;
    detail: null;
    timeStamp: number = 0;
    _stopped : boolean;

    constructor(type, target, detail){
        this.type = type;
        this.target = target;
        this.detail = detail;
        this.timeStamp = +new Date();
    }
   

    stopImmediatePropagation(){
        this._stopped = true;
    }
}


//Trick: `stopImmediatePropagation` compatibility
var RawEvent = window.Event;
if(RawEvent){
    var proto = RawEvent.prototype,
        stop = proto.stopImmediatePropagation;
    proto.stopImmediatePropagation = function(){
        stop && stop.call(this);
        this._stopped = true;
    };
}