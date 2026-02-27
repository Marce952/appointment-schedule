'use client';
import React, { useState, useMemo, useEffect } from 'react';
import {
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
  Button, useDisclosure, Tabs, Tab, Card, Chip, Divider,
  Select, SelectItem, Input, Textarea, Autocomplete, AutocompleteItem
} from "@heroui/react"; // Asumiendo NextUI por tu sintaxis, adaptable a Lucide/Tailwind
import { Check, X, Calendar, MessageSquare, PawPrint, User, Plus } from "lucide-react";
import axios from 'axios';
import { useSession } from 'next-auth/react';

interface Appointment {
  id: string;
  date: string;
  note: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  client: { name: string };
  pet: { name: string };
}

export default function AppointmentManager() {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { isOpen: isNewOpen, onOpen: onNewOpen, onOpenChange: onNewOpenChange, onClose: onNewClose } = useDisclosure();

  const { data: session, status } = useSession()
  // Ahora businessId dejará de ser undefined y no habrá error de Provider
  const businessId = session?.user?.businessId

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);
  const [loadingData, setLoadingData] = useState(false);
  const [clients, setClients] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    clientId: "",
    serviceId: "",
    date: "",
    note: ""
  });

  // Filtros inteligentes por estado
  const appointmentsByStatus = useMemo(() => {
    return {
      PENDING: appointments.filter(a => a.status === 'PENDING'),
      CONFIRMED: appointments.filter(a => a.status === 'CONFIRMED'),
      CANCELLED: appointments.filter(a => a.status === 'CANCELLED'),
    };
  }, [appointments]);

  const fetchAppointment = async () => {
    if (!businessId) return;

    setLoadingData(true);
    try {
      const res = await axios.get(`/api/appointment/business/${businessId}`);
      // Validación de seguridad:
      setAppointments(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error en la petición:", error);
    } finally {
      setLoadingData(false);
    }
  };

  const fetchDependencies = async () => {
    if (!businessId) return;
    try {
      const [clientsRes, servicesRes] = await Promise.all([
        axios.get(`/api/client?businessId=${businessId}&limit=1000`).catch(() => ({ data: { data: [] } })),
        axios.get(`/api/service/${businessId}`).catch(() => ({ data: [] }))
      ]);
      setClients(Array.isArray(clientsRes.data.data) ? clientsRes.data.data : []);
      setServices(Array.isArray(servicesRes.data) ? servicesRes.data : []);
    } catch (error) {
      console.error("Error fetching dependencies:", error);
    }
  };

  useEffect(() => {
    if (businessId) {
      fetchAppointment();
      fetchDependencies();
    }
  }, [businessId]);

  const handleSubmitNewTurno = async () => {
    try {
      if (!formData.clientId || !formData.serviceId || !formData.date) {
        alert("Por favor complete los campos obligatorios");
        return;
      }

      await axios.post('/api/appointment', {
        ...formData,
        businessId,
        clientId: parseInt(formData.clientId),
        serviceId: parseInt(formData.serviceId),
        date: new Date(formData.date).toISOString(),
      });
      onNewClose();
      // Reset form
      setFormData({ clientId: "", serviceId: "", date: "", note: "" });
      fetchAppointment();
    } catch (error) {
      console.error("Error creating appointment:", error);
      alert("Ocurrio un error al crear el turno");
    }
  };

  const updateStatus = async (id: string, newStatus: Appointment['status']) => {
    try {
      // Update optimista en UI
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
      await axios.patch(`/api/appointment/${id}`, { status: newStatus });
      onClose();
    } catch (error) {
      console.error("Error updating status", error);
      // Aquí podrías revertir el cambio si la API falla
    }
  };

  const AppointmentCard = ({ item }: { item: Appointment }) => (
    <Card
      as="div"
      isPressable
      onPress={() => {
        setSelectedAppt(item);
        onOpen();
      }}
      className="min-w-xl mb-3 p-4 border-none bg-background/60 dark:bg-default-100/50 backdrop-blur-lg shadow-sm hover:shadow-md transition-all"
    >
      <div className="flex justify-between items-center w-full">
        <div className="flex gap-4 items-center">
          <div className="bg-primary/10 p-3 rounded-full text-primary">
            <PawPrint size={20} />
          </div>
          <div className="flex flex-col items-start text-left">
            <h4 className="font-bold text-large flex items-center gap-2">
              {item.client?.name}
              {item.pet?.name && (
                <span className="text-default-400 text-small font-normal">
                  con {item.pet.name}
                </span>
              )}
            </h4>
            <div className="flex items-center gap-2 text-default-500">
              <Calendar size={14} />
              <span className="text-small">{new Date(item.date).toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 items-center" onClick={(e) => e.stopPropagation()} onPointerDown={(e) => e.stopPropagation()}>
          {item.status === 'PENDING' && (
            <div className="flex gap-2">
              <Button
                isIconOnly
                radius="full"
                size="sm"
                color="success"
                variant="flat"
                onPress={() => updateStatus(item.id, 'CONFIRMED')}
              >
                <Check size={18} />
              </Button>
              <Button
                isIconOnly
                radius="full"
                size="sm"
                color="danger"
                variant="flat"
                onPress={() => updateStatus(item.id, 'CANCELLED')}
              >
                <X size={18} />
              </Button>
            </div>
          )}
          <Chip variant="dot" color={item.status === 'CONFIRMED' ? "success" : item.status === 'PENDING' ? "warning" : "danger"}>
            {item.status}
          </Chip>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">
            Gestion de turnos
          </h1>
          <p className="text-gray-600">
            Administra tus turnos y crea nuevos registros
          </p>
        </div>
        <Button
          color="primary"
          startContent={<Plus size={20} />}
          onPress={onNewOpen}
        >
          Nuevo Turno
        </Button>
      </div>

      <Tabs
        aria-label="Options"
        color="primary"
        variant="underlined"
        classNames={{ tabList: "gap-6", cursor: "w-full bg-primary", tab: "max-w-fit px-0 h-12" }}
      >
        <Tab key="pending" title={<div className="flex items-center space-x-2"><span>Pendientes</span><Chip size="sm" variant="flat" color="warning">{appointmentsByStatus.PENDING.length}</Chip></div>}>
          <div className="mt-4">{appointmentsByStatus.PENDING.map(item => <AppointmentCard key={item.id} item={item} />)}</div>
        </Tab>
        <Tab key="confirmed" title="Confirmados">
          <div className="mt-4">{appointmentsByStatus.CONFIRMED.map(item => <AppointmentCard key={item.id} item={item} />)}</div>
        </Tab>
        <Tab key="cancelled" title="Cancelados">
          <div className="mt-4 text-opacity-50">{appointmentsByStatus.CANCELLED.map(item => <AppointmentCard key={item.id} item={item} />)}</div>
        </Tab>
      </Tabs>

      {/* Modal Inteligente */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur" placement="center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1"> Detalle del Turno </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <section className="flex items-center gap-3 bg-default-50 p-3 rounded-xl">
                    <User className="text-primary" />
                    <div>
                      <p className="text-tiny uppercase font-bold text-default-400">Cliente / Mascota</p>
                      <p className="text-md">{selectedAppt?.client?.name} & {selectedAppt?.pet?.name}</p>
                    </div>
                  </section>

                  <section className="flex items-center gap-3 bg-default-50 p-3 rounded-xl">
                    <Calendar className="text-primary" />
                    <div>
                      <p className="text-tiny uppercase font-bold text-default-400">Fecha y Hora</p>
                      <p className="text-md">{selectedAppt ? new Date(selectedAppt.date).toLocaleString() : ''}</p>
                    </div>
                  </section>

                  <Divider />

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare size={16} className="text-default-400" />
                      <p className="text-sm font-semibold">Nota del cliente:</p>
                    </div>
                    <p className="text-sm text-default-600 italic bg-default-100 p-4 rounded-lg">
                      "{selectedAppt?.note || 'El cliente no dejó notas adicionales.'}"
                    </p>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>Cerrar</Button>
                {selectedAppt?.status === 'PENDING' && (
                  <div className="flex gap-2">
                    <Button color="danger" variant="flat" onPress={() => updateStatus(selectedAppt.id, 'CANCELLED')}>Rechazar</Button>
                    <Button color="primary" onPress={() => updateStatus(selectedAppt.id, 'CONFIRMED')}>Confirmar Turno</Button>
                  </div>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Modal Nuevo Turno */}
      <Modal isOpen={isNewOpen} onOpenChange={onNewOpenChange} backdrop="blur" placement="center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1"> Crear Nuevo Turno </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <Autocomplete
                    label="Cliente"
                    placeholder="Busca un cliente por nombre"
                    defaultItems={clients}
                    selectedKey={formData.clientId}
                    onSelectionChange={(key) => setFormData({ ...formData, clientId: key as string })}
                  >
                    {(client) => (
                      <AutocompleteItem key={client.id} textValue={client.name}>
                        <div className="flex flex-col">
                          <span className="text-small">{client.name}</span>
                          <span className="text-tiny text-default-400">{client.phone}</span>
                        </div>
                      </AutocompleteItem>
                    )}
                  </Autocomplete>

                  <Select
                    label="Servicio"
                    placeholder="Seleccione un servicio"
                    selectedKeys={formData.serviceId ? [formData.serviceId] : []}
                    onSelectionChange={(keys) => setFormData({ ...formData, serviceId: Array.from(keys)[0] as string })}
                  >
                    {services.map((service) => (
                      <SelectItem key={service.id} textValue={service.name}>
                        {service.name} - ${service.price}
                      </SelectItem>
                    ))}
                  </Select>

                  <Input
                    label="Fecha y Hora"
                    type="datetime-local"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />

                  <Textarea
                    label="Nota"
                    placeholder="Notas adicionales (opcional)"
                    value={formData.note}
                    onValueChange={(value) => setFormData({ ...formData, note: value })}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>Cancelar</Button>
                <Button color="primary" onPress={handleSubmitNewTurno}>Crear Turno</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}