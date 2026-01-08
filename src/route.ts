import { Router } from "express";
import { postRouter } from "./modules/post/post.route";
import { commentRouter } from "./modules/comment/comment.route";
const router = Router();
router.use("/post", postRouter);
router.use("/comment", commentRouter);

export default router;
