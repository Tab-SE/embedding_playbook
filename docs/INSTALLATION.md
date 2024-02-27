# Installation

## Local Development

Follow this guide to run the project locally and have it preview live changes that you make to the codebase. This setup is also useful when performing demos:

1. First, clone this GitHub repository using your [method of choice](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository).
```sh
# cloning via SSH
git clone git@github.com:Tab-SE/embedding_playbook.git
# cloning via HTTP
git clone https://github.com/Tab-SE/embedding_playbook.git
```

2. Then, navigate to the directory where you cloned the repository using your shell.
```sh
cd embedding_playbook
```

1. Install dependencies (look for a file called `package.json` for more details).
```sh
npm i
```

1. Create local environment files by copying the provided templates.
```sh
# copy the development template
cp ./.env.development ./.env.development.local
# copy the production template
cp ./.env.production ./.env.production.local
```

1. Provide values for all environment variables listed in `.env.development.local` (for local development) and `.env.production.local` (for creating local production builds).

2. Finally, start the development server (see [USAGE.md](docs/USAGE.md) for more shell scripts).
```sh
npm run dev
```

1. From this point forward, any changes made to files in the codebase will be previewed live in development mode, noticeable in particular will be changes to React components (`.jsx` files) or Markdown articles (`.mdx` or `.md` files). 

Visit `localhost:3000` to see the app. Enjoy!

>NOTE: Development on GitHub codespaces may differ from this process. Please refer to their documentation for further guidance.

</br>

## Deployment

If you wish to deploy your own copy of [Embed Tableau](https://embedding-playbook.vercel.app/) these are your options:

1. Host a fork on [Vercel](https://vercel.com/home)
2. Host a fork [yourself](https://nextjs.org/docs/pages/building-your-application/deploying) (static export, Nodejs or Docker)

> NOTE: Learn more about [forking repositories here](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/fork-a-repo).

Of these options, hosting on Vercel is the most straightforward and the recommended path for beginners. It mostly consists of forking the repository, creating a free account on Vercel, connecting your profile to Github and importing your forked project.
