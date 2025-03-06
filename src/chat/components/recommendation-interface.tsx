import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Restaurant, Recommendation, useChatContext } from "@/lib/chat-ctx";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";


interface RestaurantWithRecommendation extends Restaurant {
	recommendation?: Recommendation;
	match_score: number;
}

// Component for badges
const BadgeList = ({ items, className }: { items?: string[] | null, className?: string }) => {
	if (!items?.length) return null;

	return (
		<div className="space-x-2 flex flex-wrap gap-y-2">
			{items.map((item, idx) => (
				<Badge
					variant="outline"
					key={idx}
					className={cn(
						"text-xs font-medium px-2 py-1 transition-all hover:scale-105",
						className
					)}
				>
					{item}
				</Badge>
			))}
		</div>
	);
};

// Restaurant card component
const RestaurantCard = ({
	restaurant,
	onClick
}: {
	restaurant: RestaurantWithRecommendation;
	onClick: (uri: string) => void;
}) => {
	const { recommendation } = restaurant;

	const handleClick = () => {
		if (restaurant.google_maps_url) {
			onClick(restaurant.google_maps_url);
		}
	};

	return (
		<div className="flex flex-col gap-2 p-2 pt-0">
			<button
				className="group flex flex-col items-start gap-3 rounded-lg border p-4 text-left text-sm 
                          transition-all hover:bg-accent hover:shadow-lg transform hover:-translate-y-1 
                          duration-200 ease-in-out"
				onClick={handleClick}
			>
				{/* Header Section */}
				<div className="flex w-full flex-col gap-1.5">
					<div className="flex items-center justify-between">
						<span className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-primary">
							{restaurant.name}
						</span>
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger>
									<span className={cn(
										"flex h-3 w-3 rounded-full transition-transform duration-200 group-hover:scale-110",
										restaurant.is_open ? "bg-green-500" : "bg-red-400"
									)} />
								</TooltipTrigger>
								<TooltipContent>
									{restaurant.is_open ? "Open Now" : "Closed"}
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</div>

					{/* Rating Section */}
					<div className="text-sm font-medium text-amber-500">
						{"⭐".repeat(Math.round(restaurant.rating as number))}
						<span className="text-gray-600 dark:text-gray-400 ml-1">
							{restaurant.rating} ({restaurant.total_ratings} reviews)
						</span>
					</div>
				</div>

				{/* Recommendation Details */}
				{recommendation && (
					<div className="flex flex-col gap-3 w-full">
						{/* Reason */}
						<div className="text-sm font-medium text-emerald-600 dark:text-emerald-400 
                                      bg-emerald-50 dark:bg-emerald-900/20 p-2 rounded-md">
							💡 {recommendation.reason}
						</div>

						{/* Specialties */}
						{recommendation.specialties && recommendation.specialties?.length > 0 && (
							<div className="space-y-1">
								<div className="text-xs font-semibold text-gray-500">👨‍🍳 Specialties</div>
								<BadgeList items={recommendation.specialties}
									className="bg-blue-50 text-blue-600 border-blue-200 
                                                   dark:bg-blue-900/20 dark:text-blue-400" />
							</div>
						)}

						{/* Dietary Options */}
						{recommendation.dietary_options && recommendation.dietary_options?.length > 0 && (
							<div className="space-y-1">
								<div className="text-xs font-semibold text-gray-500">🥗 Dietary Options</div>
								<BadgeList items={recommendation.dietary_options}
									className="bg-purple-50 text-purple-600 border-purple-200 
                                                   dark:bg-purple-900/20 dark:text-purple-400" />
							</div>
						)}

						{/* Ambiance */}
						{recommendation.ambiance && recommendation.ambiance?.length > 0 && (
							<div className="space-y-1">
								<div className="text-xs font-semibold text-gray-500">✨ Ambiance</div>
								<BadgeList items={recommendation.ambiance}
									className="bg-amber-50 text-amber-600 border-amber-200 
                                                   dark:bg-amber-900/20 dark:text-amber-400" />
							</div>
						)}

						{/* Message */}
						<div className="text-sm text-gray-600 dark:text-gray-300 italic 
                                      bg-gray-50 dark:bg-gray-700/30 p-2 rounded-md">
							"{recommendation.message}"
						</div>
					</div>
				)}

				{/* Address */}
				<div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
					<span>📍</span>
					{restaurant.address}
				</div>
			</button>
		</div>
	);
};

