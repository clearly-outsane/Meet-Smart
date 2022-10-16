import Document, { Head, Html, Main, NextScript } from 'next/document';
import Script from 'next/script';

const source = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GMAPS_API_KEY}&libraries=places,marker&v=beta`;

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel='preconnect' href='https://fonts.googleapis.com' />
          <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin />
          <link
            href='https://fonts.googleapis.com/css2?family=Poppins:wght@200;400;600;800&display=swap'
            rel='stylesheet'
          />
        </Head>
        <body>
          <Main />
          <NextScript />
          <Script
            type='text/javascript'
            src={source}
            strategy='beforeInteractive'
          />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
