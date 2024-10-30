import {
  useInfiniteQuery,
} from "@tanstack/react-query";
import { getMemes, getMemeComments, getUserById } from "../api";

export function useMemes(token: string) {
  return useInfiniteQuery({
    queryKey: ["memes"],
    queryFn: async ({ pageParam }) =>
      await getMemes(token, pageParam + 1).then(({ results }) => {
        return Promise.all(
          results.map(async (meme) => ({
            ...meme,
            author: await getUserById(token, meme.authorId),
          }))
        )
  }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      if (lastPage.length === 0) {
        return undefined;
      }
      return lastPageParam + 1;
    },
    getPreviousPageParam: (_, __, firstPageParam) => {
      if (firstPageParam <= 1) {
        return undefined;
      }
      return firstPageParam - 1;
    },
  });
}

export function useMemeComments(token: string, memeId: string ) {
    return useInfiniteQuery({
      queryKey: ["comments", { memeId }],
      queryFn: async ({ pageParam }) =>
        await getMemeComments(token, memeId, pageParam + 1).then(({ results }) => {
          return Promise.all(
            results.map(async (comment) => ({
              ...comment,
              author: await getUserById(token, comment.authorId),
            }))
          )
    }),
      initialPageParam: 0,
      getNextPageParam: (lastPage, _, lastPageParam) => {
        if (lastPage.length === 0) {
          return undefined;
        }
        return lastPageParam + 1;
      },
      getPreviousPageParam: (_, __, firstPageParam) => {
        if (firstPageParam <= 1) {
          return undefined;
        }
        return firstPageParam - 1;
      },
    });
  }
