import { useEffect, useState } from 'react';
import { Container, Card, CardContent, Typography, Grid, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem } from '@mui/material';
import { Add } from '@mui/icons-material'; 
import axios from '../services/api';
import PropertyForm from './PropertyForm';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function PropertyList() {
    const [properties, setProperties] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false); 
    const [selectedProperty, setSelectedProperty] = useState(null); 
    const [isEditing, setIsEditing] = useState(false); 
    const [filters, setFilters] = useState({
        location: '',
        minPrice: '',
        maxPrice: '',
        type: ''
    });

    useEffect(() => {
        fetchProperties();
    }, [filters]); 

    const fetchProperties = async () => {
        try {
            const { location, minPrice, maxPrice, type } = filters;
            const response = await axios.get('/properties', {
                params: { location, minPrice, maxPrice, type }
            });
            setProperties(response.data.properties);
        } catch (error) {
            console.log(error);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
    };

   
    const isAuthenticated = Boolean(localStorage.getItem('token')); 

    const handleDelete = async (id) => {
        if (!isAuthenticated) {
            toast.error('Please log in to perform this action.');
            return;
        }

        const token = localStorage.getItem('token');

        try {
            await axios.delete(`/properties/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setProperties(properties.filter(property => property._id !== id));
        } catch (error) {
            console.log(error);
        }
    };

    const handleDialogOpen = (property = null) => {
        if (!isAuthenticated) {
            toast.error('Please log in to perform this action.');
            return;
        }

        setSelectedProperty(property);
        setIsEditing(!!property); 
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setSelectedProperty(null);
        fetchProperties(); 
    };

    const statusColor = (status) => {
        switch (status) {
            case 'Sold':
                return 'red'; 
            case 'Not Sold':
            default:
                return 'green'; 
        }
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Property Listings
                <IconButton
                    color="primary"
                    onClick={() => handleDialogOpen()} 
                    style={{ marginLeft: '1rem' }}
                >
                    <Add />
                </IconButton>
            </Typography>

            <Grid container spacing={2} mb={2}>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        label="Location"
                        name="location"
                        value={filters.location}
                        onChange={handleFilterChange}
                        fullWidth
                        margin="normal"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        label="Min Price"
                        name="minPrice"
                        type="number"
                        value={filters.minPrice}
                        onChange={handleFilterChange}
                        fullWidth
                        margin="normal"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        label="Max Price"
                        name="maxPrice"
                        type="number"
                        value={filters.maxPrice}
                        onChange={handleFilterChange}
                        fullWidth
                        margin="normal"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        label="Type"
                        name="type"
                        value={filters.type}
                        onChange={handleFilterChange}
                        select
                        fullWidth
                        margin="normal"
                    >
                        <MenuItem value="">All</MenuItem>
                        <MenuItem value="House">House</MenuItem>
                        <MenuItem value="Apartment">Apartment</MenuItem>
                        <MenuItem value="Land">Land</MenuItem>
                    </TextField>
                </Grid>
               
            </Grid>

            <Dialog open={dialogOpen} onClose={handleDialogClose}>
                <DialogTitle>{isEditing ? 'Edit Property' : 'Add Property'}</DialogTitle>
                <DialogContent>
                    <PropertyForm 
                        handleClose={handleDialogClose} 
                        isUpdate={isEditing} 
                        property={selectedProperty} 
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            <Grid container spacing={2}>
                {properties.map((property) => (
                    <Grid item xs={12} sm={6} md={4} key={property._id}>
                        <Card
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                height: '100%', 
                                justifyContent: 'space-between' 
                            }}
                        >
                            <CardContent>
                                <Typography variant="h6">{property.type}</Typography>
                                <Typography variant="body1">{property.location}</Typography>
                                <Typography variant="body1">${property.price}</Typography>
                                <Typography variant="body2" style={{ color: statusColor(property.status) }}>
                                    {property.description}
                                    <br />
                                    <strong>Status: </strong>
                                    <span style={{ color: statusColor(property.status) }}>{property.status}</span>
                                </Typography>
                                <Grid container spacing={1} mt={2} alignItems="center">
                                    <Grid item xs={12} sm={6}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            fullWidth
                                            onClick={() => handleDialogOpen(property)} 
                                        >
                                            Edit
                                        </Button>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            fullWidth
                                            onClick={() => handleDelete(property._id)}
                                        >
                                            Delete
                                        </Button>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <ToastContainer />
        </Container>
    );
}

export default PropertyList;

