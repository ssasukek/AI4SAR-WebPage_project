"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Navbar,
  NavbarToggler,
  Collapse,
  NavItem,
  NavLink,
  NavbarBrand,
  Nav,
  Button,
  Tooltip
} from "reactstrap";
import { useAuth } from "../../contexts/AuthContext";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { signOut, currentUser } = useAuth();
  const navigate = useRouter();

  const handleSignOut = () => {
    signOut();
    setIsOpen(false); // Close the navbar when signing out
    navigate.push("/");
  };

  const [tooltipOpen, setTooltipOpen] = useState(false);
  const toggle = () => setTooltipOpen(!tooltipOpen);

  return (
    <div>
      <Navbar
        style={{ background: "#00563A", zIndex: 100 }}
        background="00563A"
        container="sm"
        dark
        fixed="top"
        light
      >
        <NavbarBrand style={{ color: "white" }} href="/incidents">
          IntelliSAR
        </NavbarBrand>
        <NavbarBrand style={{ color: "white" }}>
          Hello,{" "}
          <span
            id="Tooltip"
            style={{
              textDecoration: "underline",
            }}
          >
            {currentUser && currentUser.displayName ? currentUser.displayName : "User"}
          </span>
        </NavbarBrand>
        <Tooltip isOpen={tooltipOpen} target="Tooltip" toggle={toggle}>
          {currentUser && currentUser.email ? currentUser.email : "Signed Out"}
        </Tooltip>
        <NavbarToggler onClick={() => setIsOpen(!isOpen)} />
        <Collapse navbar isOpen={isOpen}>
          <Nav className="me-auto" navbar>
            <NavItem>
              <NavLink href="https://github.com/iSearch-CalPoly/frontend">
                GitHub
              </NavLink>
            </NavItem>
            {currentUser && <Button onClick={() => handleSignOut()}>Sign Out</Button>}
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
};
export default Header;
