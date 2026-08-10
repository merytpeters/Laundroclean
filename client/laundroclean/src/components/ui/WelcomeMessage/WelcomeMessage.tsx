import styles from './WelcomeMessage.module.css'
import { FaUserCircle } from 'react-icons/fa';
import { useAuth } from 'src/context/AuthContext';

interface WelcomeMessageProps {
    name: string;
    message?: string;
    showProfilePic?: boolean;
}

export default function WelcomeMessage({ name, message, showProfilePic = true }: WelcomeMessageProps) {
    const { authProfile } = useAuth();

    if (!authProfile) return;

    return (
        <div className={styles.welcomeMessage}>
            {showProfilePic && (
                <span className={styles.profilepic}>
                    {authProfile?.avatarUrl ? (
                        <img src={authProfile.avatarUrl} alt="Profle" className={styles.profilepic}/>
                    ): (

                        <FaUserCircle size = { 45 } className={styles.profilepic}/>
                   )}
                </span>
            )}
            <span><b>Welcome,</b> {name} </span>
            <span>{message}</span>
        </div>
    )
}