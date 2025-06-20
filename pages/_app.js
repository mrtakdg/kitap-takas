import "@/styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Provider } from "react-redux";
import { store } from "@/store";
import Navbar from "@/components/Navbar";
import { useEffect } from "react";
export default function App({ Component, pageProps }) {
	useEffect(() => {
		if (typeof window !== "undefined") {
			import("bootstrap/dist/js/bootstrap.bundle.min.js");
		}
	}, []);

	return (
		<Provider store={store}>
			<Navbar />
			<Component {...pageProps} />
		</Provider>
	);
}
