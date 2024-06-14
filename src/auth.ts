import { Request } from '@cloudflare/workers-types';
import { Env } from './index';

async function authorizeFromBackend(request: Request, env: Env): Promise<boolean> {
	let jwt = request.headers.get("Authorization");
	if (!jwt) {
		return false;
	}
	let authUrl = env.AUTH_JWT_URL;
	let resp = await fetch(authUrl, {
		headers: {
			"Authorization": jwt,
		},
	});

	return resp.ok;
}

export async function authorizeRequest(request: Request, env: Env) {
	switch (request.method) {
		case 'POST':
			return request.headers.get('X-Auth-Key') === env.AUTH_KEY_SECRET || await authorizeFromBackend(request, env);
		default:
			return true;
	}
}
