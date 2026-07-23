# Weather Intelligence App

A responsive **Weather Intelligence Application** built with **React 19**, **TypeScript**, **Vite**, and **Tailwind CSS**. It provides real-time weather data, 24-hour hourly projections, a 7-day daily forecast with interactive trend charts, and smart planning recommendations powered by client-side weather analytics.

---

## ✨ Features

1. **City Search & Geolocation**:
   - Fast autocomplete search powered by the **Open-Meteo Geocoding API**.
   - 1-click **Browser Geolocation** button for detecting current location.
   - Quick-select pills for popular global cities (London, New York, Tokyo, Paris, Sydney, etc.).

2. **Real-Time Weather & 7-Day Forecast**:
   - Accurate current conditions: temperature, "feels like", high/low, wind speed & direction, humidity, UV index, air pressure, cloud cover, and precipitation probability.
   - **24-Hour Hourly Timeline** with horizontal scroll.
   - **7-Day Forecast** with visual temperature range bars and expandable daily details.

3. **Visual Analytics & Interactive Charts**:
   - Powered by **Recharts**.
   - Toggle between **7-Day High/Low Temperature Trends** and **24-Hour Temperature & Rain Probability** visual charts.

4. **Dynamic Planning Recommendations**:
   - Outdoor activity suitability ratings (Running, Cycling, Dining, Hiking, Stargazing).
   - Apparel & clothing suggestions based on thermal comfort and weather conditions.
   - Smart weather advisories (High UV warnings, rain alerts, wind gust warnings, extreme heat or freezing alerts).

5. **Saved Locations**:
   - Save favorite locations to local storage for quick access anytime.

6. **Unit System Toggle**:
   - Instant toggle between **Metric** (°C, km/h) and **Imperial** (°F, mph).

7. **Error Handling**:
   - Graceful fallback and user-friendly error banners with quick-retry options and fallback suggestions.

---

## 🛠️ Technology Stack

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **Charts**: Recharts
- **Icons**: Lucide React
- **APIs**:
  - [Open-Meteo Geocoding API](https://geocoding-api.open-meteo.com/)
  - [Open-Meteo Forecast API](https://api.open-meteo.com/)

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18 or higher
- **npm**: v9 or higher

### Installation

1. Clone or download the repository.
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

To start the local development server:
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### Production Build

To build the application for production:
```bash
npm run build
```
The output static files will be generated in the `dist` directory.

---

## 📄 License

This project is licensed under the MIT License.
