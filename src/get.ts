import { Env } from './index';
import { Request } from '@cloudflare/workers-types';

export async function onGet(request: Request, env: Env): Promise<Response> {
	const url = new URL(request.url);
	const objectName = url.pathname.slice(1);
	console.log(`GET object ${objectName}: ${request.url}`);

	const object = await env.MY_BUCKET.get(objectName);

	if (object === null) {
		return objectNotFound(objectName);
	}

	const headers = new Headers();
	object.writeHttpMetadata(headers);
	headers.set('Access-Control-Allow-Origin', '*');
	headers.set('etag', object.httpEtag);

	return new Response(object.body, {
		headers,
	});
}

function objectNotFound(objectName: string): Response {
	return new Response(`<html lang="en"><body>R2 object "<b>${objectName}</b>" not found</body></html>`, {
		status: 404,
		headers: {
			'content-type': 'text/html; charset=UTF-8',
		},
	});
}
