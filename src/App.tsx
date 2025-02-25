import ChatPage from '@/chat/page';
import { ThemeProvider } from './components/theme-provider';

const App = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <ChatPage />
    </ThemeProvider>
  )
}

export default App;