import { authorizeRequest } from './auth';
import { Request } from '@cloudflare/workers-types';

export interface Env {
	MY_BUCKET: R2Bucket;
	AUTH_KEY_SECRET: string;
	AUTH_JWT_URL: string;
}

function objectNotFound(objectName: string): Response {
	return new Response(`<html lang="en"><body>R2 object "<b>${objectName}</b>" not found</body></html>`, {
		status: 404,
		headers: {
			'content-type': 'text/html; charset=UTF-8',
		},
	});
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url);
		const objectName = url.pathname.slice(1);

		console.log(`${request.method} object ${objectName}: ${request.url}`);

		if (!await authorizeRequest(request, env)) {
			return new Response(`Unauthorized`, {
				status: 401,
			});
		}

		if (request.method == 'GET') {
			const object = await env.MY_BUCKET.get(objectName);

			if (object === null) {
				return objectNotFound(objectName);
			}

			const headers = new Headers();
			object.writeHttpMetadata(headers);
			headers.set('etag', object.httpEtag);

			return new Response(object.body, {
				headers,
			});
		} else if (request.method == 'PUT' || request.method == 'POST') {
			await env.MY_BUCKET.put(objectName, request.body);
			return new Response(`R2 object "${objectName}" created`, {
				status: 201,
			});
		}

		return new Response(`Unsupported method`, {
			status: 405,
		});
	},
};
