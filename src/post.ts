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
	await env.MY_BUCKET.put(objectName, request.body);
	return new Response(`R2 object "${objectName}" created`, {
		status: 201,
	});
}
