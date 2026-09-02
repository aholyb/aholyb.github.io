import Header from "./components/Header/Header.jsx";
import Hero from "./components/Hero/Hero.jsx";
import Projects from "./components/Projects/Projects.jsx";
import About from "./components/About/About.jsx";
import Work from "./components/Work/Work.jsx";
import Contacts from "./components/Contacts/Contacts.jsx";
import Loader from "./components/Loader/Loader.jsx";
import { useLanguage } from "./i18n/LanguageContext.jsx";
import styles from "./App.module.css";

export default function App() {
  const { isSwitching, t } = useLanguage();

  return (
    <>
      {isSwitching && <Loader label={t.loader} />}

      <div className={styles.page}>
        <Header />
        <main>
          <Hero />
          <Projects />
          <About />
          <Work />
          <Contacts />
        </main>
      </div>
    </>
  );
}
