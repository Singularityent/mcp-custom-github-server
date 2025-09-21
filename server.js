#!/usr/bin/env node

/**
 * Custom GitHub MCP Server
 * A comprehensive Model Context Protocol server for GitHub integration
 */

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} = require('@modelcontextprotocol/sdk/types.js');

// GitHub API client
const { Octokit } = require('@octokit/rest');

class GitHubMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'github-custom-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.octokit = new Octokit({
      auth: process.env.GITHUB_PERSONAL_ACCESS_TOKEN,
    });

    this.setupToolHandlers();
  }

  setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'search_repositories',
            description: 'Search for GitHub repositories',
            inputSchema: {
              type: 'object',
              properties: {
                query: {
                  type: 'string',
                  description: 'Search query for repositories',
                },
                sort: {
                  type: 'string',
                  enum: ['stars', 'forks', 'updated'],
                  description: 'Sort order for results',
                },
                per_page: {
                  type: 'number',
                  description: 'Number of results per page (max 100)',
                  default: 30,
                },
              },
              required: ['query'],
            },
          },
          {
            name: 'get_repository',
            description: 'Get detailed information about a specific repository',
            inputSchema: {
              type: 'object',
              properties: {
                owner: {
                  type: 'string',
                  description: 'Repository owner (username or organization)',
                },
                repo: {
                  type: 'string',
                  description: 'Repository name',
                },
              },
              required: ['owner', 'repo'],
            },
          },
          {
            name: 'list_issues',
            description: 'List issues in a repository',
            inputSchema: {
              type: 'object',
              properties: {
                owner: {
                  type: 'string',
                  description: 'Repository owner',
                },
                repo: {
                  type: 'string',
                  description: 'Repository name',
                },
                state: {
                  type: 'string',
                  enum: ['open', 'closed', 'all'],
                  description: 'Issue state',
                  default: 'open',
                },
                per_page: {
                  type: 'number',
                  description: 'Number of issues per page',
                  default: 30,
                },
              },
              required: ['owner', 'repo'],
            },
          },
          {
            name: 'create_issue',
            description: 'Create a new issue in a repository',
            inputSchema: {
              type: 'object',
              properties: {
                owner: {
                  type: 'string',
                  description: 'Repository owner',
                },
                repo: {
                  type: 'string',
                  description: 'Repository name',
                },
                title: {
                  type: 'string',
                  description: 'Issue title',
                },
                body: {
                  type: 'string',
                  description: 'Issue body/description',
                },
                labels: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Labels to assign to the issue',
                },
              },
              required: ['owner', 'repo', 'title'],
            },
          },
          {
            name: 'search_code',
            description: 'Search for code across GitHub repositories',
            inputSchema: {
              type: 'object',
              properties: {
                query: {
                  type: 'string',
                  description: 'Code search query',
                },
                sort: {
                  type: 'string',
                  enum: ['indexed', 'best-match'],
                  description: 'Sort order for results',
                },
                per_page: {
                  type: 'number',
                  description: 'Number of results per page',
                  default: 30,
                },
              },
              required: ['query'],
            },
          },
          {
            name: 'get_file_contents',
            description: 'Get the contents of a file from a repository',
            inputSchema: {
              type: 'object',
              properties: {
                owner: {
                  type: 'string',
                  description: 'Repository owner',
                },
                repo: {
                  type: 'string',
                  description: 'Repository name',
                },
                path: {
                  type: 'string',
                  description: 'File path in the repository',
                },
                ref: {
                  type: 'string',
                  description: 'Git reference (branch, tag, or commit SHA)',
                  default: 'main',
                },
              },
              required: ['owner', 'repo', 'path'],
            },
          },
        ],
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'search_repositories':
            return await this.searchRepositories(args);
          case 'get_repository':
            return await this.getRepository(args);
          case 'list_issues':
            return await this.listIssues(args);
          case 'create_issue':
            return await this.createIssue(args);
          case 'search_code':
            return await this.searchCode(args);
          case 'get_file_contents':
            return await this.getFileContents(args);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error.message}`,
            },
          ],
        };
      }
    });
  }

  async searchRepositories(args) {
    const { query, sort = 'stars', per_page = 30 } = args;
    
    const response = await this.octokit.rest.search.repos({
      q: query,
      sort,
      per_page,
    });

    const repositories = response.data.items.map(repo => ({
      name: repo.name,
      full_name: repo.full_name,
      description: repo.description,
      html_url: repo.html_url,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language,
      updated_at: repo.updated_at,
    }));

    return {
      content: [
        {
          type: 'text',
          text: `Found ${repositories.length} repositories:\n\n${repositories
            .map(repo => `- **${repo.full_name}**: ${repo.description || 'No description'}\n  🌟 ${repo.stars} stars | 🍴 ${repo.forks} forks | 📅 ${new Date(repo.updated_at).toLocaleDateString()}`)
            .join('\n')}`,
        },
      ],
    };
  }

  async getRepository(args) {
    const { owner, repo } = args;
    
    const response = await this.octokit.rest.repos.get({
      owner,
      repo,
    });

    const repository = response.data;

    return {
      content: [
        {
          type: 'text',
          text: `**${repository.full_name}**\n\n` +
                `📝 ${repository.description || 'No description'}\n` +
                `🌟 ${repository.stargazers_count} stars\n` +
                `🍴 ${repository.forks_count} forks\n` +
                `👀 ${repository.watchers_count} watchers\n` +
                `📅 Created: ${new Date(repository.created_at).toLocaleDateString()}\n` +
                `🔄 Updated: ${new Date(repository.updated_at).toLocaleDateString()}\n` +
                `🌐 Language: ${repository.language || 'Unknown'}\n` +
                `🔗 URL: ${repository.html_url}`,
        },
      ],
    };
  }

  async listIssues(args) {
    const { owner, repo, state = 'open', per_page = 30 } = args;
    
    const response = await this.octokit.rest.issues.listForRepo({
      owner,
      repo,
      state,
      per_page,
    });

    const issues = response.data.map(issue => ({
      number: issue.number,
      title: issue.title,
      state: issue.state,
      labels: issue.labels.map(label => label.name),
      created_at: issue.created_at,
      updated_at: issue.updated_at,
      html_url: issue.html_url,
    }));

    return {
      content: [
        {
          type: 'text',
          text: `Found ${issues.length} ${state} issues in ${owner}/${repo}:\n\n${issues
            .map(issue => `- **#${issue.number}**: ${issue.title}\n  🏷️ ${issue.labels.join(', ') || 'No labels'}\n  📅 ${new Date(issue.updated_at).toLocaleDateString()}`)
            .join('\n')}`,
        },
      ],
    };
  }

  async createIssue(args) {
    const { owner, repo, title, body, labels = [] } = args;
    
    const response = await this.octokit.rest.issues.create({
      owner,
      repo,
      title,
      body,
      labels,
    });

    const issue = response.data;

    return {
      content: [
        {
          type: 'text',
          text: `✅ Successfully created issue #${issue.number}: "${issue.title}"\n\n` +
                `🔗 URL: ${issue.html_url}\n` +
                `📅 Created: ${new Date(issue.created_at).toLocaleDateString()}`,
        },
      ],
    };
  }

  async searchCode(args) {
    const { query, sort = 'indexed', per_page = 30 } = args;
    
    const response = await this.octokit.rest.search.code({
      q: query,
      sort,
      per_page,
    });

    const codeResults = response.data.items.map(item => ({
      name: item.name,
      path: item.path,
      repository: item.repository.full_name,
      html_url: item.html_url,
      score: item.score,
    }));

    return {
      content: [
        {
          type: 'text',
          text: `Found ${codeResults.length} code results:\n\n${codeResults
            .map(result => `- **${result.repository}/${result.path}**\n  📁 ${result.name}\n  🔗 ${result.html_url}`)
            .join('\n')}`,
        },
      ],
    };
  }

  async getFileContents(args) {
    const { owner, repo, path, ref = 'main' } = args;
    
    const response = await this.octokit.rest.repos.getContent({
      owner,
      repo,
      path,
      ref,
    });

    if (Array.isArray(response.data)) {
      // Directory listing
      const files = response.data.map(item => ({
        name: item.name,
        type: item.type,
        path: item.path,
        size: item.size,
        download_url: item.download_url,
      }));

      return {
        content: [
          {
            type: 'text',
            text: `Directory contents for ${owner}/${repo}/${path}:\n\n${files
              .map(file => `- **${file.name}** (${file.type})${file.size ? ` - ${file.size} bytes` : ''}`)
              .join('\n')}`,
          },
        ],
      };
    } else {
      // Single file
      const content = Buffer.from(response.data.content, 'base64').toString('utf-8');
      
      return {
        content: [
          {
            type: 'text',
            text: `File: ${owner}/${repo}/${path}\n\n\`\`\`\n${content}\n\`\`\``,
          },
        ],
      };
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('GitHub MCP Server running on stdio');
  }
}

// Start the server
if (require.main === module) {
  const server = new GitHubMCPServer();
  server.run().catch(console.error);
}

module.exports = GitHubMCPServer;