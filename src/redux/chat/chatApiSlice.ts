import { IUser } from "@/types/user";
import { apiSlice } from "../api/apiSlice";

export interface IChat {
  chatId: string;
  content: string;
  sender: IUser;
  createdAt: string;
  unreadCount: number;
  recipient: IUser;
}

export interface IChatResult {
  pages: number;
  chats: IChat[];
  total: number;
}

export interface IChatFilter {
  page: number;
  itemsPerPage: number;
  recipientId?: string;
}

export interface IMessage {
  content: string;
  _id: string;
  createdAt: string;
  sender: IUser;
  files: Array<{ path: string }>;
  isRead: boolean;
}

export interface IMessageResult {
  pages: number;
  messages: IMessage[];
  total: number;
}

export const chatApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //builder.query(ResultType, QueryArgType | void)
    //get chats
    getChats: builder.query<IChatResult, IChatFilter>({
      query: ({ itemsPerPage, page }) => ({
        url: `/chats?page=${page}&size=${itemsPerPage}`,
      }),
      transformErrorResponse: (response, meta, arg) =>
        (response.data as { message: string })?.message,
      providesTags: (result, error, arg) =>
        result?.chats?.length
          ? [
              ...result?.chats?.map(({ chatId: id }) => ({
                type: "Chat" as const,
                id,
              })),
              { type: "Chat", id: "LIST" },
            ]
          : // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
            [{ type: "Chat", id: "LIST" }],
    }),

    //messages for a given chat
    getChat: builder.query<IMessageResult, IChatFilter>({
      query: ({ itemsPerPage, page, recipientId }) => ({
        url: `/chats/${recipientId}?page=${page}&size=${itemsPerPage}`,
      }),
      transformErrorResponse: (response, meta, arg) =>
        (response.data as { message: string })?.message,
      providesTags: (result, error, arg) =>
        result?.messages?.length
          ? [
              ...result?.messages?.map(({ _id: id }) => ({
                type: "Chat" as const,
                id,
              })),
              { type: "Chat", id: "LIST" },
            ]
          : // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
            [{ type: "Chat", id: "LIST" }],
    }),

    //post message
    postMessage: builder.mutation<
      { message: string; chatId: string },
      FormData
    >({
      query: (data) => ({
        url: `/chats/messages`,
        method: "POST",
        body: data,
      }),
      transformErrorResponse: (response, meta, arg) =>
        (response.data as { message: string })?.message,
      //refetch or invalidate cache
      invalidatesTags: (result, error, arg) => [{ type: "Chat", id: "LIST" }],
    }),

    //mark other user's isRead as true
    markAsRead: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/chats/messages/${id}`,
        method: "PATCH",
      }),
      transformErrorResponse: (response, meta, arg) =>
        (response.data as { message: string })?.message,
      // don;t refetch writer chats as you can't see other user's isRead status, only yours
      //invalidate/refetch unread to clear notifications(after isRead of the other user is updated)
      invalidatesTags: (result, error, id) => [{ type: "Chat", id }],
    }),

    //delete chat
    deleteMessage: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/chats/messages/${id}`,
        method: "DELETE",
      }),
      transformErrorResponse: (response, meta, arg) =>
        (response.data as { message: string })?.message,
      invalidatesTags: (result, error, id) => [{ type: "Chat", id }], //provide List to trigger unread & recent chats
    }),
  }),

  overrideExisting: true,
});

export const {
  useGetChatQuery,
  useMarkAsReadMutation,
  usePostMessageMutation,
  useDeleteMessageMutation,
  useGetChatsQuery,
} = chatApiSlice;
