import { AppBar, Badge, IconButton, Toolbar, Typography } from "@mui/material";
import { useApp } from "../AppProvider"

import {
    Menu as MenuIcon,
    LightMode as LightModeIcon,
    DarkMode as DarkModeIcon,
    Mail as MailIcon,
    Task as TaskIcon
    
} from "@mui/icons-material"
import { yellow } from "@mui/material/colors";

export default function Header() {
    const {mode, setMode, drawerOpen, setDrawerOpen} = useApp();

    return (
        <AppBar position="static" color="warning">
            <Toolbar>
                <IconButton 
                    color="inherit"
                    onClick={() => setDrawerOpen(true)}
                >
                    <MenuIcon />
                </IconButton>

                <Badge badgeContent={5} sx={{ms: 2, ml: 3}} color="primary">
                    <TaskIcon />
                </Badge>

                <Typography sx={{mr: 1, flexGrow: 1, ml: 4, fontSize: 40, fontWeight: 'bold'}}>Todo</Typography>

                {mode == "light" ? 
                    (
                        <IconButton
                            color="inherit"
                            onClick={() => setMode("dark")}
                        >
                            <DarkModeIcon />
                        </IconButton>
                    ) : (
                        <IconButton
                            color="inherit"
                            onClick={() => setMode("light")}
                        >
                            <LightModeIcon />
                        </IconButton>
                    )
                }
            </Toolbar>
        </AppBar>
    )
}