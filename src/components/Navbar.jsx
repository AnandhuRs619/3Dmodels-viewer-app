/* eslint-disable react/prop-types */
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import { alpha, styled } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import Button from "@mui/material/Button";
import { Add } from "@mui/icons-material";
import UploadModels from "./UploadModels";
import { useState } from "react";
import logo from "/unnamed.png";
import { Grid, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

const Navbar = ({ setSearchTerm }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: "black" }}>
        <Toolbar>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <img
                src={logo}
                alt="logo"
                style={{ height: 40, marginRight: 16 }}
              />
            </Grid>
            <Grid item xs>
              <Typography variant="h6" noWrap sx={{ color: "red" }}>
                3D Model Viewer
              </Typography>
            </Grid>
            {isMobile ? (
              <>
                <Grid item>
                  <IconButton
                    color="inherit"
                    onClick={() => setMenuOpen(!menuOpen)}
                  >
                    <MenuIcon />
                  </IconButton>
                </Grid>
                {menuOpen && (
                  <Grid item xs={12}>
                    <Search>
                      <SearchIconWrapper>
                        <SearchIcon />
                      </SearchIconWrapper>
                      <StyledInputBase
                        placeholder="Search…"
                        inputProps={{ "aria-label": "search" }}
                        onChange={handleSearchChange}
                        fullWidth
                      />
                    </Search>
                    <Button
                      variant="contained"
                      color="error"
                      startIcon={<Add />}
                      sx={{ color: "white", mt: 2 }}
                      onClick={handleOpen}
                      fullWidth
                    >
                      Upload
                    </Button>
                  </Grid>
                )}
              </>
            ) : (
              <>
                <Grid item xs>
                  <Search>
                    <SearchIconWrapper>
                      <SearchIcon />
                    </SearchIconWrapper>
                    <StyledInputBase
                      placeholder="Search…"
                      inputProps={{ "aria-label": "search" }}
                      onChange={handleSearchChange}
                    />
                  </Search>
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<Add />}
                    sx={{ color: "white", ml: "auto", mr: "70px" }}
                    onClick={handleOpen}
                  >
                    {isMobile ? null : "Upload"}
                  </Button>
                </Grid>
              </>
            )}
          </Grid>
        </Toolbar>
      </AppBar>
      <UploadModels open={modalOpen} handleClose={handleClose} />
    </>
  );
};

export default Navbar;
