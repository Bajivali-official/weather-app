# Weatherly<img width="1902" height="969" alt="Screenshot 2026-10-05 230615" src="https://github.com/user-attachments/assets/18169a46-b7f2-45fe-b101-f230d83a3d6d" />
<img width="1899" height="968" alt="Screenshot 2026-10-05 230525" src="https://github.com/user-attachments/assets/a735562d-8eb0-4b5a-a59e-63d6679721d1" />


**Weatherly** is a full-stack weather dashboard that provides real-time weather conditions, hourly forecasts, 7-day forecasts, location search, and interactive map-based visualization.

The project combines a responsive frontend with a Spring Boot backend to securely communicate with external weather services and deliver dynamic location-based weather data.

## Features

- Real-time weather conditions
- Location-based weather search
- Hourly weather forecast
- 7-day forecast
- Interactive location map
- Dynamic map marker positioning
- Responsive design across desktop, tablet, and mobile
- Glassmorphism-based interface
- Backend API layer for external API communication
- API credentials isolated from the frontend

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | HTML5, CSS3, JavaScript |
| Backend | Java, Spring Boot |
| Maps | Leaflet.js, OpenStreetMap |
| Weather Data | WeatherAPI |
| Version Control | Git, GitHub |

## Architecture

```text
┌──────────────┐
│     User     │
└──────┬───────┘
       │
       ▼
┌──────────────────────┐
│      Frontend        │
│  HTML / CSS / JS     │
└──────────┬───────────┘
           │
           │ HTTP Request
           ▼
┌──────────────────────┐
│    Spring Boot API   │
│      Backend         │
└──────────┬───────────┘
           │
           │ API Request
           ▼
┌──────────────────────┐
│     WeatherAPI       │
└──────────┬───────────┘
           │
           │ Weather Data
           ▼
┌──────────────────────┐
│      Dashboard       │
└──────────────────────┘
```

## Project Structure

```text
weatherly/
│
├── weatherly-frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── weatherly-backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       └── resources/
│   └── pom.xml
│
└── README.md
```

## Getting Started

### Prerequisites

- Java 21+
- Maven
- Git
- WeatherAPI account and API key

### Clone the Repository

```bash
git clone <repository-url>
cd weatherly
```

### Backend Configuration

Configure the WeatherAPI key through your backend configuration or environment variables.

Example:

```properties
weather.api.key=${WEATHER_API_KEY}
```

Set the environment variable before starting the application.

### Run the Backend

```bash
cd weatherly-backend
mvn spring-boot:run
```

The backend will start on:

```text
http://localhost:8080
```

### Run the Frontend

Open the frontend using a local development server.

The frontend communicates with the Spring Boot backend for weather data.

## API Flow

The application follows this request flow:

```text
Location Search
      ↓
Location Coordinates
      ↓
Spring Boot Backend
      ↓
WeatherAPI
      ↓
Weather Response
      ↓
Frontend Dashboard
      ↓
Map + Weather Information
```

The location search determines the coordinates of the selected location. These coordinates are then used to retrieve weather information and update the dashboard and map dynamically.

## Security

API credentials are handled on the backend and are not exposed in frontend source files.

Sensitive configuration should be provided through environment variables and should never be committed to the repository.

## Responsive Design

The interface is designed to adapt to different viewport sizes, including:

- Desktop
- Tablet
- Mobile

The layout and components dynamically adjust to maintain usability across devices.

## Future Enhancements

- Weather alerts
- Saved locations
- Historical weather data
- Weather charts and analytics
- User preferences
- Improved caching and API optimization
- Production deployment

## License

This project is developed for educational and portfolio purposes.

## Author

**Bajivali**

Computer Science Student | Aspiring Software Engineer
