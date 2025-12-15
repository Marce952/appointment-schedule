'use client'
import { Button, Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@heroui/react'
import React from 'react'

const NavbarComponent = () => {
  return (
    <Navbar maxWidth="xl" className="bg-transparent absolute top-0">
      <NavbarBrand className="font-bold text-white">Socialand</NavbarBrand>
      <NavbarContent className="hidden md:flex gap-6" justify="center">
        <NavbarItem className="text-white">Home</NavbarItem>
        <NavbarItem className="text-white">Features</NavbarItem>
        <NavbarItem className="text-white">Pricing</NavbarItem>
        <NavbarItem className="text-white">Download</NavbarItem>
        <NavbarItem className="text-white">Contact</NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <Button color="primary" radius="sm">Sign in</Button>
      </NavbarContent>
    </Navbar>
  )
}

export default NavbarComponent