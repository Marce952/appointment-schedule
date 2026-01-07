'use client'
import { Button, Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@heroui/react'
import Link from 'next/link'
import React from 'react'

const NavbarComponent = () => {
  return (
    <Navbar maxWidth="xl" className="bg-transparent absolute top-0">
      <NavbarBrand className="font-bold text-white">DateSoul</NavbarBrand>
      <NavbarContent className="hidden md:flex gap-6" justify="center">
        <NavbarItem className="text-white">Home</NavbarItem>
        <NavbarItem className="text-white">Features</NavbarItem>
        <NavbarItem className="text-white">Pricing</NavbarItem>
        <NavbarItem className="text-white">Download</NavbarItem>
        <NavbarItem className="text-white">Contact</NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end" className="gap-2">
        <Link href="/client/login">
          <Button color="default" variant="flat" radius="sm" className="text-white">
            Mis Tarjetas
          </Button>
        </Link>
        <Link href="/dashboard">
          <Button color="primary" radius="sm">Sign in</Button>
        </Link>
      </NavbarContent>
    </Navbar>
  )
}

export default NavbarComponent