# LAUNDROCLEAN

A web and mobile application for a laundromat where users can book laundry services and admins manage operations through a CRM system.

## Features

### For Users
- Book laundry pickup and delivery
- Track order status
- View pricing and available services
- Manage personal profile and order history

### For Admin (CRM)
- Manage customer bookings and orders
- Update service status and schedules
- Access customer database and analytics
- Manage pricing, services, and notifications

## Getting Started

### Prerequisites
- Node.js
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/merytpeters/Laundroclean.git
   cd Laundroclean
   ```
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
3. Set up environment variables as needed.

### Running the App
- For development:
  ```bash
  npm run dev
  # or
  yarn dev
  ```
- For production build:
  ```bash
  npm run build
  npm start
  ```

## Contributing (by Permission Only)

This project is proprietary. Contributions are only accepted from approved collaborators. 

If you are an approved contributor:

1. Fork the repo and create a feature branch.
2. Add tests for new behavior and keep commits focused.
3. Update or create Alembic migration if models change.
4. Open a pull request to `main` with a clear description and testing notes.
5. Follow the existing coding style. Use `ruff`, `black`, or other configured linters/formatters if available.


## Technologies Used
- React / Typescript
- Node.js / Express
- Posgresql, Prisma Orm, Supabase

## Database Schema
![DB Schema](docs/db-schema.drawio)

For editing, open [db-schema.drawio](docs/db-schema.drawio) in [draw.io](https://app.diagrams.net/).


## License
MIT
