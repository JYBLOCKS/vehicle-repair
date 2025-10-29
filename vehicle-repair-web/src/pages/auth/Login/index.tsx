import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  IconButton,
  InputAdornment,
  Link as MuiLink,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../../middlewares/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { Login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState<{ email: string; password: string }>({
    email: "",
    password: "",
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleCancel = () => {
    setUser({
      email: "",
      password: "",
    });
    navigate("/");
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    e.stopPropagation();
    e.isDefaultPrevented();
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.stopPropagation();
    e.isDefaultPrevented();
    try {
      //login logic
      if ((user.email !== "", user.password !== "")) {
        setError("Some field are empty");
      }
      Login(user.email, user.password);
      navigate("/");
    } catch (e) {
      setError(`Error ${e}`);
    }
  };

  return (
    <Box
      width={"100%"}
      height={"100dvh"}
      display={"flex"}
      flexDirection={"row"}
      justifyContent={"center"}
      alignItems={"center"}
      bgcolor="background.default"
      sx={{ m: "auto" }}
    >
      <Card
        sx={{
          p: 3,
          width: { xs: "90%", sm: "350px" },
          minHeight: "370px",
          boxShadow: "0px 0px 10px rgb(0, 0, 0)",
          borderRadius: "8px",
        }}
      >
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
          textAlign="center"
          spacing={3}
        >
          <Typography variant="h4" fontWeight="bold" color="primary" pt={2}>
            Login
          </Typography>
          <form style={{ width: "100%" }} onSubmit={(e) => handleSubmit(e)}>
            <Stack direction="column" gap={2}>
              <TextField
                label="Email"
                type="email"
                variant="outlined"
                fullWidth
                required
                onChange={handleChange}
                name="email"
                value={user.email}
              />
              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                value={user.password}
                fullWidth
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
                required
                onChange={handleChange}
                name="password"
              />
              <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={1}
              >
                <Button
                  type="button"
                  fullWidth
                  variant="outlined"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button type="submit" fullWidth variant="contained">
                  Sign In
                </Button>
              </Stack>
              {error && <Typography color="error">{error}</Typography>}
            </Stack>
          </form>
        </Stack>
        <Stack direction="row" justifyContent="center" alignItems="center">
          <MuiLink
            component={Link}
            to={"/register"}
            variant="body1"
            color="error"
            sx={{ mt: 2 }}
          >
            Create new account!
          </MuiLink>
        </Stack>
      </Card>
    </Box>
  );
};
export default Login;
