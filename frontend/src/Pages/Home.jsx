import { Alert, Box, Button, Container, FormControl, IconButton, InputLabel, MenuItem, OutlinedInput, Select, Typography } from "@mui/material";
import { useForm } from "react-hook-form"
import "../index.css"

import {
    AddTask as AddTaskIcon ,
    Add as AddIcon
} from "@mui/icons-material"
import { useEffect, useState } from "react";
import { useApp } from "../AppProvider";

const api = "http://localhost:8800";

export default function Home() {
    const [ categoryId, setCategoryId ] = useState("");
    const { mode, setMode , setCategories, getCategories} = useApp();
    const [ error, setError ] = useState();
    const [ showBox, setShowBox ] = useState("");

    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting}
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
            setShowBox(data);
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
    }, [])

    console.log(getCategories);
    console.log(categoryId);
    console.log(showBox);

    return (
        <Container>
            <Box>
                <Typography color="inherit" sx={{ fontSize: 23, fontWeight: 'bold', borderBottom: '1px solid', pb: 2}}>
                ADD New Tasks
                    <AddTaskIcon color="warning" sx={{ ml: 1}} />
                </Typography>

                {error && <Alert severity="error" sx={{mt: 2}}>{error}</Alert>}

                {showBox && <Alert severity="info" sx={{mt: 2}}>{showBox.msg}</Alert>}

                <Box>
                    <form onSubmit={handleSubmit(addTask)} className="mt-5 shadow-xl p-4 rounded-lg border">
                        <OutlinedInput
                            placeholder="add your task"
                            fullWidth
                            error={errors.newtask}
                            {...register("newtask", {required: true })}
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
                                        {...register("categoryId", { required: true })}
                                    >

                                        {getCategories.map(category => (
                                            <MenuItem value={category.id} key={category.id}>{category.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>  
                            </Box>
                        </div>

                    </form>
                </Box>
            </Box>
        </Container>
    )
}