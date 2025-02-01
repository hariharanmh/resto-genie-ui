import ChatLayout from "./components/chat-layout";
import { useCookies } from 'react-cookie';
// import { cn } from "@/lib/utils";
import { chats } from "./data";
import { useEffect, useState } from "react";
import axios from 'axios';


const ChatPage = () => {
	const [cookies] = useCookies(['react-resizable-panels:layout:chat', 'react-resizable-panels:collapsed']);
	const layout = cookies["react-resizable-panels:layout:chat"]
	const collapsed = cookies["react-resizable-panels:collapsed"]
	// console.log(layout, collapsed)

	const defaultLayout = layout
	const defaultCollapsed = collapsed

	const [chat, setChat] = useState({})

	const baseUrl = "https://8000-idx-restogenie-1735936089471.cluster-7ubberrabzh4qqy2g4z7wgxuw2.cloudworkstations.dev/";
	const apiPrefix = "recommendation-engine/";
	// const token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2Nsb3VkLmdvb2dsZS5jb20vd29ya3N0YXRpb25zIiwiYXVkIjoiaWR4LXJlc3RvZ2VuaWUtMTczNTkzNjA4OTQ3MS5jbHVzdGVyLTd1YmJlcnJhYnpoNHFxeTJnNHo3d2d4dXcyLmNsb3Vkd29ya3N0YXRpb25zLmRldiIsImlhdCI6MTczODMwNTcwNCwiZXhwIjoxNzM4MzkyMTAzfQ.ZckXGCbPqFHf_y9oISLt_2QsbFXB72NXU9ibJVadVwhGGC7XtTu_gbypPWOwAegL2nA7Vzz0FrzKAQfesG7uW4taCANOCNjXO8AtEo52sI_d7195vdsyVAsB8YK8jIf0H1AwLj8tNww3d1cjeg2b-x4hBjvqOfQWg9c4NkBNR7ErKeOpVAY1xhe0l-RTfze70HDo63drTYG7bSNxkpTSdxsjZ5854M_2rfSvbQicr2JQLXHFgEj2yHkzdvlP8-mbFssk9Bp_1JFcvdDXTbzA-Xp1o7T3CkdIuyUp2KRD51QKfAFiuzBymeQgDWA4tuHjxNwquAl_YVIEJzhRfvB8YA";

	const client = axios.create({
		baseURL: baseUrl
	})

	const systemCheck = async () => {
		try {
			const response = await client.get(`system-check`);
			console.log('-> ', response);
			const data = response.data;
			console.log(data);
		} catch (error) {
			console.error(error)
		}
	}

	const getChat = () => {
		const fullUrl = `${apiPrefix}chat`;
		client.get(fullUrl).then(response => {
			console.log(response)
			setChat(response.data)
		}).catch(error => {
			console.log(error)
		})
	}

	const getStream = async () => {
		try {
			// const events = new EventSource(`${baseUrl}${apiPrefix}get-stream`);
			// console.log(events)
			// events.onmessage = event => {
			// 	// const parsedData = JSON.parse(event.data);
			// 	console.log(event)
			// };

			// const response = await client.get(`${apiPrefix}get-stream`, {
			// 	responseType: 'stream'
			// })

			// const stream = response.data;
			// console.log(stream);
			// for await (const chunk of stream) {
			// 	console.log(chunk);
			// }
		} catch (error) {
			console.error(error);
		}
	}

	useEffect(() => {
		// systemCheck()

		// getChat()
		// getStream()
	}, [])

	return (
		<div className="flex h-screen w-full items-center justify-center overflow-hidden">
			{/* <div className="container w-[1000px] max-w-[95vw] mx-auto"> */}
			{/* <section className={cn("overflow-hidden rounded-[0.5rem] border bg-background shadow")}> */}
			<ChatLayout
				chats={chats}
				defaultLayout={defaultLayout}
				defaultCollapsed={defaultCollapsed}
				navCollapsedSize={4}
			/>
			{/* </section> */}
			{/* </div> */}
		</div>
	)
}
export default ChatPage;