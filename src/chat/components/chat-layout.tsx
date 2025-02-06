import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import RecommendationInterface from './recommendation-interface';
import ChatInterface from './chat-interface';


interface ChatLayoutProps {
	defaultLayout: number[] | undefined
	defaultCollapsed?: boolean
	navCollapsedSize: number
}


const ChatLayout = ({
	defaultLayout = [40, 60],
	defaultCollapsed = false,
	navCollapsedSize,
}: ChatLayoutProps): JSX.Element => {
	const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);


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
					<RecommendationInterface />
				</ResizablePanel>

				<ResizableHandle />

				<ResizablePanel
					defaultSize={defaultLayout[1]}
					minSize={30}
				>
					<ChatInterface />
				</ResizablePanel>

			</ResizablePanelGroup>
		</TooltipProvider>
	)
}

export default ChatLayout;