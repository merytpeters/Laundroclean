import styles from './WelcomeMessage.module.css'
import { FaUserCircle } from 'react-icons/fa';

interface WelcomeMessageProps {
    name: string;
    message?: string;
    showProfilePic?: boolean;
}

export default function WelcomeMessage({ name, message, showProfilePic = true }: WelcomeMessageProps) {
    return (
        <div className={styles.welcomeMessage}>
            {showProfilePic && (
                <span className={styles.profilepic}>
                    <FaUserCircle size={45}/>
                </span>
            )}
            <span><b>Welcome,</b> {name} </span>
            <span>{message}</span>
        </div>
    )
}