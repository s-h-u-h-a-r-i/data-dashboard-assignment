"use client";

import { JSX, useState } from "react";

import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import { useAIAssistant } from "@/lib/hooks";
import { AIMessage } from "@/types/model";
import { Send } from "@/icons";
import { formatDateTime } from "@/utils";

function ChatMessage({
  message,
  isUser = false,
}: {
  message: AIMessage;
  isUser?: boolean;
}): JSX.Element {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        mb: 2,
        flexDirection: isUser ? "row-reverse" : "row",
      }}>
      <Avatar
        sx={{
          bgcolor: isUser ? "primary.main" : "secondary.main",
          width: 32,
          height: 32,
        }}>
        {isUser ? "U" : "AI"}
      </Avatar>
      <Box sx={{ flex: 1 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 0.5,
            flexDirection: isUser ? "row-reverse" : "row",
          }}>
          <Typography variant="caption" fontWeight={"bold"}>
            {isUser ? "You" : "Assistant"}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {formatDateTime(new Date(message.timestamp))}
          </Typography>
        </Box>
        <Paper
          elevation={0}
          sx={{
            p: 1.5,
            bgcolor: isUser ? "primary.light" : "grey.100",
            color: isUser ? "primary.contrastText" : "text.primary",
          }}>
          <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
            {isUser ? message.query : message.response}
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}

export function AIAssistant(): JSX.Element {
  const [query, setQuery] = useState("");
  const [messageHistory, setMessageHistory] = useState<AIMessage[]>([]);
  const { mutate, isPending } = useAIAssistant();

  const handleSend = () => {
    if (!query.trim() || isPending) return;

    const currentQuery = query;
    setQuery("");

    mutate(currentQuery, {
      onSuccess: (response) => {
        console.log(response);
        setMessageHistory((prev) => [...prev, response]);
      },
      onError: (error) => {
        console.error("AI Assistant error:", error);
      },
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box sx={{ flex: 1, overflowY: "auto", mb: 2 }}>
        {messageHistory.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: "text.secondary",
            }}>
            <Typography variant="body2" align="center">
              Ask me anything about your financial data...
            </Typography>
          </Box>
        ) : (
          messageHistory.map((msg, idx) => (
            <Box key={idx}>
              <ChatMessage message={msg} isUser />
              <ChatMessage message={msg} />
            </Box>
          ))
        )}
        {isPending && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}>
            <CircularProgress size={20} />
            <Typography variant="body2" color="text.secondary">
              AI is thinking...
            </Typography>
          </Box>
        )}
      </Box>

      <Box sx={{ display: "flex", gap: 1 }}>
        <TextField
          fullWidth
          multiline
          maxRows={3}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Ask about invoices, payments..."
          disabled={isPending}
          size="small"
        />
        <Button
          variant="contained"
          onClick={handleSend}
          disabled={!query.trim() || isPending}
          sx={{ minWidth: 80 }}>
          {isPending ? <CircularProgress size={20} /> : <Send />}
        </Button>
      </Box>
    </Box>
  );
}
