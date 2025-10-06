import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <header>
          {/*Header Component goes here*/}
        </header>
        <section>
          {/*Hero Section */}
        </section>
        <section>
          {/*Why section */}
        </section>
        <section>
          {/*Services */}
        </section>
        <section>
          {/*Visit us */}
        </section>
        <section>
          {/*Call to action */}
        </section>
      </main>
      <footer className={styles.footer}>
          {/*Footer Component goes here */}
      </footer>
    </div>
  );
}
