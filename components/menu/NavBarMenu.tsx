import * as React from "react";
import { Navbar, Nav, NavItem, NavDropdown, Container, MenuItem } from "react-bootstrap";
import Logo from 'images/logoLight.png';

export interface NavProps { compiler: string; framework: string; }

export class NavBarMenu extends React.Component<NavProps, {}> {
    render(){
        return(
            <Navbar collapseOnSelect expand="lg" bg="light">
            <Container>
                <Navbar.Brand href="#home"><img src={Logo} /></Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                    <Nav.Link href="#features">Features</Nav.Link>
                    <Nav.Link href="#pricing">Pricing</Nav.Link>
                    <NavDropdown title="Dropdown" id="collasible-nav-dropdown">
                        <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                    </NavDropdown>
                    </Nav>
                    <Nav>
                    <Nav.Link href="#deets">More deets</Nav.Link>
                    <Nav.Link eventKey={2} href="#memes">
                        Dank memes
                    </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
            </Navbar>
        )
    }
}