import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useChatContext } from "@/lib/chat-ctx";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";


const RecommendationInterface = () => {
	const { chats, recommendations, getRecommendations } = useChatContext();
	const [searchQuery, setSearchQuery] = useState("");

	const filteredRecommendations = recommendations?.filter((recommendation) =>
		recommendation?.name.toLowerCase().includes(searchQuery.toLowerCase())
	);

	useEffect(() => {
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
		<div className="flex h-full flex-col items-center justify-center p-4 bg-gray-100 dark:bg-gray-900">
			<Card className="flex flex-col h-[90vh] w-full max-w-2xl shadow-xl rounded-2xl bg-white dark:bg-gray-800">
				{/* Header */}
				<CardHeader className="sticky top-0 z-10 flex flex-row items-center shrink-0 p-6 bg-white dark:bg-gray-800 border-b shadow-md">
					<div className="flex items-center space-x-4 w-full">
						<div>
							<p className="text-lg font-semibold text-gray-900 dark:text-white">Top Restaurant Picks</p>
						</div>
					</div>
				</CardHeader>

				{/* Recommendation Area */}
				<CardContent className="flex flex-col flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
					<div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
						<form>
							<div className="relative">
								<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
								<Input
									placeholder="Search restaurants..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="pl-8"
								/>
							</div>
						</form>
					</div>
					{filteredRecommendations?.length > 0 ? (
						filteredRecommendations.map((recommendation, idx) => (
							<div key={idx} className="flex flex-col gap-2 p-2 pt-0">
								<button
									className="flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent"
									onClick={handleOnClick(recommendation?.google_maps_uri as string)}
								>
									<div className="flex w-full flex-col gap-1">
										<div className="flex items-center justify-between">
											<span className="font-semibold text-gray-900 dark:text-white">{recommendation.name}</span>
											<span className={cn(
												"flex h-2 w-2 rounded-full",
												recommendation.open_now ? "bg-green-500" : "bg-red-400"
											)} />
										</div>
										<div className="text-xs font-medium">⭐ {recommendation.rating} ({recommendation.user_rating_count} reviews)</div>
									</div>
									<div className="text-xs text-muted-foreground line-clamp-2">
										{recommendation.address}
									</div>
								</button>
							</div>
						))
					) : (
						<div className="flex flex-col h-full items-center justify-center gap-2 text-gray-500">
							<p>No recommendations available. Ask RestoGenie for restaurants!</p>
						</div>
					)}
				</CardContent>

				{/* Footer */}
				<CardFooter className="sticky bottom-0 z-10 shrink-0 p-4 bg-white dark:bg-gray-800 border-t shadow-md">

				</CardFooter>
			</Card>
		</div>
	);
}

export default RecommendationInterface;