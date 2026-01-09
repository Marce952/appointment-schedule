'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { Card, CardBody, CardHeader, Button, Input, Select, SelectItem, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Chip, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@heroui/react'
import { Gift, Plus, CheckCircle, XCircle, Clock } from 'lucide-react'


interface Service {
  id: number
  name: string
}

interface Client {
  id: number
  name: string
  email: string
  phone: string
}

interface LoyaltyCard {
  id: number
  name: string | null
  visitsCompleted: number
  visitsRequired: number
  isRedeemed: boolean
  isActive: boolean
  client: Client
  service: Service | null
  createdAt: string
}

export default function TarjetasFidelizacionPage() {
  const { data: session } = useSession()
  const [cards, setCards] = useState<LoyaltyCard[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [businessId, setBusinessId] = useState<number | null>(null)
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [newCard, setNewCard] = useState({
    email: '',
    phone: '',
    name: '',
    serviceId: '',
    cardName: '',
    visitsRequired: '5',
  })

  useEffect(() => {
    // Cargar datos cuando la sesión esté disponible
    if (session?.user?.businessId) {
      loadData()
    }
  }, [session])

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

      // Cargar tarjetas
      const cardsRes = await axios.get(`/api/loyalty-card?businessId=${bid}`)
      setCards(cardsRes.data)

      // Cargar servicios
      const servicesRes = await axios.get(`/api/service/${bid}`)
      setServices(servicesRes.data)
    } catch (error) {
      console.error('Error cargando datos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCard = async () => {
    if (!businessId || !newCard.visitsRequired) {
      alert('Por favor completa todos los campos requeridos')
      return
    }

    if (!newCard.email && !newCard.phone) {
      alert('Debes proporcionar el email o teléfono del cliente')
      return
    }

    if (!newCard.name) {
      alert('Debes proporcionar el nombre del cliente')
      return
    }

    try {
      const response = await axios.post('/api/loyalty-card/assign', {
        businessId,
        email: newCard.email || undefined,
        phone: newCard.phone || undefined,
        name: newCard.name,
        serviceId: newCard.serviceId ? parseInt(newCard.serviceId) : null,
        cardName: newCard.cardName || undefined,
        visitsRequired: parseInt(newCard.visitsRequired),
      })

      if (response.status === 201) {
        alert('Tarjeta creada exitosamente')
        onClose()
        setNewCard({ email: '', phone: '', name: '', serviceId: '', cardName: '', visitsRequired: '5' })
        loadData()
      }
    } catch (error: any) {
      alert(error.response?.data?.error || 'Error al crear la tarjeta')
    }
  }

  const handleRedeemCard = async (cardId: number) => {
    try {
      await axios.patch(`/api/loyalty-card/${cardId}`, {
        isRedeemed: true,
      })
      alert('Tarjeta marcada como canjeada')
      loadData()
    } catch (error) {
      alert('Error al actualizar la tarjeta')
    }
  }

  const handleToggleActive = async (cardId: number, isActive: boolean) => {
    try {
      await axios.patch(`/api/loyalty-card/${cardId}`, {
        isActive: !isActive,
      })
      loadData()
    } catch (error) {
      alert('Error al actualizar la tarjeta')
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
            Tarjetas de Fidelización
          </h1>
          <p className="text-gray-600">
            Gestiona las tarjetas de fidelización de tus clientes
          </p>
        </div>
        <Button
          color="primary"
          startContent={<Plus size={20} />}
          onPress={onOpen}
        >
          Crear Tarjeta
        </Button>
      </div>

      {/* Lista de Tarjetas */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Todas las Tarjetas</h2>
        </CardHeader>
        <CardBody>
          {cards.length === 0 ? (
            <div className="text-center py-8">
              <Gift className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No hay tarjetas creadas aún</p>
            </div>
          ) : (
            <Table aria-label="Tabla de tarjetas de fidelización">
              <TableHeader>
                <TableColumn>CLIENTE</TableColumn>
                <TableColumn>SERVICIO</TableColumn>
                <TableColumn>PROGRESO</TableColumn>
                <TableColumn>ESTADO</TableColumn>
                <TableColumn>ACCIONES</TableColumn>
              </TableHeader>
              <TableBody>
                {cards.map((card) => {
                  const progress = (card.visitsCompleted / card.visitsRequired) * 100
                  const isReady = card.visitsCompleted >= card.visitsRequired && !card.isRedeemed

                  return (
                    <TableRow key={card.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{card.client.name}</p>
                          <p className="text-sm text-gray-500">{card.client.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {card.service ? card.service.name : 'Todos los servicios'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex-1">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  isReady ? 'bg-green-500' : 'bg-blue-500'
                                }`}
                                style={{ width: `${Math.min(progress, 100)}%` }}
                              />
                            </div>
                          </div>
                          <span className="text-sm font-medium w-16 text-right">
                            {card.visitsCompleted}/{card.visitsRequired}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Chip
                            color={card.isActive ? 'success' : 'danger'}
                            size="sm"
                            variant="flat"
                          >
                            {card.isActive ? 'Activa' : 'Inactiva'}
                          </Chip>
                          {card.isRedeemed && (
                            <Chip color="default" size="sm" variant="flat">
                              Canjeada
                            </Chip>
                          )}
                          {isReady && (
                            <Chip color="warning" size="sm" variant="flat">
                              Lista para canjear
                            </Chip>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {isReady && !card.isRedeemed && (
                            <Button
                              size="sm"
                              color="success"
                              variant="flat"
                              onPress={() => handleRedeemCard(card.id)}
                            >
                              Marcar como Canjeada
                            </Button>
                          )}
                          <Button
                            size="sm"
                            color={card.isActive ? 'danger' : 'success'}
                            variant="light"
                            onPress={() => handleToggleActive(card.id, card.isActive)}
                          >
                            {card.isActive ? 'Desactivar' : 'Activar'}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardBody>
      </Card>

      {/* Modal para crear tarjeta */}
      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Crear Nueva Tarjeta de Fidelización
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 text-blue-800 rounded text-sm">
                <p className="font-medium mb-1">Buscar cliente por email o teléfono</p>
                <p>Si el cliente no existe, se creará automáticamente.</p>
              </div>
              
              <Input
                label="Email del Cliente"
                type="email"
                placeholder="cliente@ejemplo.com"
                value={newCard.email}
                onChange={(e) => setNewCard({ ...newCard, email: e.target.value })}
                variant="bordered"
                description="O usa el teléfono si no tienes el email"
              />
              
              <div className="text-center text-gray-500">o</div>
              
              <Input
                label="Teléfono del Cliente"
                placeholder="+34 123 456 789"
                value={newCard.phone}
                onChange={(e) => setNewCard({ ...newCard, phone: e.target.value })}
                variant="bordered"
                description="O usa el email si no tienes el teléfono"
              />
              
              <Input
                label="Nombre del Cliente"
                placeholder="Nombre completo"
                value={newCard.name}
                onChange={(e) => setNewCard({ ...newCard, name: e.target.value })}
                isRequired
                variant="bordered"
                description="Requerido si el cliente no existe"
              />

              <Select
                label="Servicio (Opcional)"
                placeholder="Deja vacío para todos los servicios"
                selectedKeys={newCard.serviceId ? [newCard.serviceId] : []}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0] as string
                  setNewCard({ ...newCard, serviceId: selected === 'all' ? '' : selected || '' })
                }}
                items={[
                  { key: 'all', label: 'Todos los servicios' },
                  ...services.map((s) => ({ key: s.id.toString(), label: s.name }))
                ]}
              >
                {(item) => (
                  <SelectItem key={item.key}>
                    {item.label}
                  </SelectItem>
                )}
              </Select>

              <Input
                label="Nombre de la tarjeta (Opcional)"
                placeholder="Ej: Tarjeta de Fidelización - Corte de Pelo"
                value={newCard.cardName}
                onChange={(e) => setNewCard({ ...newCard, cardName: e.target.value })}
              />

              <Input
                label="Visitas requeridas"
                type="number"
                value={newCard.visitsRequired}
                onChange={(e) => setNewCard({ ...newCard, visitsRequired: e.target.value })}
                isRequired
                description="Número de visitas necesarias para obtener el premio"
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Cancelar
            </Button>
            <Button color="primary" onPress={handleCreateCard}>
              Crear Tarjeta
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}


