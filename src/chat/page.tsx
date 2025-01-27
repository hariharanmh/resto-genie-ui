import ChatLayout from "./components/chat-layout";
import { useCookies } from 'react-cookie';


const ChatPage = () => {
	const [cookies] = useCookies(['react-resizable-panels:layout:chat', 'react-resizable-panels:collapsed']);
	const layout = cookies["react-resizable-panels:layout:chat"]
  const collapsed = cookies["react-resizable-panels:collapsed"]
	console.log(layout, collapsed)

  const defaultLayout = layout //? JSON.parse(layout) : undefined
  const defaultCollapsed = collapsed //? JSON.parse(collapsed) : undefined


	return (
		<>
			<div className="flex-col md:flex h-screen">
				<ChatLayout 
					defaultLayout={defaultLayout}
					defaultCollapsed={defaultCollapsed}
					navCollapsedSize={4}
				/>
			</div>
		</>
	)
}

export default ChatPage;