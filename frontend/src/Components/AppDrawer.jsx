import { useState } from "react";
import { Box, Container, Drawer, List, ListItem, ListItemButton, ListItemText, Typography, Collapse } from "@mui/material";
import { useApp } from "../AppProvider";
import { grey, orange } from "@mui/material/colors";

import {
    Ballot as BallotIcon,
    Home as HomeIcon,
    ExpandLess,
    ExpandMore,
    FormatListBulleted as FormatListBulletedIcon,
} from "@mui/icons-material"

export default function AppDrawer() {
    const { drawerOpen, setDrawerOpen, mode, setMode } = useApp();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleToggleDropdown = (e) => {
        e.stopPropagation();
        setDropdownOpen(prev => !prev);
    }

    return (
        <Drawer
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
        >
            <Container disableGutters sx={{width: 200, height: '100%'}}>
                <Box sx={{py: 2, px: 1 ,display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'left', borderBottom: '1px solid blue',}}>
                    <BallotIcon color="primary" />
                    <Typography color="primary" variant="h6" fontWeight="bold" >Todo Menu</Typography>
                </Box>

                <List>
                    <ListItem disablePadding>
                        <ListItemButton sx={{fontSize: 16}} onClick={() => handleSelect("Home")}>
                            <HomeIcon sx={{mr: 1, fontSize: 25}} color="primary" />
                            <ListItemText primary="Home" />
                        </ListItemButton>
                    </ListItem>

                    {/* Simple dropdown */}
                    <ListItem disablePadding>
                        <ListItemButton onClick={handleToggleDropdown}>
                            <FormatListBulletedIcon sx={{mr: 1}} color="primary" />
                            <ListItemText primary="Categories" />
                            {dropdownOpen ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                    </ListItem>
                    <Collapse in={dropdownOpen} timeout="auto" unmountOnExit>
                        <List disablePadding>
                            <ListItem disablePadding>
                                <ListItemButton sx={{ pl: 4 }} onClick={() => setDrawerOpen(false)} >
                                    <ListItemText primary="Personal" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton sx={{ pl: 4 }} onClick={() => setDrawerOpen(false)} >
                                    <ListItemText primary="Work" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton sx={{ pl: 4 }} onClick={() => setDrawerOpen(false)} >
                                    <ListItemText primary="Shopping" />
                                </ListItemButton>
                            </ListItem>
                        </List>
                    </Collapse>

                </List>

            </Container>
        </Drawer>
    )
}