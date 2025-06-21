import { useNavigate } from "react-router-dom"
import styled from "styled-components"
import { motion } from "framer-motion"
import { useAuth } from "../contexts/AuthContext"
import { Button } from "../components/ui/button"
import { ArrowRight } from "lucide-react"
import logo from '/images/LogoEmpacadora.jpg'

const WelcomeContainer = styled.div`
  min-height: 100vh;
  background: #F0F7FF;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
`

const WelcomeCard = styled(motion.div)`
  background: white;
  padding: 2.5rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  width: 100%;
`

const Logo = styled(motion.img)`
  height: 80px;
  width: auto;
  margin-bottom: 2rem;
`

const Title = styled(motion.h1)`
  color: #1a1a1a;
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 1rem;
`

const Subtitle = styled(motion.p)`
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 2rem;
  line-height: 1.6;
`

const ButtonContainer = styled(motion.div)`
  display: flex;
  justify-content: center;
  gap: 1rem;
`

const WelcomeButton = styled(Button)`
  background: #2563eb;
  color: white;
  font-weight: 500;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;

  &:hover {
    background: #1d4ed8;
    transform: translateY(-1px);
  }
`

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      staggerChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
}

export default function Welcome() {
  const navigate = useNavigate()
  const { } = useAuth()

  const handleContinue = () => {
    navigate('/dashboard')
  }

  return (
    <WelcomeContainer>
      <WelcomeCard
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Logo
          src={logo}
          alt="Logo Empacadora"
          variants={itemVariants}
        />
        <Title variants={itemVariants}>
          ¡Bienvenido a tu Sistema de Empaque!
        </Title>
        <Subtitle variants={itemVariants}>
          Estamos emocionados de tenerte aquí. Tu sistema está listo para ayudarte a gestionar y optimizar tus operaciones de empaque de manera eficiente.
        </Subtitle>
        <ButtonContainer variants={itemVariants}>
          <WelcomeButton onClick={handleContinue}>
            Continuar al Dashboard
            <ArrowRight size={20} />
          </WelcomeButton>
        </ButtonContainer>
      </WelcomeCard>
    </WelcomeContainer>
  )
} 