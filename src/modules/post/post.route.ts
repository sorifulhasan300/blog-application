import { NextFunction, Request, Response, Router } from "express";
import { postController } from "./post.controller";
import middleware, { UserRole } from "../../middlewares/auth.middleware";

const router = Router();

router.post(
  "/create",
  middleware(UserRole.ADMIN, UserRole.USER),
  postController.createPost
);
router.get("/all", postController.getAllPost);
router.get("/search", postController.searchPost);
router.get("/:id", postController.getSinglePost);
router.get(
  "/",
  middleware(UserRole.ADMIN, UserRole.USER),
  postController.myPost
);
router.patch(
  "/:postId",
  middleware(UserRole.ADMIN, UserRole.USER),
  postController.updateOwnPost
);
router.delete(
  "/:postId",
  middleware(UserRole.ADMIN, UserRole.USER),
  postController.updateOwnPost
);

export const postRouter = router;
