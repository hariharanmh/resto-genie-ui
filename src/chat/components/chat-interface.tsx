// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { format } from "date-fns";
import { useState } from "react";

interface Chat {
	role: string
	timestamp: string
	content: {
		message: string
		location: string
		latitude: string
		longitude: string
	}
}

interface ChatInterfaceProps {
	chats: Chat[]
}

const ChatInterface = ({ chats }: ChatInterfaceProps) => {
	const [allChats, setAllChats] = useState<Chat[]>(chats);
	const [message, setMessage] = useState("");

	const baseUrl = "https://8000-idx-restogenie-1735936089471.cluster-7ubberrabzh4qqy2g4z7wgxuw2.cloudworkstations.dev/";
	const apiPrefix = "recommendation-engine/";

	const fetchStream = async (message: string) => {
		try {
			const fullUrl = `${baseUrl}${apiPrefix}chat`;
			const response = await fetch(`${fullUrl}?prompt=${message}`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
			});

			if (!response.body) {
				throw new Error("ReadableStream not supported in this browser.");
			}

			const reader = response.body.getReader();
			const decoder = new TextDecoder();
			let accumulatedText = "";
			let seenLines = new Set(); // To track unique messages

			while (true) {
				const { done, value } = await reader.read();
				if (done) break;

				accumulatedText += decoder.decode(value, { stream: true });

				const lines = accumulatedText.split("\n");
				accumulatedText = lines.pop() || ""; // Save last incomplete part

				const newChats = lines
					.map(line => line.trim()) // Remove prefix & trim
					.filter(line => line.length > 0 && !seenLines.has(line)) // Avoid duplicates
					.map(line => {
						try {
							seenLines.add(line);
							return JSON.parse(line);
						} catch (e) {
							console.error("Error parsing JSON:", e, line);
							return null;
						}
					})
					.filter(Boolean);

				setAllChats(prevChats => [...prevChats, ...newChats]);
			}

			setMessage(""); // Clear input after processing

		} catch (error) {
			console.error("Error posting chat", error);
		}
	};


	const client = axios.create({
		baseURL: baseUrl
	})

	const postChat = (message: string) => {
		const fullUrl = `${apiPrefix}chat`;
		client.post(`${fullUrl}?prompt=${message}`).then(response => {
			console.log(response.data, typeof (response.data));
			const responseText = response.data
			const lines = responseText.split('\n');
			const _chats: Chat[] = lines.filter((line: string) => line.length > 1).map((j: string) => JSON.parse(j));
			console.log(_chats);

			setAllChats((prevChats) => [...prevChats, ..._chats]);

			setMessage("");
		}).catch(error => {
			console.log(`Error posting chat ${error}`);
		})
	}

	const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setMessage(e.target.value);
	}

	const handleSend = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		if (!message) {
			return;
		}

		fetchStream(message);
		// postChat(message);
	}

	return (
		<div className="flex h-full flex-col">
			<div className="flex items-center p-2">
				<div className="flex items-center px-4 py-2">
					<h1 className="text-xl font-bold">Let me help you find the best restaurants around. Just ask! 🍴</h1>
				</div>
				{/* <div className="flex items-center gap-2">
					Let me help you find the best restaurants around. Just ask! 🍴
				</div> */}
			</div>
			<Separator />

			<ScrollArea className="h-screen w-full">
				{/* <ScrollAreaViewport> */}
				{allChats.map((_chat, idx) => (
					<div className="flex flex-1 flex-col" key={idx}>
						<div className="flex items-start p-4">
							<div className="flex items-start gap-4 text-sm">
								{/* <Avatar>
								<AvatarImage alt={_chat.role} />
								<AvatarFallback>
									{_chat.role == "model" ? "M" : "U"}
								</AvatarFallback>
							</Avatar> */}
								<div className="grid gap-1">
									<div className="font-semibold">{_chat.role == "model" ? "AI Response:" : "You asked:"}</div>
									{/* <div className="line-clamp-1 text-xs">{"mail.subject"}</div>
								<div className="line-clamp-1 text-xs">
									<span className="font-medium">Reply-To:</span> {"mail.email"}
								</div> */}
								</div>
							</div>
							{_chat.timestamp && (
								<div className="ml-auto text-xs text-muted-foreground">
									{format(new Date(_chat.timestamp), "PPpp")}
								</div>
							)}
						</div>
						{/* <Separator className="mx-4" /> */}
						<div className="flex-1 whitespace-pre-wrap p-4 text-sm">
							{_chat.content && _chat.content.message}
						</div>
						<Separator />
					</div>
				))}
				{/* </ScrollAreaViewport> */}
				<ScrollBar orientation="vertical" />

			</ScrollArea>


			<Separator className="mt-auto" />
			<div className="p-4">
				<form>
					<div className="grid gap-4">
						<Textarea
							className="p-4"
							placeholder={`Reply ${"name"}...`}
							value={message}
							onChange={handleInputChange}
						/>
						<div className="flex items-center">
							<Button
								onClick={handleSend}
								size="sm"
								className="ml-auto"
								type="button"
							>
								Send
							</Button>
						</div>
					</div>
				</form>
			</div>
		</div>
	)
}

export default ChatInterface;