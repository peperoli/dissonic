export default function PrivacyPolicyPage() {
  return (
    <main className="richtext container">
      <h1 id="datenschutzerklärung">Datenschutzerklärung</h1>
      <hr />
      <h2 id="verantwortlicher">1. Verantwortlicher</h2>
      <p>
        Oliver Meyer
        <br />
        <a href="mailto:hello@dissonic.ch">hello@dissonic.ch</a>
      </p>
      <hr />
      <h2 id="erhobene-daten-und-zwecke">2. Erhobene Daten und Zwecke</h2>
      <h3 id="besuch-der-website-ohne-konto">2.1 Besuch der Website (ohne Konto)</h3>
      <p>
        Beim Aufruf der Website werden technisch notwendige Daten verarbeitet (IP-Adresse,
        Browsertyp, aufgerufene Seiten, Zeitstempel). Rechtsgrundlage: überwiegendes berechtigtes
        Interesse (Art. 31 Abs. 1 revDSG).
      </p>
      <h3 id="nutzerkonto">2.2 Nutzerkonto</h3>
      <p>Bei der Registrierung und Nutzung eines Kontos werden folgende Daten gespeichert:</p>
      <ul>
        <li>
          <strong>E-Mail-Adresse und Passwort</strong> (oder OAuth-Token bei
          Google-/Microsoft-Login) – für Authentifizierung und Kontoverwaltung
        </li>
        <li>
          <strong>Benutzername</strong> – für öffentliche Profilanzeige
        </li>
        <li>
          <strong>Konzertbesuche, Kommentare und Beiträge</strong> – für die Kernfunktion des
          Dienstes
        </li>
      </ul>
      <p>
        Diese Daten werden auf Basis der Vertragserfüllung (Art. 31 Abs. 2 lit. a revDSG)
        verarbeitet.
      </p>
      <h3 id="spotify-api">2.3 Spotify-API</h3>
      <p>
        Zur Anzeige von Bandbildern und -metadaten werden öffentliche Daten der Spotify-API
        abgerufen. Es werden dabei keine persönlichen Nutzerkonten mit Spotify verknüpft.
      </p>
      <hr />
      <h2 id="weitergabe-an-dritte">3. Weitergabe an Dritte</h2>
      <p>
        Folgende Dienstleister erhalten Zugriff auf personenbezogene Daten als Auftragsverarbeiter:
      </p>
      <table className="w-full">
        <colgroup>
          <col style={{ width: '33%' }} />
          <col style={{ width: '33%' }} />
          <col style={{ width: '33%' }} />
        </colgroup>
        <thead>
          <tr className="header">
            <th>Dienstleister</th>
            <th>Zweck</th>
            <th>Serverstandort</th>
          </tr>
        </thead>
        <tbody>
          <tr className="odd">
            <td>
              <strong>Vercel Inc.</strong> (USA)
            </td>
            <td>Hosting, Auslieferung und Webanalyse (Vercel Analytics)</td>
            <td>EU / global (CDN)</td>
          </tr>
          <tr className="even">
            <td>
              <strong>Supabase Inc.</strong> (USA)
            </td>
            <td>Datenbank und Authentifizierung</td>
            <td>Frankfurt, EU</td>
          </tr>
        </tbody>
      </table>
      <p>
        Beide Anbieter verarbeiten Daten auf Grundlage von Standardvertragsklauseln (SCCs) gemäss
        Art. 16 revDSG.
      </p>
      <hr />
      <h2 id="speicherdauer">4. Speicherdauer</h2>
      <p>
        Kontodaten werden für die Dauer der Kontonutzung gespeichert. Nach Kontolöschung werden
        personenbezogene Daten innerhalb von 30 Tagen gelöscht, sofern keine gesetzlichen
        Aufbewahrungspflichten entgegenstehen.
      </p>
      <hr />
      <h2 id="betroffenenrechte">5. Betroffenenrechte</h2>
      <p>
        Nutzende haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der
        Verarbeitung sowie auf Datenherausgabe (Portabilität). Anfragen können per E-Mail an
        hello@dissonic.ch gerichtet werden. Zudem besteht das Recht auf Beschwerde beim
        Eidgenössischen Datenschutz- und Öffentlichkeitsbeauftragten (EDÖB,{' '}
        <a href="https://www.edoeb.admin.ch">edoeb.admin.ch</a>).
      </p>
      <hr />
      <h2 id="webanalyse-vercel-analytics">6. Webanalyse (Vercel Analytics)</h2>
      <p>
        Diese Website verwendet Vercel Analytics, einen datenschutzfreundlichen Analysedienst von
        Vercel Inc. (USA). Dabei werden aggregierte Nutzungsdaten erhoben (aufgerufene Seiten,
        Herkunftsland, Gerättyp, Verweildauer). Es werden keine Cookies gesetzt und keine
        personenbezogenen Daten dauerhaft gespeichert; IP-Adressen werden nicht protokolliert.
        Rechtsgrundlage: überwiegendes berechtigtes Interesse (Art. 31 Abs. 1 revDSG). Weitere
        Informationen:{' '}
        <a
          href="https://vercel.com/docs/analytics/privacy-policy"
          target="_blank"
          rel="noopener noreferrer"
        >
          vercel.com/docs/analytics/privacy-policy
        </a>
        .
      </p>
      <hr />
      <h2 id="cookies-und-lokale-speicherung">7. Cookies und lokale Speicherung</h2>
      <p>
        Die Website verwendet technisch notwendige Cookies zur Verwaltung der Sitzung
        (Session-Cookie von Supabase Auth). Es werden keine Tracking- oder Werbe-Cookies eingesetzt.
      </p>
      <hr />
      <p>
        <em>Stand: April 2026</em>
      </p>
    </main>
  )
}
