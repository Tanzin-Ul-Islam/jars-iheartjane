import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head />
        <body>
          <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-5LZHCXM"
            height="0" width="0" style={{ display: 'none', visibility: 'hidden' }}></iframe></noscript>
        
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}