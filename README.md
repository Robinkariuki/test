# Server Fleet Monitor

A full-stack application for monitoring server fleets, tracking metrics, and managing alerts.

## Tech Stack

| Layer    | Technology                                      |
|----------|-------------------------------------------------|
| Backend  | Laravel 11.x, MySQL                             |
| Frontend | Next.js 15.x, TypeScript, Tailwind CSS, TanStack Query |

---

## Quick Start

### Backend
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve          # http://localhost:8000
```

### Frontend
```bash
cd frontend
npm install
echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api" > .env.local
npm run dev                # http://localhost:3000
```

---

## Database Schema

### `servers`
| Column | Type |
|---|---|
| id | primary |
| name, hostname, ip_address | string |
| environment | production / staging / development |
| status | online / degraded / offline |
| last_checked_at | timestamp |

### `server_metrics`
| Column | Type |
|---|---|
| server_id | foreign |
| cpu_usage, memory_usage, disk_usage | float |
| network_in, network_out | float |
| process_count | integer |
| recorded_at | timestamp |

### `alerts`
| Column | Type |
|---|---|
| server_id | foreign |
| type, severity | warning / critical |
| message | text |
| is_resolved | boolean |
| resolved_at | timestamp |

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/servers` | List all servers |
| POST | `/api/servers` | Create server |
| GET | `/api/servers/{server}` | Get server details |
| PUT | `/api/servers/{server}` | Update server |
| DELETE | `/api/servers/{server}` | Delete server |
| GET | `/api/servers/{server}/metrics` | Get metrics |
| POST | `/api/servers/{server}/metrics` | Add metric |
| GET | `/api/servers/{server}/alerts` | Get alerts |
| PATCH | `/api/servers/{server}/alerts/{alert}/resolve` | Resolve alert |
| DELETE | `/api/servers/{server}/alerts/{alert}` | Delete alert |

---

## Environment Variables

**Backend** (`backend/.env`)
```env
APP_NAME="Server Fleet Monitor"
APP_URL=http://localhost:8000
DB_CONNECTION=mysql
DB_DATABASE=fleet_monitor
DB_USERNAME=root
DB_PASSWORD=
```

**Frontend** (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

---

## Useful Commands

**Backend**
```bash
php artisan migrate:fresh       # Reset database
php artisan route:list          # List routes
php artisan optimize:clear      # Clear all cache
```

**Frontend**
```bash
npm run build                   # Production build
npm run type-check              # TypeScript check
rm -rf .next && npm run dev     # Clear Next.js cache
```

---

## Troubleshooting

**Port conflicts**
```bash
php artisan serve --port=8001
npm run dev -- --port=3001
```

**CORS issues** — add to `backend/.env`:
```env
SANCTUM_STATEFUL_DOMAINS=localhost:3000
SESSION_DOMAIN=localhost
```

---

## License

MIT