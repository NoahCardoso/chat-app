import { Box, Button, Stack, useToast, Text } from '@chakra-ui/react'
import React, { useState, useEffect } from 'react'
import { ChatState } from '../Context/ChatProvider';
import axios from 'axios';
import { AddIcon } from '@chakra-ui/icons';
import ChatLoading from './ChatLoading';
import { getSender } from '../config/ChatLogics';
import GroupChatModal from './extras/GroupChatModal';


const MyChats = ({ fetchAgain }) => {
  
  const [loggedzUser, setLoggedUser] = useState();
  const {selectedChat, setSelectedChat, user, chats, setChats} = ChatState();

  const toast = useToast();

  const fetchChats = async () => {
  try {
    const {data} = await axios.get("/api/chat",{withCredentials: true});
    setChats(data);
  } catch (error) {
    toast({
				title: "Error Occured!",
				description: "Failed to load the chats",
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "bottom-left",
			});
  }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);


  return (
    
	<Box
    display={{base: selectedChat ? "none" : "flex", md: "flex"}}
    flexDir="column"
    alignItems="center"
    p={3}
    bg="white"
    w={{base: "100%", md: "31%"}}
    borderRadius="lg"
    borderWidth="1px"
  >
    <Box
      pb={3}
      px={3}
      fontSize={{ base: "28px", md: "30px"}}
      fontFamily="Work sans"
      display="flex"
      w="100%"
      justifyContent="space-between"
      alignItems="center"
    > My Chats
    <GroupChatModal>
      <Button
        display="flex"
        fontSize={{ base: "17px", md: "10px", lg: "17px"}}
        rightIcon={<AddIcon/>}
      >
        New Group Chat
      </Button>
    </GroupChatModal>
    </Box>
    <Box
      display="flex"
      flexDir="column"
      p={3}
      bg="#F8F8F8"
      w="100%"
      h="100%"
      borderRadius="lg"
      overflowY="hidden"
    >
      {chats ? (<Stack overflowY="scroll">{chats.map((chat) => (
      <Box
        onClick={() => setSelectedChat(chat)}
        cursor="pointer"
        bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
        color={selectedChat === chat ? "white" : "black"}
        px={3}
        py={2}
        borderRadius="lg"
        key={chat.id}
      >
        <Text>
          {!chat.isgroupchat?(getSender(loggedzUser, chat.users)):(chat.chatname)}
          
        </Text>
        {/* <Text style={{ fontSize: '12px' }}>
          {
            chat?.latestmessage?.content && chat?.latestmessage?.sender?.name
            ? `${chat.latestmessage.sender.name}: ${chat.latestmessage.content}`
            : "No messages yet"
          }
        </Text> */}
      </Box>
      ))}</Stack>) : (<ChatLoading/>)}
    </Box>
  </Box>
  )
}

export default MyChats;