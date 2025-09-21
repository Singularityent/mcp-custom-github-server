# Custom GitHub MCP Server

A comprehensive Model Context Protocol (MCP) server implementation for GitHub integration, providing powerful tools for repository management, issue tracking, and code analysis.

## Features

- **Repository Management**: Create, fork, search, and manage repositories
- **Issue & PR Operations**: Create, update, and manage issues and pull requests
- **Code Analysis**: Search code, get file contents, and analyze repositories
- **Security Tools**: Access code scanning, dependabot alerts, and security advisories
- **Workflow Management**: View and manage GitHub Actions workflows
- **Notifications**: Handle GitHub notifications and subscriptions

## Installation

### Prerequisites

- Node.js 18+ or Python 3.8+
- GitHub Personal Access Token with appropriate scopes

### Setup

1. Clone this repository:
```bash
git clone https://github.com/Singularityent/mcp-custom-github-server.git
cd mcp-custom-github-server
```

2. Install dependencies:
```bash
npm install
# or
pip install -r requirements.txt
```

3. Set up your GitHub token:
```bash
export GITHUB_PERSONAL_ACCESS_TOKEN="your_token_here"
```

4. Run the server:
```bash
npm start
# or
python server.py
```

## Configuration

The server can be configured through environment variables:

- `GITHUB_PERSONAL_ACCESS_TOKEN`: Your GitHub personal access token
- `GITHUB_HOST`: GitHub hostname (default: api.github.com)
- `LOG_LEVEL`: Logging level (default: info)
- `PORT`: Server port (default: 3000)

## Usage

### With Cursor

Add to your `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "github-custom": {
      "command": "node",
      "args": ["server.js"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "your_token_here"
      }
    }
  }
}
```

### With Claude Desktop

Add to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "github-custom": {
      "command": "node",
      "args": ["server.js"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "your_token_here"
      }
    }
  }
}
```

## Available Tools

### Repository Tools
- `search_repositories`: Search for repositories
- `get_repository`: Get repository details
- `create_repository`: Create a new repository
- `fork_repository`: Fork an existing repository

### Issue & PR Tools
- `list_issues`: List repository issues
- `create_issue`: Create a new issue
- `update_issue`: Update an existing issue
- `list_pull_requests`: List pull requests
- `create_pull_request`: Create a new pull request

### Code Tools
- `search_code`: Search code across repositories
- `get_file_contents`: Get file contents
- `list_branches`: List repository branches
- `create_branch`: Create a new branch

### Security Tools
- `list_code_scanning_alerts`: List code scanning alerts
- `list_dependabot_alerts`: List Dependabot alerts
- `list_secret_scanning_alerts`: List secret scanning alerts

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions, please open an issue on GitHub.