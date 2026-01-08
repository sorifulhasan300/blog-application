import { Request, Response } from "express";
import { commentService } from "./comment.service";
import { auth } from "../../lib/auth";

const addComment = async (req: Request, res: Response) => {
  const authorId = req.user?.id;
  req.body.authorId = authorId;
  try {
    const result = await commentService.addComment(req.body);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error || "Something was wrong",
    });
  }
};

const singleComment = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    const result = await commentService.singleComment(commentId);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error || "Something was wrong",
    });
  }
};

const commentsByAuthor = async (req: Request, res: Response) => {
  try {
    const { authorId } = req.params;
    const result = await commentService.commentsByAuthor(authorId);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error || "Something was wrong",
    });
  }
};
const deleteComment = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    const authorId = req.user?.id;
    const result = await commentService.deleteComment(
      commentId,
      authorId as string
    );
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error || "Something was wrong",
    });
  }
};
const updateComment = async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    const authorId = req.user?.id;
    const { commentId } = req.params;
    const result = await commentService.updateComment(
      authorId as string,
      commentId,
      payload
    );
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error || "Something was wrong",
    });
  }
};
export const commentController = {
  addComment,
  singleComment,
  commentsByAuthor,
  deleteComment,
  updateComment,
};
