import 'bootstrap/dist/css/bootstrap.min.css';
// @ts-ignore
import { appWithTranslation } from '../i18n';
import ThemeProvider from "../src/utils/themeContext";
import CssBaseline from '@material-ui/core/CssBaseline';
import {Provider} from 'react-redux'
import {createWrapper} from 'next-redux-wrapper'
import store from './../src/store/store'
import { context } from '../src/utils/config';
import useLocalStorage from '../src/utils/useLocalStorage';
import React from 'react';
function PlanetWeb({Component, pageProps,config}:any) {

  const [configStore, setConfig] = useLocalStorage('config', {});

  React.useEffect(()=>{
    setConfig(config)
  },[config])

  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles!.parentElement!.removeChild(jssStyles);
    }
  }, []);
  return (
    <Provider store={store}>
      <ThemeProvider>
      <CssBaseline />
        <Component {...pageProps} config={config} />
      </ThemeProvider> 
    </Provider>
    
  );
}

PlanetWeb.getInitialProps = async ({ Component, ctx }) => {
  let pageProps = {};
  const res = await fetch(`${context.api_url}/public/v1.2/en/config`);
  const config =await res.json()
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx)
  }
  return { pageProps, config:config }
}
const makestore =()=>store;
const wrapper = createWrapper(makestore);

export default wrapper.withRedux(appWithTranslation(PlanetWeb));