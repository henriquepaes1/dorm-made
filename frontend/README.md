# Dorm Made - Frontend

A modern React/TypeScript frontend application for the Dorm Made culinary social network, built with Vite, Tailwind CSS, and shadcn/ui components.

## Features

- **Modern UI**: Beautiful, responsive design with Tailwind CSS and shadcn/ui components
- **User Authentication**: Sign up and login functionality
- **Recipe Management**: Create and manage cooking recipes
- **Event Management**: Host and join culinary events
- **Real-time Updates**: Dynamic event listings and participant counts
- **Mobile Responsive**: Optimized for all device sizes

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **React Router** for navigation
- **TanStack Query** for data fetching
- **Axios** for API communication

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- Backend API running on http://localhost:8000

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env.example .env
# Edit .env with your API URL if needed
```

4. Start the development server:
```bash
npm run dev
```

The application will open in your browser at `http://localhost:8080`.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/
│   ├── home/           # Homepage components
│   ├── layout/         # Layout components (Header, Footer)
│   ├── meals/          # Meal/Event related components
│   └── ui/             # Reusable UI components (shadcn/ui)
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── pages/              # Page components
│   ├── Auth.tsx        # Login/Signup page
│   ├── CreateEvent.tsx # Event creation page
│   ├── CreateRecipe.tsx# Recipe creation page
│   ├── Explore.tsx     # Events listing page
│   ├── Index.tsx       # Homepage
│   └── NotFound.tsx    # 404 page
├── services/
│   └── api.ts          # API service functions
├── App.tsx             # Main app component
├── main.tsx            # Application entry point
└── index.css           # Global styles
```

## API Integration

The frontend communicates with the FastAPI backend through the following endpoints:

- `POST /users/` - Create user account
- `POST /recipes/` - Create recipe
- `POST /events/` - Create event
- `GET /events/` - List all events
- `POST /events/join/` - Join an event
- `GET /users/{id}/recipes` - Get user's recipes
- `GET /users/{id}/events` - Get user's events

## Key Features

### User Authentication
- Clean signup/login forms with validation
- User session management with localStorage
- Automatic redirects based on authentication status

### Recipe Creation
- Dynamic ingredient list management
- Difficulty levels and prep time specification
- Rich text instructions with textarea
- Form validation and error handling

### Event Management
- Create events using your recipes
- Set participant limits and timing
- Location specification
- Real-time participant count updates

### Event Discovery
- Beautiful grid layout for events
- Advanced filtering and search
- Responsive design for all devices
- Join functionality with capacity validation

## Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:8000
```

## Styling

The application uses:
- **Tailwind CSS** for utility-first styling
- **shadcn/ui** components for consistent design
- **Custom CSS variables** for theming
- **Responsive design** patterns
- **Dark/light mode** support (via shadcn/ui)

## Development

### Adding New Features

1. Create new components in the appropriate directory
2. Add API functions to `src/services/api.ts`
3. Update routing in `App.tsx` if needed
4. Use existing UI components for consistency

### Code Style

- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Component-based architecture
- Custom hooks for reusable logic

## Troubleshooting

### Common Issues

1. **API Connection Error**: Ensure the backend is running on port 8000
2. **CORS Issues**: The backend should have CORS enabled for localhost:8080
3. **User Session Lost**: Check browser localStorage for user data
4. **Build Errors**: Ensure all dependencies are installed with `npm install`

### Debug Mode

Enable debug logging by opening browser developer tools and checking the console for API request/response details.

## Production Deployment

1. Build the application:
```bash
npm run build
```

2. The built files will be in the `dist/` directory
3. Deploy the `dist/` directory to your hosting service
4. Ensure the API URL is correctly configured for production

## Contributing

1. Follow the existing code style and patterns
2. Use TypeScript for all new code
3. Test your changes thoroughly
4. Update documentation as needed