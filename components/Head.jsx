
function Head(props) {

  return (
    <>
      <meta name="msapplication-TileColor" content="#fff" />
      <meta name="theme-color" content="#fff" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Language" content="en" />
      <meta
        name="description"
        content={props.description}
      />
      <meta
        name="og:description"
        content={props.description}
      />
      <meta name="twitter:card" content={props.imgHost + "/img/tableau/logo_text.png?w=350"} />
      <meta name="twitter:image" content={props.socialCard} />
      <meta name="twitter:site:domain" content="https://tab-se.github.io" />
      <meta name="twitter:url" content="https://tab-se.github.io/embedding_playbook" />
      <meta name="og:title" content={props.title}/>
      <meta name="og:image" content={props.socialCard} />
      <meta name="apple-mobile-web-app-title" content={props.title} />
      <link rel="icon" href={props.imgHost + "/svg/logo_color.svg?h=32&w=32"} type="image/svg+xml" />
      <link rel="icon" href={props.imgHost + "/img/tableau/tableau.ico?h=32&w=32"} type="image/ico" />
      <link rel="icon" href={props.imgHost + "/img.tableau/tableau_logo.png?h=32&w=32"} type="image/png" />
      <link
        rel="icon"
        href={props.imgHost + "/svg/dark.svg?h=32&w=32"}
        type="image/svg+xml"
        media="(prefers-color-scheme: dark)"
      />
      <link
        rel="icon"
        href={props.imgHost + "/img/tableau/tableau_logo_dark.png?h=32&w=32"}
        type="image/png"
        media="(prefers-color-scheme: dark)"
      />
    </>
  )

}

export default Head;
