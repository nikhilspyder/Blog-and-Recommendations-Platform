import * as React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { useCommonContext } from './CommonContext';
import PropTypes from 'prop-types';

const Alert = ({ alert, onDelete }) => {
  const { commonState } = useCommonContext();

  const handleDeleteAlert = async () => {
    console.log('handleDeleteAlert deleteAlert - ' + alert);
    try {
      const response = await fetch(`http://localhost:8080/deleteAlert?userName=${commonState.userName}&topic=${alert}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      onDelete();

      if (!response.ok) {
        throw new Error('Failed to deleteAlert');
      }
    } catch (error) {
      console.error('Error deleteAlert:', error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleDeleteAlert();
  };

  return (
    <Grid item xs={12} md={12}>
      <Card sx={{ display: 'flex' }}>
        <CardContent>
          <Typography component="h6" variant="h6">
            New post has been added to {alert} section
          </Typography>
        </CardContent>
        <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '16px' }}>
          <form onSubmit={handleSubmit}>
            <Button type="submit" variant="contained" color="primary" sx={{ marginLeft: '8px' }}>
              Mark as Read
            </Button>
          </form>
        </Grid>
      </Card>
    </Grid>

  );
};

Alert.propTypes = {
  alert: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default Alert;
