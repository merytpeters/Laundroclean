import styles from './WelcomeMessage.module.css'
import { FaUserCircle } from 'react-icons/fa';
import { useAuth } from 'src/context/AuthContext';

interface WelcomeMessageProps {
    name: string;
    message?: string;
}

export default function WelcomeMessage({ name, message }: WelcomeMessageProps) {
    const { authProfile } = useAuth();

    if (!authProfile) return;

    return (
        <div className={styles.welcomeMessage}>
            <span><b>Welcome,</b> {name} </span>
            <span>{message}</span>
        </div>
    )
}