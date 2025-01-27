import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

interface Chat {

}

interface ChatInterfaceProps {
	messages: Chat[] | null
}

const ChatInterface = ({ chats }: ChatInterfaceProps) => {
	return (
		<div className="flex h-full flex-col">
			<div className="flex items-center p-2">
				<div className="flex items-center gap-2">
					Let me help you find the best restaurants around. Just ask! 🍴
				</div>
			</div>
			<Separator />
			<div className="flex-1 whitespace-pre-wrap p-4 text-sm">
				{"Some random text....."}
			</div>
			<Separator className="mt-auto" />
			<div className="p-4">
				<form>
					<div className="grid gap-4">
						<Textarea
							className="p-4"
							placeholder={`Reply ${"name"}...`}
						/>
						<div className="flex items-center">
							<Label
								htmlFor="mute"
								className="flex items-center gap-2 text-xs font-normal"
							>
								{/* <Switch id="mute" aria-label="Mute thread" /> Mute this
								thread */}
							</Label>
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