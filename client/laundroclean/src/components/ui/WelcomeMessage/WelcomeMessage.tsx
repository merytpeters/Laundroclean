import styles from './WelcomeMessage.module.css'

interface WelcomeMessageProps {
    title: string;
    message: string;
}

export default function WelcomeMessage({ title, message}: WelcomeMessageProps) {
    return (
        <div className={styles.welcomeMessage}>
            <h3>
                {title}
            </h3>
            <span>{message}</span>
        </div>
    )
}