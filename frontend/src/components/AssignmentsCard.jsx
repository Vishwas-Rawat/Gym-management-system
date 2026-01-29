import React, { useState, useEffect } from 'react';
import { 
    Paper, Box, Typography, Tabs, Tab, 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Avatar, Chip, CircularProgress, TextField, InputAdornment, Button, IconButton, 
    Dialog, DialogTitle, DialogContent, DialogActions,
    List, ListItemAvatar, ListItemText, Checkbox, ListItemButton
} from '@mui/material';
import { Search, Person, FitnessCenter, AssignmentInd, Edit, Add, Delete, ExpandMore, Close } from '@mui/icons-material';
import { userApi } from '../services/api';
import AssignTrainerDialog from './AssignTrainerDialog';

const AssignmentsCard = ({ gymId }) => {
    const [tab, setTab] = useState(0); // 0 = Member Based, 1 = Trainer Based
    const [members, setMembers] = useState([]);
    const [trainers, setTrainers] = useState([]);
    const [trainerMembersMap, setTrainerMembersMap] = useState({});
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    
    // For Member-Based Single Assignment
    const [assignDialogOpen, setAssignDialogOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    
    // For Trainer-Based Bulk Assignment
    const [bulkAssignDialogOpen, setBulkAssignDialogOpen] = useState(false);
    const [selectedTrainer, setSelectedTrainer] = useState(null);
    const [potentialMembers, setPotentialMembers] = useState([]);
    const [selectedMemberIds, setSelectedMemberIds] = useState([]);
    const [assignLoading, setAssignLoading] = useState(false);
    const [expandedTrainers, setExpandedTrainers] = useState({}); // Track which trainers are expanded

    const fetchMemberBasedData = async () => {
        if(!gymId) return;
        
        setLoading(true);
        try {
            const response = await userApi.get(`/member/gym/${gymId}`);
            setMembers(response.data || []);
        } catch (err) {
            console.error("Failed to fetch members", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchTrainerBasedData = async () => {
        if(!gymId) return;
        
        setLoading(true);
        try {
            // 1. Get all trainers for the gym
            const trainersRes = await userApi.get(`/trainer/gym/${gymId}`);
            const trainersData = trainersRes.data || [];
            setTrainers(trainersData);

            // 2. For each trainer, fetch their assigned members
            const membersMap = {};
            await Promise.all(
                trainersData.map(async (trainer) => {
                    try {
                        const membersRes = await userApi.get(`/trainer/${trainer.trainerId}/members`);
                        membersMap[trainer.trainerId] = membersRes.data || [];
                    } catch (err) {
                        console.error(`Failed to fetch members for trainer ${trainer.trainerId}`, err);
                        membersMap[trainer.trainerId] = [];
                    }
                })
            );
            
            setTrainerMembersMap(membersMap);
        } catch (err) {
            console.error("Failed to fetch trainer data", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (tab === 0) {
            fetchMemberBasedData();
        } else {
            fetchTrainerBasedData();
        }
    }, [gymId, tab]);

    const handleTabChange = (event, newValue) => {
        setTab(newValue);
        setSearchTerm("");
    };

    // Member-Based: Single assignment
    const handleAssignClick = (member) => {
        setSelectedMember(member);
        setAssignDialogOpen(true);
    };

    const handleAssignSuccess = () => {
        setAssignDialogOpen(false);
        setSelectedMember(null);
        fetchMemberBasedData();
    };

    // Trainer-Based: Bulk assignment
    const handleBulkAssignClick = async (trainer) => {
        setSelectedTrainer(trainer);
        setAssignLoading(true);
        setBulkAssignDialogOpen(true);
        
        try {
            // Fetch potential members for this trainer
            const response = await userApi.get(`/trainer/${trainer.trainerId}/potential-members`);
            setPotentialMembers(response.data || []);
            
            // Pre-select already assigned members
            const currentMembers = trainerMembersMap[trainer.trainerId] || [];
            setSelectedMemberIds(currentMembers.map(m => m.memberId));
        } catch (err) {
            console.error("Failed to fetch potential members", err);
            setPotentialMembers([]);
        } finally {
            setAssignLoading(false);
        }
    };

    // Handle member selection toggle
    const handleToggleMember = (memberId) => {
        setSelectedMemberIds(prev => 
            prev.includes(memberId) 
                ? prev.filter(id => id !== memberId)
                : [...prev, memberId]
        );
    };

    // Bulk assign members to trainer
    const handleBulkAssign = async () => {
        if (!selectedTrainer) return;
        
        setAssignLoading(true);
        try {
            await userApi.post('/trainer/admin/assign-members', {
                trainerId: selectedTrainer.trainerId,
                memberIds: selectedMemberIds
            });
            
            // Close dialog and refresh
            setBulkAssignDialogOpen(false);
            setSelectedTrainer(null);
            setPotentialMembers([]);
            setSelectedMemberIds([]);
            fetchTrainerBasedData();
        } catch (err) {
            console.error("Failed to assign members", err);
            alert("Failed to assign members. Please try again.");
        } finally {
            setAssignLoading(false);
        }
    };

    // Remove trainer from member (Member-Based View) - API: POST /member/{memberId}/remove-trainer
    const handleRemoveTrainerFromMember = async (memberId) => {
        if (!window.confirm("Are you sure you want to remove the trainer from this member?")) return;
        
        try {
            await userApi.post(`/member/${memberId}/remove-trainer`);
            fetchMemberBasedData(); // Refresh member data
        } catch (err) {
            console.error("Failed to remove trainer from member", err);
            alert("Failed to remove trainer. Please try again.");
        }
    };

    // Remove member from trainer (Trainer-Based View) - API: POST /trainer/{trainerId}/remove-member/{memberId}
    const handleRemoveMemberFromTrainer = async (trainerId, memberId, memberName) => {
        if (!window.confirm(`Are you sure you want to remove ${memberName} from this trainer?`)) return;
        
        try {
            await userApi.post(`/trainer/${trainerId}/remove-member/${memberId}`);
            fetchTrainerBasedData(); // Refresh trainer data
        } catch (err) {
            console.error("Failed to remove member from trainer", err);
            alert("Failed to remove member. Please try again.");
        }
    };

    // Filter Logic
    const filteredMembers = members.filter(m => 
        m.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredTrainers = trainers.filter(t => 
        t.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Helper function to check if member has a valid trainer assigned
    const hasTrainerAssigned = (member) => {
        return member.trainerName && 
               member.trainerName.trim() !== "" && 
               member.trainerName.toLowerCase() !== "no trainer assigned";
    };

    return (
        <Paper sx={{ width: "100%", height: "100%", overflow: "hidden", borderRadius: '16px', boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
            {/* HEADER */}
            <Box sx={{ p: 3, borderBottom: "1px solid #f1f5f9", display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
                <Box>
                    <Typography variant="h6" fontWeight={700}>Trainer Assignments</Typography>
                    <Typography variant="caption" color="text.secondary">Manage member-trainer relationships</Typography>
                </Box>
                <Tabs value={tab} onChange={handleTabChange} sx={{ minHeight: 0 }}>
                    <Tab label="Member Based" icon={<Person sx={{ fontSize: 16 }} />} iconPosition="start" sx={{ minHeight: 36, textTransform: 'none', fontWeight: 600 }} />
                    <Tab label="Trainer Based" icon={<FitnessCenter sx={{ fontSize: 16 }} />} iconPosition="start" sx={{ minHeight: 36, textTransform: 'none', fontWeight: 600 }} />
                </Tabs>
            </Box>

            {/* SEARCH */}
            <Box sx={{ p: 2, bgcolor: '#f8fafc', borderBottom: "1px solid #e2e8f0" }}>
                <TextField
                    fullWidth
                    size="small"
                    placeholder={tab === 0 ? "Search members..." : "Search trainers..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: <InputAdornment position="start"><Search fontSize="small" color="action" /></InputAdornment>,
                        sx: { bgcolor: 'white' }
                    }}
                />
            </Box>

            {/* CONTENT */}
            {tab === 0 ? (
                // MEMBER-BASED VIEW (Table format showing members)
                <TableContainer sx={{ maxHeight: 400 }}>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
                    ) : (
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 600 }}>Member</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Assigned Trainer</TableCell>
                                    <TableCell sx={{ fontWeight: 600, width: 180 }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredMembers.length > 0 ? filteredMembers.map(m => (
                                    <TableRow key={m.memberId} hover>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                <Avatar sx={{ width: 32, height: 32, fontSize: 14, bgcolor: 'primary.light' }}>
                                                    {m.fullName ? m.fullName[0] : 'U'}
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="body2" fontWeight={600}>{m.fullName}</Typography>
                                                    <Typography variant="caption" color="text.secondary">{m.email}</Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            {hasTrainerAssigned(m) ? (
                                                <Chip 
                                                    icon={<AssignmentInd sx={{ fontSize: 14 }} />} 
                                                    label={m.trainerName} 
                                                    size="small" 
                                                    color="secondary" 
                                                    variant="outlined" 
                                                    sx={{ bgcolor: 'secondary.50', borderColor: 'secondary.light', color: 'secondary.dark', fontWeight: 600 }}
                                                />
                                            ) : (
                                                <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                                    No Trainer Assigned
                                                </Typography>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    startIcon={<Edit sx={{ fontSize: 16 }} />}
                                                    onClick={() => handleAssignClick(m)}
                                                    sx={{ 
                                                        textTransform: 'none', 
                                                        fontWeight: 600,
                                                        borderRadius: '8px',
                                                        minWidth: 80
                                                    }}
                                                >
                                                    {hasTrainerAssigned(m) ? "Change" : "Assign"}
                                                </Button>
                                                {hasTrainerAssigned(m) ? (
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        color="error"
                                                        startIcon={<Delete sx={{ fontSize: 16 }} />}
                                                        onClick={() => handleRemoveTrainerFromMember(m.memberId)}
                                                        sx={{ 
                                                            textTransform: 'none', 
                                                            fontWeight: 600,
                                                            borderRadius: '8px',
                                                            minWidth: 80
                                                        }}
                                                    >
                                                        Remove
                                                    </Button>
                                                ) : null}
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                )) : <TableRow><TableCell colSpan={3} align="center">No members found.</TableCell></TableRow>}
                            </TableBody>
                        </Table>
                    )}
                </TableContainer>
            ) : (
                // TRAINER-BASED VIEW (Table format with expandable rows)
                <TableContainer sx={{ maxHeight: 400 }}>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
                    ) : (
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 600 }}>Trainer</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Members</TableCell>
                                    <TableCell sx={{ fontWeight: 600, width: 100 }}>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredTrainers.length > 0 ? filteredTrainers.map(t => {
                                    const assignedMembers = trainerMembersMap[t.trainerId] || [];
                                    const isExpanded = expandedTrainers[t.trainerId] || false;
                                    
                                    const toggleExpanded = () => {
                                        setExpandedTrainers(prev => ({
                                            ...prev,
                                            [t.trainerId]: !prev[t.trainerId]
                                        }));
                                    };
                                    
                                    return (
                                        <React.Fragment key={t.trainerId}>
                                            <TableRow hover>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                        <Avatar sx={{ width: 32, height: 32, fontSize: 14, bgcolor: 'secondary.light' }}>
                                                            {t.fullName ? t.fullName[0] : 'T'}
                                                        </Avatar>
                                                        <Box>
                                                            <Typography variant="body2" fontWeight={600}>{t.fullName}</Typography>
                                                            <Typography variant="caption" color="text.secondary">{assignedMembers.length} Members</Typography>
                                                        </Box>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    {assignedMembers.length > 0 ? (
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                                            {assignedMembers.length === 1 ? (
                                                                <Chip 
                                                                    label={assignedMembers[0].fullName}
                                                                    size="small"
                                                                    avatar={<Avatar sx={{ bgcolor: 'primary.main', color: 'white' }}>{assignedMembers[0].fullName[0]}</Avatar>}
                                                                    onDelete={() => handleRemoveMemberFromTrainer(t.trainerId, assignedMembers[0].memberId, assignedMembers[0].fullName)}
                                                                    deleteIcon={<Close sx={{ fontSize: 16 }} />}
                                                                    sx={{ 
                                                                        bgcolor: 'white', 
                                                                        border: '1px solid #e2e8f0',
                                                                        height: '32px',
                                                                        px: 1,
                                                                        '& .MuiChip-label': { px: 1 }
                                                                    }}
                                                                />
                                                            ) : (
                                                                <>
                                                                    <Chip 
                                                                        label={`${assignedMembers.length} members`}
                                                                        size="small"
                                                                        sx={{ 
                                                                            bgcolor: 'primary.50', 
                                                                            border: '1px solid',
                                                                            borderColor: 'primary.light',
                                                                            color: 'primary.main',
                                                                            fontWeight: 600
                                                                        }}
                                                                    />
                                                                    <IconButton 
                                                                        size="small" 
                                                                        onClick={toggleExpanded}
                                                                        sx={{ 
                                                                            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                                                            transition: 'transform 0.3s'
                                                                        }}
                                                                    >
                                                                        <ExpandMore fontSize="small" />
                                                                    </IconButton>
                                                                </>
                                                            )}
                                                        </Box>
                                                    ) : (
                                                        <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                                            No members assigned
                                                        </Typography>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        startIcon={<Add sx={{ fontSize: 16 }} />}
                                                        onClick={() => handleBulkAssignClick(t)}
                                                        sx={{ 
                                                            textTransform: 'none', 
                                                            fontWeight: 600,
                                                            borderRadius: '8px',
                                                            minWidth: 90
                                                        }}
                                                    >
                                                        Manage
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                            {isExpanded && assignedMembers.length > 1 && (
                                                <TableRow>
                                                    <TableCell colSpan={3} sx={{ bgcolor: '#f8fafc', py: 1 }}>
                                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, pl: 6 }}>
                                                            {assignedMembers.map(m => (
                                                                <Chip 
                                                                    key={m.memberId}
                                                                    label={m.fullName}
                                                                    size="small"
                                                                    avatar={<Avatar sx={{ bgcolor: 'primary.main', color: 'white' }}>{m.fullName[0]}</Avatar>}
                                                                    onDelete={() => handleRemoveMemberFromTrainer(t.trainerId, m.memberId, m.fullName)}
                                                                    deleteIcon={<Close sx={{ fontSize: 16 }} />}
                                                                    sx={{ 
                                                                        bgcolor: 'white', 
                                                                        border: '1px solid #e2e8f0',
                                                                        height: '32px',
                                                                        px: 1,
                                                                        '& .MuiChip-label': { px: 1 }
                                                                    }}
                                                                />
                                                            ))}
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </React.Fragment>
                                    );
                                }) : <TableRow><TableCell colSpan={3} align="center">No trainers found.</TableCell></TableRow>}
                            </TableBody>
                        </Table>
                    )}
                </TableContainer>
            )}

            {/* Single Assign Trainer Dialog (Member-Based) */}
            {selectedMember && (
                <AssignTrainerDialog
                    open={assignDialogOpen}
                    onClose={() => {
                        setAssignDialogOpen(false);
                        setSelectedMember(null);
                    }}
                    gymId={gymId}
                    memberId={selectedMember.memberId || selectedMember.id}
                    onAssignSuccess={handleAssignSuccess}
                />
            )}

            {/* Bulk Assign Members Dialog (Trainer-Based) */}
            <Dialog open={bulkAssignDialogOpen} onClose={() => setBulkAssignDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    Assign Members to {selectedTrainer?.fullName}
                </DialogTitle>
                <DialogContent>
                    {assignLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
                    ) : (
                        <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                            {potentialMembers.map(member => (
                                <ListItemButton key={member.memberId} onClick={() => handleToggleMember(member.memberId)} dense>
                                    <Checkbox
                                        edge="start"
                                        checked={selectedMemberIds.includes(member.memberId)}
                                        tabIndex={-1}
                                        disableRipple
                                    />
                                    <ListItemAvatar>
                                        <Avatar sx={{ bgcolor: 'primary.light' }}>{member.fullName[0]}</Avatar>
                                    </ListItemAvatar>
                                    <ListItemText 
                                        primary={member.fullName} 
                                        secondary={member.trainerName || "No trainer assigned"}
                                    />
                                </ListItemButton>
                            ))}
                        </List>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setBulkAssignDialogOpen(false)}>Cancel</Button>
                    <Button 
                        onClick={handleBulkAssign} 
                        variant="contained" 
                        disabled={assignLoading}
                    >
                        Assign ({selectedMemberIds.length})
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
};

export default AssignmentsCard;
