import styles from "./page.module.css";
import Header from "../components/header/header";
import Navbar from "../components/navbar/navbar";
import Footer from "../components/footer/footer";

export default function Home() {
  return (
    <div className={styles.container}>
      {/* Header Section */}
      <Header />
      
      {/* Navbar Section */}
      <Navbar />
      
      {/* Main Content */}
      <main className={styles.main}>
        <h1></h1>
      </main>
      
      {/* Footer Section */}
      <Footer />
    </div>
  );
}
