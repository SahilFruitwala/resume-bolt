# ResumeBolt

ResumeBolt is an AI-powered resume and cover letter analysis tool that provides actionable feedback to optimize your job applications for ATS systems and land more interviews.

## Features

- **AI-Powered Resume Analysis:** Get instant, detailed feedback on your resume using advanced AI models.
- **Cover Letter Optimization:** Analyze and improve your cover letters for specific job descriptions.
- **ATS Compatibility Checking:** Ensure your resume passes Applicant Tracking Systems with tailored recommendations.
- **Keyword Optimization:** Identify missing and matching keywords for your target job.
- **Actionable Recommendations:** Receive concrete suggestions for rewriting bullet points, summaries, and more.
- **Progress Tracking:** View your analysis history and track improvements over time.

## Getting Started

1. **Clone the repository:**
   ```sh
   git clone https://github.com/yourusername/resumebolt.git
   cd resumebolt
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Set up environment variables:**
   - Copy `.env.local.example` to `.env.local` and fill in the required values below.

### Required API Keys and Environment Variables

To run ResumeBolt locally, you need to set the following environment variables in your `.env.local` file:

```env
# PostHog (Analytics)
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_project_api_key

# Database (Turso)
TURSO_DATABASE_URL=your_turso_database_url
TURSO_AUTH_TOKEN=your_turso_auth_token

# Clerk (Authentication)
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret

# OpenAI (AI Resume Analysis)
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key

# (Optional) Other integrations
# Add any other keys your setup or features require
```

4. **Run the development server:**
   ```sh
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

## Contribution Guide

We welcome contributions! To get started:

1. **Fork the repository** and create your branch from `main`.
2. **Make your changes** with clear, descriptive commit messages.
3. **Ensure code quality** by running lint and tests:
   ```sh
   npm run lint
   npm run test
   ```
4. **Submit a pull request** describing your changes and why they are needed.

### Code Style

- Follow the existing code style and structure.
- Use descriptive variable and function names.
- Write clear, concise comments where necessary.

### Issues

- If you find a bug or have a feature request, please [open an issue](https://github.com/yourusername/resumebolt/issues).

### Security

- **Never commit API keys or secrets.** Use environment variables and ensure `.env.local` is in `.gitignore`.

## License

MIT License. See [LICENSE](LICENSE) for details.

---

**ResumeBolt** – Optimize your job search with