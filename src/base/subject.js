class Subject{
    constructor(){
        this.events = {};
    }

    subscribe(eventName,eventListener){
        if(!this.events[eventName]){
            this.events[eventName] = [];
        }
        this.events[eventName].push(eventListener);
        return {
            eventName,
            eventListener
        };
    }

    unsubscribe(eventName, eventListenerToRmv){
        if(this.events[eventName]){
            this.events[eventName] = this.events[eventName].filter(eventListener=>{
                return eventListener != eventListenerToRmv;
            });
            return true;
        }
        return false;
    }

    next(eventName,data){
        if(this.events[eventName]){
            this.events[eventName].forEach(eventListener=>{
                eventListener(data);
            });
            return true;
        }
        return false;
    }
}

const subject = new Subject;
export default subject;