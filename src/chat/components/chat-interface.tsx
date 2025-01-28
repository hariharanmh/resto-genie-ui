import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns"

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
	console.log(chats);
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

			<ScrollArea className="h-screen">
				{chats.map((_chat, idx) => (
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
			</ScrollArea>

			<Separator className="mt-auto" />
			<div className="p-4">
				<form>
					<div className="grid gap-4">
						<Textarea
							className="p-4"
							placeholder={`Reply ${"name"}...`}
						/>
						<div className="flex items-center">
							<Button
								onClick={(e) => e.preventDefault()}
								size="sm"
								className="ml-auto"
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