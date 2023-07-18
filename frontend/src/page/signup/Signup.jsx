import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import { NavLink } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Logo from "../../Asssets/fyp-logo.png"
import googleLogo from "../../Asssets/logos/google.png";
import facebookLogo from "../../Asssets/logos/facebook.png";
import appleLogo from "../../Asssets/logos/apple.png";

const defaultTheme = createTheme();

export default function SignUp() {
    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log({
            email: data.get("email"),
            password: data.get("password"),
        });
    };

    return (
        <>
            <div className="left">
                <ThemeProvider theme={defaultTheme}>
                    <div style={{ height: "200px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <img style={{ width: "100px", height: "100px" }} src={Logo} alt="smart-contract-auditor" />
                    </div>
                    <Container component="main" maxWidth="xs">
                        <CssBaseline />
                        <Box
                            sx={{
                                marginTop: 2,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                            }}
                        >
                            <h2>Welcome</h2>
                            <Box
                                component="form"
                                noValidate
                                onSubmit={handleSubmit}
                                sx={{ mt: 3 }}
                            >
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            id="fullName"
                                            label="Full Name"
                                            name="fullName"
                                            autoComplete="family-name"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            id="email"
                                            label="Email Address"
                                            name="email"
                                            autoComplete="email"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            name="password"
                                            label="Password"
                                            type="password"
                                            id="password"
                                            autoComplete="new-password"
                                        />
                                    </Grid>
                                </Grid>
                                <Button
                                    style={{
                                        background: "#EB6769FF",
                                    }}
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                >
                                    Sign Up
                                </Button>
                            </Box>
                            <Grid container justifyContent="flex-end" className="temp">
                                <Grid item>
                                    <NavLink to="/login">
                                        {"Already have an account? Sign in"}
                                    </NavLink>
                                </Grid>
                            </Grid>
                            <p>Or sign up with</p>
                            <div style={{ width: "150px", display: "flex", justifyContent: "space-around" }}>
                                <div className="google">
                                    <img style={{ width: "30px", height: "20px" }} src={googleLogo} alt="Google" />
                                </div>
                                <div className="facebook">
                                    <img style={{ width: "30px", height: "20px" }} src={facebookLogo} alt="Facebook" />
                                </div>
                                <div className="apple">
                                    <img style={{ width: "30px", height: "20px" }} src={appleLogo} alt="Apple" />
                                </div>
                            </div>
                        </Box>
                    </Container>
                </ThemeProvider>

            </div>

        </>
    )
}