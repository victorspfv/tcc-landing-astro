# Clique Landing Page

A modern, responsive landing page for Clique built with Astro and React. This project showcases the organization's mission, team, philanthropy efforts, and provides contact information.

## 📋 Project Overview

This landing page serves as the online presence for Clique, featuring:
- A welcoming homepage with hero section
- About page with organization information
- Team showcase (Clique Crew)
- Philanthropy initiatives
- Contact form with email functionality

## 🚀 Project Structure

```text
/
├── public/               # Static assets
├── src/
│   ├── actions/          # API and form handling logic
│   ├── assets/           # Images and other assets
│   ├── components/       # Reusable UI components
│   │   ├── ComingSoon.astro
│   │   ├── Footer.astro
│   │   ├── Header.astro
│   │   ├── Hero.astro
│   │   ├── Instagram.astro
│   │   ├── TeamCard.astro
│   │   ├── Welcome.astro
│   │   └── ... (other components)
│   ├── layouts/          # Page layouts
│   │   └── Layout.astro
│   ├── pages/            # Page components
│   │   ├── about.astro
│   │   ├── clique-crew.astro
│   │   ├── contact.astro
│   │   ├── index.astro
│   │   └── philanthropy.astro
│   └── styles/           # CSS and styling files
└── package.json
```

## 📄 Available Pages

- **Home** (`/`): Main landing page with hero section, welcome message, and Instagram feed
- **About** (`/about`): Information about Clique and its mission
- **Clique Crew** (`/clique-crew`): Team members showcase
- **Philanthropy** (`/philanthropy`): Information about charitable initiatives
- **Contact** (`/contact`): Contact form and information

## 🛠️ Technologies Used

- **[Astro](https://astro.build/)**: Core framework for building the site
- **[React](https://reactjs.org/)**: For interactive components
- **[TailwindCSS](https://tailwindcss.com/)**: For styling
- **[React Hook Form](https://react-hook-form.com/)**: For form handling
- **[Zod](https://zod.dev/)**: For form validation
- **[Nodemailer](https://nodemailer.com/)**: For email functionality
- **[Vercel](https://vercel.com/)**: For deployment

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |

## 🚀 Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Start the development server with `npm run dev`
4. Open your browser and navigate to `http://localhost:4321`

## 📝 Development Notes

- The site is configured for deployment on Vercel
- Form submissions are handled through server-side functions
- The Instagram component displays recent posts from the Clique Instagram account

## 📚 Additional Resources

- [Astro Documentation](https://docs.astro.build)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [React Documentation](https://reactjs.org/docs)