import { useEffect, useRef } from "react";
import { useMessages } from "../../../queries/message.query";
import { Socket } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../../../store/auth.store";
import { Avatar, Tooltip } from "antd";
import { UserOutlined } from "@ant-design/icons";
import styles from "./ChatMessages.module.scss";
import clsx from "clsx";

interface ChatMessagesProps {
  socket: Socket;
  conversationId: string;
}

// Add the IMessageResponse interface with metadata property
interface IMessageResponse {
  id: string;
  sender: {
    id: string;
    fullName: string;
    avatarUrl?: string;
  };
  content: string;
  isRead?: boolean;
  metadata?: {
    products?: Array<{
      result?: {
        items?: any[];
      };
    }>;
  };
}

export default function ChatMessages({
  socket,
  conversationId,
}: ChatMessagesProps) {
  const queryClient = useQueryClient();
  const currentUser = useAuthStore((state) => state.user);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useMessages(conversationId);

  const messages =
    data?.pages
      .slice()
      .reverse()
      .flatMap((p) => p.items) ?? [];
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!conversationId) return;

    socket.emit("join_conversation", conversationId);

    return () => {
      socket.emit("leave_conversation", conversationId);
    };
  }, [conversationId, socket]);

  useEffect(() => {
    const onNewMessage = (msg: any) => {
      // Use loose equality or check both string forms if necessary
      if (String(msg.conversationId) !== String(conversationId)) return;

      console.log("📩 realtime message", msg);

      queryClient.setQueryData(["messages", conversationId], (old: any) => {
        if (!old || !old.pages || old.pages.length === 0) return old;

        const newPages = [...old.pages];
        const firstPage = { ...newPages[0] };
        firstPage.items = [...firstPage.items, msg];
        newPages[0] = firstPage;

        return {
          ...old,
          pages: newPages,
        };
      });
    };

    socket.on("new_message", onNewMessage);

    return () => {
      socket.off("new_message", onNewMessage);
    };
  }, [conversationId, socket, queryClient]);

  useEffect(() => {
    containerRef.current?.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages.length]);

  return (
    <div
      ref={containerRef}
      className={styles.container}
      onScroll={(e) => {
        const el = e.currentTarget;
        if (el.scrollTop < 50 && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }}
    >
      {isFetchingNextPage && <div className={styles.loading}>Đang tải...</div>}

      <div style={{ flex: 1 }} />

      {messages.map((m: IMessageResponse) => {
        const isMe = m.sender?.id === currentUser?.id;

        return (
          <div
            key={m.id}
            className={clsx(styles.messageWrapper, {
              [styles.isMe]: isMe,
              [styles.isPartner]: !isMe,
            })}
          >
            <Tooltip title={m.sender.fullName}>
              <Avatar
                size={32}
                src={m.sender.avatarUrl}
                icon={<UserOutlined />}
                className={styles.avatar}
              />
            </Tooltip>

            <div className={styles.messageContent}>
              <div className={styles.bubble}>
                <div>{m.content}</div>
              </div>

              {m.isRead && isMe && <div className={styles.status}>Đã xem</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
