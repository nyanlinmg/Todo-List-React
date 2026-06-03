import { Alert, Badge, Box, Button, Container, FormControl, IconButton, InputLabel, List, ListItem, ListItemButton, MenuItem, OutlinedInput, Select, Typography, Pagination, ListItemText, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { useForm } from "react-hook-form"
import "../index.css"
import { deleteTask} from "../services/taskService"

import {
    AddTask as AddTaskIcon ,
    Add as AddIcon,
    ListAlt as ListAltIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    Done as DoneIcon,
    DoneAll as DoneTasksIcon,
    Close as CloseIcon,
    Save as SaveIcon
} from "@mui/icons-material"

import { useEffect, useState } from "react";
import { useApp } from "../AppProvider";
import { motion } from "framer-motion";

const api = "http://localhost:8800";

const MotionTypography = motion(Typography);
const MotionBox = motion(Box);
const MotionList = motion(List);
const MotionListItem = motion(ListItem);
const MotionContainer = motion(Container);


export default function Home() {
    const [ categoryId, setCategoryId ] = useState("");
    const { mode, setMode , setCategories, getCategories, tasks, setTasks, tasksLoading, tasksError } = useApp();
    const [ error, setError ] = useState();
    const [ showBox, setShowBox ] = useState("");

    const {
        register,
        handleSubmit,
        formState: {errors},
        reset
    } =  useForm();

    const addTask = (data) => {
        fetch(`${api}/tasks`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(res => res.json())
        .then(data => {
            if(!data.task){
                setError(data.msg);
                return;
            }

            setError("");  
            setShowBox(data.msg);
            reset();
            setTasks(prev => [...prev, data.task])
            setTimeout(() => setShowBox(""), 1000);

        })
        .catch(() => {
            setError("Api server is broken");
        })
    }

    useEffect(() => {
        fetch(`${api}/categories`, {
            method: 'GET'
        })
        .then(res => res.json())
        .then(data => {
            setCategories(data);
        })
        .catch(e => {
            setError(e)
        })
    }, [])

    const done = async (id) => {
        try{

            const res = await fetch(`${api}/doneTask/${id}`, {
                method: 'PUT'
            });

            const data = await res.json();

            if(data.msg){
                setShowBox(data.msg);

                setTasks(prev => prev.map(task =>
                    task.id === id ? { ...task, done: true } : task
                ));

                setTimeout(() => setShowBox(""), 1000);
            }

        }catch(e) {
            setError(e);
        }
    }

    const del = async (id) => {
        const confirm = window.confirm("Do you really want to delete this task permanently?");

        if(confirm){
            try {
                const data = await deleteTask(id);

                setTasks(prev => prev.filter(task => task.id !== id))
                setShowBox(data.msg)
                setTimeout(() => setShowBox(""), 1000);

                console.log(data);

            } catch (error) {
                setError(error.message);
            }
        } else {
            return false;
        }
    }

    console.log(getCategories);
    console.log(categoryId);
    console.log(showBox);
    console.log(tasks);

    const [page, setPage] = useState(1);
    const tasksPerPage = 5;
    const filteredTasks = tasks.filter(data => !data.done)
    const startIndex = (page - 1) * tasksPerPage;
    const endIndex = startIndex + tasksPerPage;
    const currentTasks = filteredTasks.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

    const [donePage, setDonePage] = useState(1);
    const tasksPerDonePage = 5;
    const startIndexOfDonePage = (donePage - 1) * tasksPerDonePage;
    const endIndexOfDonePage = startIndexOfDonePage + tasksPerDonePage;
    const filteredDoneTasks = tasks.filter(data => data.done);
    const currentDoneTasks = filteredDoneTasks.slice(startIndexOfDonePage, endIndexOfDonePage);
    const totalDonePages = Math.ceil(filteredDoneTasks.length / tasksPerDonePage);

    const totalTasks = tasks.length;
    const doneTasks = filteredDoneTasks.length;
    const progressPercent = totalTasks === 0 ? 0 : Math.round((doneTasks/totalTasks) * 100);

    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState("");
    const [editCategoryId, setEditCategoryId] = useState("");
    const [openEditDialog, setOpenEditDialog] = useState(false);

    const startEdit = (task) => {
        setEditingId(task.id);
        setEditText(task.tasks);
        setEditCategoryId(task.category?.id ?? "");
        setOpenEditDialog(true);
    }

    const cencelEdit = () => {
        setEditingId(null);
        setEditText("");
        setEditCategoryId("");
        setOpenEditDialog(false);
    }

    const saveEdit = async () => {
        try {

            const res = await fetch(`${api}/editTask/${editingId}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    newTask: editText,
                    categoryId: editCategoryId,
                })

            })

            const data = await res.json();

            if(data.msg){
                setShowBox(data.msg);
            }

            setTasks(prev => prev.map(
                data => data.id === editingId ? 
                {...data, tasks: editText, categoryId: editCategoryId}
                : data
            ));

            setTimeout(() => setShowBox(""), 1000);
            cencelEdit();

        } catch(error) {
            setError(error);
        }
    }

    return (
        <Container>
            <Dialog open={openEditDialog} fullWidth maxWidth="sm">
                <DialogTitle>
                    Edit Task
                    <EditIcon color="primary" sx={{ml : 1}} />
                </DialogTitle>

                <DialogContent
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 3,
                        mt : 1
                    }}
                >
                    <OutlinedInput 
                        value={editText}
                        onChange={e => setEditText(e.target.value)}
                        fullWidth
                        autoFocus
                        placeholder="Edit your task..."
                    />

                    <FormControl fullWidth>
                        <InputLabel>Category</InputLabel>
                        <Select
                            label="Category"
                            value={editCategoryId}
                            onChange={e => setEditCategoryId(e.target.value)}
                        >
                            {getCategories.map(c => (
                                <MenuItem value={c.id} key={c.id}>{c.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>

                <DialogActions>
                    <Button onClick={cencelEdit} variant="outlined" color="error">
                        Cancel
                    </Button>

                    <Button onClick={saveEdit} variant="outlined" color="success">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            <Box>
                <MotionTypography 
                color="inherit" sx={{ fontSize: 23, fontWeight: 'bold', borderBottom: '1px solid', pb: 2}
                }
                initial={{ opacity: 0, y: -20}}
                animate={{ opacity: 1, y: 0}}
                transition={{
                    duration: 0.2,
                    type: "spring",
                    stiffness: 100,
                    damping: 10,
                    delay: 0.2
                }}
                >
                ADD New Tasks
                    <AddTaskIcon color="warning" sx={{ ml: 1}} />
                </MotionTypography>

                {error && <Alert severity="error" sx={{mt: 2}}>{error}</Alert>}

                {showBox && <Alert severity="info" sx={{mt: 2}}>{showBox}</Alert>}

                <MotionBox
                    initial={{ opacity: 0, y: 50}}
                    animate={{ opacity: 1, y: 0}}
                    transition={{
                        duration: 0.3,
                        type: "spring",
                        stiffness: 100,
                        damping: 10,
                        delay: 0.4
                    }}

                >
                    <form onSubmit={handleSubmit(addTask)} className="mt-5 shadow-xl p-4 rounded-lg border">
                        <OutlinedInput
                            placeholder="add your task"
                            fullWidth
                            error={errors.newtask}
                            {...register("newtask",)}
                        />

                        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                            <Button type="submit" sx={{mt: 2, color: 'white', px: 2, textAlign: 'center', width: '140px', bgcolor: mode == "dark" ? "transparent" : "black" }}>
                                <AddIcon />
                                Add 
                            </Button>

                            <Box sx={{minWidth : 130}}>
                                <FormControl fullWidth>
                                    <InputLabel>Categories</InputLabel>
                                    <Select
                                        label="Categories"
                                        defaultValue=""
                                        {...register("categoryId",)}
                                    >

                                        {getCategories.map(category => (
                                            <MenuItem value={category.id} key={category.id}>{category.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>  
                            </Box>
                        </div>

                    </form>
                </MotionBox>
            </Box>

            <Container sx={{mt: 5, mb: 5}}>
                <MotionTypography sx={{ fontSize: 23, fontWeight: 'bold', borderBottom: '1px solid', pb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <MotionBox
                        initial={{ opacity: 0, x: -50}}
                        animate={{ opacity: 1, x: 0}}
                        transition={{
                            delay: 0.6,
                            duration: 0.5,
                            type: "spring",
                            stiffness: 100,
                            damping: 10,
                            ease: "easeInOut"
                        }}
                    >
                        All Tasks
                        <ListAltIcon color="warning" sx={{ ml: 1, fontSize: 28 }} />
                    </MotionBox>

                    <MotionBox
                        initial={{ opacity: 0, x: 50}}
                        animate={{ opacity: 1, x: 0}}
                        transition={{
                            delay: 0.8,
                            duration: 0.5,
                            type: "spring",
                            stiffness: 100,
                            damping: 10,
                            ease: "easeInOut"
                        }}
                    >
                        <Pagination
                        page={page}
                        count={totalPages}
                        onChange={(e, value) => setPage(value)}
                    />
                    </MotionBox>
                </MotionTypography>

                { filteredTasks.length == 0 && <Alert severity="warning" sx={{mt: 2}}>No tasks found</Alert> }

                { tasksLoading ? (
                    <h1>Loading...</h1>
                ) : (
                    <MotionList sx={{mt : 2}} 
                        initial={{ opacity: 0, y: 50}}
                        animate={{ opacity: 1, y: 0}}
                        transition={{
                            duration: 0.5,
                            type: "spring",
                            stiffness: 100,
                            damping: 10,
                            ease: "easeInOut",
                            delay: 0.6
                        }}
                    >
                        {
                            currentTasks.map(data => (
                                <ListItem 
                                disablePadding
                                key={data.id} 
                                sx={{border: '1px solid', mb: 2, borderColor: mode == "dark" ? "grey" : "black", borderRadius: 1, boxShadow: 3, py: 1}} >
                                    <div>
                                        <ListItemButton onClick={() => done(data.id)}>
                                            <DoneIcon color="success" />
                                        </ListItemButton>
                                    </div>
                                    <div className="me-auto">{data.tasks}</div>

                                    <div>
                                        <ListItemButton onClick={() => startEdit(data)}>
                                            <EditIcon color="primary" />
                                        </ListItemButton>
                                    </div>
                                    <div>
                                        <ListItemText sx={{color: 'orange'}} primary={data.category?.name} />
                                    </div>
                                    <div>
                                        <ListItemButton onClick={() => del(data.id)}>
                                            <DeleteIcon color="error" />
                                        </ListItemButton>
                                    </div>

                                </ListItem>
                            ))
                        }
                    </MotionList>
                ) }

            </Container>

            <MotionBox
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, type: 'spring', stiffness: 100, damping: 10 }}
                sx={{ mb: 5 }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: 15 }}>
                        Overall Progress
                    </Typography>
                    <Typography sx={{ fontSize: 14, color: 'grey' }}>
                        {doneTasks} / {totalTasks} tasks done
                    </Typography>
                </Box>

                <Box sx={{
                    width: '100%',
                    height: 14,
                    borderRadius: 50,
                    bgcolor: mode === 'dark' ? '#2a2a2a' : '#e0e0e0',
                    overflow: 'hidden'
                }}>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
                        transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                        style={{
                            height: '100%',
                            borderRadius: 50,
                            background: 'linear-gradient(90deg, #f59e0b, #ef4444)',
                        }}
                    />
                </Box>

                <Typography sx={{ fontSize: 15, color: 'grey', mt: 0.5, textAlign: 'right' }}>
                    {progressPercent}%
                </Typography>
            </MotionBox>

            <MotionContainer 
                sx={{mt:4, mb:6}}
                initial={{opacity: 0, y: 100}}
                whileInView={{opacity: 1, y: 0}}
                transition={{
                    duration: 0.5,
                    stiffness: 100,
                    damping: 10,
                    type: 'spring'
                }}
            >
                <Box sx={{borderBottom: '1px solid', pb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontSize: 23, fontWeight: 'bold'}}>
                        Completed Tasks
                        <DoneTasksIcon color="warning" sx={{ml: 2}} />
                    </Typography>

                    <Pagination
                        page={donePage}
                        count={totalDonePages}
                        onChange={(e, value) => setDonePage(value)}
                    />
                </Box>

                <MotionBox 
                    sx={{mt: 3}}
                    initial={{opacity: 0, y: 100}}
                    whileInView={{opacity: 1, y: 0}}
                    transition={{
                        duration: 0.5,
                        stiffness: 100,
                        damping: 10,
                        type: 'spring',
                        delay: 0.3
                    }}
                >
                    <List>
                        {
                            currentDoneTasks.map(data => (
                                <ListItem 
                                key={data.id} 
                                sx={{border: '1px solid', mb: 2, borderColor: mode == "dark" ? "grey" : "black", borderRadius: 1, boxShadow: 3, py: 1}} >
                                    <div className="me-auto">{data.tasks}</div>
                                    <div>
                                        <ListItemText sx={{color: 'orange'}} primary={data.category?.name} />
                                    </div>
                                    <div>
                                        <ListItemButton onClick={() => del(data.id)}>
                                            <DeleteIcon color="error" />
                                        </ListItemButton>
                                    </div>

                                </ListItem>
                            ))
                        }
                    </List>
                </MotionBox>
            </MotionContainer>
        </Container>
    )
}   