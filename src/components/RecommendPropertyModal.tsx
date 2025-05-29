import React, { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import { recommendProperty } from '../services/propertyService';

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

interface RecommendPropertyModalProps {
  open: boolean;
  onClose: () => void;
  propertyId: string;
  propertyTitle: string;
}

const RecommendPropertyModal: React.FC<RecommendPropertyModalProps> = ({
  open,
  onClose,
  propertyId,
  propertyTitle
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      await recommendProperty(propertyId, email);
      setSuccess(true);
      setEmail('');
      // Close modal after 2 seconds on success
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to recommend property. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle} component="form" onSubmit={handleSubmit}>
        <Typography variant="h6" component="h2" gutterBottom>
          Recommend Property
        </Typography>
        
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Recommend "{propertyTitle}" to someone
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>Property recommended successfully!</Alert>}

        <TextField
          fullWidth
          label="User Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
          required
          disabled={isSubmitting}
        />

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting || !email}
          >
            {isSubmitting ? <CircularProgress size={24} /> : "Recommend"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default RecommendPropertyModal; 