import { useState } from "react";
import { Box, Container, Drawer, List, ListItem, ListItemButton, ListItemText, Typography, Collapse, Divider } from "@mui/material";
import { useApp } from "../AppProvider";
import { grey, orange } from "@mui/material/colors";

import {
    Ballot as BallotIcon,
    Home as HomeIcon,
    ExpandLess,
    ExpandMore,
    FormatListBulleted as FormatListBulletedIcon,
    Work as WorkIcon,
    MenuBook as MenuBookIcon,
    Person as PersonIcon,
    ShoppingCart as ShoppingCartIcon,
    HealthAndSafety as HealthIcon,
    Add as AddIcon,
    CheckCircle as CheckCircleIcon,
    PriorityHigh as PriorityHighIcon,
} from "@mui/icons-material"
import { useNavigate } from "react-router-dom";

export default function AppDrawer() {
    const { drawerOpen, setDrawerOpen, mode, setMode } = useApp();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const navigate = useNavigate();

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
                        <ListItemButton sx={{fontSize: 16}} onClick={() => 
                            {navigate('/'); setDrawerOpen(false)}
                            } >
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
                                <ListItemButton sx={{ pl: 4 }} onClick={() => { navigate('/category/1'); setDrawerOpen(false);  }} >
                                    <WorkIcon sx={{mr: 1}} color="primary" />
                                    <ListItemText primary="Work" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton sx={{ pl: 4 }} onClick={() => { navigate('/category/2'); setDrawerOpen(false);  }} >
                                    <MenuBookIcon sx={{mr: 1}} color="primary" />
                                    <ListItemText primary="Study" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton sx={{ pl: 4 }} onClick={() => { navigate('/category/3'); setDrawerOpen(false);  }} >
                                    <PersonIcon sx={{mr: 1}} color="primary" />
                                    <ListItemText primary="Personal" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton sx={{ pl: 4 }} onClick={() => { navigate('/category/4'); setDrawerOpen(false);  }} >
                                    <ShoppingCartIcon sx={{mr: 1}} color="primary" />
                                    <ListItemText primary="Shop" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton sx={{ pl: 4 }} onClick={() => { navigate('/category/5'); setDrawerOpen(false);  }  } >
                                    <HealthIcon sx={{mr: 1}} color="primary" />
                                    <ListItemText primary="Health" />
                                </ListItemButton>
                            </ListItem>
                        </List>
                    </Collapse>

                    <ListItem disablePadding>
                        <ListItemButton onClick={() => { navigate('/add-category'); setDrawerOpen(false);  }} >
                            <AddIcon sx={{mr: 1}} color="primary" />
                            <ListItemText primary="Add Category" />
                        </ListItemButton>
                    </ListItem>
                </List>

                <Divider />

                <List>
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => { navigate('/completed'); setDrawerOpen(false);  }} >
                            <CheckCircleIcon sx={{mr: 1}} color="primary" />
                            <ListItemText primary="Completed" />
                        </ListItemButton>
                    </ListItem>

                    <ListItem disablePadding>
                        <ListItemButton onClick={() => { navigate('/priority'); setDrawerOpen(false);  }} >
                            <PriorityHighIcon sx={{mr: 1}} color="primary" />
                            <ListItemText primary="Priority" />
                        </ListItemButton>
                    </ListItem>
                </List>

                <Divider />

            </Container>
        </Drawer>
    )
}