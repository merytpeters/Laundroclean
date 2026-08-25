import { FaSpinner } from "react-icons/fa";
import Button from "../Button/Button";

type StateProps = {
    message?: string;
    onRetry?: () => void;
}

export default function ErrorState({
    message = "Something went wrong",
    onRetry,
}: StateProps) {
    return (
        <section style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
            <h2>Oops!</h2>
            <p>{message}</p>

            {onRetry && (
                <Button type="button" onClick={onRetry} text="Try Again" />
            )}
        </section>
    )
}

export function LoadingState({
    message = "Your data is loading..."
}: StateProps) {
    return (
        <span style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
            <p>{message}</p>
            <FaSpinner />
        </span>
    )
}

export function TableLoadingState({
    message = "Your data is loading..."
}: StateProps) {
    return (
        <tbody style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
            <tr>
                <td>
                    <div>
                        <p>{message}</p>
                        <FaSpinner />
                    </div>

                </td>
            </tr>

        </tbody>
    )
}
