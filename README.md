# Staxiv

A self-hosted C# and Blazor management console for Docker and Docker Compose.

![Status](https://img.shields.io/badge/status-alpha-orange)
![.NET](https://img.shields.io/badge/.NET-9.0-512BD4?logo=dotnet&logoColor=white)
![Blazor](https://img.shields.io/badge/Blazor-Server-512BD4?logo=blazor&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-ready-2496ED?logo=docker&logoColor=white)

Staxiv provides an approachable stack workflow, a built-in application catalog
for one-click self-hosting, and Docker environment management from a single
container. It talks to the Docker host through the Docker CLI and stores managed
stacks as ordinary Compose files on disk.

## Features

Staxiv is early alpha software. Current features include:

- Authentication, account management, and two-factor authentication
- First-run administrator setup with public registration disabled afterward
- Docker engine overview and container discovery
- Compose stack discovery, creation, editing, and lifecycle actions
- Built-in application catalog with parameterized Compose previews
- Image, network, and volume management
- Container logs and terminal access
- Audit events and Docker engine event monitoring
- Stack backups and replication
- Remote Docker hosts through Staxiv Agent
- Registry credentials and update checks

## Quick start

### Prerequisites

- Docker Engine with the Docker Compose v2 plugin (`docker compose`)
- Docker Desktop when running on Windows or macOS

### Run Staxiv

Clone this release repository and start the bundled Compose configuration:

```bash
git clone https://github.com/stoxello/Staxiv-Releases.git
cd Staxiv-Releases
docker compose up -d
```

Open **http://localhost:8080**, create the initial administrator account, and
sign in.

The bundled [`compose.yaml`](compose.yaml) pulls the published image
`ghcr.io/stoxello/staxiv:latest` with `pull_policy: always`. No source checkout
or local image build is required.

To use another host port, create a `.env` file beside `compose.yaml`:

```dotenv
STAXIV_PORT=9000
```

To pin or override the image, set `STAXIV_IMAGE`:

```dotenv
STAXIV_IMAGE=ghcr.io/stoxello/staxiv:latest
```

If the GHCR package is private, run `docker login ghcr.io` before starting the
container.

## Compose configuration

```yaml
services:
  staxiv:
    image: ${STAXIV_IMAGE:-ghcr.io/stoxello/staxiv:latest}
    pull_policy: always
    container_name: staxiv
    restart: unless-stopped
    ports:
      - "${STAXIV_PORT:-8080}:8080"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - ./data:/app/data
      - ./keys:/app/keys
      - ./stacks:/opt/stacks
```

## Persistent data

Keep the three writable directories beside `compose.yaml` to preserve state
across upgrades.

| Host path | Container path | Purpose |
| --- | --- | --- |
| `/var/run/docker.sock` | `/var/run/docker.sock` | Lets Staxiv manage the host Docker engine |
| `./data` | `/app/data` | SQLite data, registered agents, replication plans, and local metadata |
| `./keys` | `/app/keys` | ASP.NET Core data-protection keys |
| `./stacks` | `/opt/stacks` | Compose stacks created and managed by Staxiv |

## Configuration

| Variable | Default | Description |
| --- | --- | --- |
| `STAXIV_IMAGE` | `ghcr.io/stoxello/staxiv:latest` | Container image pulled by Compose |
| `STAXIV_PORT` | `8080` | Host port mapped to the web interface |
| `ASPNETCORE_URLS` | `http://+:8080` | Address used inside the container |
| `ConnectionStrings__DefaultConnection` | `DataSource=/app/data/staxiv.db` | SQLite connection string |
| `Staxiv__DataPath` | `/app/data` | Persistent application state |
| `Staxiv__StacksPath` | `/opt/stacks` | Managed Compose stack directory |
| `Staxiv__DataProtectionPath` | `/app/keys` | Persisted data-protection keys |

## Updating

From the directory containing `compose.yaml`:

```bash
docker compose pull
docker compose up -d
```

The mounted data, keys, and stack directories are preserved when the container
is recreated.

## Security

Staxiv mounts `/var/run/docker.sock`. Access to this socket is equivalent to
administrative control of the Docker host.

- Keep Staxiv behind a reverse proxy that terminates HTTPS.
- Do not expose the application directly to the public internet.
- Treat anyone who can reach the interface as a host administrator.
- Back up the `data`, `keys`, and `stacks` directories regularly.

## License

Staxiv is proprietary commercial software. Use requires a valid commercial
order or written agreement with Stoxello. See [LICENSE](LICENSE) for the terms.

Documentation is available at
[stoxello.github.io/Staxiv-Releases](https://stoxello.github.io/Staxiv-Releases/).
