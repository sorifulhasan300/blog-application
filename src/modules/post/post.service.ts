import { includes } from "better-auth/*";
import { Post, PostType } from "../../../generated/prisma/client";
import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

const createPost = async (
  data: Omit<Post, "id" | "createdAt" | "updatedAt">,
  authorId: string
) => {
  const result = await prisma.post.create({
    data: {
      ...data,
      authorId: authorId,
    },
  });
  return result;
};

const getAllPost = async () => {
  const res = await prisma.post.findMany({
    include: {
      comments: true,
    },
  });

  return res;
};

const searchPost = async (
  search: string,
  tags: string[],
  isFeatured: boolean | undefined,
  status: PostType | undefined,
  authorId: string,
  page: number,
  limit: number,
  skip: number,
  sortBy: string,
  sortOrder: string,
  totalItem: number
) => {
  console.log(limit, skip, sortBy, sortOrder);
  const andCondition: PostWhereInput[] | undefined = [];
  if (search) {
    andCondition.push({
      OR: [
        {
          title: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: search,
            mode: "insensitive",
          },
        },

        {
          tags: {
            has: search,
          },
        },
      ],
    });
  }
  if (tags.length > 0) {
    andCondition.push({
      tags: {
        hasEvery: tags,
      },
    });
  }
  if (typeof isFeatured === "boolean") {
    andCondition.push({
      isFeatured,
    });
  }
  if (status) {
    andCondition.push({
      status,
    });
  }
  if (authorId) {
    andCondition.push({
      authorId,
    });
  }
  const result = await prisma.post.findMany({
    where: {
      AND: andCondition,
    },
    take: limit,
    skip,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });
  const totalPage = Math.ceil(totalItem / limit);
  return {
    data: result,
    pagination: {
      page,
      limit,
      totalPage,
    },
  };
};

const getSinglePost = async (id: string) => {
  return prisma.$transaction(async (tx) => {
    await tx.post.update({
      where: { id },
      data: {
        views: {
          increment: 1,
        },
      },
    });
    const post = await tx.post.findUnique({
      where: {
        id,
      },
      include: {
        comments: {
          where: {
            parentId: null,
          },
          orderBy: { createdAt: "asc" },
          include: {
            replies: {
              include: {
                replies: {
                  include: {
                    replies: true,
                  },
                },
              },
            },
          },
        },
        _count: {
          select: { comments: true },
        },
      },
    });

    return post;
  });
};

const myPost = async (authorId: string) => {
  console.log(authorId);
  await prisma.user.findUniqueOrThrow({
    where: {
      id: authorId,
      status: "ACTIVE",
    },
  });
  const res = await prisma.post.findMany({
    where: {
      authorId,
    },
    orderBy: { createdAt: "asc" },
    include: {
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });
  const totalPost = await prisma.post.aggregate({
    _count: {
      id: true,
    },
  });
  return {
    data: res,
    totalPost,
  };
};

const updateOwnPost = async (
  data: Partial<Post>,
  postId: string,
  authorId: string,
  isAdmin: boolean
) => {
  const postData = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
      authorId,
    },
    select: {
      id: true,
      authorId: true,
    },
  });
  if (!isAdmin && postData.authorId !== authorId) {
    return "author id not match";
  }
  if (!isAdmin) {
    delete data.isFeatured;
  }
  return await prisma.post.update({
    where: {
      id: postId,
      authorId,
    },
    data,
  });
};

const deletePost = async (
  postId: string,
  authorId: string,
  isAdmin: boolean
) => {
  const postData = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
      authorId,
    },
    select: {
      id: true,
      authorId: true,
    },
  });
  if (!isAdmin && postId !== postData.id) {
    return "is this not a own post";
  }
  await prisma.post.delete({
    where: {
      id: postId,
    },
  });
};

const analytics = async () => {
  const result = await prisma.$transaction(async (tx) => {
    await tx.post.count();
  });
  return result;
};

export const postService = {
  createPost,
  getAllPost,
  searchPost,
  getSinglePost,
  myPost,
  updateOwnPost,
  deletePost,
  analytics,
};
