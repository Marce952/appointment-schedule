'use client'
import React, { useState, useEffect, useRef } from 'react'
import { Input, Button } from '@heroui/react'
import { Search, X } from 'lucide-react'
import axios from 'axios'

interface Client {
  id: number
  name: string
  email: string
  phone: string
}

interface ClientSearchProps {
  businessId: number | null
  selectedClient: Client | null
  onSelectClient: (client: Client | null) => void
  placeholder?: string
  isRequired?: boolean
}

export default function ClientSearch({
  businessId,
  selectedClient,
  onSelectClient,
  placeholder = "Buscar cliente por nombre, email o teléfono...",
  isRequired = false,
}: ClientSearchProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [clients, setClients] = useState<Client[]>([])
  const [filteredClients, setFilteredClients] = useState<Client[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (businessId) {
      loadClients()
    }
  }, [businessId])

  useEffect(() => {
    if (selectedClient) {
      setSearchTerm(`${selectedClient.name} - ${selectedClient.email}`)
    } else {
      setSearchTerm('')
    }
  }, [selectedClient])

  useEffect(() => {
    if (searchTerm.length > 0) {
      const filtered = clients.filter(
        (client) =>
          client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.phone.includes(searchTerm)
      )
      setFilteredClients(filtered)
      setIsOpen(filtered.length > 0)
    } else {
      setFilteredClients([])
      setIsOpen(false)
    }
  }, [searchTerm, clients])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const loadClients = async () => {
    if (!businessId) return
    setLoading(true)
    try {
      const response = await axios.get(`/api/client?businessId=${businessId}`)
      setClients(response.data)
    } catch (error) {
      console.error('Error cargando clientes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelect = (client: Client) => {
    onSelectClient(client)
    setIsOpen(false)
    setSearchTerm(`${client.name} - ${client.email}`)
  }

  const handleClear = () => {
    onSelectClient(null)
    setSearchTerm('')
    setIsOpen(false)
  }

  return (
    <div className="relative w-full" ref={searchRef}>
      <Input
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value)
          if (selectedClient && e.target.value !== `${selectedClient.name} - ${selectedClient.email}`) {
            onSelectClient(null)
          }
        }}
        onFocus={() => {
          if (searchTerm.length > 0 && filteredClients.length > 0) {
            setIsOpen(true)
          }
        }}
        placeholder={placeholder}
        isRequired={isRequired}
        variant="bordered"
        startContent={<Search size={18} className="text-gray-400" />}
        endContent={
          selectedClient && (
            <button
              onClick={handleClear}
              className="focus:outline-none hover:bg-gray-100 rounded-full p-1"
            >
              <X size={16} className="text-gray-400" />
            </button>
          )
        }
      />
      {isOpen && filteredClients.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          {filteredClients.map((client) => (
            <button
              key={client.id}
              onClick={() => handleSelect(client)}
              className="w-full text-left px-4 py-3 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none border-b border-gray-100 last:border-b-0"
            >
              <div className="font-medium text-gray-900">{client.name}</div>
              <div className="text-sm text-gray-500">{client.email}</div>
              <div className="text-xs text-gray-400">{client.phone}</div>
            </button>
          ))}
        </div>
      )}
      {isOpen && searchTerm.length > 0 && filteredClients.length === 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center text-gray-500">
          No se encontraron clientes
        </div>
      )}
    </div>
  )
}

