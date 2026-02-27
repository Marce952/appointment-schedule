'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
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
  Pagination,
} from '@heroui/react'
import { Users, Plus, Search, Edit, Trash2 } from 'lucide-react'
import ClientSearch from '@/components/ClientSearch'
import { useSession } from 'next-auth/react'

interface Client {
  id: number
  name: string
  email: string
  phone: string
  businessId: number
  notes?: string
  createdAt: string
}

export default function ClientesPage() {
  const { data: session } = useSession()
  const businessId = session?.user?.businessId

  const [clients, setClients] = useState<Client[]>([])
  const [filteredClients, setFilteredClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalClients, setTotalClients] = useState(0)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure()

  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
  })

  const [editingClient, setEditingClient] = useState<Client | null>(null)

  useEffect(() => {
    loadData(page, searchTerm)
  }, [page, businessId])

  // Debounce search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (businessId) {
        setPage(1) // Reset to first page on search
        loadData(1, searchTerm)
      }
    }, 500)

    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm])

  // Removed client-side filtering since it's now server-side
  /* 
  useEffect(() => {
    if (searchTerm.length > 0) {
      ...
    }
  }, [searchTerm, clients])
  */

  const loadData = async (currentPage = 1, search = '') => {
    if (!businessId) return

    try {
      setLoading(currentPage === 1 && !clients.length) // Only show fullscreen loading on first load

      const clientsRes = await axios.get(`/api/client?businessId=${businessId}&page=${currentPage}&name=${search}`)
      setClients(clientsRes.data.data)
      setFilteredClients(clientsRes.data.data)
      setTotalPages(clientsRes.data.meta.totalPages)
      setTotalClients(clientsRes.data.meta.total)
    } catch (error) {
      console.error('Error cargando datos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateClient = async () => {
    if (!businessId || !newClient.name || !newClient.email || !newClient.phone) {
      alert('Por favor completa todos los campos requeridos')
      return
    }

    try {
      const response = await axios.post('/api/client', {
        ...newClient,
        businessId,
      })

      if (response.status === 201 || response.status === 200) {
        alert('Cliente creado exitosamente')
        onClose()
        setNewClient({ name: '', email: '', phone: '', notes: '' })
        loadData()
      }
    } catch (error: any) {
      alert(error.response?.data?.error || 'Error al crear el cliente')
    }
  }

  const handleEditClient = (client: Client) => {
    setEditingClient(client)
    setNewClient({
      name: client.name,
      email: client.email,
      phone: client.phone,
      notes: client.notes || '',
    })
    onEditOpen()
  }

  const handleUpdateClient = async () => {
    if (!editingClient || !newClient.name || !newClient.email || !newClient.phone) {
      alert('Por favor completa todos los campos requeridos')
      return
    }

    try {
      const response = await axios.patch(`/api/client/${editingClient.id}`, {
        name: newClient.name,
        email: newClient.email,
        phone: newClient.phone,
        notes: newClient.notes,
      })

      if (response.status === 200) {
        alert('Cliente actualizado exitosamente')
        onEditClose()
        setEditingClient(null)
        setNewClient({ name: '', email: '', phone: '', notes: '' })
        loadData()
      }
    } catch (error: any) {
      alert(error.response?.data?.error || 'Error al actualizar el cliente')
    }
  }

  const handleDeleteClient = async (clientId: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      return
    }

    try {
      await axios.delete(`/api/client/${clientId}`)
      alert('Cliente eliminado exitosamente')
      loadData()
    } catch (error: any) {
      alert(error.response?.data?.error || 'Error al eliminar el cliente')
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
            Gestión de Clientes
          </h1>
          <p className="text-gray-600">
            Administra tus clientes y crea nuevos registros
          </p>
        </div>
        <Button
          color="primary"
          startContent={<Plus size={20} />}
          onPress={onOpen}
        >
          Nuevo Cliente
        </Button>
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
            Clientes ({totalClients})
          </h2>
        </CardHeader>
        <CardBody>
          {filteredClients.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                {searchTerm ? 'No se encontraron clientes' : 'No hay clientes registrados aún'}
              </p>
            </div>
          ) : (
            <Table aria-label="Tabla de clientes">
              <TableHeader>
                <TableColumn>NOMBRE</TableColumn>
                <TableColumn>EMAIL</TableColumn>
                <TableColumn>TELÉFONO</TableColumn>
                <TableColumn>NOTAS</TableColumn>
                <TableColumn>FECHA REGISTRO</TableColumn>
                <TableColumn>ACCIONES</TableColumn>
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
                      <p className="text-sm text-gray-500 max-w-xs truncate">
                        {client.notes || '-'}
                      </p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-gray-500">
                        {new Date(client.createdAt).toLocaleDateString('es-ES')}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          color="primary"
                          variant="light"
                          startContent={<Edit size={16} />}
                          onPress={() => handleEditClient(client)}
                        >
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          color="danger"
                          variant="light"
                          startContent={<Trash2 size={16} />}
                          onPress={() => handleDeleteClient(client.id)}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardBody>
        {totalPages > 1 && (
          <div className="flex justify-center p-4 border-t">
            <Pagination
              showControls
              color="primary"
              page={page}
              total={totalPages}
              onChange={(p) => setPage(p)}
            />
          </div>
        )}
      </Card>

      {/* Modal para crear cliente */}
      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Crear Nuevo Cliente
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Nombre completo"
                placeholder="Ej: Juan Pérez"
                value={newClient.name}
                onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                isRequired
                variant="bordered"
              />
              <Input
                label="Email"
                type="email"
                placeholder="Ej: juan@example.com"
                value={newClient.email}
                onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                isRequired
                variant="bordered"
              />
              <Input
                label="Teléfono"
                placeholder="Ej: +34 123 456 789"
                value={newClient.phone}
                onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                isRequired
                variant="bordered"
              />
              <Input
                label="Notas (Opcional)"
                placeholder="Información adicional sobre el cliente"
                value={newClient.notes}
                onChange={(e) => setNewClient({ ...newClient, notes: e.target.value })}
                variant="bordered"
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Cancelar
            </Button>
            <Button color="primary" onPress={handleCreateClient}>
              Crear Cliente
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal para editar cliente */}
      <Modal isOpen={isEditOpen} onClose={onEditClose} size="2xl">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Editar Cliente
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Nombre completo"
                placeholder="Ej: Juan Pérez"
                value={newClient.name}
                onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                isRequired
                variant="bordered"
              />
              <Input
                label="Email"
                type="email"
                placeholder="Ej: juan@example.com"
                value={newClient.email}
                onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                isRequired
                variant="bordered"
              />
              <Input
                label="Teléfono"
                placeholder="Ej: +34 123 456 789"
                value={newClient.phone}
                onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                isRequired
                variant="bordered"
              />
              <Input
                label="Notas (Opcional)"
                placeholder="Información adicional sobre el cliente"
                value={newClient.notes}
                onChange={(e) => setNewClient({ ...newClient, notes: e.target.value })}
                variant="bordered"
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onEditClose}>
              Cancelar
            </Button>
            <Button color="primary" onPress={handleUpdateClient}>
              Actualizar Cliente
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}

