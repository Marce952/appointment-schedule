'use client'
import React, { useState, useEffect } from "react";
import { Input, Button, Select, SelectItem, Card, CardHeader, CardBody, Divider, Skeleton } from "@heroui/react";
import { PlusIcon, Save, Trash2, Clock } from "lucide-react";
import axios from "axios";

const daysLabels: { [key: string]: string } = {
  '0': 'Domingo', '1': 'Lunes', '2': 'Martes', '3': 'Miércoles', '4': 'Jueves', '5': 'Viernes', '6': 'Sábado'
};

export default function BusinessHoursPage() {
  const [businessHours, setBusinessHours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tempHour, setTempHour] = useState({ dayOfWeek: '1', startTime: '08:00', endTime: '13:00' });

  useEffect(() => {
    fetchHours();
  }, []);

  const fetchHours = async () => {
    try {
      const res = await axios.get('/api/business/hours');
      setBusinessHours(res.data);
    } catch (error) {
      console.error("Error fetching hours:", error);
    } finally {
      setLoading(false);
    }
  };

  const addBusinessHour = () => {
    const newHours = [...businessHours, { ...tempHour, dayOfWeek: parseInt(tempHour.dayOfWeek) }];
    // Ordenar por día y luego por hora
    newHours.sort((a, b) => a.dayOfWeek - b.dayOfWeek || a.startTime.localeCompare(b.startTime));
    setBusinessHours(newHours);
  };

  const removeBusinessHour = (index: number) => {
    setBusinessHours(businessHours.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.post('/api/business/hours', { hours: businessHours });
      alert("Horarios actualizados correctamente");
    } catch (error) {
      alert("Error al guardar los horarios");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-4">
        <Skeleton className="h-12 w-1/4 rounded-lg" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Clock className="text-blue-600" />
            Configuración de Horarios
          </h1>
          <p className="text-gray-500">Gestiona los horarios de apertura y cierre de tu establecimiento.</p>
        </div>
        <Button
          color="primary"
          startContent={<Save size={18} />}
          onPress={handleSave}
          isLoading={saving}
          className="font-bold"
        >
          Guardar Cambios
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Formulario para añadir */}
        <Card className="md:col-span-1 shadow-sm border border-gray-100">
          <CardHeader className="font-bold text-gray-700">Añadir Franja Horaria</CardHeader>
          <Divider />
          <CardBody className="gap-4">
            <Select
              label="Día de la semana"
              variant="bordered"
              selectedKeys={[tempHour.dayOfWeek]}
              onChange={(e) => setTempHour({ ...tempHour, dayOfWeek: e.target.value })}
            >
              {Object.entries(daysLabels).map(([key, label]) => (
                <SelectItem key={key}>{label}</SelectItem>
              ))}
            </Select>
            <div className="flex gap-2">
              <Input
                label="Apertura"
                type="time"
                variant="bordered"
                value={tempHour.startTime}
                onChange={(e) => setTempHour({ ...tempHour, startTime: e.target.value })}
              />
              <Input
                label="Cierre"
                type="time"
                variant="bordered"
                value={tempHour.endTime}
                onChange={(e) => setTempHour({ ...tempHour, endTime: e.target.value })}
              />
            </div>
            <Button
              color="primary"
              variant="flat"
              startContent={<PlusIcon size={18} />}
              onPress={addBusinessHour}
              className="w-full mt-2"
            >
              Añadir Franja
            </Button>
          </CardBody>
        </Card>

        {/* Lista de horarios */}
        <Card className="md:col-span-2 shadow-sm border border-gray-100">
          <CardHeader className="font-bold text-gray-700">Horarios Actuales</CardHeader>
          <Divider />
          <CardBody>
            {businessHours.length === 0 ? (
              <div className="text-center py-10 text-gray-400 italic">
                No hay horarios configurados. El negocio aparecerá como cerrado.
              </div>
            ) : (
              <div className="space-y-4">
                {[0, 1, 2, 3, 4, 5, 6].map(day => {
                  const daySlots = businessHours.filter(h => h.dayOfWeek === day);
                  if (daySlots.length === 0) return null;

                  return (
                    <div key={day} className="flex flex-col gap-2">
                      <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">{daysLabels[day]}</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {daySlots.map((h, idx) => (
                          <div key={idx} className="flex justify-between items-center bg-blue-50/50 p-3 rounded-xl border border-blue-100 group">
                            <span className="text-blue-700 font-medium font-mono">
                              {h.startTime} - {h.endTime}
                            </span>
                            <Button
                              isIconOnly
                              size="sm"
                              variant="light"
                              color="danger"
                              onPress={() => removeBusinessHour(businessHours.indexOf(h))}
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        ))}
                      </div>
                      <Divider className="my-2 opacity-50" />
                    </div>
                  );
                })}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
