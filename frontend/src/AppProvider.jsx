
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material"
import { createContext, useContext, useMemo, useState } from "react"
import AppRouter from "./AppRouter";
import { useEffect } from "react";
import { showCategories, showTasks } from "./services/taskService";

const AppContext = createContext();

export default function AppProvider() {
    const [mode, setMode] = useState("light");
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [getCategories, setCategories] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [tasksLoading, setTasksLoading] = useState(false);
    const [tasksError, setTasksError] = useState(null);
    console.log(drawerOpen); 

    const theme = useMemo(() => {
        return createTheme({
            palette: {mode}
        })
    }, [mode]);

    useEffect(()=>{
        const fetchCategories = async() => {
            const data = await showCategories();
            setCategories(data);
        }

        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchTasks = async () => {
            setTasksLoading(true);
            try {
                const data = await showTasks();
                setTasks(data);
            } catch (error) {
                setTasksError(error.message);
            } finally {
                setTasksLoading(false);
            }
        };

        fetchTasks();
    }, []);

    return (
        <AppContext.Provider value={{mode, setMode, drawerOpen, setDrawerOpen, getCategories, setCategories, tasks, setTasks, tasksLoading, tasksError}}>
            <ThemeProvider theme={theme}>
                <AppRouter />
                <CssBaseline />
            </ThemeProvider>
        </AppContext.Provider>
    )
}

export function useApp() {
    return useContext(AppContext);
}