import { CommentStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const addComment = async (payload: any) => {
  await prisma.post.findUniqueOrThrow({
    where: { id: payload.postId },
  });

  if (payload.parentId) {
    await prisma.comment.findUniqueOrThrow({
      where: { id: payload.parentId },
    });
  }

  const result = await prisma.comment.create({
    data: payload,
  });

  return result;
};

const singleComment = async (id: string) => {
  return await prisma.comment.findUnique({
    where: {
      id,
    },
    include: {
      replies: {
        include: {
          replies: true,
        },
      },
    },
  });
};

const commentsByAuthor = async (id: string) => {
  return await prisma.comment.findMany({
    where: {
      authorId: id,
    },
    include: {
      post: {
        select: {
          title: true,
        },
      },
    },
  });
};

const deleteComment = async (id: string, authorId: string) => {
  const commentIsExits = await prisma.comment.findFirst({
    where: {
      id,
      authorId,
    },
  });
  if (!commentIsExits) {
    return "comment id not found";
  }
  const result = prisma.comment.delete({
    where: {
      id,
    },
  });
  return result;
};

const updateComment = async (
  authorId: string,
  commentId: string,

  payload: {
    content?: string;
    status?: CommentStatus;
  }
) => {
  const commentIsExits = await prisma.comment.findFirst({
    where: {
      id: commentId,
      authorId,
    },
  });
  if (!commentIsExits) {
    return "comment not found";
  }

  return await prisma.comment.update({
    where: {
      id: commentId,
    },
    data: {
      content: payload.content,
      status: payload.status,
    },
  });
};
export const commentService = {
  addComment,
  singleComment,
  commentsByAuthor,
  deleteComment,
  updateComment,
};
