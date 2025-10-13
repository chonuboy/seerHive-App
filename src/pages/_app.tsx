import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Poppins } from "next/font/google"; // Import next/font
import { ToastContainer } from "react-toastify";
import { store, persistor } from "@/Features/Store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

// Configure the font
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  display: 'swap',
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={poppins.className}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Component {...pageProps} />
          <ToastContainer />
        </PersistGate>
      </Provider>
    </div>
  );
}