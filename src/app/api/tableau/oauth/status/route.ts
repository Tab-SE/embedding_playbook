import { NextResponse } from 'next/server';
import { getAccessToken } from '../../../chat/agent/tableau-oauth';

export async function GET() {
  // Only relevant when using the hosted mcp.tableau.com
  const mcpUrl = process.env.TABLEAU_MCP_URL ?? '';
  if (!mcpUrl.includes('mcp.tableau.com')) {
    return NextResponse.json({ ready: true, required: false });
  }

  try {
    await getAccessToken();
    return NextResponse.json({ ready: true, required: true });
  } catch {
    return NextResponse.json({ ready: false, required: true });
  }
}