// Function to combine and sort restaurants with recommendations
const getCombinedRestaurantData = (
	restaurants?: Restaurant[],
	recommendations?: Recommendation[]
): RestaurantWithRecommendation[] => {
	// If no restaurants, return empty array
	if (!restaurants?.length) {
		return [];
	}

	// If no recommendations, return all restaurants without sorting
	if (!recommendations?.length) {
		return restaurants.map(restaurant => ({
			...restaurant,
			recommendation: undefined,
			match_score: 0
		}));
	}

	// If both restaurants and recommendations exist, combine and sort
	return restaurants.map(restaurant => {
		const recommendation = recommendations.find(
			rec => rec.name.toLowerCase() === restaurant.name.toLowerCase()
		);

		return {
			...restaurant,
			recommendation,
			match_score: recommendation?.match_score || 0
		};
	}).sort((a: RestaurantWithRecommendation, b: RestaurantWithRecommendation) =>
		b.match_score - a.match_score
	);
};

// Main component
const RestaurantList = ({
	restaurants,
	recommendations,
	searchQuery,
	handleOnClick
}: {
	restaurants?: Restaurant[];
	recommendations?: Recommendation[];
	searchQuery: string;
	handleOnClick: (uri: string) => void;
}) => {
	const sortedRestaurants = getCombinedRestaurantData(restaurants, recommendations);
	const filteredRestaurants = sortedRestaurants?.filter((restaurant) =>
		restaurant?.name.toLowerCase().includes(searchQuery.toLowerCase())
	);

	if (!filteredRestaurants.length) {
		return (
			<div className="flex flex-col h-full items-center justify-center gap-2 text-gray-500">
				<p>No recommendations available. Ask RestoGenie for restaurants!</p>
			</div>
		);
	}

	return (
		<>
			{filteredRestaurants.map((restaurant, idx) => (
				<RestaurantCard
					key={idx}
					restaurant={restaurant}
					onClick={handleOnClick}
				/>
			))}
		</>
	);
};

const RecommendationInterface = () => {
	const { chats, restaurants, recommendations, getAllRestaurants, getRecommendations } = useChatContext();
	const [searchQuery, setSearchQuery] = useState("");

	useEffect(() => {
		const fetchData = async () => {
			try {
				// Fetch restaurants first
				getAllRestaurants();

				// Get recommendations only after restaurants are loaded
				if (restaurants) {
					getRecommendations();

					// Optional: Log only in development environment
					if (process.env.NODE_ENV === 'development') {
						console.log({
							chats,
							restaurants: restaurants,
							recommendations: recommendations
						});
					}
				}
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		};

		fetchData();
	}, [chats]);


	const openInNewTab = (url: string) => {
		const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
		if (newWindow) newWindow.opener = null;
	}

	const handleOnClick = (url: string) => {
		return openInNewTab(url);
	};

	return (
		<div className="flex h-full flex-col items-center justify-center p-4 bg-gray-100 dark:bg-gray-900">
			<Card className="flex flex-col h-[90vh] w-full max-w-2xl shadow-xl rounded-2xl bg-white dark:bg-gray-800">
				{/* Header */}
				<CardHeader className="sticky top-0 z-10 flex flex-row items-center shrink-0 p-6 bg-white dark:bg-gray-800 border-b shadow-md">
					<div className="flex items-center space-x-4 w-full">
						<div>
							<p className="text-lg font-semibold text-gray-900 dark:text-white">Top recommendation Picks</p>
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

					<RestaurantList
						restaurants={restaurants}
						recommendations={recommendations}
						searchQuery={searchQuery}
						handleOnClick={handleOnClick}
					/>
				</CardContent>

				{/* Footer */}
				<CardFooter className="sticky bottom-0 z-10 shrink-0 p-4 bg-white dark:bg-gray-800 border-t shadow-md">

				</CardFooter>
			</Card>
		</div>
	);
}

export default RecommendationInterface;