import * as React from "react";
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from "react-bootstrap";

export interface IHelloProps { compiler: string; framework: string; }

// 'helloProps' describes the shape of props.
// state is never set so we use the '{}' type.
export class Hello extends React.Component<IHelloProps, {}> {
    render() {
        return(
        <div>
            <Navbar inverse>
            <Navbar.Header>
                <Navbar.Brand>  
                <a href="#brand">React-Bootstrap</a>
                </Navbar.Brand>
                <Navbar.Toggle />
            </Navbar.Header>
            <Navbar.Collapse>
                <Nav>
                <NavItem eventKey={1} href="#">
                    Link
                </NavItem>
                <NavItem eventKey={2} href="#">
                    Link
                </NavItem>
                <NavDropdown eventKey={3} title="Dropdown" id="basic-nav-dropdown">
                    <MenuItem eventKey={3.1}>Action</MenuItem>
                    <MenuItem eventKey={3.2}>Another action</MenuItem>
                    <MenuItem eventKey={3.3}>Something else here</MenuItem>
                    <MenuItem divider />
                    <MenuItem eventKey={3.3}>Separated link</MenuItem>
                </NavDropdown>
                </Nav>
                <Nav pullRight>
                <NavItem eventKey={1} href="#">
                    Link Right
                </NavItem>
                <NavItem eventKey={2} href="#">
                    Link Right
                </NavItem>
                </Nav>
            </Navbar.Collapse>
            </Navbar>                                                                                                                                                          
        </div>
    )
};