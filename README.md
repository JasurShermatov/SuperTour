# SuperTour

Production-style demo for a modern travel agency website built for **SuperTour.uz**.

This project combines a dynamic **Django + PostgreSQL** backend, a responsive **Next.js** frontend, an improved **Django admin panel with Jazzmin**, and an **AI chat assistant** that answers only from available website/company context.

## Overview

The goal of this project is to present a realistic travel company platform where:

- tours are managed from admin
- destinations, categories, FAQ, testimonials, and contact requests are dynamic
- the public website is fast, clean, and fully responsive
- the content structure is suitable for a real agency workflow
- the AI assistant can help users based on existing site data without inventing unsupported company facts

## Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript
- **Backend:** Django 6, Django REST Framework
- **Database:** PostgreSQL 17
- **Admin UI:** Django Jazzmin + custom admin dashboard styling
- **AI Integration:** OpenAI API
- **Containerization:** Docker + Docker Compose

## Main Features

### Frontend

- modern mobile-first landing page
- responsive layout from small phones to large desktop screens
- dynamic hero, featured tours, destinations, FAQ, testimonials, and contact sections
- detailed tour page with itinerary, departure dates, and inquiry form
- contact page with direct inquiry submission
- about page with company-oriented presentation
- sticky responsive navbar with mobile menu
- persistent AI chat widget

### Backend

- REST API for all website content
- structured models for tours, categories, destinations, itinerary days, departures, FAQs, testimonials, inquiries, and site settings
- admin-driven content management
- inquiry collection from frontend forms
- seed command for demo data population
- OpenAI-backed chat endpoint with fallback behavior when API key is missing

### Admin Panel

- Jazzmin-based improved admin appearance
- custom admin dashboard entry screen
- curated model visibility for better usability
- filters, search, ordering, and bulk actions
- inline editing for itinerary days and departure dates
- inquiry workflow statuses such as `new`, `contacted`, `reserved`, and `closed`

## Website Pages

The project currently includes these core pages:

1. **Home**  
   Hero, moving strip, featured tours, destinations, values, trust/safety, testimonials, FAQ, inquiry CTA.

2. **Destinations**  
   Dynamic list of countries and travel directions.

3. **Tour Detail**  
   Individual tour detail page with pricing, duration, highlights, itinerary, departure dates, and booking form.

4. **About**  
   Brand positioning, operating style, values, and service approach.

5. **Contact**  
   Company contact details and lead form.

## Data Models

Core backend models:

- `TourCategory`
- `Destination`
- `Tour`
- `DepartureDate`
- `ItineraryDay`
- `Inquiry`
- `FAQ`
- `Testimonial`
- `SiteSetting`

This structure is designed so non-technical users can manage most website content directly from Django admin.

## API Endpoints

Base path: `/api/`

- `GET /api/` — API root
- `GET /api/home/` — homepage payload
- `GET /api/tours/` — all published tours
- `GET /api/tours/<slug>/` — tour details
- `GET /api/destinations/` — active destinations
- `GET /api/categories/` — active categories
- `POST /api/inquiries/` — inquiry submission
- `POST /api/chat/` — AI assistant request

## AI Assistant Behavior

The assistant is designed for travel-site use cases:

- answers in the user’s language where possible
- uses current site content and company context
- avoids making up unsupported company claims
- should not invent founding year, years of operation, or other unverified facts
- can work with OpenAI when `OPENAI_API_KEY` is provided
- falls back gracefully when no API key is configured

## Environment Variables

Example environment file:

```env
SECRET_KEY=change-me
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=postgres://supertour:supertour@localhost:5432/supertour
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
CSRF_TRUSTED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
OPENAI_API_KEY=
OPENAI_MODEL=gpt-5.6-luna
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000/api
API_INTERNAL_BASE_URL=http://127.0.0.1:8000/api
```

Copy:

```bash
cp .env.example .env
```

## Running With Docker

From the project root:

```bash
docker compose up --build
```

Services:

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:8000/api/](http://localhost:8000/api/)
- Django Admin: [http://localhost:8000/admin/](http://localhost:8000/admin/)
- PostgreSQL: `localhost:5432`

The Docker setup automatically:

- starts PostgreSQL
- runs Django migrations
- seeds demo content
- starts Django development server
- starts Next.js frontend

## Local Development

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_demo
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Demo Data

The demo content is populated with:

- multiple destinations
- multiple tour categories
- published tours
- FAQs
- testimonials
- site settings

Populate manually:

```bash
cd backend
python manage.py seed_demo
```

## Admin Access

If no admin user exists yet, create one:

```bash
cd backend
python manage.py createsuperuser
```

Then log in at:

[http://localhost:8000/admin/](http://localhost:8000/admin/)

## Project Structure

```text
.
├── backend/
│   ├── config/
│   ├── tours/
│   ├── static/
│   ├── templates/
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   └── lib/
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
├── .env.example
└── README.md
```

## Production Readiness Notes

This repository is a strong demo foundation, but for real production deployment the following should be tightened before launch:

- set `DEBUG=False`
- replace `SECRET_KEY`
- restrict `ALLOWED_HOSTS`
- configure production CORS and CSRF origins
- run Django behind Gunicorn or another production WSGI/ASGI setup
- serve static/media properly
- add HTTPS termination
- move secrets to a secure secret manager
- configure database backups
- add monitoring and error tracking
- add rate limiting for public endpoints, especially `/api/chat/`
- add authentication/authorization rules if admin exposure changes

## Suitable Use Cases

This codebase is well-suited for:

- travel agency demo projects
- agency CRM-lite lead capture websites
- admin-managed tour catalog platforms
- test assignments requiring both frontend and backend
- AI-assisted commercial service websites

## Notes About Company Facts

This project intentionally avoids unsupported claims such as:

- exact founding year
- “X years in business”
- unverified operational scale claims

That choice is deliberate so the demo remains credible and safe for presentation.

## License

This project is provided as a demo implementation for portfolio, presentation, and test-task usage.
