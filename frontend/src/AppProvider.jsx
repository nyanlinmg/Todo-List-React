
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material"
import { createContext, useContext, useMemo, useState } from "react"
import AppRouter from "./AppRouter";
import { useEffect } from "react";

const AppContext = createContext();

export default function AppProvider() {
    const [mode, setMode] = useState("light");
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [getCategories, setCategories] = useState([]);
    const [ tasks, setTasks ] = useState([]);
    console.log(drawerOpen);

    const theme = useMemo(() => {
        return createTheme({
            palette: {mode}
        })
    }, [mode]);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const res = await fetch("http://localhost:8800/tasks");
                const data = await res.json();

                setTasks(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchTasks();
    }, []);

    return (
        <AppContext.Provider value={{mode, setMode, drawerOpen, setDrawerOpen, getCategories, setCategories, tasks, setTasks}}>
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