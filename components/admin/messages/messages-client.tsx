"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { MarkReadButton } from "./mark-read-button";
import { ChevronDown, ChevronUp } from "lucide-react";

type Message = {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  subject?: string | null;
  message: string;
  isRead: boolean;
  createdAt: string;
};

function MessageCard({ msg }: { msg: Message }) {
  const [expanded, setExpanded] = useState(!msg.isRead);
  const isLong = msg.message.length > 150;

  return (
    <div
      className={`bg-card border rounded-xl p-4 transition-all ${!msg.isRead ? "border-brand-brown/40 shadow-sm" : "border-border"}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-sm">{msg.name}</span>
            {!msg.isRead && (
              <Badge className="text-xs bg-brand-brown text-white border-0 px-1.5">New</Badge>
            )}
          </div>
          {msg.email && <p className="text-xs text-muted-foreground">{msg.email}</p>}
          {msg.phone && <p className="text-xs text-muted-foreground">{msg.phone}</p>}
          {msg.subject && <p className="text-sm font-medium mt-2">{msg.subject}</p>}

          <p className={`text-sm text-muted-foreground mt-1 whitespace-pre-wrap ${!expanded && isLong ? "line-clamp-2" : ""}`}>
            {msg.message}
          </p>

          {isLong && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="mt-1.5 flex items-center gap-1 text-xs text-brand-brown hover:underline"
            >
              {expanded ? (
                <><ChevronUp className="h-3 w-3" /> Show less</>
              ) : (
                <><ChevronDown className="h-3 w-3" /> Show more</>
              )}
            </button>
          )}
        </div>

        <div className="shrink-0 flex flex-col items-end gap-2">
          <span className="text-xs text-muted-foreground">
            {new Date(msg.createdAt).toLocaleDateString()}
          </span>
          {!msg.isRead && <MarkReadButton id={msg.id} />}
        </div>
      </div>
    </div>
  );
}

export function MessagesClient({ messages }: { messages: Message[] }) {
  return (
    <div className="space-y-3">
      {messages.map((msg) => (
        <MessageCard key={msg.id} msg={msg} />
      ))}
    </div>
  );
}
