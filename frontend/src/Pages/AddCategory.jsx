import { Container, Box, FormControl, OutlinedInput, InputLabel, InputAdornment, IconButton, Typography, Alert } from "@mui/material";
import { useState } from "react";
import {
    Send as SendIcon,
    Delete as DeleteIcon
} from "@mui/icons-material"
import "../index.css"
import { useApp } from "../AppProvider";

const api = "http://localhost:8800";

export default function AddCategory() {
    const [text, setText] = useState("");
    const {getCategories, setCategories} = useApp();
    const [error,setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [alertBox, setAlertBox] = useState("");

    const addCategory = async() => {
        setIsLoading(true);
        try{
            const res = await fetch(`${api}/addCategory`, {
                method: "POST",
                body: JSON.stringify({
                    name: text
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            })

            if(!res.ok) {
                const error = await res.json();
                throw new Error(error.msg);
            }

            const newCategory = await res.json();

            setCategories(prev => [...prev, newCategory]);
            setError("");
            setAlertBox("Successfully added new category");
            setText("");

        }catch(error) {
            setError(error.message)
        }finally{
            setIsLoading(false);
        }
    }

    const del = async(id) => {
        if(window.confirm("Do you really want to delete permanently ?")) {
            try {
                const res = await fetch(`${api}/removeCategory/${id}`, {
                    method: 'DELETE'
                });

                if(!res.ok){
                    const error = await res.json();
                    throw new Error(error.msg || "Failed to delete");
                }

                const data = await res.json();

                setCategories(prev => prev.filter(category => category.id !== id));

            }catch(error) {
                setError(error.message);
            }
        }
    }

    const categoriesList = [...getCategories];

    return (
        <Container sx={{ padding:5}} maxWidth="sm">
            <Box >
                <InputLabel sx={{marginBottom:2,fontWeight:'bold',fontSize:20}}>Add Category</InputLabel>

                {alertBox && <Alert severity="info" className="mb-3">{alertBox}</Alert>}

                {error && <Alert severity="error" className="mb-3">{error}</Alert>}

                <OutlinedInput
                    fullWidth
                    value={text}
                    autoFocus
                    onChange={(e) => setText(e.target.value)}
                    placeholder="add new category"
                    endAdornment={
                        <IconButton sx={{ borderRadius: 20}} onClick={() => addCategory() }>
                            <SendIcon color="primary" />
                            <Typography color="info" component="span" sx={{marginLeft:1}}>
                                {isLoading ? "Loading..." : "Send"}
                            </Typography>
                        </IconButton>
                    }
                />
            </Box>

            <Container className="border border-gray-200 mt-4 p-3 grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-3 gap-3">
                {categoriesList.map((category, index) => (
                    <Box component="div" className="border  border-gray-300 shadow-lg px-2 py-1 flex items-center justify-between" >
                        <Box component="div">
                            {index + 1} . {category.name}
                        </Box>

                        <IconButton color="error" onClick={() => del(category.id)}>
                            <DeleteIcon />
                        </IconButton>
                    </Box>
                ))}
            </Container>
        </Container>
    )
}