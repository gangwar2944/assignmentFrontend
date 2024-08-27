"use client";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Grid,
  TextField,
  Button,
  Container,
  Typography,
  MenuItem,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import axios from "axios";

interface FormValues {
  firstName: string;
  secondName: string;
  location: Location;
}

interface Location {
  id: string;
  name: string;
}

const FormComponent = (): JSX.Element => {
  const [initialData, setInitialData] = useState<FormValues | null>(null);
  const [locationList, setLocationList] = useState<Location[]>([]);
  const [submittedData, setSubmittedData] = useState<FormValues[]>([]);
  const { control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      firstName: "",
      secondName: "",
      location: {
        id: "",
      },
    },
  });

  useEffect(() => {
    // Fetch initial data
    axios
      .get("https://localhost:8800/data/1")
      .then((response) => {
        setInitialData(response.data);
        reset(response.data);
      })
      .catch((error) => console.error("Error fetching initial data:", error));

    // Fetch locations
    axios
      .get("localhost:8800/api/form/location")
      .then((response) => setLocationList(response.data))
      .catch((error) => console.error("Error fetching locations:", error));
  }, [reset]);

  const onSubmit = (data: FormValues) => {
    // Post data to API
    axios
      .post("https://localhost:8800/api/form", data)
      .then((response) => {
        console.log("Data posted successfully:", response.data);
        alert("Data submitted successfully!");

        // Add the submitted data to the list
        setSubmittedData((prevData) => [...prevData, data]);
      })
      .catch((error) => console.error("Error posting data:", error));
  };

  const handleEdit = (id: string) => {
    // Edit data (PUT request)
    if (initialData) {
      axios
        .put(`https://localhost:8800/api/form/${id}`, initialData)
        .then((response) => {
          console.log("Data updated successfully:", response.data);
          alert("Data updated successfully!");
        })
        .catch((error) => console.error("Error updating data:", error));
    }
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Form Example
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6} lg={4}>
            <Controller
              name="firstName"
              control={control}
              rules={{ required: "First Name is required" }}
              render={({ field, fieldState }) => (
                <TextField
                  label="First Name"
                  fullWidth
                  {...field}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Controller
              name="secondName"
              control={control}
              rules={{ required: "Second Name is required" }}
              render={({ field, fieldState }) => (
                <TextField
                  label="Second Name"
                  fullWidth
                  {...field}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Controller
              name="location.id"
              control={control}
              rules={{ required: "Location is required" }}
              render={({ field, fieldState }) => (
                <TextField
                  select
                  label="Location"
                  fullWidth
                  {...field}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                >
                  <MenuItem value="">Select Location</MenuItem>
                  {locationList.map((item) => (
                    <MenuItem value={item.id} key={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
            <Button
              type="button"
              variant="outlined"
              color="secondary"
              onClick={handleEdit}
              style={{ marginLeft: "10px" }}
            >
              Edit Data
            </Button>
          </Grid>
        </Grid>
      </form>

      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        style={{ marginTop: "20px" }}
      >
        Submitted Data
      </Typography>
      <List>
        {submittedData.map((item, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={`First Name: ${item.firstName}, Second Name: ${
                item.secondName
              }, Location: ${
                locationList.find((loc) => loc.id === item.location.id)?.name ||
                "Unknown"
              }`}
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default FormComponent;
