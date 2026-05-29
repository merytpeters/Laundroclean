import styles from './WelcomeMessage.module.css'
import { FaUserCircle } from 'react-icons/fa';

interface WelcomeMessageProps {
    name: string;
    message?: string;
}

export default function WelcomeMessage({ name, message}: WelcomeMessageProps) {
    return (
        <div className={styles.welcomeMessage}>
            <span className={styles.profilepic}>
                <FaUserCircle size={45}/>
            </span>
            <span><b>Welcome,</b> {name} </span>
            <span>{message}</span>
        </div>
    )
}