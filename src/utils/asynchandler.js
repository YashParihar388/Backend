const asynchandler = (handler) =>{
    return async (req,res,next)=>{
       try {
            await Promise.resolve(handler(req, res));
        } catch (err) {
            return next(err);
        }
    }
}


export  {asynchandler};




