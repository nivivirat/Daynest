import { PantryState } from './domain';
import { stateSchema } from './schema';
export type Connection = { url: string; token: string; version: number };
export async function cloudRequest(
  connection: Omit<Connection, 'version'>,
  state?: PantryState,
  version?: number,
) {
  const url = connection.url.replace(/\/+$/, '');
  if (!/^https?:\/\//.test(url))
    throw new Error('Enter an API URL beginning with https:// or http://.');
  if (!connection.token.trim())
    throw new Error('Enter the personal API token configured on your server.');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(`${url}/v1/state`, {
      method: state ? 'PUT' : 'GET',
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${connection.token.trim()}`,
        'Content-Type': 'application/json',
      },
      ...(state ? { body: JSON.stringify({ state, version }) } : {}),
    });
    if (response.status === 409)
      throw new Error(
        'Another device saved changes. Load the latest cloud pantry before saving again. Your local changes are still here.',
      );
    if (response.status === 401)
      throw new Error('The API token is incorrect. Check your server configuration.');
    if (!response.ok)
      throw new Error(
        'The server could not complete this request. Check the API and database setup.',
      );
    const body = await response.json();
    if (!Number.isInteger(body.version) || body.version < 0)
      throw new Error('The server returned an invalid version.');
    return { state: stateSchema.parse(body.state), version: body.version as number };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError')
      throw new Error('Connection timed out. Your local data is unchanged.');
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
