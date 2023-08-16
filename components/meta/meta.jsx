import Head from "next/head";
import Script from "next/script";

const Meta = ({ title, keywords, description }) => {
    return (
        <>
            <Head>
                <meta charSet="UTF-8" />
                <title>{title}</title>
                <link rel="icon" href="/favicon.ico" />
                <meta name="description" content={description} />
                {/* <meta name="viewport" content="width=device-width, initial-scale=1" /> */}
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
                <meta name="keywords" content={keywords} />
                <meta name="theme-color" content="#000000" />
                <meta name="og:type" content="ecommerce" />
                <meta name="og:title" content={title} />
                <meta name="og:url" content={description} />
                <meta name="og:description" content={description} />
                <meta name="og:image" content={description} />
                <>
                    <Script src="https://kit.fontawesome.com/7f4933efb1.js" strategy="beforeInteractive" crossOrigin="anonymous" />

                    {/* <Script strategy="afterInteractive">
                {`
                    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                    })(window,document,'script','dataLayer','GTM-5LZHCXM');
                `}
                </Script> */}

                    <script
                        dangerouslySetInnerHTML={{
                            __html: `
                    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                    })(window,document,'script','dataLayer','GTM-5LZHCXM');
                    `
                        }}
                    />

                </>
            </Head>
            <Script strategy="lazyOnload">
                {`
            window.smartlook||(function(d) {
                var o=smartlook=function(){ o.api.push(arguments)},h=d.getElementsByTagName('head')[0];
                var c=d.createElement('script');o.api=new Array();c.async=true;c.type='text/javascript';
                c.charset='utf-8';c.src='https://web-sdk.smartlook.com/recorder.js';h.appendChild(c);
                })(document);
                smartlook('init', '66ee50db017ba54ef23eabcb4a107b4f1ab02e4e', { region: 'eu' });
                smartlook('record', { forms: true, numbers: true, emails: false, ips: true })
        `}
            </Script>
        </>
    )
}
Meta.defaultProps = {
    title: "JAR",
    keywords: "jar, jar",
    description: "page description",
}

export default Meta;
