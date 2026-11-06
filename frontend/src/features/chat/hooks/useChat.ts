import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import type { ApiError } from "../../../shared/api/ApiError";
import {
    getConversations,
    startConversation,
    getMessages,
    sendMessage,
    markMessagesAsRead,
    type SendMessagePayload,
} from "../services/chat.service";

export const useGetConversations = () => {
    return useMutation({
        mutationFn: getConversations,
        onError: (error: ApiError) => toast.error(error.message),
    });
};

export const useGetMessages = () => {
    return useMutation({
        mutationFn: ({
            conversationId,
            cursor,
            limit,
        }: {
            conversationId: string;
            cursor?: string;
            limit?: number;
        }) => getMessages(conversationId, cursor, limit),
        onError: (error: ApiError) => toast.error(error.message),
    });
};

export const useSendMessage = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            conversationId,
            payload,
        }: {
            conversationId: string;
            payload: SendMessagePayload;
        }) => sendMessage(conversationId, payload),
        onError: (error: ApiError) => toast.error(error.message),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["chatMessages", variables.conversationId],
            });
            queryClient.invalidateQueries({
                queryKey: ["chatConversations"],
            });
        },
    });
};

export const useStartConversation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (recipientId: string) => startConversation(recipientId),
        onError: (error: ApiError) => toast.error(error.message),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["chatConversations"],
            });
        },
    });
};

export const useMarkMessagesAsRead = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (conversationId: string) => markMessagesAsRead(conversationId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["chatConversations"],
            });
        },
    });
};

