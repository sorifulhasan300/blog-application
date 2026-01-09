import { Router } from "express";
import { commentController } from "./comment.controller";
import middleware, { UserRole } from "../../middlewares/auth.middleware";

const router = Router();
router.post(
  "/",
  middleware(UserRole.USER, UserRole.USER),
  commentController.addComment
);
router.get("/:commentId", commentController.singleComment);
router.get("/author/:authorId", commentController.commentsByAuthor);
router.delete(
  "/:commentId",
  middleware(UserRole.ADMIN),
  commentController.deleteComment
);

router.patch(
  "/:commentId",
  middleware(UserRole.USER, UserRole.ADMIN),
  commentController.updateComment
);
router.patch(
  "/moderateComment/:commentId",
  middleware(UserRole.ADMIN),
  commentController.moderateComment
);

export const commentRouter = router;
