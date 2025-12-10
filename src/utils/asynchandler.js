const asynchandler = (handler) =>{
    (req,res,next)=>{
       return  Promise.resolve(handler(req,res)).catch((err)=>next(err))
    }
}
//    OR
// const synchandler=async(handler)=>{
//     try{
//         const h=await handler(req,res,next);

//     }catch(err){
//         res.status(err.code || 500).json({
//             success:false,
//             error:err.message
//         })
       
//     }
// }

export  {asynchandler};




