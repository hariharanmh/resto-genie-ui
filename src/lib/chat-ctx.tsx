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
    getChat: () => void;
    postChat: (
        message: string,
    ) => void;
    restaurants: Restaurant[];
    getAllRestaurants: () => void;
    recommendations: Recommendation[];
    getRecommendations: () => void;
    sysReady: boolean;
    sysReadyCheck: () => void;
}>({
    chats: null,
    isLoading: false,
    getChat: () => null,
    postChat: () => null,
    restaurants: [],
    getAllRestaurants: () => null,
    recommendations: [],
    getRecommendations: () => null,
    sysReady: false,
    sysReadyCheck: () => null,
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
        getChat: async () => {
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
        postChat: async (message: string) => {
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

                setChats((prevChats) => {
                    let updatedChats = [...prevChats];

                    // Push user message first
                    updatedChats.push({ role: "user", timestamp: new Date().toISOString(), content: { message } });

                    const processChunk = async () => {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    accumulatedText += decoder.decode(value, { stream: true });

                            // Split events properly by line breaks
                    const lines = accumulatedText.split("\n");
                            accumulatedText = lines.pop() || ""; // Store partial event for next chunk

                            lines.forEach((line) => {
                                if (!line.trim()) return;
                                try {
                                    // SSE format includes "data: ..." so we need to remove the prefix
                                    if (line.startsWith("data:")) {
                                        const jsonString = line.slice(5).trim(); // Remove "data:" prefix and trim whitespace
                                        const parsedData = JSON.parse(jsonString); // Convert to JSON

                                        const { role, timestamp, content } = parsedData;

                                        if (role === "model") {
                                            // If last message is from AI, update it, else push a new AI message
                                            if (updatedChats.length > 0 && updatedChats[updatedChats.length - 1].role === "model") {
                                                updatedChats[updatedChats.length - 1].content.message = content.message;
                                            } else {
                                                updatedChats.push({ role, timestamp, content });
                                            }
                                        }
                                    }
                            } catch (e) {
                                    console.error("Error parsing SSE:", e, line);
                                }
                            });

                            setChats([...updatedChats]); // Trigger re-render with new state
                        }
                    };

                    processChunk();
                    return updatedChats;
                    });
            } catch (error) {
                console.error("Error posting chat", error);
            } finally {
                setIsLoading(false);
            }
        },
        restaurants,
        getAllRestaurants: async () => {
            try {
                setIsLoading(true);

                const response = await client.get(`${apiPrefix}get-restaurants`);
                const newRestaurants = response.data;
                setRestaurants(newRestaurants);
            } catch (error: any) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        },
        recommendations,
        getRecommendations: async () => {
            try {
                setIsLoading(true);

                const response = await client.get(`${apiPrefix}get-recommendations`);
                const newRecommendations = response.data;
                    setRecommendations(newRecommendations);
            } catch (error: any) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        },
        sysReady,
        sysReadyCheck: async () => {
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
