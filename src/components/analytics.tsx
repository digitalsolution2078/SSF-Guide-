/**
 * Optional, privacy-friendly analytics — activated only when an env var is set,
 * so the site ships with zero tracking by default. Configure before build:
 *   NEXT_PUBLIC_PLAUSIBLE_DOMAIN=ssf.digitalsolutionnepal.com   (Plausible)
 *   NEXT_PUBLIC_GA_ID=G-XXXXXXX                                 (Google Analytics 4)
 * Set either (or neither). Plausible is cookieless and lighter.
 */
export function Analytics() {
  const plausible = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  const ga = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <>
      {plausible && (
        <script
          defer
          data-domain={plausible}
          src="https://plausible.io/js/script.js"
        />
      )}
      {ga && (
        <>
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${ga}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga}');`,
            }}
          />
        </>
      )}
    </>
  );
}
