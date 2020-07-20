import Document, { Html, Head, Main, NextScript } from 'next/document';
// @ts-ignore
import { withTranslation } from '../i18n';

class MyDocument extends Document {
  static async getInitialProps(ctx:any) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default withTranslation('common')(MyDocument)