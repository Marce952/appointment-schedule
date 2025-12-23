'use client'
import { signIn } from "next-auth/react";
import React, { useState } from "react";
import { Input, Button, Checkbox, Link, Divider, Progress, Select, SelectItem, Chip } from "@heroui/react";
import { Ghost, Eye, EyeOff, Facebook, Mail, Twitter, ArrowBigRightDash, ArrowBigLeftDash, PlusIcon, Phone } from "lucide-react";
import { div, em } from "framer-motion/client";
import axios from "axios";
import { useRouter } from "next/navigation";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [step, setStep] = useState(1);
  const [services, setServices] = useState<any[]>([]);
  const [tempService, setTempService] = useState({ name: '', duration: '', price: '' });
  const [registerBusiness, setRegisterBusiness] = useState({
    name: '',
    type: '',
    address: '',
    phone: '',
    email: '',
    website: '',
  })
  const [registerUser, setRegisterUser] = useState({
    businessId: 0,
    email: '',
    password: '',
    name: '',
    role: 'ADMIN',
    phone: '',
  })

  const router = useRouter();

  // 2. Función para añadir a la lista
  const addService = () => {
    if (!tempService.name || !tempService.price) return;
    setServices([...services, tempService]);
    setTempService({ name: '', duration: '', price: '' }); // Limpiar campos
  };

  const businessType = [
    { key: "peluqueria", label: "peluqueria" },
    { key: "veterinaria", label: "veterinaria" },
    { key: "nutricionista", label: "nutricionista" },
    { key: "doctor", label: "doctor" },
    { key: "estetica", label: "estetica" },
    { key: "odontologia", label: "odontologia" },
    { key: "masajista", label: "masajista" },
    { key: "fisioterapia", label: "fisioterapia" },
    { key: "psicologia", label: "psicologia" },
    { key: "otro", label: "otro" },
  ];

  const registerForm = (step: number) => {
    switch (step) {
      case 1: return (
        <div>
          <div className="flex gap-4">
            <Input
              label="Nombre de tu negocio"
              variant="underlined"
              className="flex-1"
              value={registerBusiness.name}
              onChange={(e) => setRegisterBusiness({ ...registerBusiness, name: e.target.value })}
            />

            <Select
              className="flex-1"
              label="Tipo de negocio"
              variant="underlined"
              selectedKeys={registerBusiness.type ? [registerBusiness.type] : []}
              onChange={(e) => setRegisterBusiness({ ...registerBusiness, type: e.target.value })}
            >
              {businessType.map((business) => (
                <SelectItem key={business.key}>{business.label.charAt(0).toUpperCase() + business.label.slice(1)}</SelectItem>
              ))}
            </Select>
          </div>

          <Input
            label="Direccion"
            type="text"
            variant="underlined"
            value={registerBusiness.address}
            onChange={(e) => setRegisterBusiness({ ...registerBusiness, address: e.target.value })}
          />
          <Input
            label="Telefono"
            type="text"
            variant="underlined"
            value={registerBusiness.phone}
            onChange={(e) => setRegisterBusiness({ ...registerBusiness, phone: e.target.value })}
          />
          <Input
            label="Email"
            type="email"
            variant="underlined"
            value={registerBusiness.email}
            onChange={(e) => setRegisterBusiness({ ...registerBusiness, email: e.target.value })}
          />
          <Input
            label="Pagina"
            type="text"
            variant="underlined"
            value={registerBusiness.website}
            onChange={(e) => setRegisterBusiness({ ...registerBusiness, website: e.target.value })}
          />

          <div className="flex justify-end">
            <Button
              type="button"
              className="mt-6 bg-blue-700 hover:bg-blue-500 text-white font-bold rounded-full py-6 shadow-lg shadow-purple-200"
              onPress={() => setStep(step + 1)}
            >
              <ArrowBigRightDash />
            </Button>
          </div>
        </div>
      )
      case 2: return (
        <div className="flex flex-col gap-4 mt-2">
          {/* Inputs para el servicio actual */}
          <div className="flex gap-2 items-end">
            <Input
              label="Nombre"
              variant="underlined"
              value={tempService.name}
              onChange={(e) => setTempService({ ...tempService, name: e.target.value })}
            />
            <Input
              label="Duración"
              placeholder="30 min"
              variant="underlined"
              value={tempService.duration}
              onChange={(e) => setTempService({ ...tempService, duration: e.target.value })}
            />
            <Input
              label="Precio"
              placeholder="0.00"
              variant="underlined"
              value={tempService.price}
              onChange={(e) => setTempService({ ...tempService, price: e.target.value })}
            />
            <Button isIconOnly color="primary" variant="flat" onPress={addService}>
              <PlusIcon />
            </Button>
          </div>

          {/* Visualización de servicios añadidos */}
          <div className="mt-4 flex flex-wrap gap-2 max-h-[150px] overflow-y-auto p-2 border-t border-gray-400">
            {services.map((s, index) => (
              <Chip
                key={index}
                onClose={() => setServices(services.filter((_, i) => i !== index))}
                variant="flat"
              >
                {s.name} - ${s.price}
              </Chip>
            ))}
          </div>

          <div className="flex justify-between items-center mt-4">
            <Button className="mt-6 bg-gray-200 text-blue-700 font-bold rounded-full py-6 shadow-lg shadow-purple-200" onPress={() => setStep(step - 1)}>
              <ArrowBigLeftDash />
            </Button>


            <Button
              className="mt-6 bg-blue-700 hover:bg-blue-500 text-white font-bold rounded-full py-6 shadow-lg shadow-purple-200"
              // isDisabled={services.length === 0}
              onPress={() => setStep(step + 1)}
            >
              <ArrowBigRightDash />
            </Button>
          </div>
        </div>
      )

      case 3: return (
        <div>
          <div className="flex gap-2">
            <Input
              label="Nombre y Apellido"
              variant="underlined"
              className="flex-1"
              value={registerUser.name}
              onChange={(e) => setRegisterUser({ ...registerUser, name: e.target.value })}
            />
            <Input
              label="Contraseña"
              variant="underlined"
              className="flex-1"
              type="password"
              value={registerUser.password}
              onChange={(e) => setRegisterUser({ ...registerUser, password: e.target.value })}
            />
          </div>

          <div>
            <Input
              label="Email"
              variant="underlined"
              type="email"
              value={registerUser.email}
              onChange={(e) => setRegisterUser({ ...registerUser, email: e.target.value })}
            />
            <Input
              label="Telefono"
              variant="underlined"
              value={registerUser.phone}
              onChange={(e) => setRegisterUser({ ...registerUser, phone: e.target.value })}
            />

            <Checkbox
              size="sm"
              className="mt-2"
            // isSelected={registerData.acceptTerms}
            // onChange={(e) => setRegisterData({ ...registerData, acceptTerms: e.target.checked })}
            >
              <span className="text-xs text-gray-500">Acepto los terminos de uso y politicas de privacidad</span>
            </Checkbox>
          </div>

          <div className="flex justify-between gap-4">
            <Button
              type="button"
              className="mt-6 bg-gray-200 text-blue-700 font-bold rounded-full py-6 shadow-lg shadow-purple-200"
              onPress={() => setStep(step - 1)}
            >
              <ArrowBigLeftDash />
            </Button>
          </div>
        </div>
      )
    }
  }

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleRegisterSubmit = async () => {
    try {
      const payload = {
        business: registerBusiness,
        services: services,
        user: registerUser
      };

      // 1. Crear el registro en la base de datos
      const res = await axios.post('/api/auth/register', payload);

      if (res.status === 201) {
        // 2. LOGUEAR automáticamente con las credenciales recién creadas
        const result = await signIn("credentials", {
          email: registerUser.email,
          password: registerUser.password,
          redirect: false, // Evitamos recarga brusca
        });

        if (result?.ok) {
          router.push("/dashboard"); // 3. ¡Directo al éxito!
        }
      }
    } catch (error) {
      alert("Error en el registro");
    }
  };

  const handleLoginSubmit = async () => {
    console.log('Enviando login...');
    // await fetch('/api/auth/login', {...})
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-blue-500 to-blue-700">
      <div className="rounded-[40px] shadow-2xl flex flex-col lg:flex-row w-full max-w-5xl overflow-hidden min-h-[600px]">

        {/* Lado Izquierdo: Branding/Ilustración */}
        <div className="relative w-full lg:w-1/2 backdrop-blur-sm bg-white/20 p-12 flex flex-col items-center justify-center text-black text-center">
          {/* Logo y Texto */}
          <div className="z-10 animate-appearance-in text-white">
            <div className="flex flex-col items-center gap-2 mb-6">
              <div className="p-4 bg-white/20 rounded-full backdrop-blur-md">
                <Ghost size={64} fill="white" className="text-white" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight italic">DateSoul</h1>
            </div>
            <p className="max-w-xs text-sm opacity-90 leading-relaxed hidden lg:block">
              {isLogin ? "Agenda tus citas de manera fácil y rápida con DateSoul, la aplicación diseñada para simplificar tu vida laboral y mantenerte organizado." :
                "Crea tu cuenta en DateSoul y comienza a gestionar tus citas de manera eficiente y sencilla. ¡Es gratis y solo toma un minuto!"}
            </p>
            {!isLogin && (
              <Button
                variant="bordered"
                className="mt-8 border-white text-white rounded-full px-12 hover:bg-white hover:text-primary transition-all font-semibold"
                onPress={() => setIsLogin(true)}
              >
                Ya tengo una cuenta
              </Button>
            )}
          </div>

          {/* ONDA SVG (Responsiva) */}
          <div className="absolute top-0 right-0 h-full w-24 hidden lg:block">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full fill-white">
              <path d="M0 0 C 50 0, 50 100, 100 100 L 100 0 Z" />
            </svg>
          </div>

          <div className="absolute bottom-0 left-0 w-full h-24 lg:hidden">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full fill-white">
              <path d="M0 0 C 0 50, 100 50, 100 100 L 0 100 Z" />
            </svg>
          </div>
        </div>

        {/* Lado Derecho: Formulario */}
        <div className="w-full lg:w-1/2 bg-white p-8 lg:p-16 flex flex-col justify-center items-center">
          <div className="w-full max-w-sm animate-in slide-in-from-right-8 duration-500">
            <h2 className="text-3xl font-bold text-blue-700 mb-1">
              {isLogin ? "Bienvenido de nuevo!" : "Crea tu cuenta"}
            </h2>
            <p className="text-gray-400 text-sm mb-8">
              {isLogin && "Inicia sesión"}
            </p>

            {
              !isLogin && (
                <div className="mb-1 gap-2 flex flex-col">
                  {step === 1 && <p className="text-sm font-semibold text-gray-500">Registra tu negocio</p>}
                  {step === 2 && <p className="text-sm font-semibold text-gray-500">Añade los servicios que ofreces</p>}
                  {step === 3 && <p className="text-sm font-semibold text-gray-500">Configura tu usuario</p>}
                  <Progress aria-label="Loading..." className="max-w-md" value={step * 33.3} />
                </div>
              )
            }

            <form
              className="flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (!isLogin) {
                  handleRegisterSubmit();
                } else {
                  handleLoginSubmit();
                }
              }}
            >
              {!isLogin ? (
                registerForm(step)
              ) :
                (
                  <>
                    <Input
                      label="Username"
                      variant="underlined"
                      startContent={<Ghost size={16} className="text-gray-400" />}
                    />

                    <Input
                      label="Password"
                      variant="underlined"
                      endContent={
                        <button type="button" onClick={toggleVisibility}>
                          {isVisible ? <EyeOff size={20} className="text-gray-400" /> : <Eye size={20} className="text-gray-400" />}
                        </button>
                      }
                      type={isVisible ? "text" : "password"}
                    />
                  </>
                )}

              {isLogin && (
                <div className="flex justify-end mt-[-10px]">
                  <Link size="sm" className="text-gray-400 cursor-pointer">Forgot password?</Link>
                </div>
              )}

              {isLogin ?
                <Button
                  type="submit"
                  className="mt-6 bg-blue-700 hover:bg-blue-500 text-white font-bold rounded-full py-6 shadow-lg shadow-purple-200"
                >
                  Ingresar
                </Button>
                :
                <Button
                  type="submit"
                  className={`mt-6 bg-blue-700 hover:bg-blue-500 text-white font-bold rounded-full py-6 shadow-lg shadow-purple-20 ${step < 3 ? 'hidden' : ''}`}
                >
                  Registrarse?
                </Button>
              }
            </form>

            <div className="mt-8 text-center text-xs text-gray-400">
              <p className="mb-4">
                {isLogin && "¿No tienes una cuenta? "}
                <Link size="sm" className="font-bold text-blue-700 cursor-pointer" onPress={() => setIsLogin(!isLogin)}>
                  {isLogin && "Registrate"}
                </Link>
              </p>

              <p className="mb-4">
                {(!isLogin && step === 1) && "¿Ya tienes una cuenta? "}
                <Link size="sm" className="font-bold text-blue-700 cursor-pointer" onPress={() => setIsLogin(!isLogin)}>
                  {(!isLogin && step === 1) && "Inicia sesión"}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login