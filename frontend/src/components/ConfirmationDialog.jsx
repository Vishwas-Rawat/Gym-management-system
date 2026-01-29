import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
  Box
} from '@mui/material';
import { WarningAmber, CheckCircleOutline } from '@mui/icons-material';

const ConfirmationDialog = ({ 
  open, 
  title, 
  message, 
  onConfirm, 
  onCancel, 
  confirmText = "Confirm", 
  cancelText = "Cancel",
  severity = "warning" // warning | info | error
}) => {
  return (
    <Dialog 
      open={open} 
      onClose={onCancel}
      PaperProps={{
        sx: {
          borderRadius: 3,
          padding: 1,
          minWidth: 320,
          boxShadow: "0 10px 40px rgba(0,0,0,0.1)"
        }
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 3, pb: 1, px: 2 }}>
        {severity === 'warning' && (
          <Box sx={{ 
            bgcolor: 'warning.light', 
            borderRadius: '50%', 
            p: 2, 
            mb: 2,
            display: 'flex', 
            color: 'warning.main' 
          }}>
            <WarningAmber sx={{ fontSize: 32 }} />
          </Box>
        )}
        {severity === 'info' && (
          <Box sx={{ 
            bgcolor: 'info.light', 
            borderRadius: '50%', 
            p: 2, 
            mb: 2,
            display: 'flex', 
            color: 'info.main' 
          }}>
            <CheckCircleOutline sx={{ fontSize: 32 }} />
          </Box>
        )}

        <Typography variant="h6" fontWeight={700} align="center" gutterBottom>
          {title}
        </Typography>
        
        <DialogContent sx={{ p: 0, px: 2, pb: 2 }}>
          <DialogContentText align="center" sx={{ fontSize: '0.95rem', color: 'text.secondary' }}>
            {message}
          </DialogContentText>
        </DialogContent>
      </Box>

      <DialogActions sx={{ justifyContent: 'center', pb: 2, px: 3, gap: 1 }}>
        <Button 
          onClick={onCancel} 
          variant="outlined" 
          color="inherit"
          fullWidth
          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, borderColor: 'divider' }}
        >
          {cancelText}
        </Button>
        <Button 
          onClick={onConfirm} 
          variant="contained" 
          color={severity === 'warning' ? 'warning' : 'primary'}
          fullWidth
          autoFocus
          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, boxShadow: 'none' }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmationDialog;
