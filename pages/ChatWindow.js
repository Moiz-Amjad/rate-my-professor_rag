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
    <Container maxWidth="100vh" id="home-root" style={{ backgroundImage: "url('/images/ratemyprofnew.jpg')", backgroundSize: 'cover',  backgroundPosition: 'center', padding: '0', margin: '0', flexDirection: 'column',display: 'flex', justifyContent: 'space-between', minHeight: '100vh'}}>
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

      {/* Centered Paper with Overlay Background */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flexGrow: 1, 
          padding: "20px",
          marginTop: "-50px", 
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: "80%",
            maxWidth: 650,
            minHeight: "70vh",
            maxHeight: "70vh",
            backgroundColor: "rgba(0, 0, 0, 0.6)", // Same overlay background
            color: "#FFFFFF", // White text for contrast
            borderRadius: "15px",
            boxShadow: "0 0 20px rgba(0, 0, 0, 0.5)",
            display: "flex",
            flexDirection: "column",
            justifyContent:"space-between",
          }}
        >
          <Typography variant="h4" gutterBottom align="center">
            Rate My Professor Chat Assistant
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
              flexGrow: 1,
              overflowY: "auto",
              maxHeight: "400px",
            }}
          >
            {messages.map((msg, i) => (
              <Box
                key={i}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: msg.role === "user" ? "#4caf50" : "rgba(255, 255, 255, 0.15)", // Custom colors for messages
                  color: msg.role === "user" ? "#FFFFFF" : "#FFFFFF",
                  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
                  maxWidth: "75%",
                }}
              >
                {msg.role === "assistant" && (
                  <img
                    src="/images/robot.png" 
                    alt="AI"
                    style={{ width: "30px", marginRight: "10px" }} // Adjust the size and spacing
                  />
                )}
                {msg.content}
              </Box>
            ))}
            </Box>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                mt: "auto",
              }}
            >
              <TextField
                variant="outlined"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                sx={{
                  flexGrow: 1,
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "8px",
                  input: { color: "#FFFFFF" },
                }}
                InputProps={{
                  style: {
                    color: "#FFFFFF", // Text color in the input field
                  },
                }}
              />
              <Button
                variant="contained"
                onClick={sendMessage}
                sx={{
                  backgroundColor: "#4caf50",
                  color: "#FFFFFF",
                  "&:hover": {
                    backgroundColor: "#388e3c",
                  },
                  borderRadius: "8px",
                  padding: "10px 20px",
                }}
              >
                Send
              </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
