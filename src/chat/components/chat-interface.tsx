import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useChatContext } from "@/lib/chat-ctx";
import { cn } from "@/lib/utils";
import { Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";


const ChatInterface = () => {
	const { chats, getChat, postChat } = useChatContext();
	const [message, setMessage] = useState("");
	const [isThinking, setIsThinking] = useState(false);
	const initialized = useRef(false);
	const chatEndRef = useRef<HTMLDivElement | null>(null);
	const chatContainerRef = useRef<HTMLDivElement | null>(null);
	const promptExamples = [
		[
			"Find the best Italian restaurants in Indiranagar, Bangalore.",
			"Suggest a good place for sushi near Koramangala.",
			"Looking for budget-friendly South Indian breakfast spots in Malleshwaram.",
			"Best rooftop dining options in MG Road for dinner.",
			"Where can I get authentic biryani in Frazer Town?",
		],
		[
			"Recommend some fine-dining seafood restaurants near Besant Nagar.",
			"Good vegetarian restaurants for lunch in Mylapore.",
			"Best street food places in Sowcarpet.",
			"Where can I find the best filter coffee in Chennai?",
			"Looking for a romantic dinner spot in ECR with a sea view.",
		],
		[
			"Best traditional Kongunadu cuisine restaurants in RS Puram.",
			"Suggest a great place for filter coffee and snacks near Town Hall.",
			"Where can I find the best thattu kadai (street food) experience in Gandhipuram?",
			"Looking for a cozy café with a great ambiance in Race Course.",
			"Recommend a good place for Chettinad-style non-veg dishes in Peelamedu.",
		],
	];
	const [selectedPromptList] = useState(() => {
		const randomListIndex = Math.floor(Math.random() * promptExamples.length);
		return promptExamples[randomListIndex];
	});

	useEffect(() => {
		if (!initialized.current) {
			initialized.current = true;
			getChat();
		}
	}, []);

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
		if (chatContainerRef.current) {
			chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
		}
	}, [chats]);


	return (
		<div className="flex h-full flex-col items-center justify-center p-4 bg-gray-100 dark:bg-gray-900">
			<Card className="flex flex-col h-[90vh] w-full max-w-4xl shadow-xl rounded-2xl bg-white dark:bg-gray-800">
				{/* Header */}
				<CardHeader className="sticky top-0 z-10 flex flex-row items-center shrink-0 p-6 bg-white dark:bg-gray-800 border-b shadow-md">
					<div className="flex items-center space-x-4 w-full">
						<div>
							<p className="text-lg font-semibold text-gray-900 dark:text-white">Your AI-powered restaurant guide</p>
						</div>
					</div>
				</CardHeader>

				{/* Chat Area */}
				<CardContent
					ref={chatContainerRef}
					className="flex flex-col flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700"
				>
					{chats &&
						chats.map((chat, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.3 }}
								className={cn(
									"flex w-fit max-w-[75%] break-words flex-col gap-2 rounded-lg px-4 py-2 text-sm shadow-md whitespace-pre-wrap",
									chat.role === "user"
										? "ml-auto bg-blue-500 text-white"
										: "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
								)}
							>
								<ReactMarkdown rehypePlugins={[rehypeSanitize]}>
									{chat.content?.message}
								</ReactMarkdown>
							</motion.div>
						))}
					<div ref={chatEndRef} />
				</CardContent>

				{/* Footer */}
				<CardFooter className="sticky bottom-0 z-10 shrink-0 p-4 bg-white dark:bg-gray-800 border-t shadow-md">
					<form className="flex w-full items-center space-x-2">
						<div className="w-full grid gap-4">
							{isThinking && (
								<div className="text-sm text-gray-500 dark:text-gray-400">Thinking...</div>
							)}
							<Textarea
								className="p-4 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
								placeholder="Ask RestoGenie for restaurant recommendations..."
								value={message}
								onChange={handleInputChange}
								onKeyDown={handleKeyDown}
								disabled={isThinking}
							/>
							<div className="flex flex-col space-y-2">
								<div className="flex flex-wrap gap-2">
									{selectedPromptList.map((example, index) => (
										<button
											key={index}
											type="button"
											onClick={() => setMessage(example)}
											className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full transition-colors"
										>
											{example}
										</button>
									))}
								</div>
								<div className="flex items-center">
									<Button
										onClick={handleSend}
										size="sm"
										className="ml-auto transition-transform transform hover:scale-105 hover:bg-blue-600"
										type="button"
										disabled={isThinking}
									>
										<Send className="w-5 h-5" />
									</Button>
								</div>
							</div>
						</div>
					</form>
				</CardFooter>
			</Card>
		</div>
	);
}

export default ChatInterface;