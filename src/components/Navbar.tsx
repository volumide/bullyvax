import * as React from "react"
import { styled, alpha } from "@mui/material/styles"
import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import Toolbar from "@mui/material/Toolbar"
import IconButton from "@mui/material/IconButton"
import InputBase from "@mui/material/InputBase"
import MenuItem from "@mui/material/MenuItem"
import Menu from "@mui/material/Menu"
import MenuIcon from "@mui/icons-material/Menu"
import AccountCircle from "@mui/icons-material/AccountCircle"
import MoreIcon from "@mui/icons-material/MoreVert"
import { Link, NavLink, useHistory } from "react-router-dom"
import Divider from "@mui/material/Divider"
import Drawer from "@mui/material/Drawer"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import { useLocation } from "react-router-dom"
import auth from "../utilities/Auth"
import { Button, Fab, useScrollTrigger, Zoom } from "@mui/material"
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import { setInterval } from "timers"
import Typography from "@mui/material/Typography"

export const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25)
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto"
  }
}))

export const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
}))

export const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch"
    },
    borderRadius: "10px"
  }
}))

const NavBarLink = styled(NavLink)(({ theme }) => ({
  textDecoration: "none",
  marginRight: "3%",
  color: theme.palette.getContrastText(theme.palette.primary.main),
  display: "inline-block"
}))

const MenuLink = styled(NavBarLink)(({ theme }) => ({
  color: theme.palette.secondary.main
}))

export interface NavBarProps {
  children: React.ReactElement
  window?: () => Window
  // history?: any;
}

let drawerWidth = 240

export interface INavLink {
  text: string
  link: string
  auth: boolean
}

function ElevationScroll(props: NavBarProps) {
  const { children, window } = props
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined
  })

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0
  })
}

function ScrollTop(props: NavBarProps) {
  const { children, window } = props
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: 100
  })

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const anchor = ((event.target as HTMLDivElement).ownerDocument || document).querySelector(
      "#back-to-top-anchor"
    )

    if (anchor) {
      anchor.scrollIntoView({
        behavior: "smooth",
        block: "center"
      })
    }
  }

  return (
    <Zoom in={trigger}>
      <Box
        onClick={handleClick}
        role="presentation"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
      >
        {children}
      </Box>
    </Zoom>
  )
}

