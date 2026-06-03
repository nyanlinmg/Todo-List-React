import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, IconButton, Typography, Box, ListItem, List, ListItemIcon, ListItemButton } from "@mui/material";
import  { motion } from "framer-motion";
import "../index.css"
import { useApp } from "../AppProvider";
import { deleteTask } from "../services/taskService"

import {
    Sort as SortIcon,
    Delete as DeleteIcon,
} from "@mui/icons-material"


const api = "http://localhost:8800";

const MotionContainer = motion(Container);

export default function Category() {
    const { id } = useParams();
    const [data, setData] = useState({name: "",
        tasks: []
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchCategory = async () => {
        setIsLoading(true);

        try {
            const res = await fetch(`${api}/category/${id}`);
             
            if(!res.ok) {
                const error = await res.json();
                throw new Error(error.msg);
            }

            const data = await res.json();
            setData(data);

        }catch(error) {
            setError(error.message);
        }finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchCategory();
    }, [id])

    console.log(data);

    const del = async (taskId) => {
        if(window.confirm("Are you sure you want to delete this task?")) {
            try{

                const data = await deleteTask(taskId);

                setData(prev => ({
                    ...prev,
                    tasks: prev.tasks.filter(task => task.id !== taskId)
                }))

            }catch(error) {
                setError(error.message);
            }
        }
    }

    return (
        <Container>
            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 4, 'borderBottom': '1px solid',pb: 2, mb: 3}}>
                <Typography sx={{fontSize: 25,fontWeight:'bold'}}>
                    Category: <small className="font-bold text-amber-600 text-[25px]">{data.name}</small>
                </Typography>

                <IconButton color="primary" title="sort">
                    <SortIcon />
                    <Typography sx={{fontSize: 12, fontWeight: 'bold', ml: 1}}>Sort</Typography>
                </IconButton>
            </Box>

            <Box>
                {isLoading && <Typography>Loading...</Typography>}
                {error && <Typography color="error">{error}</Typography>}

                <List>
                    {data.tasks.map(task => (
                        <ListItem key={task.id} sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, border: '1px solid', borderRadius: 1, p: 2, boxShadow: 3}}>
                            <Typography>{task.tasks}</Typography>
                            <Box>
                                <ListItemButton onClick={() => del(task.id)}>
                                    <DeleteIcon color="error" />
                                </ListItemButton>
                            </Box>
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Container>
    )
}