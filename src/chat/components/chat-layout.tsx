

import { Input } from '@/components/ui/input';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Separator } from '@/components/ui/separator';
import { TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import { useState } from 'react';
import RecommendationInterface from './recommendation-interface';
import ChatInterface from './chat-interface';
import { Chat } from '../data';


interface ChatLayoutProps {
	chats: Chat[]
	defaultLayout: number[] | undefined
	defaultCollapsed?: boolean
	navCollapsedSize: number
}


const ChatLayout = ({
	chats,
	defaultLayout = [40, 60],
	defaultCollapsed = false,
	navCollapsedSize,
}: ChatLayoutProps): JSX.Element => {

	const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed)
	return (
		<TooltipProvider delayDuration={0}>
			<ResizablePanelGroup
				direction="horizontal"
				onLayout={(sizes: number[]) => {
					document.cookie = `react-resizable-panels:layout:chat=${JSON.stringify(
						sizes
					)}`
				}}
				className="h-full items-stretch"
			>
				<ResizablePanel
					defaultSize={defaultLayout[0]}
					collapsedSize={navCollapsedSize}
					collapsible={true}
					minSize={30}
					maxSize={50}
					onCollapse={() => {
						setIsCollapsed(true)
						document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
							true
						)}`
					}}
					onResize={() => {
						setIsCollapsed(false)
						document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
							false
						)}`
					}}
					className={cn(
						isCollapsed &&
						"min-w-[50px] transition-all duration-300 ease-in-out"
					)}
				>
					<div className="flex items-center px-4 py-2">
						<h1 className="text-xl font-bold">Recommendations</h1>
					</div>
					<Separator />
					<div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
						<form>
							<div className="relative">
								<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
								<Input placeholder="Search" className="pl-8" />
							</div>
						</form>
					</div>
					<RecommendationInterface />
				</ResizablePanel>

				<ResizableHandle withHandle />

				<ResizablePanel
					defaultSize={defaultLayout[1]}
					minSize={30}
				>
					<ChatInterface chats={chats} />
				</ResizablePanel>

			</ResizablePanelGroup>
		</TooltipProvider>
	)
}

export default ChatLayout;