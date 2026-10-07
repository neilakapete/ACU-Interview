import Clear from "@mui/icons-material/Clear";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Snackbar from "@mui/material/Snackbar";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useState } from "react";

import { api } from "../../lib/api";

const STATUS_COLORS = {
    not_started: "warning",
    in_progress: "primary",
    completed: "success",
};

const STATUS_LABELS = {
    not_started: "Not Started",
    in_progress: "In Progress",
    completed: "Completed",
};

function getOnboardingProgress(member) {
    const completed = member.onboarding_steps_progress.filter((progress) => progress.completed_at !== null).length;

    const totalSteps = member.onboarding_steps_progress.length;

    let statusLabel = STATUS_LABELS.not_started;
    let statusColor = STATUS_COLORS.not_started;

    if (totalSteps > 0 && completed === totalSteps) {
        statusLabel = STATUS_LABELS.completed;
        statusColor = STATUS_COLORS.completed;
    } else if (completed > 0) {
        statusLabel = STATUS_LABELS.in_progress;
        statusColor = STATUS_COLORS.in_progress;
    }

    return { completed, totalSteps, statusLabel, statusColor };
}

function formatCompletedAtDate(date) {
    return dayjs(date).format("MMM D, YYYY");
}

export default function Members() {
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [dateDialog, setDateDialog] = useState(null); // { stepId, stepName, memberName }
    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState({});
    const [errorMessage, setErrorMessage] = useState("");
    const [name, setName] = useState("");
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const queryClient = useQueryClient();

    const {
        data: members,
        isPending: getMembersIsPending,
        isError: getMembersIsError,
    } = useQuery({
        queryKey: ["members"],
        queryFn: api.getMembers,
    });

    const {
        data: onboardingSteps,
        isPending: getOnboardingStepsIsPending,
        isError: getOnboardingStepsIsError,
    } = useQuery({
        queryKey: ["onboardingSteps"],
        queryFn: api.getOnboardingSteps,
    });

    const createMemberMutation = useMutation({
        mutationFn: (data) => {
            return api.createMember({
                name: data.name,
                email: data.email,
            });
        },
        onMutate: () => {
            setErrors({});
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["members"],
            });

            resetMemberForm();
        },
        onError: (error) => {
            if (error.status === 422) {
                setErrors(error.data?.errors ?? {});
            } else {
                showError("Failed to create member. Please try again.");
            }
        },
    });

    const updateStepMutation = useMutation({
        mutationFn: (data) => {
            return api.updateMemberOnboardingStep(data.stepId, {
                completed_at: data.completedAt,
            });
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["members"],
            });
        },
        onError: () => {
            showError("Failed to update onboarding step. Please try again.");
        },
    });

    function resetMemberForm() {
        setCreateDialogOpen(false);
        setName("");
        setEmail("");
        setErrors({});
    }

    function openDateDialog(member, step) {
        setSelectedDate(dayjs());
        setDateDialog({
            stepId: step.id,
            stepName: step.onboarding_step.name,
            memberName: member.name,
        });
    }

    function closeDateDialog() {
        setDateDialog(null);
    }

    function saveDate() {
        updateStepMutation.mutate({
            stepId: dateDialog.stepId,
            completedAt: selectedDate.format("YYYY-MM-DD"),
        });

        closeDateDialog();
    }

    function showError(message) {
        setErrorMessage(message);
        setSnackbarOpen(true);
    }

    if (getMembersIsPending || getOnboardingStepsIsPending) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", pt: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (getMembersIsError || getOnboardingStepsIsError) {
        return (
            <Typography color="error" sx={{ pt: 4 }}>
                Failed to load - please try again.
            </Typography>
        );
    }

    return (
        <Box>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                }}
            >
                <Typography variant="h5">Members</Typography>

                <Button
                    variant="contained"
                    onClick={(event) => {
                        event.currentTarget.blur();
                        setErrors({});
                        setCreateDialogOpen(true);
                    }}
                >
                    Create Member
                </Button>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Onboarding Steps</TableCell>
                            {onboardingSteps.map((step) => (
                                <TableCell key={step.id} align="center">
                                    {step.name}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {members.map((member) => {
                            const { completed, totalSteps, statusLabel, statusColor } = getOnboardingProgress(member);

                            return (
                                <TableRow key={member.id} hover>
                                    <TableCell>{member.name}</TableCell>
                                    <TableCell>{member.email}</TableCell>
                                    <TableCell>
                                        <Chip label={`${completed}/${totalSteps} ${statusLabel}`} color={statusColor} />
                                    </TableCell>
                                    {member.onboarding_steps_progress.map((step) => (
                                        <TableCell key={step.id} align="center">
                                            {updateStepMutation.isPending &&
                                            updateStepMutation.variables?.stepId === step.id ? (
                                                <CircularProgress size={20} />
                                            ) : step.completed_at ? (
                                                <Box
                                                    sx={{
                                                        display: "inline-flex",
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    {formatCompletedAtDate(step.completed_at)}
                                                    <IconButton
                                                        aria-label={`Remove ${step.onboarding_step.name} date for ${member.name}`}
                                                        color="error"
                                                        size="small"
                                                        onClick={() =>
                                                            updateStepMutation.mutate({
                                                                stepId: step.id,
                                                                completedAt: null,
                                                            })
                                                        }
                                                    >
                                                        <Clear sx={{ fontSize: 14 }} />
                                                    </IconButton>
                                                </Box>
                                            ) : (
                                                <Button
                                                    aria-label={`Set ${step.onboarding_step.name} date for ${member.name}`}
                                                    size="small"
                                                    variant="outlined"
                                                    onClick={(event) => {
                                                        event.currentTarget.blur();
                                                        openDateDialog(member, step);
                                                    }}
                                                >
                                                    Set date
                                                </Button>
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            );
                        })}
                        {members.length === 0 && (
                            <TableRow>
                                <TableCell
                                    colSpan={3 + onboardingSteps.length}
                                    align="center"
                                    sx={{ color: "text.secondary", py: 4 }}
                                >
                                    No members yet.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog open={createDialogOpen} onClose={() => resetMemberForm()}>
                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        createMemberMutation.mutate({ name: name.trim(), email: email.trim() });
                    }}
                >
                    <DialogTitle>Create Member</DialogTitle>

                    <DialogContent>
                        <TextField
                            label="Name"
                            fullWidth
                            margin="normal"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            error={Boolean(errors.name)}
                            helperText={errors.name?.[0] ?? ""}
                        />

                        <TextField
                            label="Email"
                            type="email"
                            fullWidth
                            margin="normal"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            error={Boolean(errors.email)}
                            helperText={errors.email?.[0] ?? ""}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button type="button" onClick={() => resetMemberForm()}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="contained" disabled={createMemberMutation.isPending}>
                            {createMemberMutation.isPending ? "Creating..." : "Create"}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
            <Dialog open={dateDialog !== null} onClose={closeDateDialog}>
                <DialogTitle>
                    {dateDialog?.stepName}
                    <Typography variant="body2" color="text.secondary">
                        {dateDialog?.memberName}
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <DateCalendar value={selectedDate} onChange={(date) => setSelectedDate(date)} disableFuture />
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDateDialog}>Cancel</Button>
                    <Button variant="contained" onClick={saveDate} disabled={!selectedDate}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={(_event, reason) => {
                    if (reason === "clickaway") return;
                    setSnackbarOpen(false);
                }}
                slotProps={{ transition: { onExited: () => setErrorMessage("") } }}
            >
                <Alert severity="error" onClose={() => setSnackbarOpen(false)}>
                    {errorMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
}
