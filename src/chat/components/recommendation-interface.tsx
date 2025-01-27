import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";


const RecommendationInterface = () => {
	return (
		<ScrollArea className="h-screen">
			<div className="flex flex-col gap-2 p-4 pt-0">
				<button className={cn(
					"flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
					true && "bg-muted"
				)}
				>
					<div className="flex w-full flex-col gap-1">
						<div className="flex items-center">
							<div className="flex items-center gap-2">
								<div className="font-semibold">{"Name"}</div>
								<span className="flex h-2 w-2 rounded-full bg-green-600" />
								{/* <div
							className={cn(
								"ml-auto text-xs",
								mail.selected === item.id
									? "text-foreground"
									: "text-muted-foreground"
							)}
						>
							{formatDistanceToNow(new Date(), {
								addSuffix: true,
							})}
						</div> */}
							</div>
						</div>
						<div className="text-xs font-medium">{"Details...."}</div>
						<div className="line-clamp-2 text-xs text-muted-foreground">
							{"Dummy random text.. Dummy random text.. Dummy random text.. Dummy random text.. Dummy random text.. Dummy random text.. Dummy random text.. Dummy random text.. Dummy random text.. Dummy random text.. Dummy random text..".substring(0, 300)}
						</div>

					</div>
				</button>
			</div>
		</ScrollArea>
	)
}

export default RecommendationInterface;