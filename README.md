# R2-Public

R2-Public is a project that exposes R2 to the internet. It provides a RESTful API for performing various operations on R2. Class B operations (GET) are unauthenticated, while Class A operations (PUT, DELETE, POST) require authentication using the X-Auth-Key header and a preshared secret.

## Getting Started

Make sure you have wrangler installed first. To get started with R2-Public, follow these steps:

1. Clone the repository: `git clone https://github.com/ProjectKula/R2-Public.git`
2. Install the dependencies: `yarn install`
3. Configure the preshared secret using `wrangler secret put AUTH_KEY_SECRET`
4. Start the server: `wrangler dev`

## API Endpoints

The following API endpoints are available:

### Class B Operations (Unauthenticated)

- `GET /<resource>`: Retrieves a resource.

### Class A Operations (Authenticated)

- `PUT /<resource>`: Creates / updates a resource.
- `DELETE /<resource>`: Deletes a resource.
- `POST /<resource>`: Creates / updates a new resource.

## Authentication

To authenticate Class A operations, include the `X-Auth-Key` header in your requests with the preshared secret as the value.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
