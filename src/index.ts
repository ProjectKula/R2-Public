import { authorizeRequest } from './auth';
import { Request } from '@cloudflare/workers-types';
import { onPost } from './post';
import { onGet } from './get';

export interface Env {
	MY_BUCKET: R2Bucket;
	AUTH_KEY_SECRET: string;
	AUTH_JWT_URL: string;
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		if (!await authorizeRequest(request, env)) {
			return new Response(`Unauthorized`, {
				status: 401,
			});
		}

		if (request.method == 'GET') {
			return onGet(request, env);
		} else if (request.method == 'PUT' || request.method == 'POST') {
			return onPost(request, env);
		}

		return new Response(`Unsupported method`, {
			status: 405,
		});
	},
};
