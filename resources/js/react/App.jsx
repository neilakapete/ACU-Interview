import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useContext } from "react";
import { Link, Outlet } from "react-router-dom";

import { ColorModeContext } from "./theme/ColorModeContext";

export default function App() {
    const { mode, toggleColorMode } = useContext(ColorModeContext);

    return (
        <Box
            sx={{
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
            }}
        >
            <AppBar position="static" color="primary" elevation={1}>
                <Toolbar>
                    <Typography variant="h6" sx={{ mr: 3 }}>
                        Bank One
                    </Typography>
                    <Button color="inherit" component={Link} to="/">
                        Members
                    </Button>
                    <Button color="inherit" component={Link} to="/tasks">
                        Tasks
                    </Button>
                    <Box sx={{ flexGrow: 1 }} />
                    <Tooltip title={`Switch to ${mode === "light" ? "dark" : "light"} mode`}>
                        <IconButton onClick={toggleColorMode} color="inherit">
                            {mode === "light" ? <Brightness4Icon /> : <Brightness7Icon />}
                        </IconButton>
                    </Tooltip>
                </Toolbar>
            </AppBar>
            <Container
                maxWidth="xl"
                sx={{
                    pt: 3,
                    flex: 1,
                    minHeight: 0,
                    display: "flex",
                    flexDirection: "column",
                    overflow: "auto",
                }}
            >
                <Outlet />
            </Container>
        </Box>
    );
}
