import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import RecommendationInterface from './recommendation-interface';
import ChatInterface from './chat-interface';
import { motion } from 'framer-motion';


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
				className="bg-white dark:bg-gray-900 bg-opacity-50 shadow-lg backdrop-blur-md rounded-lg p-4 
			flex flex-col md:flex-row h-full w-full"
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
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ type: "spring", stiffness: 100, damping: 10 }}
						className="h-full flex flex-col"
					>
						<RecommendationInterface />
					</motion.div>
				</ResizablePanel>

				<ResizableHandle />

				<ResizablePanel
					defaultSize={defaultLayout[1]}
					minSize={30}
				>
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 10 }}
						transition={{ duration: 0.3, ease: "easeInOut" }}
						className="h-full flex flex-col"
					>
						<ChatInterface />
					</motion.div>
				</ResizablePanel>
			</ResizablePanelGroup>
		</TooltipProvider>

	);
}

export default ChatLayout;