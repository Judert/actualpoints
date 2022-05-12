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
const NextLink = require("next/link").default;
import { useContext } from "react";
import { UserContext } from "../lib/context";

export default function Navbar(props) {
  const theme = useTheme();

  const { photoURL } = useContext(UserContext);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            sx={{ mr: 2, display: { xs: "block", md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "row" }}>
            <NextLink href="/" passHref>
              <Typography variant="h6" noWrap pr={2}>
                Blog
              </Typography>
            </NextLink>

            <Box sx={{ display: { xs: "none", md: "block" } }}>
              <Button
                color="inherit"
                component={Link}
                noLinkStyle
                href="/category"
              >
                Articles
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

          <IconButton component={Link} noLinkStyle href="/admin" sx={{ py: 0 }}>
            <Avatar sx={{ width: 28, height: 28 }} src={photoURL} />
          </IconButton>

          {/* <IconButton onClick={props.colorMode.toggleColorMode} color="inherit">
            {theme.palette.mode === "dark" ? (
              <Brightness7Icon />
            ) : (
              <Brightness4Icon />
            )}
          </IconButton> */}
          <Brightness7Icon sx={{ mx: 1 }} />

          <NextLink href="/search" passHref>
            <IconButton color="inherit">
              <SearchIcon />
            </IconButton>
          </NextLink>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
