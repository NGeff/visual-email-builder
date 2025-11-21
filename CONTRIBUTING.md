# Contributing to Visual Email Builder

Thank you for considering contributing to Visual Email Builder! We welcome contributions from the community.

## How to Contribute

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* Use a clear and descriptive title
* Describe the exact steps to reproduce the problem
* Provide specific examples to demonstrate the steps
* Describe the behavior you observed and what behavior you expected
* Include screenshots if relevant
* Include your environment details (OS, Node version, browser)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* Use a clear and descriptive title
* Provide a detailed description of the suggested enhancement
* Provide specific examples to demonstrate the enhancement
* Explain why this enhancement would be useful

### Pull Requests

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

#### Pull Request Guidelines

* Follow the existing code style
* Write clear, descriptive commit messages
* Include comments in your code where necessary
* Update documentation as needed
* Add tests for new features
* Ensure all tests pass before submitting

## Development Setup

1. Clone your fork of the repository
```bash
git clone https://github.com/NGeff/visual-email-builder.git
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file based on `.env.example`

4. Start the development server
```bash
npm run dev
```

## Code Style

* Use meaningful variable and function names
* Keep functions small and focused
* Comment complex logic
* Use ES6+ features where appropriate
* Follow the existing patterns in the codebase

## Project Structure

```
visual-email-builder/
├── public/              # Frontend assets
│   ├── css/            # Stylesheets
│   ├── js/             # JavaScript modules
│   └── index.html      # Main HTML file
├── server/             # Backend code
│   ├── config/         # Configuration files
│   ├── controllers/    # Request handlers
│   ├── routes/         # API routes
│   └── utils/          # Utility functions
└── README.md
```

## Testing

Currently, we don't have automated tests, but we welcome contributions to add testing infrastructure.

## Questions?

Feel free to open an issue with your question or reach out to the maintainers.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.