export default function NavBar(props: NavBarProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState<null | HTMLElement>(null)
  const [navMoreEl, setNavMoreEl] = React.useState<null | HTMLElement>(null)
  const [mobileMenu, setMobileMenu] = React.useState<null | HTMLElement>(null)
  const [logged, setLogged] = React.useState<boolean>(false)
  const { window } = props
  const [mobileOpen, setMobileOpen] = React.useState(false)

  const isMenuOpen = Boolean(anchorEl)
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl)
  const isMoreMenuOpen = Boolean(navMoreEl)
  const isMobileGenMenuOpen = Boolean(mobileMenu)

  const handleGenMenuClose = () => {
    setMobileMenu(null)
  }

  const mobileGenMenuId = "menu"

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    handleMobileMenuClose()
  }

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget)
  }

  const handleMoreMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNavMoreEl(event.currentTarget)
  }

  const handleMoreMenuClose = () => {
    setNavMoreEl(null)
  }

  const handleGenMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenu(event?.currentTarget)
  }

  let history = useHistory()

  const menuId = "primary-search-account-menu"
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right"
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right"
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem
        onClick={() =>
          auth.logout(() => {
            localStorage.removeItem("app_id")
            localStorage.removeItem("user_id")
            history.push("/")
            handleMenuClose()
          })
        }
      >
        Logout
      </MenuItem>
    </Menu>
  )

  const mobileMenuId = "primary-search-account-menu-mobile"
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right"
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right"
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem
        onClick={() =>
          auth.logout(() => {
            localStorage.removeItem("app_id")
            localStorage.removeItem("user_id")
            history.push("/")
            handleMenuClose()
          })
        }
      >
        Logout
      </MenuItem>
      {/* <MenuItem onClick={handleProfileMenuOpen}>
				<IconButton
					size="large"
					aria-label="account of current user"
					aria-controls="primary-search-account-menu"
					aria-haspopup="true"
					color="inherit"
				>
					<AccountCircle />
				</IconButton>
				<p>Profile</p>
			</MenuItem> */}
    </Menu>
  )

  const { children } = props
  const location = useLocation()
  !location.pathname.includes("dashboard") ? (drawerWidth = 0) : (drawerWidth = 240)

  const DrawerLinks: INavLink[] = [
    { text: "Submit Report", link: "forms", auth: auth.confirmAdminAuth() || auth.confirmAuth() },
    { text: "Manage Content", link: "admin", auth: auth.confirmAdminAuth() },
    { text: "Manage Users", link: "users", auth: auth.confirmAdminAuth() },
    { text: "Manage Sponsorships", link: "sponsorships", auth: auth.confirmAdminAuth() },
    { text: "Manage Reports", link: "reports", auth: auth.confirmAdminAuth() }
  ].filter((link) => link.auth)

  const TopNavLinks: INavLink[] = [
    { text: "HOME", link: "", auth: true },
    { text: "SPONSOR A SCHOOL", link: "/sponsors/create", auth: true },
    { text: "MESSAGE TO MOMS", link: "/moms", auth: true },
    // { text: "YOUR BULLYING EXPERIENCE", link: "/experience", auth: true },
    { text: "YOU CAN HELP", link: "/you-can-help", auth: true },
    { text: "SCHOOL SHOOTER", link: "/school-shooter", auth: true },
    { text: "REQUEST REPORT", link: "/request/report/form", auth: true },
    { text: "VIDEO", link: "/videos", auth: true }
  ].filter((link) => link.auth)

  const TopNavMoreLinks: INavLink[] = [
    { text: "SCHOOL ADMINISTRATORS", link: "/administrators", auth: true },
    { text: "ASIAN AMERICAN STUDENTS", link: "/asian-american-students", auth: true },
    { text: "BULLY-FREE SCHOOL", link: "/bully-free", auth: true },
    { text: "REQUEST BULLY REPORTS", link: "/request-report", auth: true },
    // { text: "MESSAGE TO MOMS", link: "/moms", auth: true },
    // { text: "MESSAGE TO BULLIES", link: "/bullies", auth: true },
    { text: "BULLYVAXX DISCIPLINE POLICY", link: "/bully-policy", auth: true },
    { text: "ABOUT US", link: "/about", auth: true },
    { text: "CONTACT US", link: "/contact", auth: true },
    { text: "FAQs", link: "/faq", auth: true }
  ].filter((link) => link.auth)

  const renderGeneralMenu = (
    <Menu
      anchorEl={mobileMenu}
      anchorOrigin={{
        vertical: "top",
        horizontal: "left"
      }}
      id={mobileGenMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right"
      }}
      open={isMobileGenMenuOpen}
      onClose={handleGenMenuClose}
    >
      {TopNavLinks.map((link, index: number) => (
        <MenuItem onClick={handleGenMenuClose}>
          <NavLink
            activeStyle={{ borderBottom: "solid #F44336 5px" }}
            style={{ textDecoration: "none", color: "#000" }}
            exact={true}
            key={index}
            to={link.link}
          >
            {link.text}
          </NavLink>
        </MenuItem>
      ))}
      <MenuItem>
        <NavLink
          onClick={handleMoreMenuOpen}
          to="#"
          activeStyle={{ background: "transparent" }}
          style={{ textDecoration: "none", color: "#000" }}
        >
          MORE
        </NavLink>
      </MenuItem>
    </Menu>
  )

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {DrawerLinks.map((text: INavLink, index) => (
          <ListItem style={{ paddingLeft: 0, paddingRight: 0 }} button key={index}>
            <MenuLink
              style={{ width: "100%" }}
              exact={true}
              activeStyle={{
                width: "100%",
                padding: "inherit",
                margin: 0,
                background: "#F44336",
                color: "#fff"
              }}
              to={`/dashboard/${text.link}`}
            >
              <ListItemText style={{ width: "100%" }} primary={text.text} />
            </MenuLink>
          </ListItem>
        ))}
      </List>
    </div>
  )

  const container = window !== undefined ? () => window().document.body : undefined
  React.useEffect(() => {
    setInterval(() => {
      if (localStorage.getItem("app_id")) setLogged(true)
      else setLogged(false)
    }, 500)
  }, [])

  return (
    <React.Fragment>
      <ElevationScroll {...props}>
        {/* <CssBaseline /> */}
        <AppBar
          position="sticky"
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` }
          }}
          color="secondary"
          elevation={0}
        >
          <Toolbar id="back-to-top-anchor">
            <Box sx={{ mr: 2, display: { xs: "block", sm: "block" } }}>
              <Link to="/">
                <img
                  style={{ width: "70px", marginLeft: "auto", marginRight: "auto" }}
                  alt="logo"
                  src={"logo.png"}
                />
              </Link>
            </Box>
            {logged ? (
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { sm: "none" } }}
              >
                <MenuIcon />
              </IconButton>
            ) : null}
            <Box sx={{ display: { xs: "block", sm: "none" }, mr: 2 }}>
              <Typography
                // variant="p"
                noWrap
                // edge="end"
                component="div"
                onClick={handleGenMenuOpen}
                aria-controls={mobileGenMenuId}
                aria-haspopup="true"
              >
                MENU
              </Typography>
            </Box>

            <Box sx={{ display: { xs: "none", sm: "none", md: "block", width: "100%" } }}>
              {TopNavLinks.map((link, index: number) => (
                <NavBarLink
                  activeStyle={{ borderBottom: "solid #F44336 5px" }}
                  exact={true}
                  key={index}
                  to={link.link}
                >
                  {link.text}
                </NavBarLink>
              ))}

              <NavBarLink
                onClick={handleMoreMenuOpen}
                to="#"
                activeStyle={{ background: "transparent" }}
              >
                MORE <KeyboardArrowDownIcon style={{ position: "absolute" }} />
              </NavBarLink>
              <Menu
                id="menu-appbar"
                anchorEl={navMoreEl}
                // getContentAnchorEl={null}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "bottom", horizontal: "right" }}
                open={isMoreMenuOpen}
                onClose={handleMoreMenuClose}
                keepMounted
              >
                {TopNavMoreLinks.map((link, index) => (
                  <MenuItem style={{ width: "100%" }} key={index} onClick={handleMoreMenuClose}>
                    <MenuLink
                      activeStyle={{ background: "transparent" }}
                      style={{ color: "#000", width: "100%" }}
                      to={link?.link}
                    >
                      {link?.text}
                    </MenuLink>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            {!auth.confirmAuth() && !auth.confirmAdminAuth() && (
              <Box sx={{ display: { xs: "block", sm: "block", md: "block" }, width: "150px" }}>
                <NavLink
                  activeStyle={{ background: "transparent" }}
                  style={{ textDecoration: "none" }}
                  exact={true}
                  to="/login"
                >
                  <Button variant="outlined" style={{ width: "100%" }}>
                    SIGN IN
                  </Button>
                </NavLink>
              </Box>
            )}
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              {auth.confirmAuth() ||
                (auth.confirmAdminAuth() && (
                  <IconButton
                    size="large"
                    edge="end"
                    aria-label="account of current user"
                    aria-controls={menuId}
                    aria-haspopup="true"
                    onClick={handleProfileMenuOpen}
                    color="inherit"
                  >
                    <AccountCircle />
                  </IconButton>
                ))}
            </Box>
            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              {auth.confirmAuth() ||
                (auth.confirmAdminAuth() && (
                  <IconButton
                    size="large"
                    aria-label="show more"
                    aria-controls={mobileMenuId}
                    aria-haspopup="true"
                    onClick={handleMobileMenuOpen}
                    color="inherit"
                  >
                    <MoreIcon />
                  </IconButton>
                ))}
            </Box>
          </Toolbar>
        </AppBar>
      </ElevationScroll>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth }
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth }
          }}
          open
          variant="permanent"
          // anchor="left"
        >
          {drawer}
        </Drawer>
      </Box>
      {renderMobileMenu}
      {renderMenu}
      {renderGeneralMenu}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          marginLeft: { sm: `${drawerWidth}px` }
        }}
      >
        {children}
      </Box>
      <ScrollTop {...props}>
        <Fab color="secondary" size="small" aria-label="scroll back to top">
          <KeyboardArrowUpIcon />
        </Fab>
      </ScrollTop>
    </React.Fragment>
  )
}
