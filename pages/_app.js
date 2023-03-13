// `pages/_app.js`
import MainLayout from "../components/layout/main-layout";
import "../styles/globals.css";
import "../styles/general.sass";

export default function App({ Component, pageProps }) {
  return (
    <MainLayout>
      <Component {...pageProps} />
    </MainLayout>
  );
}
