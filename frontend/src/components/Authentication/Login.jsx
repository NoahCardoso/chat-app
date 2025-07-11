import { FormControl, VStack, FormLabel, Input, InputGroup, InputRightElement, Button, useToast} from "@chakra-ui/react"
import React, { useState } from "react"
import axios from "axios";
import {useHistory} from "react-router-dom";
import { ChatState } from "../../Context/ChatProvider";

const Login = () => {
	const [show, setShow] = useState(false);
	const [email, setEmail] = useState();
	const [loading, setLoading] = useState(false);
	const [password, setPassword] = useState();
	const toast = useToast();
	const history = useHistory();
	const { setUser } = ChatState();

	const handleClick = () => {
		setShow(!show);
	};

	const submitHandler = async () => {
		setLoading(true);
		if ( !email || !password){
			toast({
				title: "Please Fill all the Feilds!",
				status: "warning",
				duration: 5000,
				isClosable: true,
				position: "bottom"
			});
			setLoading(false);
			return;
		}
		try {
			const config = {
				headers: {
					"Content-type": "application/json",
				},
				withCredentials: true,
			};
			const {data} = await axios.post("/api/user/login",{email,password}, config);
			toast({
				title: "Login Successful",
				status: "success",
				duration: 5000,
				isClosable: true,
				position: "bottom"
			});

			setUser(data);
			localStorage.setItem("userInfo", JSON.stringify(data));
			setLoading(false);
			history.push("/chats");

		} catch (error) {
			toast({
				title: "Error Occured!",
				status: "error",
				description: error.response.data.message,
				duration: 5000,
				isClosable: true,
				position: "bottom"
			});
			setLoading(false);
		}
	};
  return (
	<VStack spacing="5px" color="black">
	

		<FormControl id="email" isRequired>
		<FormLabel>Email</FormLabel>
		<Input placeholder="Enter Your Email"
			onChange={(e) => setEmail(e.target.value)}
			value={email}/>
		</FormControl>

		<FormControl id="password" isRequired>
		<FormLabel>Password</FormLabel>
		<InputGroup>
			<Input placeholder="Enter Your Password"
			type={show ? "text": "password"}
				onChange={(e) => setPassword(e.target.value)} value={password} autoComplete="new-password"/>
			<InputRightElement width="4.5rem">
				<Button h="1.75rem" size="sm" onClick={handleClick}>{show ? "Hide" : "Show"}</Button>
			
			</InputRightElement>
		</InputGroup>
		</FormControl>
		

		<Button colorScheme="blue" width="100%" style={{ marginTop: 15}} onClick={submitHandler} isLoading={loading}>Login</Button>
		<Button variant="solid" colorScheme="red" width="100%" onClick={() => {setEmail("guest@example.com"); setPassword("123456");}}>Get Guest User Credentials </Button>
	</VStack>
  );
}

export default Login