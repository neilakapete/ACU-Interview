import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import App from "./App";
import Members from "./pages/Members";
import Tasks from "./pages/Tasks";
import AppThemeProvider from "./theme/AppThemeProvider";

const rootElement = document.getElementById("root");

if (rootElement) {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 1000 * 60,
                gcTime: 1000 * 60 * 10,
                refetchOnWindowFocus: true,
            },
        },
    });

    createRoot(rootElement).render(
        <QueryClientProvider client={queryClient}>
            <AppThemeProvider>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<App />}>
                                <Route index element={<Members />} />
                                <Route path="/tasks" element={<Tasks />} />
                            </Route>
                        </Routes>
                    </BrowserRouter>
                </LocalizationProvider>
            </AppThemeProvider>
        </QueryClientProvider>
    );
}
