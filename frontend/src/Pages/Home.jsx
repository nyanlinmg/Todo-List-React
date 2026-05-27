import { Box, Button, Container, IconButton, OutlinedInput, Typography } from "@mui/material";
import { useForm } from "react-hook-form"
import "../index.css"

import {
    AddTask as AddTaskIcon ,
    Add as AddIcon
} from "@mui/icons-material"

export default function Home() {

    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting}
    } =  useForm();

    const addTask = async (data) => {
        console.log(data);
    }

    return (
        <Container>
            <Box>
                <Typography color="inherit" sx={{ fontSize: 23, fontWeight: 'bold', borderBottom: '1px solid', pb: 2}}>
                ADD New Tasks
                    <AddTaskIcon color="warning" sx={{ ml: 1}} />
                </Typography>

                <Box>
                    <form onSubmit={handleSubmit(addTask)} className="mt-5 shadow-xl">
                        <OutlinedInput
                            placeholder="add your task"
                            fullWidth
                            error={errors.newtask}
                            {...register("newtask", {required: "new task is required" })}
                            endAdornment={
                                <IconButton color="primary" type="submit">
                                    <AddIcon />
                                    <Typography>Add</Typography>
                                </IconButton>
                            }
                        />
                    </form>
                </Box>
            </Box>
        </Container>
    )
}