import { Env } from './index';
import { Request } from '@cloudflare/workers-types';

export async function onPost(request: Request, env: Env): Promise<Response> {
	const url = new URL(request.url);
	const objectName = url.pathname.slice(1);
	console.log(`${request.method} object ${objectName}: ${request.url}`);
	if (await env.MY_BUCKET.head(objectName)) {
		return new Response(`R2 object "${objectName}" already exists`, {
			status: 409,
		});
	}
	const headers = new Headers();
	await env.MY_BUCKET.put(objectName, await request.body);
	headers.set('Access-Control-Allow-Origin', '*');
	return new Response(`R2 object "${objectName}" created`, {
		status: 201,
		headers
	});
}
