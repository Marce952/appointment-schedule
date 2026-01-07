'use client'
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Card, CardBody, CardHeader, Progress, Chip, Button } from "@heroui/react";
import { Gift, CheckCircle, Clock, XCircle } from "lucide-react";

interface LoyaltyCard {
  id: number;
  name: string | null;
  visitsCompleted: number;
  visitsRequired: number;
  isRedeemed: boolean;
  isActive: boolean;
  business: {
    id: number;
    name: string;
    type: string;
  };
  service: {
    id: number;
    name: string;
  } | null;
  createdAt: string;
}

export default function ClientDashboardPage() {
  const [client, setClient] = useState<any>(null);
  const [cards, setCards] = useState<LoyaltyCard[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Verificar si el cliente está autenticado
    const clientData = localStorage.getItem("client");
    if (!clientData) {
      router.push("/client/login");
      return;
    }

    const parsedClient = JSON.parse(clientData);
    setClient(parsedClient);
    loadCards(parsedClient.id);
  }, [router]);

  const loadCards = async (clientId: number) => {
    try {
      const response = await axios.get(`/api/loyalty-card?clientId=${clientId}`);
      setCards(response.data);
    } catch (error) {
      console.error("Error al cargar tarjetas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("client");
    router.push("/client/login");
  };

  const getCardStatus = (card: LoyaltyCard) => {
    if (!card.isActive) return "inactive";
    if (card.isRedeemed) return "redeemed";
    if (card.visitsCompleted >= card.visitsRequired) return "ready";
    return "active";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ready":
        return "success";
      case "redeemed":
        return "default";
      case "inactive":
        return "danger";
      default:
        return "primary";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ready":
        return <Gift className="w-5 h-5" />;
      case "redeemed":
        return <CheckCircle className="w-5 h-5" />;
      case "inactive":
        return <XCircle className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "ready":
        return "¡Listo para canjear!";
      case "redeemed":
        return "Ya canjeado";
      case "inactive":
        return "Inactiva";
      default:
        return "En progreso";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                ¡Hola, {client?.name}!
              </h1>
              <p className="text-gray-600 mt-1">
                Aquí están tus tarjetas de fidelización
              </p>
            </div>
            <Button
              color="danger"
              variant="light"
              onClick={handleLogout}
            >
              Cerrar Sesión
            </Button>
          </div>
        </div>

        {/* Tarjetas de Fidelización */}
        {cards.length === 0 ? (
          <Card className="bg-white">
            <CardBody className="text-center py-12">
              <Gift className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No tienes tarjetas de fidelización
              </h3>
              <p className="text-gray-500">
                Pregunta en el negocio para que te asignen una tarjeta
              </p>
            </CardBody>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card) => {
              const status = getCardStatus(card);
              const progress = (card.visitsCompleted / card.visitsRequired) * 100;

              return (
                <Card key={card.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-col items-start gap-2 pb-2">
                    <div className="flex justify-between items-center w-full">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {card.name || "Tarjeta de Fidelización"}
                      </h3>
                      <Chip
                        color={getStatusColor(status)}
                        variant="flat"
                        startContent={getStatusIcon(status)}
                      >
                        {getStatusText(status)}
                      </Chip>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p className="font-medium">{card.business.name}</p>
                      {card.service && (
                        <p className="text-xs text-gray-500">{card.service.name}</p>
                      )}
                    </div>
                  </CardHeader>
                  <CardBody className="pt-2">
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">Progreso</span>
                          <span className="font-semibold text-gray-800">
                            {card.visitsCompleted} / {card.visitsRequired}
                          </span>
                        </div>
                        <Progress
                          value={progress}
                          color={status === "ready" ? "success" : "primary"}
                          className="w-full"
                        />
                      </div>

                      {status === "ready" && !card.isRedeemed && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <p className="text-sm text-green-800 font-medium text-center">
                            🎉 ¡Felicidades! Puedes canjear tu premio
                          </p>
                        </div>
                      )}

                      {card.isRedeemed && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <p className="text-sm text-blue-800 font-medium text-center">
                            ✅ Premio canjeado
                          </p>
                        </div>
                      )}

                      <div className="text-xs text-gray-500 pt-2 border-t">
                        Creada: {new Date(card.createdAt).toLocaleDateString("es-ES")}
                      </div>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}


