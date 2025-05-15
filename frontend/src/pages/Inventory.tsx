import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Grid,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  PlayArrow as StartIcon,
  Save as SaveIcon,
  Check as CheckIcon,
  Room as RoomIcon,
} from '@mui/icons-material';

// Mock data for inventory sessions
const mockInventorySessions = [
  {
    id: 1,
    date: '2025-05-01',
    status: 'Completed',
    totalValue: '$24,567.89',
    roomsCount: 5,
    createdBy: 'John Doe',
  },
  {
    id: 2,
    date: '2025-04-15',
    status: 'Completed',
    totalValue: '$23,982.45',
    roomsCount: 5,
    createdBy: 'Jane Smith',
  },
  {
    id: 3,
    date: '2025-04-01',
    status: 'Completed',
    totalValue: '$24,102.33',
    roomsCount: 5,
    createdBy: 'John Doe',
  },
];

// Mock data for rooms in a new count
const mockRoomsForCount = [
  { id: 1, name: 'Dry Storage', productCount: 45, assigned: 'John Doe', status: 'Not Started' },
  { id: 2, name: 'Walk-in Cooler', productCount: 32, assigned: 'Jane Smith', status: 'Not Started' },
  { id: 3, name: 'Walk-in Freezer', productCount: 28, assigned: 'John Doe', status: 'Not Started' },
  { id: 4, name: 'Prep Area', productCount: 15, assigned: 'Unassigned', status: 'Not Started' },
  { id: 5, name: 'Bar', productCount: 36, assigned: 'Jane Smith', status: 'Not Started' },
];

const Inventory = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  const steps = ['Create Session', 'Assign Rooms', 'Count Inventory', 'Review & Finalize'];

  const handleStartNewCount = () => {
    setIsCreatingNew(true);
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleCancel = () => {
    setIsCreatingNew(false);
    setActiveStep(0);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Inventory</Typography>
        {!isCreatingNew && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleStartNewCount}
          >
            New Inventory Count
          </Button>
        )}
      </Box>

      {isCreatingNew ? (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {activeStep === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Create New Inventory Session
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Session Name"
                    defaultValue={`Inventory Count - ${new Date().toLocaleDateString()}`}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Date"
                    type="date"
                    defaultValue={new Date().toISOString().split('T')[0]}
                    margin="normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Notes"
                    multiline
                    rows={4}
                    margin="normal"
                  />
                </Grid>
              </Grid>
            </Box>
          )}

          {activeStep === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Assign Rooms to Users
              </Typography>
              <List>
                {mockRoomsForCount.map((room) => (
                  <Paper key={room.id} sx={{ mb: 2 }}>
                    <ListItem>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <RoomIcon sx={{ mr: 1 }} />
                            {room.name}
                          </Box>
                        }
                        secondary={`${room.productCount} products`}
                      />
                      <ListItemSecondaryAction>
                        <TextField
                          select
                          label="Assign to"
                          defaultValue={room.assigned}
                          SelectProps={{
                            native: true,
                          }}
                          sx={{ minWidth: 150 }}
                        >
                          <option value="Unassigned">Unassigned</option>
                          <option value="John Doe">John Doe</option>
                          <option value="Jane Smith">Jane Smith</option>
                        </TextField>
                      </ListItemSecondaryAction>
                    </ListItem>
                  </Paper>
                ))}
              </List>
            </Box>
          )}

          {activeStep === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Count Inventory
              </Typography>
              <Typography variant="body1" paragraph>
                Inventory counting is in progress. Users can access their assigned rooms and enter counts.
              </Typography>
              <Grid container spacing={3}>
                {mockRoomsForCount.map((room) => (
                  <Grid item xs={12} md={6} key={room.id}>
                    <Card>
                      <CardHeader
                        title={room.name}
                        subheader={`Assigned to: ${room.assigned}`}
                        action={
                          <Chip
                            label={room.status}
                            color={room.status === 'Completed' ? 'success' : 'default'}
                          />
                        }
                      />
                      <Divider />
                      <CardContent>
                        <Typography variant="body2" color="text.secondary">
                          {room.productCount} products to count
                        </Typography>
                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                          <Button
                            variant="outlined"
                            startIcon={<StartIcon />}
                          >
                            Start Counting
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {activeStep === 3 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Review & Finalize
              </Typography>
              <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Inventory Summary
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6} md={3}>
                    <Typography variant="body2" color="text.secondary">
                      Total Rooms:
                    </Typography>
                    <Typography variant="body1">5</Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography variant="body2" color="text.secondary">
                      Rooms Completed:
                    </Typography>
                    <Typography variant="body1">3/5</Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography variant="body2" color="text.secondary">
                      Total Products:
                    </Typography>
                    <Typography variant="body1">156</Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography variant="body2" color="text.secondary">
                      Total Value:
                    </Typography>
                    <Typography variant="body1">$24,789.45</Typography>
                  </Grid>
                </Grid>
              </Paper>
              <Typography variant="body1" paragraph>
                Some rooms are still not completed. You can finalize the inventory count when all rooms are completed,
                or force finalize now (incomplete rooms will not be included).
              </Typography>
            </Box>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button onClick={handleCancel} sx={{ mr: 1 }}>
              Cancel
            </Button>
            {activeStep > 0 && (
              <Button onClick={handleBack} sx={{ mr: 1 }}>
                Back
              </Button>
            )}
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
              startIcon={activeStep === steps.length - 1 ? <CheckIcon /> : null}
            >
              {activeStep === steps.length - 1 ? 'Finalize' : 'Next'}
            </Button>
          </Box>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Recent Inventory Sessions
            </Typography>
            <List>
              {mockInventorySessions.map((session) => (
                <Paper key={session.id} sx={{ mb: 2 }}>
                  <ListItem>
                    <ListItemText
                      primary={`Inventory Count - ${session.date}`}
                      secondary={`Created by: ${session.createdBy} | Rooms: ${session.roomsCount}`}
                    />
                    <ListItemSecondaryAction>
                      <Chip
                        label={session.status}
                        color={session.status === 'Completed' ? 'success' : 'default'}
                        sx={{ mr: 2 }}
                      />
                      <Typography variant="body2" component="span" sx={{ mr: 2 }}>
                        {session.totalValue}
                      </Typography>
                      <Button
                        variant="outlined"
                        size="small"
                      >
                        View Details
                      </Button>
                    </ListItemSecondaryAction>
                  </ListItem>
                </Paper>
              ))}
            </List>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default Inventory;