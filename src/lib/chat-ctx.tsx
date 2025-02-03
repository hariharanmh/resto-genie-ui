import axios from "axios";
import { useContext, createContext, type PropsWithChildren, useState } from "react";


interface ChatContent {
    message: string;
    location?: string | null;
    latitude?: string | null;
    longitude?: string | null;
}

interface Chat {
    role: string;
    timestamp: string;
    content: ChatContent;
}


const ChatContext = createContext<{
    chats?: Chat[] | null;
    isLoading: boolean;
    getChat: () => void;
    postChat: (
        message: string
    ) => void;
    getRecommendations: (
        names: string[]
    ) => void;
    sysReady: boolean;
    sysReadyCheck: () => void;
}>({
    chats: null,
    isLoading: false,
    getChat: () => null,
    postChat: () => null,
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

    const baseUrl = "https://8000-idx-restogenie-1735936089471.cluster-7ubberrabzh4qqy2g4z7wgxuw2.cloudworkstations.dev/";
    const apiPrefix = "recommendation-engine/";
    const client = axios.create({
        baseURL: baseUrl
    });

    const contextValue = {
        chats,
        isLoading,
        getChat: async () => {
            try {
                setIsLoading(true);

                const response = await client.get(`${apiPrefix}chat`);
                console.log(response);

                setChats(response.data);
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
                    headers: { "Content-Type": "application/json" },
                });
    
                if (!response.body) {
                    throw new Error("ReadableStream not supported in this browser.");
                }
    
                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let accumulatedText = "";
                let seenMessages = new Set(); // To store unique content messages
    
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
    
                    accumulatedText += decoder.decode(value, { stream: true });
    
                    const lines = accumulatedText.split("\n");
                    accumulatedText = lines.pop() || ""; // Save incomplete part
    
                    const newChats = lines
                        .map(line => line.trim()) // Remove any extra spaces
                        .filter(line => line.length > 0) // Ignore empty lines
                        .map(line => {
                            try {
                                const jsonData = JSON.parse(line);
                                const contentString = JSON.stringify(jsonData.content); // Extract `content` field
    
                                if (!seenMessages.has(contentString)) {
                                    seenMessages.add(contentString); // Track unique messages
                                    return jsonData;
                                }
                                return null; // Ignore duplicate messages
                            } catch (e) {
                                console.error("Error parsing JSON:", e, line);
                                return null;
                            }
                        })
                        .filter(Boolean); // Remove null values
    
                    setChats(prevChats => [...prevChats, ...newChats]);
                }
            } catch (error) {
                console.error("Error posting chat", error);
            } finally {
                setIsLoading(false);
            }
        },
        getRecommendations: async () => {
            try {
                setIsLoading(true);

                const response = await client.get(`${apiPrefix}recommendations`);
                console.log(response);
            } catch (error: any) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        },
        sysReady,
        sysReadyCheck: async () => {
            try {
                const response = await client.get(`system-check`);
                console.log('sys check -> ', response)
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
