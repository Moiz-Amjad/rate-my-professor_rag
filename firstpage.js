'use client'
import Image from 'next/image'
import { AppBar, Box, Button, Grid, Toolbar, Typography } from '@mui/material'
import Head from 'next/head'
import React from 'react';
import Link from 'next/link';
import ChatWindow from './pages/ChatWindow';
import Container from '@mui/material/Container';
import { useState } from 'react';


export default function FirstPage() {
  const [showChat, setShowChat] = useState(false); // State to control whether to show the ChatWindow

  const getStarted = () => {
    setShowChat(true); // Set to true to show the ChatWindow
  };
  
  return (
    <React.Fragment>
      <Container maxWidth="100vh" id="home-root" style={{ backgroundImage: "url('/images/ratemyprofnew.jpg')", backgroundSize: 'cover', backdropFilter: 'blur(90px)', backgroundPosition: 'center', padding: '0', justifyContent: 'center', minHeight: '100vh' }}>
        <Head>
          <title>Rate My Professor Chatbot Assistant</title>
          <meta name="description" content="Your friendly assistant for Rate My Professor" />
        </Head>
        
        {/* Transparent AppBar */}
        <AppBar position="sticky" sx={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.5)', width: '100vw' }}>
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
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            color: '#FFFFFF',
            padding: 15,
            textAlign: 'center',
            position: 'relative'
          }}
        >
          <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.35)', // Overlay color
            padding: '50px', // Padding inside the overlay
            borderRadius: '12px', // Rounded corners for overlay
            textAlign: 'center',
            maxWidth: '700px', // Set a maximum width to control the size of the text block
          }}
        >
          <Typography variant="h2" gutterBottom sx={{ fontSize: { xs: '2.5rem', md: '3rem' }, color: '#FFFFFF' }}>
            Welcome to Rate My Prof Assistant!
          </Typography>
          <Typography variant="h5" gutterBottom sx={{ color: '#FFFFFF' }}>
            Your AI-powered support for Rate My Professor queries.
          </Typography>
          <Link href="/ChatWindow" passHref>
          <Button  
            sx={{ 
              mt: 2, 
              px: 4, 
              py: 2, 
              borderRadius: '25px', 
              fontWeight: 'bold', 
              backgroundColor: '#FFFFFF',
              color: '#000000',
              ":hover": { backgroundColor: '#A0A0A0' }
            }}
          >
            Get Started
          </Button>
          </Link>
        </Box>
      
         </Box> 
        
      </Container>
      </React.Fragment>
  );
} 
