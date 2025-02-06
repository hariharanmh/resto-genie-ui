import ChatLayout from "./components/chat-layout";
import { useCookies } from 'react-cookie';
import { ChatContextProvider } from "@/lib/chat-ctx";


const ChatPage = () => {
	const [cookies] = useCookies(['react-resizable-panels:layout:chat', 'react-resizable-panels:collapsed']);
	const layout = cookies["react-resizable-panels:layout:chat"]
	const collapsed = cookies["react-resizable-panels:collapsed"]

	const defaultLayout = layout
	const defaultCollapsed = collapsed

	return (
		<ChatContextProvider>
			<div className="flex h-screen w-full items-center justify-center overflow-y-auto">
				<div className="flex flex-1 h-full w-full">
					<ChatLayout
						defaultLayout={defaultLayout}
						defaultCollapsed={defaultCollapsed}
						navCollapsedSize={30}
					/>
				</div>
			</div>
		</ChatContextProvider>
	)
}
export default ChatPage;