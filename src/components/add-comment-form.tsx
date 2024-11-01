import { Avatar, Flex, Input } from "@chakra-ui/react";
import { useState } from "react";

import { useAuthToken } from "../contexts/authentication";
import { useCreateComment } from "../services/mutations";

export const AddCommentForm: React.FC<{
  memeId: string;
  username?: string;
  pictureUrl?: string;
}> = ({ memeId, username, pictureUrl }) => {
  const [commentValue, setCommentValue] = useState("");
  const token = useAuthToken();

  const { mutate } = useCreateComment(token);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCommentValue(event.target.value ?? "");
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (commentValue) {
      mutate({
        memeId: memeId,
        content: commentValue,
      });
      setCommentValue("");
    }
  };

  return (
    <form data-testid={`add-comment-form-${memeId}`} onSubmit={handleSubmit}>
      <Flex alignItems="center">
        <Avatar
          borderWidth="1px"
          borderColor="gray.300"
          name={username}
          src={pictureUrl}
          size="sm"
          mr={2}
        />
        <Input
          placeholder="Type your comment here..."
          onChange={handleChange}
          value={commentValue}
        />
      </Flex>
    </form>
  );
};
