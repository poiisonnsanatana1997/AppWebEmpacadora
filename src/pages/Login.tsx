import { useState, useEffect } from "react"
import styled from "styled-components"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Form, FormControl, FormField, FormItem, FormMessage as BaseFormMessage } from "../components/ui/form"
import { Lock, Loader2, Eye, EyeOff, AlertCircle, User } from "lucide-react"
import { AuthError } from "../api/auth"
import { motion, AnimatePresence, easeOut } from "framer-motion"
import { useAuth } from "../contexts/AuthContext"
import logo from '/images/LogoEmpacadora.jpg'

// Page container
const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #F0F7FF;
  padding: 1rem;
  position: relative;
`

const LoginCard = styled.div`
  background: white;
  padding: clamp(1.5rem, 5vw, 2.5rem);
  border-radius: clamp(0.5rem, 2vw, 0.75rem);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: min(90vw, 400px);
  margin: auto;
`

const LogoContainer = styled.div`
  position: absolute;
  top: clamp(1rem, 3vw, 2rem);
  left: clamp(1rem, 3vw, 2rem);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  z-index: 10;

  img {
    height: clamp(30px, 5vw, 40px);
    width: auto;
  }
`

const Title = styled.h1`
  color: #1a1a1a;
  text-align: center;
  margin-bottom: 0.5rem;
  font-size: clamp(1.25rem, 4vw, 1.5rem);
  font-weight: 600;
`

const Subtitle = styled.p`
  color: #666;
  text-align: center;
  margin-bottom: clamp(1.5rem, 4vw, 2rem);
  font-size: clamp(0.813rem, 2.5vw, 0.875rem);
`

const FormSection = styled.div`
  margin-bottom: clamp(0.75rem, 2vw, 1rem);
`

const InputWrapper = styled.div`
  position: relative;
  margin-bottom: 0.5rem;
  width: 100%;
`

const InputIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: clamp(14px, 4vw, 16px);
    height: clamp(14px, 4vw, 16px);
  }
`

const PasswordToggleButton = styled.button`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  padding: 0.25rem;
  cursor: pointer;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    color: #2563eb;
    background-color: rgba(37, 99, 235, 0.1);
  }

  &:active {
    background-color: rgba(37, 99, 235, 0.2);
  }

  svg {
    width: 16px;
    height: 16px;
  }
`

const StyledInput = styled(Input)`
  padding-left: 3rem;
  background-color: white;
  border: 1px solid #e0e0e0;
  color: #1a1a1a;
  height: clamp(2.5rem, 7vw, 2.75rem);
  font-size: clamp(0.813rem, 2.5vw, 0.875rem);
  border-radius: 0.375rem;
  width: 100%;
  transition: all 0.2s ease;
  
  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
  }
  
  &::placeholder {
    color: #999;
    font-size: clamp(0.813rem, 2.5vw, 0.875rem);
  }

  &.error {
    border-color: #dc2626;
    &:focus {
      box-shadow: 0 0 0 2px rgba(220, 38, 38, 0.1);
    }
  }
`

const LoadingSpinner = styled(motion.div)`
  display: inline-flex;
  margin-right: 8px;
  svg {
    animation: spin 1s linear infinite;
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  }
`

const ButtonText = styled(motion.span)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`

const LoginButton = styled(Button)`
  width: 100%;
  background: #2563eb;
  color: white;
  font-weight: 500;
  height: clamp(2.5rem, 7vw, 2.75rem);
  font-size: clamp(0.813rem, 2.5vw, 0.875rem);
  border-radius: 0.375rem;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    background: #1d4ed8;
  }
  
  &:disabled {
    background: #93c5fd;
    cursor: not-allowed;
    opacity: 1;
  }
`


const OrDivider = styled.div`
  display: flex;
  align-items: center;
  margin: clamp(1.25rem, 3vw, 1.5rem) 0;
  color: #666;
  font-size: clamp(0.688rem, 2vw, 0.75rem);
  
  &::before, &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: #e0e0e0;
  }
  
  &::before {
    margin-right: 1rem;
  }
  
  &::after {
    margin-left: 1rem;
  }
`

const StyledFormMessage = styled(BaseFormMessage)`
  color: #dc2626;
  font-size: clamp(0.688rem, 2vw, 0.75rem);
  margin-top: 0.25rem;
  margin-left: 0.25rem;
  display: block;
`

const ErrorMessage = styled.div`
  background-color: rgba(220, 38, 38, 0.1);
  border: 1px solid #dc2626;
  color: #dc2626;
  padding: clamp(0.625rem, 2vw, 0.75rem);
  border-radius: 0.375rem;
  margin-bottom: 1rem;
  text-align: center;
  font-size: clamp(0.813rem, 2.5vw, 0.875rem);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  svg {
    width: clamp(14px, 4vw, 16px);
    height: clamp(14px, 4vw, 16px);
  }
