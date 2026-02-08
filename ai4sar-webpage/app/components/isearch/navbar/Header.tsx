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

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

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
        <NavbarBrand style={{ color: "white" }} href="/private/incidents">
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
          </span>
        </NavbarBrand>
        <NavbarToggler onClick={() => setIsOpen(!isOpen)} />
        <Collapse navbar isOpen={isOpen}>
          <Nav className="me-auto" navbar>
            <NavItem>
              <NavLink href="https://github.com/iSearch-CalPoly/frontend">
                GitHub
              </NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
};
export default Header;
