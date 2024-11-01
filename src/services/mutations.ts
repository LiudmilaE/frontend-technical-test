import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMemeComment } from "../api";

export function useCreateComment(token: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { memeId: string; content: string }) => {
        const {memeId, content} = data;
        await createMemeComment(token, memeId, content);
      },
    
    onSettled: async (_, error, variables) => {
      if (error) {
        console.log(error);
      } else {
        await queryClient.invalidateQueries({ queryKey: ["memes"] });
        await queryClient.invalidateQueries({ queryKey: ["comments", { memeId: variables.memeId }] });
      }
    },
  });
}