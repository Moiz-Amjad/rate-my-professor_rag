import { useState } from "react";
import { Box, TextField, Button, Typography, Paper, Toolbar, AppBar } from "@mui/material";
import "../styles/globals.css";
import Container from '@mui/material/Container';
import Image from 'next/image'
import Head from 'next/head'
import Link from 'next/link';


export default function ChatWindow() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I'm the Rate My Professor support assistant. How can I help you today?",
    },
  ]);
  const [message, setMessage] = useState("");

  const sendMessage = async () => {
    setMessages((messages) => [
      ...messages,
      { role: "user", content: message },
      { role: "assistant", content: "" },
    ]);
    setMessage("");

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([...messages, { role: "user", content: message }]),
    }).then(async (res) => {
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let result = "";
      return reader.read().then(function processText({ done, value }) {
        if (done) {
          return result;
        }
        const text = decoder.decode(value || new Uint8Array(), {
          stream: true,
        });
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1];
          let otherMessages = messages.slice(0, messages.length - 1);
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },
          ];
        });
        return reader.read().then(processText);
      });
    });
  };

  return (
    <Container maxWidth="100vh" id="home-root" style={{ backgroundImage: "url('/images/ratemyprofnew.jpg')", backgroundSize: 'cover', backdropFilter: 'blur(90px)', backgroundPosition: 'center', padding: '0', justifyContent: 'center' }}>
        <Head>
          <title>Rate My Professor Chatbot Assistant</title>
          <meta name="description" content="Your friendly assistant for Rate My Professor" />
        </Head>
        
        {/* Transparent AppBar */}
        <AppBar position="sticky" sx={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.5)'}}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1, color: '#FFFFFF', fontWeight: 'bold' }}>
              <Link href="/" style={{ color: '#FFFFFF', textDecoration: 'none' }}>
                RateMyProfChat
              </Link>
            </Typography>
              <Button sx={{ color: '#FFFFFF', borderRadius: '20px', padding: '8px 16px', marginRight: '16px', ":hover": { backgroundColor: 'rgba(255, 255, 255, 0.1)' }}}>
                LOG IN
              </Button>
              <Button sx={{ color: '#FFFFFF', borderRadius: '20px', padding: '8px 16px', border: '1px solid #FFFFFF', ":hover": { backgroundColor: 'rgba(255, 255, 255, 0.1)' }}}>
                SIGN UP
              </Button>
          </Toolbar>
        </AppBar>
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        bgcolor: "linear-gradient(to bottom, #000000, #333333)",
        boxShadow: "0 0 20px rgba(0, 0, 0, 0.5)",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: "80%",
          maxWidth: 600,
          bgcolor: "background.paper",
          boxShadow: "0 0 20px rgba(0, 0, 0, 0.5)",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Rate My Professor
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {messages.map((msg, i) => (
            <Box
              key={i}
              sx={{
                alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                p: 2,
                borderRadius: 2,
                bgcolor:
                  msg.role === "user" ? "primary.main" : "background.paper",
                color: msg.role === "user" ? "common.white" : "text.primary",
              }}
            >
              {msg.content}
            </Box>
          ))}
          <Box
            sx={{
              display: "flex",
              gap: 2,
            }}
          >
            <TextField
              variant="outlined"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              sx={{
                flexGrow: 1,
              }}
            />
            <Button
              variant="contained"
              onClick={sendMessage}
              sx={{
                bgcolor: "primary.main",
                "&:hover": {
                  bgcolor: "primary.dark",
                },
              }}
            >
              Send
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  </Container>
  );
}
