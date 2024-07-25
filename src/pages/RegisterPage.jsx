import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, Container, Typography, Grid, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from '../services/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword(!showPassword);

    const onSubmit = async (data) => {
        try {
            const res = await axios.post('/auth/register', data);
            localStorage.setItem('registrationData', JSON.stringify(data));
            reset({ name: '', email: '', password: '' });
            toast.success(res.data.message);
            setTimeout(() => {
                navigate('/');
            }, 1000);
        } catch (error) {
            toast.error('Registration failed. Please try again.');
        }
    };

    return (
        <Container maxWidth="xs" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom align="center">
                Register
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            {...register('name', { required: 'Name is required' })}
                            label="Name"
                            fullWidth
                            error={Boolean(errors.name)}
                            helperText={errors.name?.message}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            {...register('email', { 
                                required: 'Email is required',
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: 'Invalid email address'
                                }
                            })}
                            label="Email"
                            fullWidth
                            error={Boolean(errors.email)}
                            helperText={errors.email?.message}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            {...register('password', { 
                                required: 'Password is required',
                                minLength: {
                                    value: 6,
                                    message: 'Password must be at least 6 characters long'
                                }
                            })}
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            fullWidth
                            error={Boolean(errors.password)}
                            helperText={errors.password?.message}
                            variant="outlined"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            Register
                        </Button>
                    </Grid>
                </Grid>
            </form>
            <ToastContainer />
        </Container>
    );
}

export default RegisterPage;

