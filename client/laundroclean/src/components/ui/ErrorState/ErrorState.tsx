import Button from "../Button/Button";

type ErrorStateProps = {
    message?: string;
    onRetry?: () => void;
}

export default function ErrorState({
    message = "Something went wrong",
    onRetry,
}: ErrorStateProps) {
    return (
        <div>
            <h2>Oops!</h2>
            <p>{message}</p>

            {onRetry && (
                <Button type="button" onClick={onRetry} text="Try Again"/>
            )}
        </div>
    )
}