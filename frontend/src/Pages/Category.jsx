import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, IconButton, Typography, Box, ListItem, List, ListItemButton, Menu, MenuItem } from "@mui/material";
import { motion } from "framer-motion";
import "../index.css"
import { useApp } from "../AppProvider";
import { deleteTask } from "../services/taskService"

import {
    Sort as SortIcon,
    Delete as DeleteIcon,
} from "@mui/icons-material"

const MotionContainer = motion(Container);

export default function Category() {
    const { id } = useParams();
    const [error, setError] = useState(null);
    const { tasks, setTasks, tasksLoading, tasksError, getCategories } = useApp();
    const [showBox, setShowBox] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);
    const [sortType, setSortType] = useState("default");

    const categoryName = getCategories.find(category => category.id === Number(id));
    console.log(categoryName);

    const filteredCategories = tasks.filter(task => task.categoryId == Number(id));
    console.log(filteredCategories);

    const sortedTasks = () => {
        const list = [...filteredCategories];
        if (sortType === "completed") return list.filter(prev  => prev.done);
        if (sortType === "az") return list.sort((a, b) => a.tasks.localeCompare(b.tasks));
        if (sortType === "za") return list.sort((a, b) => b.tasks.localeCompare(a.tasks));
        if (sortType === "date") return list.sort((a, b) => new Date(b.created) - new Date(a.created));
        if (sortType === "priority") return list.filter(data => data.priority) ?? "No tasks found";
        return list; // default
    };

    const handleSortClick = (e) => setAnchorEl(
        e.currentTarget
    );
    const handleSortClose = () => setAnchorEl(null);
    const handleSort = (type) => {
        setSortType(type);
        handleSortClose();
    };

    const del = async (id) => {
        if (window.confirm("Are you sure you want to delete this task?")) {
            try {
                const data = await deleteTask(id);
                if (data) setShowBox(data.msg);
                setTasks(prev => prev.filter(task => task.id !== id));
            } catch (error) {
                setError(error.message);
            }
        }
    }

    return (
        <Container>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 4, borderBottom: '1px solid', pb: 2, mb: 3 }}>
                <Typography sx={{ fontSize: 25, fontWeight: 'bold' }}>
                    Category: <small className="font-bold text-amber-600 text-[25px]">{categoryName?.name}</small>
                </Typography>

                <IconButton color="primary" onClick={handleSortClick}>
                    <SortIcon />
                    <Typography sx={{ fontSize: 12, fontWeight: 'bold', ml: 1 }}>Sort</Typography>
                </IconButton>

                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleSortClose}>
                    <MenuItem onClick={() => handleSort("default")}  selected={sortType === "default"}>Default</MenuItem>
                    <MenuItem onClick={() => handleSort("completed")} selected={sortType === "completed"}>Completed</MenuItem>
                    <MenuItem onClick={() => handleSort("date")}      selected={sortType === "date"}>Sort by Date</MenuItem>
                    <MenuItem onClick={() => handleSort("az")}        selected={sortType === "az"}>A → Z</MenuItem>
                    <MenuItem onClick={() => handleSort("za")}        selected={sortType === "za"}>Z → A</MenuItem>
                    <MenuItem onClick={() => handleSort("priority")}
                    selected={sortType === "priority"}>
                        Priority
                    </MenuItem>
                </Menu>
            </Box>

            <Box>
                {tasksLoading && <Typography>Loading...</Typography>}
                {tasksError && <Typography color="error">{tasksError}</Typography>}
                {showBox && <Typography color="success">{showBox}</Typography>}

                <List>
                    {
                        sortedTasks().length > 0 ?
                        sortedTasks().map(task => (
                            <ListItem key={task.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, border: '1px solid', borderRadius: 1, p: 2, boxShadow: 3 }}>
                                <Typography sx={{ display: 'flex', gap: 2 }}>
                                    {task.tasks}
                                    {task.done && <Typography color="success" component="span">Completed</Typography>}
                                    {task.priority && <Typography component="span"
                                    color="warning">
                                        Priority
                                    </Typography>}
                                </Typography>
                                <Box>
                                    <ListItemButton onClick={() => del(task.id)}>
                                        <DeleteIcon color="error" />
                                    </ListItemButton>
                                </Box>
                            </ListItem>
                        )) : <Typography color="warning">No tasks found</Typography>
                    }
                </List>
            </Box>
        </Container>
    )
}