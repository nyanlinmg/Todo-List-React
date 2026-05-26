import React from 'react'
import Header from './Components/Header'
import { Container } from "@mui/material"
import { Outlet } from 'react-router'
import AppDrawer from './Components/AppDrawer'

export default function App() {
    return <div>
        <Header />
        <AppDrawer />
        <Container maxWidth="md" sx={{mt: 4, mx: 'auto', }}>
            <Outlet />
        </Container>
    </div>
}