`

// Form schema
const formSchema = z.object({
  username: z.string()
    .min(1, {
      message: "El nombre de usuario es requerido",
    }),
  password: z.string()
    .min(1, {
      message: "La contraseña es requerida",
    })
    .min(6, {
      message: "La contraseña debe tener al menos 6 caracteres",
    })
    .max(50, {
      message: "La contraseña no puede tener más de 50 caracteres",
    }),
})

type FormValues = z.infer<typeof formSchema>

const MotionLogo = motion(LogoContainer)
const MotionInput = motion(InputWrapper)

export default function Login() {
  const navigate = useNavigate()
  const { login, isAuthenticated, user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Redirigir automáticamente si ya está autenticado
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('Login - Usuario ya autenticado, redirigiendo a home...')
      navigate('/home', { replace: true })
    }
  }, [isAuthenticated, user, navigate])

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  const onSubmit = async (data: FormValues) => {
    try {
      setIsLoading(true)
      setErrorMessage(null)
      form.clearErrors()

      console.log('Iniciando login...')
      const response = await login(data.username, data.password)
      console.log('Login exitoso:', response)
      
      if (response && response.token) {
        console.log('Token recibido, redirigiendo a home...')
        // Pequeño delay para asegurar que el estado se actualice
        setTimeout(() => {
          console.log('Ejecutando navegación a /home...')
          navigate('/home', { replace: true })
        }, 100)
      }
    } catch (error: any) {
      console.error('Error en login:', error)
      const authError = error as AuthError
      
      if (authError.code === 'INVALID_CREDENTIALS') {
        form.setError('username', { 
          type: 'manual', 
          message: 'Usuario o contraseña incorrectos' 
        })
        form.setError('password', { 
          type: 'manual', 
          message: 'Usuario o contraseña incorrectos' 
        })
      } else {
        setErrorMessage(authError.message || 'Error al iniciar sesión')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const inputVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.15,
        duration: 0.5,
        ease: easeOut
      }
    })
  }

  const logoVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: easeOut
      }
    }
  }

  return (
    <LoginContainer>
      <MotionLogo
        initial="hidden"
        animate="visible"
        variants={logoVariants}
      >
        <img src={logo} alt="Empacadora" />
      </MotionLogo>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <LoginCard>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <Title>Iniciar sesión</Title>
            <Subtitle>Sistema integral de control y gestión de empaque.</Subtitle>
          </motion.div>

          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <ErrorMessage>
                  <AlertCircle size={16} />
                  {errorMessage}
                </ErrorMessage>
              </motion.div>
            )}
          </AnimatePresence>

          <Form {...form}>
            <form onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit(onSubmit)(e);
            }} noValidate>
              <FormSection>
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <MotionInput
                          variants={inputVariants}
                          initial="hidden"
                          animate="visible"
                          custom={0}
                        >
                          <InputIcon>
                            <User size={16} />
                          </InputIcon>
                          <StyledInput 
                            className={form.formState.errors[field.name] ? 'error' : ''}
                            placeholder="Nombre de usuario" 
                            {...field} 
                          />
                        </MotionInput>
                      </FormControl>
                      <StyledFormMessage>{form.formState.errors[field.name]?.message}</StyledFormMessage>
                    </FormItem>
                  )}
                />
              </FormSection>

              <FormSection>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <MotionInput
                          variants={inputVariants}
                          initial="hidden"
                          animate="visible"
                          custom={1}
                        >
                          <InputIcon>
                            <Lock size={16} />
                          </InputIcon>
                          <StyledInput 
                            type={showPassword ? "text" : "password"} 
                            placeholder="Contraseña" 
                            className={form.formState.errors[field.name] ? 'error' : ''}
                            {...field} 
                          />
                          <PasswordToggleButton
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                          >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </PasswordToggleButton>
                        </MotionInput>
                      </FormControl>
                      <StyledFormMessage>{form.formState.errors[field.name]?.message}</StyledFormMessage>
                    </FormItem>
                  )}
                />
              </FormSection>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                <LoginButton 
                  type="submit" 
                  disabled={isLoading}
                  as={motion.button}
                  whileHover={{ scale: isLoading ? 1 : 1.02 }}
                  whileTap={{ scale: isLoading ? 1 : 0.98 }}
                >
                  <ButtonText
                    initial={false}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      transition: { duration: 0.2 }
                    }}
                  >
                    {isLoading ? (
                      <>
                        <LoadingSpinner
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                        >
                          <Loader2 size={16} />
                        </LoadingSpinner>
                        Iniciando sesión...
                      </>
                    ) : (
                      "Comenzar"
                    )}
                  </ButtonText>
                </LoginButton>
              </motion.div>
            </form>

            <OrDivider>Solo usuarios registrados v1.0</OrDivider>
          </Form>
        </LoginCard>
      </motion.div>
    </LoginContainer>
  )
}