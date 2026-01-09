'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
} from '@heroui/react'
import { Users, Search } from 'lucide-react'

interface Client {
  id: number
  name: string
  email: string
  phone: string
  createdAt: string
}

export default function ClientesPage() {
  const { data: session } = useSession()
  const [clients, setClients] = useState<Client[]>([])
  const [filteredClients, setFilteredClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [businessId, setBusinessId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    // Cargar datos cuando la sesión esté disponible
    if (session?.user?.businessId) {
      loadData()
    }
  }, [session])

  useEffect(() => {
    if (searchTerm.length > 0) {
      const filtered = clients.filter(
        (client) =>
          client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.phone.includes(searchTerm)
      )
      setFilteredClients(filtered)
    } else {
      setFilteredClients(clients)
    }
  }, [searchTerm, clients])

  const loadData = async () => {
    try {
      // Obtener businessId de la sesión del usuario
      const bid = session?.user?.businessId
      
      if (!bid) {
        console.error('No se encontró businessId en la sesión')
        setLoading(false)
        return
      }

      setBusinessId(bid)

      // Cargar clientes que tienen tarjetas en este negocio
      const cardsRes = await axios.get(`/api/loyalty-card?businessId=${bid}`)
      const uniqueClients = Array.from(
        new Map(
          cardsRes.data.map((card: any) => [card.client.id, card.client])
        ).values()
      )
      setClients(uniqueClients)
      setFilteredClients(uniqueClients)
    } catch (error) {
      console.error('Error cargando datos:', error)
    } finally {
      setLoading(false)
    }
  }


  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">
            Clientes con Tarjetas
          </h1>
          <p className="text-gray-600">
            Lista de clientes que tienen tarjetas de fidelización en tu negocio
          </p>
        </div>
      </div>

      {/* Búsqueda */}
      <Card>
        <CardBody>
          <div className="flex gap-4">
            <Input
              placeholder="Buscar por nombre, email o teléfono..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              startContent={<Search size={18} className="text-gray-400" />}
              className="flex-1"
              variant="bordered"
            />
            {searchTerm && (
              <Button
                variant="light"
                onPress={() => setSearchTerm('')}
              >
                Limpiar
              </Button>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Lista de Clientes */}
      <Card>
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            Clientes ({filteredClients.length})
          </h2>
        </CardHeader>
        <CardBody>
          {filteredClients.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                {searchTerm ? 'No se encontraron clientes' : 'No hay clientes con tarjetas aún'}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Asigna tarjetas desde la sección "Tarjetas de Fidelización"
              </p>
            </div>
          ) : (
            <Table aria-label="Tabla de clientes">
              <TableHeader>
                <TableColumn>NOMBRE</TableColumn>
                <TableColumn>EMAIL</TableColumn>
                <TableColumn>TELÉFONO</TableColumn>
              <TableColumn>FECHA REGISTRO</TableColumn>
              <TableColumn>INFO</TableColumn>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>
                      <p className="font-medium">{client.name}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{client.email}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{client.phone}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-gray-500">
                        {new Date(client.createdAt).toLocaleDateString('es-ES')}
                      </p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-gray-500">Solo lectura</p>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardBody>
      </Card>

    </div>
  )
}

