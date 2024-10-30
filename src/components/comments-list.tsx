import { Fragment } from "react";
import { Avatar, Box, Button, Flex, Text, VStack } from "@chakra-ui/react";
import { format } from "timeago.js";
import { useMemeComments } from "../services/queries";
import { useAuthToken } from "../contexts/authentication";

export const CommentsList: React.FC<{ memeId: string }> = ({ memeId }) => {
  const token = useAuthToken();

  const commentsQuery = useMemeComments(token, memeId);

  return (
    <VStack align="stretch" spacing={4}>
      {commentsQuery.data?.pages.map((group, index) => (
        <Fragment key={index}>
          {group.map((comment) => (
            <Flex key={comment.id}>
              <Avatar
                borderWidth="1px"
                borderColor="gray.300"
                size="sm"
                name={comment.author.username}
                src={comment.author.pictureUrl}
                mr={2}
              />
              <Box p={2} borderRadius={8} bg="gray.50" flexGrow={1}>
                <Flex justifyContent="space-between" alignItems="center">
                  <Flex>
                    <Text
                      data-testid={`meme-comment-author-${memeId}-${comment.id}`}
                    >
                      {comment.author.username}
                    </Text>
                  </Flex>
                  <Text fontStyle="italic" color="gray.500" fontSize="small">
                    {format(comment.createdAt)}
                  </Text>
                </Flex>
                <Text
                  color="gray.500"
                  whiteSpace="pre-line"
                  data-testid={`meme-comment-content-${memeId}-${comment.id}`}
                >
                  {comment.content}
                </Text>
              </Box>
            </Flex>
          ))}
        </Fragment>
      ))}
      <Box>
        <Button
          onClick={() => commentsQuery.fetchNextPage()}
          disabled={
            !commentsQuery.hasNextPage || commentsQuery.isFetchingNextPage
          }
          size={"xs"}
          colorScheme={"gray"}
        >
          {commentsQuery.isFetchingNextPage
            ? "Loading more..."
            : commentsQuery.hasNextPage
              ? "Load More"
              : "Nothing more to load"}
        </Button>
      </Box>
    </VStack>
  );
};
