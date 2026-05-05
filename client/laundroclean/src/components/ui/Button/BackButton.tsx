"use client";

import { useRouter } from "next/navigation";
import Button from "./Button";
import styles from "./BackButton.module.css"

export default function BackButton() {
    const router = useRouter();

    return (
        <Button onClick={() => router.back()} text="Back" className={styles.button}/>
    )
}