
import { useForm } from 'react-hook-form';
import { TextField, Button, Container, Typography, Grid } from '@mui/material';
import axios from '../services/api';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom'; 
import 'react-toastify/dist/ReactToastify.css';

function LoginPage() {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
 
    const navigate = useNavigate(); 

   

    const onSubmit = async (data) => {
        try {
            const res = await axios.post('/auth/login', data);
            // Save token to local storage
            localStorage.setItem('token', res.data.token); 
            // Clear the form fields
            reset({ email: '', password: '' });
            toast.success(res.data.message);
            console.log('Login successful');
            // Navigate to the root path
            setTimeout(() => {
                navigate('/');
            }, 1000);
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };
    
    return (
        <Container maxWidth="xs" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom align="center">
                Login
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
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
                            type="password"
                            fullWidth
                            error={Boolean(errors.password)}
                            helperText={errors.password?.message}
                            variant="outlined"
                            
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            Login
                        </Button>
                    </Grid>
                </Grid>
            </form>
            <ToastContainer />
        </Container>
    );
}

export default LoginPage;
