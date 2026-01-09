'use client'
import React, { useState } from "react";
import { Input, Button, Link } from "@heroui/react";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function ClientLoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [needsPassword, setNeedsPassword] = useState(false);
  const [emailForPassword, setEmailForPassword] = useState("");
  
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const [passwordData, setPasswordData] = useState({
    password: "",
    confirmPassword: "",
  });

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("/api/client/auth/login", loginData);
      
      if (response.data.client) {
        // Guardar el cliente en localStorage
        localStorage.setItem("client", JSON.stringify(response.data.client));
        router.push("/client/dashboard");
      }
    } catch (err: any) {
      // Si el cliente necesita establecer contraseña
      if (err.response?.data?.needsPassword) {
        setNeedsPassword(true);
        setEmailForPassword(err.response.data.email);
        setError("");
      } else {
        setError(err.response?.data?.error || "Error al iniciar sesión");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (passwordData.password !== passwordData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    if (passwordData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("/api/client/auth/set-password", {
        email: emailForPassword,
        password: passwordData.password,
      });

      if (response.data.client) {
        // Guardar el cliente en localStorage
        localStorage.setItem("client", JSON.stringify(response.data.client));
        router.push("/client/dashboard");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Error al establecer la contraseña");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("/api/client/register", registerData);

      if (response.data.client) {
        // Guardar el cliente en localStorage
        localStorage.setItem("client", JSON.stringify(response.data.client));
        router.push("/client/dashboard");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Error al registrarse");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-blue-500 to-blue-700">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {isLogin ? "Iniciar Sesión" : "Registrarse"}
          </h1>
          <p className="text-gray-600">
            {isLogin 
              ? "Accede a tus tarjetas de fidelización" 
              : "Crea tu cuenta para ver tus tarjetas"}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {needsPassword ? (
          <form onSubmit={handleSetPassword} className="space-y-4">
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 text-blue-800 rounded text-sm">
              <p className="font-medium mb-1">¡Bienvenido!</p>
              <p>El negocio te ha registrado. Por favor, establece tu contraseña para acceder a tu cuenta.</p>
            </div>
            <Input
              label="Email"
              type="email"
              value={emailForPassword}
              disabled
              variant="bordered"
            />
            <Input
              label="Nueva Contraseña"
              type={isVisible ? "text" : "password"}
              value={passwordData.password}
              onChange={(e) => setPasswordData({ ...passwordData, password: e.target.value })}
              required
              variant="bordered"
              description="Mínimo 6 caracteres"
              endContent={
                <button
                  type="button"
                  onClick={() => setIsVisible(!isVisible)}
                  className="focus:outline-none"
                >
                  {isVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              }
            />
            <Input
              label="Confirmar Contraseña"
              type={isVisible ? "text" : "password"}
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              required
              variant="bordered"
              endContent={
                <button
                  type="button"
                  onClick={() => setIsVisible(!isVisible)}
                  className="focus:outline-none"
                >
                  {isVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              }
            />
            <Button
              type="submit"
              color="primary"
              className="w-full"
              isLoading={loading}
            >
              Establecer Contraseña
            </Button>
            <Button
              type="button"
              color="default"
              variant="light"
              className="w-full"
              onClick={() => {
                setNeedsPassword(false);
                setEmailForPassword("");
                setPasswordData({ password: "", confirmPassword: "" });
                setError("");
              }}
            >
              Volver al Login
            </Button>
          </form>
        ) : isLogin ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={loginData.email}
              onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
              required
              variant="bordered"
            />
            <Input
              label="Contraseña"
              type={isVisible ? "text" : "password"}
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              required
              variant="bordered"
              endContent={
                <button
                  type="button"
                  onClick={() => setIsVisible(!isVisible)}
                  className="focus:outline-none"
                >
                  {isVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              }
            />
            <Button
              type="submit"
              color="primary"
              className="w-full"
              isLoading={loading}
            >
              Iniciar Sesión
            </Button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <Input
              label="Nombre completo"
              value={registerData.name}
              onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
              required
              variant="bordered"
            />
            <Input
              label="Email"
              type="email"
              value={registerData.email}
              onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
              required
              variant="bordered"
            />
            <Input
              label="Teléfono"
              value={registerData.phone}
              onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
              required
              variant="bordered"
            />
            <Input
              label="Contraseña"
              type={isVisible ? "text" : "password"}
              value={registerData.password}
              onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
              required
              variant="bordered"
              endContent={
                <button
                  type="button"
                  onClick={() => setIsVisible(!isVisible)}
                  className="focus:outline-none"
                >
                  {isVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              }
            />
            <Button
              type="submit"
              color="primary"
              className="w-full"
              isLoading={loading}
            >
              Registrarse
            </Button>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
            className="cursor-pointer"
          >
            {isLogin 
              ? "¿No tienes cuenta? Regístrate" 
              : "¿Ya tienes cuenta? Inicia sesión"}
          </Link>
        </div>
      </div>
    </div>
  );
}


