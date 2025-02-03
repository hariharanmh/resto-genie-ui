// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useChatContext } from "@/lib/chat-ctx";
import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";


const ChatInterface = () => {
	const { chats, isLoading, postChat } = useChatContext();
	const [message, setMessage] = useState("");
	const [isThinking, setIsThinking] = useState(false);
	const scrollRef = useRef<HTMLDivElement | null>(null);

	const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setMessage(e.target.value);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault(); // Prevent the default action (new line)
			handleSend(e as any); // Simulate a button click
		}
	};

	const handleSend = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		if (!message) {
			return;
		}
		setIsThinking(true);
		await postChat(message);
		setMessage(""); // Clear input after processing
		setIsThinking(false);
	}

	useEffect(() => {
		if (!scrollRef.current) {
			console.error("scrollRef is null, skipping scroll.");
			return; // Exit early if ref is not set
		}

		setTimeout(() => { // Ensure DOM updates before scrolling
			const scrollableElement = scrollRef.current?.querySelector(".scroll-area-content") as HTMLElement | null;

			if (scrollableElement) {
				// console.log(scrollableElement);
				console.log('bf -> ', scrollableElement.scrollTop, scrollableElement.scrollHeight, scrollableElement.clientHeight);
				scrollableElement.scrollTop = scrollableElement.scrollHeight - scrollableElement.clientHeight;
				console.log('af -> ', scrollableElement.scrollTop);
			} else {
				console.error("Scrollable element not found within scrollRef.");
			}
		}, 0);
	}, [chats]); // Runs when 'allChats' updates


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

			<ScrollArea ref={scrollRef} className="h-screen w-full" >
				<div className="scroll-area-content">
					{chats && chats.map((_chat, idx) => (
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
				</div>
				<ScrollBar orientation="vertical" />

			</ScrollArea>


			<Separator className="mt-auto" />
			<div className="p-4">
				{
					isThinking &&
					<div className="flex-1 whitespace-pre-wrap p-4 text-sm">Thinking...</div>
				}
				<form>
					<div className="grid gap-4">
						<Textarea
							className="p-4"
							placeholder={`Reply ${"name"}...`}
							value={message}
							onChange={handleInputChange}
							onKeyDown={handleKeyDown}
							disabled={isThinking}
						/>
						<div className="flex items-center">
							<Button
								onClick={handleSend}
								size="sm"
								className="ml-auto"
								type="button"
								disabled={isThinking}
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