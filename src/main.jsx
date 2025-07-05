import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.jsx'

import AppBar from './AppBar'
import Container from '@mui/material/Container';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Container fixed>
      <AppBar />
      <App />
    </Container>
  </StrictMode>,
)
