import { AppBar, Button, Stack, Toolbar, Typography } from "@mui/material";
import { useNavigate } from "react-router";
import ThemeToggle from "../../theme/ThemeToggle";

const NavBar = () => {
  const navigate = useNavigate();

  const handleGoToLoginClick = () => {
    navigate("/login");
  };
  return (
    <AppBar
      variant="outlined"
      color="default"
      sx={{ top: 0, zIndex: 1000, height: 66 }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography color="primary" fontWeight={"bold"}>
          Vehicle Repair Estimates
        </Typography>
        <Stack direction={"row"}>
          <Button variant="text" onClick={handleGoToLoginClick}>
            <Typography color="primary" fontWeight={"bold"}>
              Login
            </Typography>
          </Button>
          <ThemeToggle />
        </Stack>
      </Toolbar>
    </AppBar>
  );
};
export default NavBar;
