import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Icon,
  IconButton,
  Input,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Trash } from "@phosphor-icons/react";
import { v4 as uuidv4 } from 'uuid';

import { MemeEditor } from "../../components/meme-editor";
import { createMeme } from "../../api";
import { useAuthToken } from "../../contexts/authentication";


export const Route = createFileRoute("/_authentication/create")({
  component: CreateMemePage,
});

type Picture = {
  url: string;
  file: File;
};

function CreateMemePage() {
  const [picture, setPicture] = useState<Picture | null>(null);
  const [description, setDescription] = useState("");
  const [texts, setTexts] = useState<{
    id: string;
    content: string;
    x: number;
    y: number;
  }[]>([]);
  const token = useAuthToken();
  const navigate = useNavigate();

  const handleDrop = (file: File) => {
    setPicture({
      url: URL.createObjectURL(file),
      file,
    });
  };

  const handleAddCaptionButtonClick = () => {
    setTexts(oldData => {
      return (oldData.concat({
        id: uuidv4(),
        content: `New caption ${oldData.length + 1}`,
        x: Math.trunc(Math.random() * 400),
        y: Math.trunc(Math.random() * 225),
      })
    )});
  };

  const handleDeleteCaptionButtonClick = (id: string) => {
    setTexts(texts.filter((text) => text.id !== id));
  };

  const handleChangeDescription = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value);
  };

  const handleChangeCaption = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.target;
    setTexts(oldData => ([
      ...oldData.map(text => text.id !== name? text : ({...text, content: value}))
    ]));
  };

  const memePicture = useMemo(() => {
    if (!picture) {
      return undefined;
    }

    return {
      pictureUrl: picture.url,
      texts,
    };
  }, [picture, texts]);

  const handleSubmit = () => {
    const formData = new FormData();
    if (picture?.file) {
      formData.append('picture', picture.file);
    }
    formData.append('description', description);
    texts.forEach((text, index) => {
      Object.entries(text).filter(([key,]) => key !== "id").forEach(([name, value]) => {
        formData.append(`Texts[${index}][${name}]`, value.toString());
      });
    })

    createMeme(token, formData).then(() => {
      navigate({ to: "/" });
    });
  }

  return (
    <Flex width="full" height="full">
      <Box flexGrow={1} height="full" p={4} overflowY="auto">
        <VStack spacing={5} align="stretch">
          <Box>
            <Heading as="h2" size="md" mb={2}>
              Upload your picture
            </Heading>
            <MemeEditor onDrop={handleDrop} memePicture={memePicture} />
          </Box>
          <Box>
            <Heading as="h2" size="md" mb={2}>
              Describe your meme
            </Heading>
            <Textarea placeholder="Type your description here..." required value={description} onChange={handleChangeDescription}/>
          </Box>
        </VStack>
      </Box>
      <Flex
        flexDir="column"
        width="30%"
        minW="250"
        height="full"
        boxShadow="lg"
      >
        <Heading as="h2" size="md" mb={2} p={4}>
          Add your captions
        </Heading>
        <Box p={4} flexGrow={1} height={0} overflowY="auto">
          <VStack>
            {texts.map((text) => (
              <Flex width="full" key={text.id}>
                <Input name={text.id} value={text.content ?? ""} mr={1} onChange={handleChangeCaption}/>
                <IconButton
                  onClick={() => handleDeleteCaptionButtonClick(text.id)}
                  aria-label="Delete caption"
                  icon={<Icon as={Trash} />}
                />
              </Flex>
            ))}
            <Button
              colorScheme="cyan"
              leftIcon={<Icon as={Plus} />}
              variant="ghost"
              size="sm"
              width="full"
              onClick={handleAddCaptionButtonClick}
              isDisabled={memePicture === undefined}
            >
              Add a caption
            </Button>
          </VStack>
        </Box>
        <HStack p={4}>
          <Button
            as={Link}
            to="/"
            colorScheme="cyan"
            variant="outline"
            size="sm"
            width="full"
          >
            Cancel
          </Button>
          <Button
            colorScheme="cyan"
            size="sm"
            width="full"
            color="white"
            isDisabled={!description || memePicture === undefined}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </HStack>
      </Flex>
    </Flex>
  );
}
