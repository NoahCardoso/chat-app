import { FormControl, VStack, FormLabel, Input, InputGroup, InputRightElement, Button, useToast} from "@chakra-ui/react";
import React, { useState } from "react";
import axios from "axios";
import {useHistory} from "react-router-dom";
import { ChatState } from "../../Context/ChatProvider";

const SignUp = () => {
	const [show, setShow] = useState(false);
	const [name, setName] = useState();
	const [email, setEmail] = useState();
	const [confirmPassword, setConfirmPassword] = useState();
	const [password, setPassword] = useState();
	const [pic, setPic] = useState();
	const [loading, setLoading] = useState(false);
	
	const toast = useToast();
	const history = useHistory();
	const { setUser } = ChatState();

	const handleClick = () => {
		setShow(!show);
	};

	const postDetails = (pic) => {
		setLoading(true);
		if (pic === undefined) {
			toast({
				title: "Please Select an Image!",
				status: "warning",
				duration: 5000,
				isClosable: true,
				position: "bottom"
			});
			return;
		}
		
		if(pic.type==="image/jpeg" || pic.type === "image/png"){
			const data = new FormData();
			data.append("file", pic);
			data.append("upload_preset", "chat-app");
			data.append("cloud_name", "dynt0ciad");
			fetch("https://api.cloudinary.com/v1_1/dynt0ciad/upload", {
				method:"post",
				body: data,
			}).then((res) => res.json()).then(data => {
				setPic(data.url.toString());
				setLoading(false);
			}).catch((err) => {
				console.log(err);
				setLoading(false);
			});

		}
		else {
			toast({
				title: "Please Select an Image!",
				status: "warning",
				duration: 5000,
				isClosable: true,
				position: "bottom"
			});
			setLoading(false);
			return;
		}
	};

	const submitHandler = async () => {
		setLoading(true);
		if ( !name || !email || !password || !confirmPassword){
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

		if( password !== confirmPassword){
			toast({
				title: "Passwords Do Not Match!",
				status: "warning",
				duration: 5000,
				isClosable: true,
				position: "bottom"
			});
			return;
		}
		try {
			const config = {
				headers: {
					"Content-type": "application/json",
					withCredentials: true,
				},
			};
			const {data} = await axios.post("/api/user",{name,email,password,pic}, config);
			toast({
				title: "Registration Successful",
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
		<FormControl id="fName" isRequired>
		<FormLabel>Name</FormLabel>
		<Input placeholder="Enter Your Name"
			onChange={(e) => setName(e.target.value)}/>
		</FormControl>

		<FormControl id="email" isRequired>
		<FormLabel>Email</FormLabel>
		<Input placeholder="Enter Your Email"
			onChange={(e) => setEmail(e.target.value)}/>
		</FormControl>

		<FormControl id="password" isRequired>
		<FormLabel>Password</FormLabel>
		<InputGroup>
			<Input placeholder="Enter Your Password"
			type={show ? "text": "Enter Password"}
				onChange={(e) => setPassword(e.target.value)} autoComplete="new-password"/>
			<InputRightElement width="4.5rem">
				<Button h="1.75rem" size="sm" onClick={handleClick}>{show ? "Hide" : "Show"}</Button>
			
			</InputRightElement>
		</InputGroup>
		</FormControl>
		<FormControl id="password" isRequired>
		<FormLabel>Confirm Password</FormLabel>
		<InputGroup>
			<Input placeholder="Confirm Password"
			type={show ? "text": "password"}
				onChange={(e) => setConfirmPassword(e.target.value)} autoComplete="new-password"/>
			<InputRightElement width="4.5rem">
				<Button h="1.75rem" size="sm" onClick={handleClick}>{show ? "Hide" : "Show"}</Button>
			
			</InputRightElement>
		</InputGroup>
		</FormControl>

		<FormControl id="pic" isRequired>
		<FormLabel>Upload your Picture</FormLabel>

			<Input type="file" p={1.5} accept="image/*"
				onChange={(e) => postDetails(e.target.files[0])}/>
			

		</FormControl>

		<Button colorScheme="blue" width="100%" style={{ marginTop: 15}} onClick={submitHandler} isLoading={loading}>Sign Up</Button>
	</VStack>
  );
}

export default SignUp