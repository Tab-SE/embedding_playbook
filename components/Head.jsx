export const Head = (props) => {
  const { imgHost, title, description } = props;
  const url = imgHost;
  const previewImage = imgHost + "/img/opengraph/embed_tableau.png";
  let formattedTitle = title + ' ✨ Embed Tableau';
  if (title === 'Index') {
    formattedTitle = 'Embed Tableau ✨';
  }

  return (
    <>
      <meta name="robots" content="index, follow, archive, snippet" />
      <meta name="msapplication-TileColor" content="#fff" />
      <meta name="theme-color" content="#fff" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Language" content="en" />
      <meta name="description" content={description} />

      <meta name="og:title" content={formattedTitle} />
      <meta name="og:image" content={previewImage} alt="embed tableau preview" />
      <meta name="og:description" content={description} />
      <meta name="og:url" content={url} />

      <meta name="twitter:title" content={formattedTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:card" content={previewImage} />
      <meta name="twitter:image" content={previewImage} alt="embed tableau preview" />
      <meta name="twitter:site:domain" content={url} />
      <meta name="twitter:url" content={url} />
      
      <meta name="apple-mobile-web-app-title" content={formattedTitle} />

      <link rel="canonical" href={url} />
      <link rel="icon" href={imgHost + "/svg/logo_color.svg?h=32&w=32"} type="image/svg+xml" />
      <link rel="icon" href={imgHost + "/img/tableau/tableau.ico?h=32&w=32"} type="image/ico" />
      <link rel="icon" href={imgHost + "/img.tableau/tableau_logo.png?h=32&w=32"} type="image/png" />
      <link
        rel="icon"
        href={imgHost + "/svg/dark.svg?h=32&w=32"}
        type="image/svg+xml"
        media="(prefers-color-scheme: dark)"
      />
      <link
        rel="icon"
        href={imgHost + "/img/tableau/tableau_logo_dark.png?h=32&w=32"}
        type="image/png"
        media="(prefers-color-scheme: dark)"
      />
    </>
  )

}
