/*
 * Copyright (c) 2009 Nicholas C. Zakas
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

window.IdleTimer = function(){

    //-------------------------------------------------------------------------
    // Private variables
    //-------------------------------------------------------------------------
    
    var idle    = false,        //indicates if the user is idle
        tId     = -1,           //timeout ID
        enabled = false,        //indicates if the idle timer is enabled
        timeout = 30000,        //the amount of time (ms) before the user is considered idle
        
        handlers    = {};       //event handlers

    //-------------------------------------------------------------------------
    // Private functions
    //-------------------------------------------------------------------------
        
    /* (intentionally not documented)
     * Handles a user event indicating that the user isn't idle.
     * @param {Event} event A DOM2-normalized event object.
     * @return {void}
     */
    function handleUserEvent(){
    
        //clear any existing timeout
        clearTimeout(tId);
        
        //if the idle timer is enabled
        if (enabled){
        
            //if it's idle, that means the user is no longer idle
            if (idle){
                toggleIdleState();           
            } 

            //set a new timeout
            tId = setTimeout(toggleIdleState, timeout);
        }    
    }
    
    /* (intentionally not documented)
     * Toggles the idle state and fires an appropriate event.
     * @return {void}
     */
    function toggleIdleState(){
    
        //toggle the state
        idle = !idle;
        
        //fire appropriate event
        fire(idle ? "idle" : "active");            
    }

    /* (intentionally not documented)
     * Fires an event with the given name, calling all of its subscribers.
     * @param {String} eventType The type of event to fire.
     * @return {void}
     */          
    function fire(eventType){
        var subscribers = handlers[eventType];
        if (subscribers){
            for (var i=0, len = subscribers.length; i < len; i++){
                subscribers[i].method.call(subscribers[i].scope);
            }
        }
    }

    //-------------------------------------------------------------------------
    // Public interface
    //-------------------------------------------------------------------------
    
    /**
     * Centralized control for determining when a user has become idle
     * on the current page.
     * @class IdleTimer
     * @static
     */
    return {
    
        //---------------------------------------------------------------------
        // Basic Interface
        //---------------------------------------------------------------------
        
        /**
         * Indicates if the idle timer is running or not.
         * @return {Boolean} True if the idle timer is running, false if not.
         * @method isRunning
         * @static
         */
        isRunning: function(){
            return enabled;
        },
        
        /**
         * Indicates if the user is idle or not.
         * @return {Boolean} True if the user is idle, false if not.
         * @method isIdle
         * @static
         */        
        isIdle: function(){
            return idle;
        },
        
        /**
         * Starts the idle timer. This adds appropriate event handlers
         * and starts the first timeout.
         * @param {int} newTimeout (Optional) A new value for the timeout period in ms.
         * @return {void}
         * @method start
         * @static
         */ 
        start: function(newTimeout){
            
            //set to enabled
            enabled = true;
            
            //set idle to false to begin with
            idle = false;
            
            //assign a new timeout if necessary
            if (typeof newTimeout == "number"){
                timeout = newTimeout;
            }
            
            //assign appropriate event handlers
            var body = document.body;
            if (body.addEventListener){
                body.addEventListener("mousemove", handleUserEvent, false);
                body.addEventListener("keydown", handleUserEvent, false);            
            } else {
                body.attachEvent("onmousemove", handleUserEvent);
                body.attachEvent("onkeydown", handleUserEvent); 
            }            

            //set a timeout to toggle state
            tId = setTimeout(toggleIdleState, timeout);
        },
        
        /**
         * Stops the idle timer. This removes appropriate event handlers
         * and cancels any pending timeouts.
         * @return {void}
         * @method stop
         * @static
         */         
        stop: function(){
        
            //set to disabled
            enabled = false;
            
            //clear any pending timeouts
            clearTimeout(tId);
            
            //detach the event handlers
            var body = document.body;
            if (body.removeEventListener){
                body.removeEventListener("mousemove", handleUserEvent, false);
                body.removeEventListener("keydown", handleUserEvent, false);            
            } else {
                body.detachEvent("onmousemove", handleUserEvent);
                body.detachEvent("onkeydown", handleUserEvent); 
            } 
        },
        
        //---------------------------------------------------------------------
        // Events Interface
        //---------------------------------------------------------------------
        
        /**
         * Assigns an event handler for the given event.
         * @param {String} eventType The type of event to subscribe to.
         * @param {Function} method The function to call when the event occurs.
         * @param {Object} scope (Optional) The scope in which to execute the function.
         * @return {void}
         * @method subscribe
         * @static
         */          
        subscribe: function(eventType, method, scope){
        
            //create the handlers array if not present
            if (!handlers[eventType]){
                handlers[eventType] = [];
            }
            
            //add the info
            handlers[eventType].push({ method: method, scope: scope || window });
        },
        
        /**
         * Removes an event handler for the given event.
         * @param {String} eventType The type of event to unsubscribe from.
         * @param {Function} method The function that was registered to the event.
         * @return {void}
         * @method subscribe
         * @static
         */          
        unsubscribe: function(eventType, method){
        
            //ignore if the event has no subscribers
            if (!handlers[eventType]){
                return;
            }
            
            //if there's no method, remove them all
            if (!method){
                delete handlers[eventType];
                return;
            }
            
            //find the method
            var i   = 0,
                subscribers = handlers[eventType],
                len = subscribers.length,
                found = false;
                
            while(i < len & !found){
                if (subscribers[i].method === method){
                    found = true;
                } else {
                    i++;
                }
            }
            
            //if it was found, remove it
            if (found){
                subscribers.splice(i, 1);
            }            
        }        
    
    };

}();