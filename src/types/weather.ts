export type UnitSystem = 'metric' | 'imperial';

export interface LocationResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  feature_code?: string;
  country_code?: string;
  admin1?: string; // state or province
  country?: string;
  timezone?: string;
  population?: number;
}

export interface CurrentWeather {
  temperature: number;
  windspeed: number;
  winddirection: number;
  weathercode: number;
  is_day: number;
  time: string;
  // Extra current fields from modern current endpoint if available
  humidity?: number;
  apparent_temperature?: number;
  precipitation?: number;
  pressure?: number;
  cloudcover?: number;
  uv_index?: number;
}

export interface HourlyData {
  time: string[];
  temperature_2m: number[];
  relative_humidity_2m: number[];
  dew_point_2m?: number[];
  apparent_temperature?: number[];
  precipitation_probability: number[];
  precipitation?: number[];
  weather_code: number[];
  pressure_msl?: number[];
  cloud_cover?: number[];
  visibility?: number[];
  wind_speed_10m: number[];
  wind_direction_10m?: number[];
  uv_index?: number[];
}

export interface DailyData {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  apparent_temperature_max?: number[];
  apparent_temperature_min?: number[];
  sunrise?: string[];
  sunset?: string[];
  uv_index_max?: number[];
  precipitation_sum?: number[];
  rain_sum?: number[];
  showers_sum?: number[];
  snowfall_sum?: number[];
  precipitation_hours?: number[];
  precipitation_probability_max?: number[];
  wind_speed_10m_max?: number[];
  wind_gusts_10m_max?: number[];
  wind_direction_10m_dominant?: number[];
}

export interface WeatherResponse {
  latitude: number;
  longitude: number;
  elevation?: number;
  timezone: string;
  timezone_abbreviation?: string;
  current_weather?: CurrentWeather;
  current?: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    is_day: number;
    precipitation: number;
    rain: number;
    showers: number;
    snowfall: number;
    weather_code: number;
    cloud_cover: number;
    pressure_msl: number;
    surface_pressure: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    wind_gusts_10m: number;
    uv_index?: number;
  };
  hourly?: HourlyData;
  daily?: DailyData;
  daily_units?: Record<string, string>;
  hourly_units?: Record<string, string>;
}

export interface WeatherConditionInfo {
  code: number;
  label: string;
  description: string;
  iconName: string;
  category: 'clear' | 'cloudy' | 'fog' | 'drizzle' | 'rain' | 'snow' | 'thunderstorm';
  bgGradient: string;
  cardTheme: string;
}

export interface ActivityScore {
  name: string;
  score: number; // 0 to 100
  rating: 'Excellent' | 'Good' | 'Moderate' | 'Poor' | 'Unfavorable';
  icon: string;
  reason: string;
}

export interface ClothingRecommendation {
  type: string;
  items: string[];
  icon: string;
  summary: string;
}

export interface WeatherAdvisory {
  id: string;
  title: string;
  type: 'info' | 'warning' | 'alert' | 'success';
  description: string;
  icon: string;
}

export interface PlanningRecommendations {
  outdoorScore: number; // Overall 0-100 score
  overallSummary: string;
  activities: ActivityScore[];
  clothing: ClothingRecommendation;
  advisories: WeatherAdvisory[];
  bestTimeWindow?: string;
}
