import { useEffect, useState } from "react";
import { TextField, Button, Container, Typography, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import axios from "../services/api";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

function PropertyForm({ handleClose, isUpdate, property }) {
  const [formData, setFormData] = useState({
    type: "",
    location: "",
    price: "",
    description: "",
    status: "Not Sold",
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (isUpdate && property) {
      setFormData({
        type: property.type,
        location: property.location,
        price: property.price,
        description: property.description,
        status: property.status,
      });
    }
  }, [isUpdate, property]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token"); 
  
    try {
      if (isUpdate) {
        await axios.put(`/properties/${property._id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });
      } else {
        await axios.post("/properties/create", formData, {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });
      }
      handleClose(); 
      navigate("/"); 
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message); 
    }
  };
  
  return (
    <Container>
      <Typography variant="h4">
        {isUpdate ? "Update Property" : "Add Property"}
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          name="type"
          label="Type"
          value={formData.type}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="location"
          label="Location"
          value={formData.location}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="price"
          label="Price"
          value={formData.price}
          onChange={handleChange}
          type="number"
          fullWidth
          margin="normal"
        />
        <TextField
          name="description"
          label="Description"
          value={formData.description}
          onChange={handleChange}
          fullWidth
          margin="normal"
          multiline
          rows={4}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Status</InputLabel>
          <Select
            name="status"
            value={formData.status}
            onChange={handleChange}
            label="Status"
          >
            <MenuItem value="Not Sold">Not Sold</MenuItem>
            <MenuItem value="Sold">Sold</MenuItem>
          </Select>
        </FormControl>
        <Button type="submit" variant="contained" color="primary">
          {isUpdate ? "Update" : "Submit"}
        </Button>
      </form>
    </Container>
  );
}

// PropTypes validation
PropertyForm.propTypes = {
  handleClose: PropTypes.func.isRequired,
  isUpdate: PropTypes.bool.isRequired,
  property: PropTypes.shape({
    type: PropTypes.string,
    location: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    description: PropTypes.string,
    status: PropTypes.string,
    _id: PropTypes.string,
  }),
};

export default PropertyForm;
