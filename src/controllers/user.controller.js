import {asynchandler} from '../utils/asynchandler.js'

const registerUser = asynchandler(async (req,res) => {
    const {username ,password} = req.body;
    console.log(username);

})


export {registerUser}