'use client';

import { Provider } from 'react-redux';
import { ThemeProvider } from 'next-themes';
import store from '@/Redux/Store';

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <ThemeProvider attribute="class" enableSystem={false} defaultTheme="dark">
        {children}
      </ThemeProvider>
    </Provider>
  );
};

export default Providers;
