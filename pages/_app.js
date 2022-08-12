import '../styles/globals.css';
import '../ui/assets/css/App.css';

import { ChakraProvider } from '@chakra-ui/react';
import theme from '../ui/theme/theme';

function MyApp({ Component, pageProps }) {
    return (
        <>
            <ChakraProvider theme={theme}>
                <Component {...pageProps} />
            </ChakraProvider>
        </>
    );
}

export default MyApp;
