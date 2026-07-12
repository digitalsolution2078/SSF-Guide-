/**
 * Site analytics. GA4 is enabled by default with the Digital Solution property
 * measurement ID (a public, non-secret ID that appears in page HTML anyway).
 * GA4 automatically rolls subdomain traffic (ssf.*) up under the main
 * digitalsolutionnepal.com property; filter by hostname to view SSF separately,
 * or create a dedicated stream later and override via env.
 * Override or disable via env before build:
 *   NEXT_PUBLIC_GA_ID=G-XXXXXXX            (Google Analytics 4; "off" to disable)
 *   NEXT_PUBLIC_PLAUSIBLE_DOMAIN=...       (Plausible, cookieless — optional)
 */
const DEFAULT_GA_ID = "G-KY771G1Q6S";

export function Analytics() {
  const plausible = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  const gaEnv = process.env.NEXT_PUBLIC_GA_ID;
  const ga = gaEnv === "off" ? undefined : (gaEnv ?? DEFAULT_GA_ID);

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
