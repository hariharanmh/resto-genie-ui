import axios from "axios";
import { useContext, createContext, type PropsWithChildren, useState } from "react";


interface ChatContent {
    message: string;
}

interface Chat {
    role: string;
    timestamp: string;
    content: ChatContent;
}

export interface Restaurant {
    name: string;
    address?: string;
    rating?: string | number;
    total_ratings?: string | number;
    is_open?: boolean;
    google_maps_url?: string;
}

export interface Recommendation {
    name: string;
    reason?: string;
    specialties?: string[] | null;
    match_score?: number;
    dietary_options?: string[] | null;
    ambiance?: string[] | null;
    message?: string;
}

const ChatContext = createContext<{
    chats?: Chat[] | null;
    isLoading: boolean;
    getChat: () => Promise<void>;
    postChat: (
        message: string,
    ) => Promise<void>;
    restaurants: Restaurant[];
    getAllRestaurants: () => Promise<Restaurant[]>;
    recommendations: Recommendation[];
    getRecommendations: () => Promise<Recommendation[]>;
    sysReady: boolean;
    sysReadyCheck: () => Promise<void>;
}>({
    chats: null,
    isLoading: false,
    getChat: async () => {},
    postChat: async () => {},
    restaurants: [],
    getAllRestaurants: async () => [],
    recommendations: [],
    getRecommendations: async () => [],
    sysReady: false,
    sysReadyCheck: async () => {},
});


export const useChatContext = () => {
    const value = useContext(ChatContext);
    if (process.env.NODE_ENV !== "production") {
        if (!value) {
            throw new Error("useSession must be wrapped in a <SessionProvider />");
        }
    }

    return value;

};


export const ChatContextProvider = ({ children }: PropsWithChildren) => {
    const [chats, setChats] = useState<Chat[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [sysReady, setSysReady] = useState(false);
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

    const baseUrl = import.meta.env.VITE_BASE_URL || "https://8000-idx-restogenie-1735936089471.cluster-7ubberrabzh4qqy2g4z7wgxuw2.cloudworkstations.dev/";
    const apiPrefix = "recommendation-engine/";
    const client = axios.create({
        baseURL: baseUrl
    });
    client.defaults.withCredentials = true;

    const contextValue = {
        chats,
        isLoading,
        getChat: async (): Promise<void> => {
            try {
                setIsLoading(true);

                const response = await client.get(`${apiPrefix}chat`);
                const newChats = response.data;
                setChats(newChats);
            } catch (error: any) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        },
        postChat: async (message: string): Promise<void> => {
            try {
                setIsLoading(true);

                const response = await fetch(`${baseUrl}${apiPrefix}chat`, {
                    method: "POST",
                    credentials: "include",
                    headers: { 
                        "Content-Type": "text/event-stream",
                    },
                    body: JSON.stringify({ prompt: message }), // Send JSON body
                });

                if (!response.body) {
                    throw new Error("ReadableStream not supported in this browser.");
                }

                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let accumulatedText = "";

                setChats((prevChats) => [
                    ...prevChats,
                    { role: "user", timestamp: new Date().toISOString(), content: { message } }, // User message
                    { role: "model", timestamp: new Date().toISOString(), content: { message: "" } } // Placeholder for AI response
                ]);

                    const processChunk = async () => {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    accumulatedText += decoder.decode(value, { stream: true });

                            // Split events properly by line breaks
                    const lines = accumulatedText.split("\n");
                        accumulatedText = lines.pop() || "";

                        let latestMessage = "";

                            lines.forEach((line) => {
                                if (!line.trim()) return;
                                try {
                                    // SSE format includes "data: ..." so we need to remove the prefix
                                    if (line.startsWith("data:")) {
                                        const jsonString = line.slice(5).trim(); // Remove "data:" prefix and trim whitespace
                                        const parsedData = JSON.parse(jsonString); // Convert to JSON

                                    if (parsedData.role === "model") {
                                        latestMessage = parsedData.content.message; // REPLACING instead of appending
                                        }
                                    }
                            } catch (e) {
                                    console.error("Error parsing SSE:", e, line);
                                }
                            });

                        if (latestMessage) {
                            setChats((prevChats) => {
                                const lastMessage = prevChats[prevChats.length - 1];
                                if (lastMessage.role === "model") {
                                    return [
                                        ...prevChats.slice(0, -1),
                                        {
                                            ...lastMessage,
                                            content: { message: latestMessage }, // REPLACING the message instead of appending
                                        },
                                    ];
                                }
                                return prevChats;
                            });
                        }
                        }
                    };

                // Wait for all streaming chunks to be processed
                await processChunk();
            } catch (error) {
                console.error("Error posting chat", error);
            } finally {
                setIsLoading(false);
            }
        },
        restaurants,
        getAllRestaurants: async (): Promise<Restaurant[]> => {
            try {
                setIsLoading(true);

                const response = await client.get(`${apiPrefix}get-restaurants`);
                const newRestaurants = response.data;
                setRestaurants(newRestaurants);
                return newRestaurants;
            } catch (error: any) {
                console.error(error);
                return [];
            } finally {
                setIsLoading(false);
            }
        },
        recommendations,
        getRecommendations: async (): Promise<Recommendation[]> => {
            try {
                setIsLoading(true);

                const response = await client.get(`${apiPrefix}get-recommendations`);
                const newRecommendations = response.data;
                setRecommendations(newRecommendations);
                return newRecommendations;
            } catch (error: any) {
                console.error(error);
                return [];
            } finally {
                setIsLoading(false);
            }
        },
        sysReady,
        sysReadyCheck: async (): Promise<void> => {
            try {
                await client.get(`system-check`);
                setSysReady(true);
            } catch (error: any) {
                console.error(error);
            }
        },
    }

    return (
        <ChatContext.Provider
            value={contextValue}
        >
            {children}
        </ChatContext.Provider>
    );
};
