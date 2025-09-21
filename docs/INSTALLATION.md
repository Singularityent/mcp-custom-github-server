# Installation Guide

This guide will help you install and configure the Custom GitHub MCP Server.

## Prerequisites

Before installing the server, ensure you have:

- **Node.js 18+**: Download from [nodejs.org](https://nodejs.org/)
- **GitHub Personal Access Token**: Create one at [github.com/settings/tokens](https://github.com/settings/tokens)

### Required GitHub Token Scopes

Your GitHub Personal Access Token needs the following scopes:

- `repo` - Full control of private repositories
- `read:org` - Read org and team membership
- `read:user` - Read user profile data
- `user:email` - Access user email addresses

## Installation Methods

### Method 1: Direct Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Singularityent/mcp-custom-github-server.git
   cd mcp-custom-github-server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   export GITHUB_PERSONAL_ACCESS_TOKEN="your_token_here"
   ```

4. **Test the installation:**
   ```bash
   npm start
   ```

### Method 2: Global Installation

1. **Install globally:**
   ```bash
   npm install -g github-custom-mcp-server
   ```

2. **Set up environment variables:**
   ```bash
   export GITHUB_PERSONAL_ACCESS_TOKEN="your_token_here"
   ```

3. **Run the server:**
   ```bash
   github-mcp-server
   ```

## Configuration

### For Cursor IDE

1. **Open Cursor Settings:**
   - Press `Cmd+,` (Mac) or `Ctrl+,` (Windows/Linux)
   - Navigate to "Tools & Integrations" → "MCP Tools"

2. **Add the server configuration:**
   ```json
   {
     "mcpServers": {
       "github-custom": {
         "command": "node",
         "args": ["/path/to/mcp-custom-github-server/server.js"],
         "env": {
           "GITHUB_PERSONAL_ACCESS_TOKEN": "your_token_here"
         }
       }
     }
   }
   ```

3. **Restart Cursor** to load the new configuration.

### For Claude Desktop

1. **Locate your Claude Desktop configuration file:**
   - **Mac**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

2. **Add the server configuration:**
   ```json
   {
     "mcpServers": {
       "github-custom": {
         "command": "node",
         "args": ["/path/to/mcp-custom-github-server/server.js"],
         "env": {
           "GITHUB_PERSONAL_ACCESS_TOKEN": "your_token_here"
         }
       }
     }
   }
   ```

3. **Restart Claude Desktop** to load the new configuration.

## Verification

To verify the installation is working:

1. **Check server status** in your MCP client (Cursor/Claude Desktop)
2. **Test a simple command** like "List my GitHub repositories"
3. **Check the logs** for any error messages

## Troubleshooting

### Common Issues

**Server not starting:**
- Verify Node.js version is 18+
- Check that all dependencies are installed
- Ensure the GitHub token is valid

**Authentication errors:**
- Verify the GitHub token has the required scopes
- Check that the token hasn't expired
- Ensure the token is properly set in environment variables

**Connection issues:**
- Check your internet connection
- Verify GitHub API is accessible
- Check firewall settings

### Getting Help

If you encounter issues:

1. Check the [GitHub Issues](https://github.com/Singularityent/mcp-custom-github-server/issues)
2. Review the logs for error messages
3. Ensure you're using the latest version

## Security Notes

- **Never commit your GitHub token** to version control
- **Use environment variables** to store sensitive information
- **Regularly rotate your tokens** for security
- **Use minimal required scopes** for your use case