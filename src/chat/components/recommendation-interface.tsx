import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatContext } from "@/lib/chat-ctx";
import { cn } from "@/lib/utils";
import { useEffect } from "react";


const RecommendationInterface = () => {
	const { chats, recommendations, getRecommendations } = useChatContext();

	useEffect(() => {
		console.log('chats updated-> ', chats);
		// call to collect recommended restaurant details
		if (
			chats &&
			chats[chats.length - 1]?.content.recommended_restaurant_names &&
			chats[chats.length - 1]?.content.recommended_restaurant_names.length > 0
		) {
			const recommendedRestaurantNames = chats[chats.length - 1].content.recommended_restaurant_names as string[]
			getRecommendations(recommendedRestaurantNames, true);
		}
	}, [chats]);

	const openInNewTab = (url: string) => {
		const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
		if (newWindow) newWindow.opener = null;
	}

	const handleOnClick = (url: string) => {
		return () => openInNewTab(url);
	};

	return (
		<ScrollArea className="h-screen">
			{
				recommendations && recommendations.map((recommendation, idx) => (
					<div className="flex flex-col gap-2 p-4 pt-0" key={idx}>
						<button className={cn(
							"flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
							false && "bg-muted"
						)} onClick={handleOnClick(recommendation.google_maps_uri as string)}
						>
							<div className="flex w-full flex-col gap-1">
								<div className="flex items-center">
									<div className="flex items-center gap-2">
										<div className="font-semibold">{recommendation.name}</div>
										{
											recommendation.open_now ? (
												<span className="flex h-2 w-2 rounded-full bg-green-600" />
											) : (
												<span className="flex h-2 w-2 rounded-full bg-red-600" />
											)
										}
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
								<div className="text-xs font-medium">{recommendation.rating}&nbsp;({recommendation.user_rating_count})</div>
								<div className="line-clamp-2 text-xs text-muted-foreground">
									{recommendation.address?.substring(0, 300)}
								</div>

							</div>
						</button>
					</div>
				))
			}
		</ScrollArea>
	)
}

export default RecommendationInterface;