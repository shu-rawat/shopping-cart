class Subject{
    constructor(){
        this.events = {};
    }

    //it registers event listener to the event name
    subscribe(eventName,eventListener){
        //if no events with such name found.
        if(!this.events[eventName]){
            //initializes it with empty array
            this.events[eventName] = [];
        }
        //push event listener to array for corresponding event name.
        this.events[eventName].push(eventListener);
        return {
            eventName,
            eventListener
        };
    }

    //it unregister event listener to the event name
    unsubscribe(eventName, eventListenerToRmv){
        //if event name found
        if(this.events[eventName]){
            //removes event listener from array by filtering it.
            this.events[eventName] = this.events[eventName].filter(eventListener=>{
                return eventListener != eventListenerToRmv;
            });
            return true;
        }
        return false;
    }

    //triggers event
    next(eventName,data){
        if(this.events[eventName]){
            //calls event listeners attached with event name and passes data.
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