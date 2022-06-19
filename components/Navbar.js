import * as React from "react";
import { styled, alpha, useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Avatar from "@mui/material/Avatar";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import Link from "../src/Link";
import { useContext } from "react";
import { UserContext } from "../lib/context";
import { LogoIcon } from "../components/LogoIcon";
import { useRouter } from "next/router";
import Image from "next/image";

export default function Navbar(props) {
  const theme = useTheme();
  const { photoURL } = useContext(UserContext);
  const router = useRouter();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              alignItems: "center",
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClick}
              sx={{ mr: 2, display: { xs: "flex", md: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
              <MenuItem
                onClick={handleClose}
                component={Link}
                noLinkStyle
                href="/category"
              >
                Categories
              </MenuItem>
              <MenuItem
                onClick={handleClose}
                component={Link}
                noLinkStyle
                href="/about"
              >
                About
              </MenuItem>
              <MenuItem
                onClick={handleClose}
                component={Link}
                noLinkStyle
                href="/apply"
              >
                Apply
              </MenuItem>
            </Menu>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                columnGap: 1,
                pr: 2,
              }}
            >
              <Link
                href="/"
                // passHref
                variant="h6"
                noWrap
                color="inherit"
                underline="none"
              >
                Actual Points
              </Link>
              <LogoIcon color="primary.contrastText" />
            </Box>
            <Box sx={{ display: { xs: "none", md: "block" } }}>
              <Button
                color="inherit"
                component={Link}
                noLinkStyle
                href="/category"
              >
                Categories
              </Button>
              <Button
                color="inherit"
                component={Link}
                noLinkStyle
                href="/about"
              >
                About
              </Button>
              <Button
                color="inherit"
                component={Link}
                noLinkStyle
                href="/apply"
              >
                Apply
              </Button>
            </Box>
          </Box>

          {photoURL ? (
            <IconButton
              component={Link}
              noLinkStyle
              href="/admin"
              sx={{ py: 0 }}
            >
              <Avatar sx={{ width: 28, height: 28 }}>
                <Image src={photoURL} alt="Profile" layout="fill" />
              </Avatar>
            </IconButton>
          ) : (
            router.pathname !== "/admin" && (
              <Button
                color="inherit"
                component={Link}
                noLinkStyle
                href="/admin"
              >
                Sign In
              </Button>
            )
          )}

          {/* <IconButton onClick={props.colorMode.toggleColorMode} color="inherit">
            {theme.palette.mode === "dark" ? (
              <Brightness7Icon />
            ) : (
              <Brightness4Icon />
            )}
          </IconButton> */}
          {/* <Brightness7Icon sx={{ mx: 1 }} /> */}

          <IconButton
            // passHref
            href="/search"
            color="inherit"
            component={Link}
            noLinkStyle
          >
            <SearchIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
