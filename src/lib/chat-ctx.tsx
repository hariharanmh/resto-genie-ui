import axios from "axios";
import { useContext, createContext, type PropsWithChildren, useState } from "react";


interface ChatContent {
    message: string;
    location?: string | null;
    latitude?: string | null;
    longitude?: string | null;
    recommended_restaurant_names: string[];
}

interface Chat {
    role: string;
    timestamp: string;
    content: ChatContent;
}

interface Recommendations {
    name: string;
    address?: string;
    rating?: string | number;
    user_rating_count?: string | number;
    open_now?: boolean;
    google_maps_uri?: string;
}

const ChatContext = createContext<{
    chats?: Chat[] | null;
    isLoading: boolean;
    getChat: () => void;
    postChat: (
        message: string,
    ) => void;
    recommendations: Recommendations[];
    getRecommendations: (
        names: string[],
        use_local_cache: boolean,
    ) => void;
    sysReady: boolean;
    sysReadyCheck: () => void;
}>({
    chats: null,
    isLoading: false,
    getChat: () => null,
    postChat: () => null,
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
    const [recommendations, setRecommendations] = useState<Recommendations[]>([]);

    const baseUrl = "https://8000-idx-restogenie-1735936089471.cluster-7ubberrabzh4qqy2g4z7wgxuw2.cloudworkstations.dev/";
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

                const response = await fetch(`${baseUrl}${apiPrefix}chat?prompt=${message}`, {
                    method: "POST",
                    credentials: 'include',
                    headers: { 
                        "Content-Type": "application/json",
                        "WithCredentials": "true",
                    },
                });

                if (!response.body) {
                    throw new Error("ReadableStream not supported in this browser.");
                }

                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let accumulatedText = "";
                let latestMessages = new Map(); // Track the last message for each role

                setChats(prevChats => {
                    let updatedChats = [...prevChats]; // Keep existing chats before entering the loop

                    const processChunk = async () => {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    accumulatedText += decoder.decode(value, { stream: true });
                    const lines = accumulatedText.split("\n");
                    accumulatedText = lines.pop() || ""; // Save incomplete part

                            lines.forEach(line => {
                            try {
                                    const jsonData = JSON.parse(line.trim());
                                    latestMessages.set(jsonData.role, jsonData); // Store latest message for each role
                            } catch (e) {
                                console.error("Error parsing JSON:", e, line);
                                }
                            });

                            // Merge prevChats and latestMessages
                            updatedChats = [
                                ...updatedChats.filter(chat => !latestMessages.has(chat.role)), // Keep old chats except replaced ones
                                ...Array.from(latestMessages.values()), // Append latest messages
                            ];

                            setChats(updatedChats); // Update chats in real-time
                        }
                    };

                    processChunk(); // Start processing stream

                    return updatedChats; // Ensures existing chats persist
                    });
            } catch (error) {
                console.error("Error posting chat", error);
            } finally {
                setIsLoading(false);
            }
        },
        recommendations,
        getRecommendations: async (names: string[], use_local_cache: boolean = false) => {
            try {
                setIsLoading(true);

                let requiredRecommendations: string[] = names;
                const existingRecommendations: Map<string, Recommendations> = new Map(
                    (recommendations ?? []).filter(rec => rec).map(rec => [rec.name, rec])
                );


                if (use_local_cache) {
                    requiredRecommendations = names.filter((name) => !existingRecommendations.has(name));
                }

                // Avoid API if no details required
                if (!requiredRecommendations) return;

                const response = await client.post(`${apiPrefix}get-recommended-restaurants/`, requiredRecommendations);
                const fetchedRecommendationsArray = response.data ?? [];

                const fetchedRecommendations: Map<string, Recommendations> = new Map(
                    fetchedRecommendationsArray
                        .filter((rec: Recommendations) => rec?.name)
                        .map((rec: Recommendations) => [rec.name, rec])
                );
                const newRecommendations: Recommendations[] = names.map((name) =>
                    existingRecommendations.get(name) ?? fetchedRecommendations.get(name)
                ).filter((rec): rec is Recommendations => rec !== undefined);

                if (newRecommendations.length > 0) {
                    setRecommendations(newRecommendations);
                }
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
