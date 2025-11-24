import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

export class MCPClient {
  private client: Client;
  private transport: StdioClientTransport;

  constructor() {
    // Initialize transport (this is a basic example)
    this.transport = new StdioClientTransport({
      command: "node",
      args: ["--version"], // Replace with your MCP server command
    });
    
    this.client = new Client(
      {
        name: "ui-design-system",
        version: "1.0.0",
      },
      {
        capabilities: {},
      }
    );
  }

  async connect() {
    try {
      await this.client.connect(this.transport);
      console.log("MCP client connected");
      return true;
    } catch (error) {
      console.error("Failed to connect MCP client:", error);
      return false;
    }
  }

  async disconnect() {
    try {
      await this.client.close();
      console.log("MCP client disconnected");
    } catch (error) {
      console.error("Failed to disconnect MCP client:", error);
    }
  }

  getClient() {
    return this.client;
  }
}

export const mcpClient = new MCPClient();