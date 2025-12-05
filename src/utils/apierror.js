class apierror extends Error{
    constructor(
        statuscode,
        message="something went wrong",
        stack="",
        errors=[]){
            super(message)
            this.statuscode=statuscode;
        this.message=message;
        this.data=null;
        this.success=false;
        this.errors=errors;
        if(stack){
            this.stack=stack;

        }else{
            Error.captureStackTrace(this,this.constructor)
        }
        
    }
}

export {apierror};