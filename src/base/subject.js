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

    unsubscribe(observable){
        if(this.events[observable.eventName]){
            this.events[observable.eventName] = this.events[observable.eventName].filter(eventListener=>{
                return eventListener != observable.eventListener;
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