import ChatLayout from "./components/chat-layout";
import { useCookies } from 'react-cookie';
import { cn } from "@/lib/utils";
import { chats } from "./data";


const ChatPage = () => {
	const [cookies] = useCookies(['react-resizable-panels:layout:chat', 'react-resizable-panels:collapsed']);
	const layout = cookies["react-resizable-panels:layout:chat"]
	const collapsed = cookies["react-resizable-panels:collapsed"]
	console.log(layout, collapsed)

	const defaultLayout = layout //? JSON.parse(layout) : undefined
	const defaultCollapsed = collapsed //? JSON.parse(collapsed) : undefined


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