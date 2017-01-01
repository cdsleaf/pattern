/**
 * Created by cho on 2017-01-01.
 */

//poor man's dependency injection
let Attendee02 =(service, messenger, attendeeId)=>{

    if(!(this instanceof Attendee)){
        return new Attendee(attendeeId);
    }

    this.attendeeId = attendeeId;
    this.service = service;
    this.messenger = messenger;
};