import { Router } from "express";
import { loginUser, logoutUser, registerUser ,refreshAccessToken} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.js";
import { verifyJWT } from "../middlewares/auth.js";

const userRouter = Router();

userRouter.post(
  "/register",
  upload.fields([
    {
      name: "avatar",
      maxCount: 1
    },
    {
      name: "coverImage",
      maxCount: 1
    }
  ]),
  registerUser
);


userRouter.post(
  "/login",loginUser
)


//secured routes
userRouter.post("/logout",verifyJWT,logoutUser);

userRouter.post("/access-token",refreshAccessToken)

export default userRouter;
