import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { useQuery } from "@tanstack/react-query";

import { api } from "../../lib/api";

const STATUS_COLORS = {
    todo: "default",
    in_progress: "primary",
    done: "success",
};

const STATUS_LABELS = {
    todo: "To Do",
    in_progress: "In Progress",
    done: "Done",
};

export default function Tasks() {
    const {
        data: tasks,
        isPending,
        isError,
    } = useQuery({
        queryKey: ["tasks"],
        queryFn: api.getTasks,
    });

    if (isPending) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", pt: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (isError) {
        return (
            <Typography color="error" sx={{ pt: 4 }}>
                Failed to load tasks.
            </Typography>
        );
    }

    return (
        <Box>
            <Typography variant="h5" gutterBottom>
                Tasks
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Created</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tasks.map((task) => (
                            <TableRow key={task.id} hover>
                                <TableCell>{task.title}</TableCell>
                                <TableCell sx={{ color: "text.secondary" }}>{task.description ?? "—"}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={STATUS_LABELS[task.status] ?? task.status}
                                        color={STATUS_COLORS[task.status] ?? "default"}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>{new Date(task.created_at).toLocaleDateString()}</TableCell>
                            </TableRow>
                        ))}
                        {tasks.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} align="center" sx={{ color: "text.secondary", py: 4 }}>
                                    No tasks yet.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
