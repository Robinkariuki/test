markdown
# Server Fleet Monitor

A full-stack application for monitoring server fleets, tracking metrics, and managing alerts.

## Tech Stack
- **Backend:** Laravel 11.x, MySQL
- **Frontend:** Next.js 15.x, TypeScript, Tailwind CSS, TanStack Query

## Project Structure
server-fleet-monitor/
├── backend/ # Laravel application
│ ├── app/
│ │ ├── Http/Controllers/Api/
│ │ │ ├── ServerController.php
│ │ │ ├── MetricController.php
│ │ │ └── AlertController.php
│ │ ├── Models/
│ │ │ ├── Server.php
│ │ │ ├── ServerMetric.php
│ │ │ └── Alert.php
│ │ └── Services/AlertService.php
│ ├── database/migrations/
│ └── routes/api.php
└── frontend/ # Next.js application
├── src/
│ ├── app/
│ ├── components/
│ ├── hooks/
│ ├── lib/
│ └── types/
└── public/

text

## Quick Installation

### Backend Setup
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
# Configure database in .env
php artisan migrate
php artisan serve
# Backend runs on http://localhost:8000
Frontend Setup
bash
cd frontend
npm install
echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api" > .env.local
npm run dev
# Frontend runs on http://localhost:3000
Database Schema
Servers Table
sql
- id (primary)
- name, hostname, ip_address
- environment (production/staging/development)
- status (online/degraded/offline)
- last_checked_at (timestamp)
- soft_deletes, timestamps
Server Metrics Table
sql
- id (primary)
- server_id (foreign)
- cpu_usage, memory_usage, disk_usage (float)
- process_count (integer)
- network_in, network_out (float)
- recorded_at (timestamp)
- timestamps
Alerts Table
sql
- id (primary)
- server_id (foreign)
- type, severity (warning/critical)
- message (text)
- is_resolved (boolean)
- resolved_at (timestamp)
- timestamps
API Endpoints
Method	Endpoint	Description
GET	/api/servers	List all servers
POST	/api/servers	Create server
GET	/api/servers/{server}	Get server details
PUT	/api/servers/{server}	Update server
DELETE	/api/servers/{server}	Delete server
GET	/api/servers/{server}/metrics	Get server metrics
POST	/api/servers/{server}/metrics	Add metric
GET	/api/servers/{server}/alerts	Get server alerts
PATCH	/api/servers/{server}/alerts/{alert}/resolve	Resolve alert
DELETE	/api/servers/{server}/alerts/{alert}	Delete alert
API Examples
Create Server
bash
curl -X POST http://localhost:8000/api/servers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Web Server 01",
    "hostname": "web01.example.com",
    "ip_address": "192.168.1.100",
    "environment": "production",
    "status": "online"
  }'
Add Metrics
bash
curl -X POST http://localhost:8000/api/servers/1/metrics \
  -H "Content-Type: application/json" \
  -d '{
    "cpu_usage": 45.5,
    "memory_usage": 60.2,
    "disk_usage": 35.0,
    "network_in": 1024000,
    "network_out": 512000,
    "recorded_at": "2024-01-15T10:30:00"
  }'
Resolve Alert
bash
curl -X PATCH http://localhost:8000/api/servers/1/alerts/1/resolve
Frontend Type Definitions
typescript
// src/types/index.ts
export type ServerStatus = 'online' | 'degraded' | 'offline';
export type AlertSeverity = 'warning' | 'critical';

export type ServerMetric = {
  cpu_usage: number;
  memory_usage: number;
  disk_usage: number;
  network_in: number;
  network_out: number;
  recorded_at: string;
};

export type Server = {
  id: number;
  name: string;
  hostname: string;
  ip_address: string;
  environment: string;
  status: ServerStatus;
  last_checked_at: string | null;
  latest_metric: ServerMetric | null;
  alerts_count: number;
};

export type Alert = {
  id: number;
  server_id: number;
  type: string;
  severity: AlertSeverity;
  message: string;
  resolved: boolean;
  resolved_at: string | null;
  created_at: string;
  server: { id: number; name: string; hostname: string };
};
Frontend Hooks
typescript
// src/hooks/useFleetData.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export function useServers() {
  return useQuery<Server[]>({
    queryKey: ['servers'],
    queryFn: () => api.get('/servers').then(r => r.data),
  });
}

export function useServer(serverId: number) {
  return useQuery<Server>({
    queryKey: ['servers', serverId],
    queryFn: () => api.get(`/servers/${serverId}`).then(r => r.data),
    enabled: !!serverId,
  });
}

export function useServerAlerts(serverId: number, resolved?: boolean) {
  return useQuery<Alert[]>({
    queryKey: ['servers', serverId, 'alerts', resolved],
    queryFn: () => {
      const params = resolved !== undefined ? { is_resolved: resolved } : {};
      return api.get(`/servers/${serverId}/alerts`, { params }).then(r => r.data);
    },
    enabled: !!serverId,
  });
}

export function useServerMetrics(serverId: number, limit?: number) {
  return useQuery<ServerMetric[]>({
    queryKey: ['servers', serverId, 'metrics', limit],
    queryFn: () => {
      const params = limit ? { limit } : {};
      return api.get(`/servers/${serverId}/metrics`, { params }).then(r => r.data);
    },
    enabled: !!serverId,
  });
}

export function useResolveAlert(serverId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (alertId: number) => 
      api.patch(`/servers/${serverId}/alerts/${alertId}/resolve`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servers', serverId, 'alerts'] });
    },
  });
}
Environment Variables
Backend (.env)
env
APP_NAME="Server Fleet Monitor"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=fleet_monitor
DB_USERNAME=root
DB_PASSWORD=
Frontend (.env.local)
env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
Useful Commands
Backend
bash
php artisan migrate:fresh  # Reset and run migrations
php artisan make:model ModelName -m  # Create model with migration
php artisan make:controller Api/ControllerName  # Create controller
php artisan route:list  # List all routes
php artisan tinker  # Interactive shell
Frontend
bash
npm run dev      # Start development server
npm run build    # Create production build
npm run start    # Run production server
npm run lint     # Run ESLint
npm run type-check  # Run TypeScript compiler
Troubleshooting
Port Already in Use
bash
# Change Laravel port
php artisan serve --port=8001

# Change Next.js port
npm run dev -- --port=3001
CORS Issues
Add to Laravel .env:

env
SANCTUM_STATEFUL_DOMAINS=localhost:3000
SESSION_DOMAIN=localhost
Clear Laravel Cache
bash
php artisan optimize:clear
php artisan route:clear
php artisan config:clear
php artisan cache:clear
Clear Next.js Cache
bash
rm -rf .next
npm run dev
License
MIT

text

This README contains everything you need in a single file - installation steps, database schema, API documentation, code examples, and troubleshooting guides.
