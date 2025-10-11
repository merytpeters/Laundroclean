import styles from "./page.module.css";

export default function About() {
    return(
        <div className={styles.page}>
            <main className={styles.main}>
                <header>
                    {/*Header  Component goes here*/}
                </header>
                <section>
                    {/*About Us*/}
                    About Us
                </section>
                <section>
                    {/*Mission/Vission*/}
                </section>
                <section>
                    {/*FAQs*/}
                </section>
                <section>
                    {/*Policy*/}
                </section>
            </main>
           <footer className={styles.footer}>
            {/*Footer Component goes here */}
            </footer>
    </div>
    )
}