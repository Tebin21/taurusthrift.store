import { prisma } from "@/lib/prisma";
import { MessagesClient } from "@/components/admin/messages/messages-client";
import { MessageSquare } from "lucide-react";

export const metadata = { title: "Messages" };

export default async function AdminMessagesPage() {
  const rawMessages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });

  const messages = rawMessages.map((m: any) => ({
    id: m.id,
    name: m.name,
    email: m.email,
    phone: m.phone,
    subject: m.subject,
    message: m.message,
    isRead: m.isRead,
    createdAt: m.createdAt.toISOString(),
  }));

  const unreadCount = messages.filter((m) => !m.isRead).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Contact Messages</h1>
        <p className="text-muted-foreground">{unreadCount} unread of {messages.length} total</p>
      </div>

      {messages.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <MessageSquare className="h-10 w-10 mx-auto mb-3 opacity-30" />
          No messages yet
        </div>
      ) : (
        <MessagesClient messages={messages} />
      )}
    </div>
  );
}
