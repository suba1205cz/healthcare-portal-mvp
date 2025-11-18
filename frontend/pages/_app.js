import '../styles/global.css';          // 👈 bring back all your Tailwind/global styles
import { AuthProvider } from '../context/AuthContext';

export default function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
