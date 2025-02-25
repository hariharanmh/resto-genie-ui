import ChatLayout from "./components/chat-layout";
import { useCookies } from 'react-cookie';
import { ChatContextProvider } from "@/lib/chat-ctx";
import { ModeToggle } from "@/components/mode-toggle";


const ChatPage = () => {
	const [cookies] = useCookies(['react-resizable-panels:layout:chat', 'react-resizable-panels:collapsed']);
	const layout = cookies["react-resizable-panels:layout:chat"];
	const collapsed = cookies["react-resizable-panels:collapsed"];

	const defaultLayout = layout
	const defaultCollapsed = collapsed

	return (
		<ChatContextProvider>
			<div className="flex flex-col h-screen w-full fixed bg-white dark:bg-gray-900">
			<header className="flex justify-between items-center px-4 py-2 shadow-md bg-gray-100 dark:bg-gray-800">
					<h1 className="text-xl font-semibold text-gray-900 dark:text-white">
						Resto Genie
					</h1>
					<ModeToggle />
				</header>
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