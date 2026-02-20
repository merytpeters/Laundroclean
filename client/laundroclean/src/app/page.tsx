import styles from "./page.module.css";
import Image from "next/image";
import Header from "src/components/ui/Header/Header";
import Button from "src/components/ui/Button/Button";
import ReasonsFlexbox from "src/components/ui/flexboxes/ReasonsFlexbox";
import Services from "src/components/ui/flexboxes/ServicesFlexbox";
import Location from "src/components/ui/flexboxes/VisitUs";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Header />
        <section>
          <figure className={styles.hero}>
            <Image
              src="/img/hero.png"
              alt="man in clean laundry"
              width={1080}
              height={720}
              className={styles.heroImage}
              priority
            />
            <div className={styles.heroText}>
              <h1>FEEL THE COMFORT IN EVERY <strong>FOLD</strong></h1>
              <p>Transform your laundry routine with our <br /> state-of-the-art facilities, <br /> smart booking system to premium care</p>
              <div className={styles.heroButtons}>
                <Button text="Book Now" className={styles.bookNowButton} href="/signup"/>
                <Button text="Locate Us" className={styles.locationButton} href="/#location"/>
              </div>
              <Image
                src="/img/waterdroplets.png"
                alt="Water droplets"
                width={168}
                height={99}
                className={styles.waterdroplets}
              />
            </div>
          </figure>
        </section>
        <section className={styles.reasons}>
          {/*Why section */}
          <h2>Why Choose LaundroClean ?</h2>
          <p>We combine cutting-edge technology with sustainable practices to revolutionize <br /> your laundry experience.</p>
          <figure className={styles.reasonsflex}>
            <ReasonsFlexbox icon="/icons/fast.png" header="Fast & Convenient" text="Advanced machines with optimized cycles 
that clean thoroughly in record time without compromising quality."
            />
            <ReasonsFlexbox icon="/icons/wash.png" header="Clean & Reliable" text="Our modern, well-maintained washers and dryers ensure your clothes come out fresh every time." />
            <ReasonsFlexbox icon="/icons/game.png" header="More Than Laundry" text="Enjoy social games, PlayStation gaming, snacks for the kids, and a welcoming space that makes laundry day something to look forward to." />
          </figure>
        </section>
        <section className={styles.services}>
          {/*Services */}
          <h2>Premium Services</h2>
          <p>Tailored solutions for every fabric and cleaning need.</p>
          <figure className={styles.servicesflex}>
            <Services
              header="Regular Wash"
              icon="/icons/hanger.png"
              paragraph="Perfect for everyday essentials"
              orderedlist={[
                "30-minute smart cycle",
                "Temperature optimized",
                "Eco-friendly detergent"
              ]}
            />
            <Services
              header="Delicate Care"
              icon="/icons/waterdroplet.png"
              paragraph="Gentle luxury for fine fabrics"
              orderedlist={[
                "45-minute gentle cycle",
                "Cold water protection",
                "Premium fabric care"
              ]}
            />
            <Services
              header="Heavy Duty"
              icon="/icons/washbath.png"
              paragraph="Maximum power for tough stains"
              orderedlist={[
                "60-minute deep clean",
                "Hot water sanitization",
                "Industrial-strength formula"
              ]}
            />
            <Services
              header="Express Dry"
              icon="/icons/iron.png"
              paragraph="Fast drying service"
              orderedlist={[
                "20-minute rapid dry",
                "Smart heat control",
                "Anti-wrinkle technology"
              ]}
            />
          </figure>
        </section>
        <section id="location" className={styles.visitUs}>
          {/*Visit us */}
          <h2>Visit Us</h2>
          <p>Conveniently located in the heart of Ibadan.</p>
          <figure className={styles.locationflex}>
            <Location icon="/icons/location.png" header="Location" paragraphs={["123 Main Street", "Downtown District", "City, State 12345"]} button={<Button text="Get Directions" className={styles.directionButton}/>} />
            <Location icon="/icons/time.png" header="Hours" paragraphs={["Monday - Friday 8:00am - 8:00pm", "Saturday - Sunday 1:00pm - 10:00pm"]} orderedlist={["Open Now"]} className={styles.hoursflex}/>
          </figure>
        </section>
        <section className={styles.calltoAction}>
          {/*Call to action */}
          <p>Join our Happy Customers</p>
          <h2>Ready to Transform Your Laundry?</h2>
          <p>Experience laundry care with LaundroClean&apos;s premium services.</p>
          <figure id="contact" className={styles.calltoActionButtonWrap}>
            <Button text="Start Your Journey" href="/signup" className={styles.startButton}/>
            <Button text="WhatsApp" href="wa.me/2348163378163" className={styles.whatsApp}/>
          </figure>
        </section>
      </main>
      <footer className={styles.footer}>
        <section>{/* Social*/}</section>
        <section>{/*Contact*/}</section>
        <section>{/*FAQs*/}</section>
      </footer>
    </div>
  );
}
