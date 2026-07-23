import { PlanningRecommendations, WeatherResponse, ActivityScore, ClothingRecommendation, WeatherAdvisory } from '../types/weather';
import { getWeatherCondition } from './weatherCodes';

export function generateRecommendations(
  weather: WeatherResponse,
  cityName: string
): PlanningRecommendations {
  const current = weather.current || {
    temperature_2m: weather.current_weather?.temperature || 20,
    apparent_temperature: weather.current_weather?.temperature || 20,
    relative_humidity_2m: 50,
    wind_speed_10m: weather.current_weather?.windspeed || 10,
    weather_code: weather.current_weather?.weathercode || 0,
    precipitation: 0,
    cloud_cover: 20,
    is_day: weather.current_weather?.is_day ?? 1,
  };

  const daily = weather.daily;
  const temp = current.temperature_2m;
  const feelsLike = current.apparent_temperature ?? temp;
  const humidity = current.relative_humidity_2m ?? 50;
  const windSpeed = current.wind_speed_10m ?? 10;
  const code = current.weather_code;
  const condition = getWeatherCondition(code);
  
  const todayMaxTemp = daily?.temperature_2m_max?.[0] ?? temp;
  const todayMinTemp = daily?.temperature_2m_min?.[0] ?? temp;
  const todayPrecipProb = daily?.precipitation_probability_max?.[0] ?? 0;
  const todayUV = daily?.uv_index_max?.[0] ?? 3;

  // 1. Calculate Activity Scores (0-100)
  const activities: ActivityScore[] = [];

  // --- Running / Jogging ---
  let runScore = 100;
  if (feelsLike < 0) runScore -= 40;
  else if (feelsLike < 8) runScore -= 15;
  else if (feelsLike > 28) runScore -= 35;
  else if (feelsLike > 34) runScore -= 60;
  
  if (condition.category === 'rain' || condition.category === 'drizzle') runScore -= 40;
  if (condition.category === 'snow') runScore -= 50;
  if (condition.category === 'thunderstorm') runScore -= 80;
  if (windSpeed > 30) runScore -= 25;
  if (humidity > 80 && feelsLike > 22) runScore -= 20;

  runScore = Math.max(0, Math.min(100, runScore));

  activities.push({
    name: 'Running & Jogging',
    score: runScore,
    rating: getRatingLabel(runScore),
    icon: 'Footprints',
    reason: getRunReason(feelsLike, condition.category, windSpeed, humidity),
  });

  // --- Cycling ---
  let cycleScore = 100;
  if (feelsLike < 5) cycleScore -= 35;
  if (feelsLike > 32) cycleScore -= 45;
  if (windSpeed > 25) cycleScore -= 40;
  if (condition.category === 'rain' || condition.category === 'thunderstorm') cycleScore -= 60;
  if (condition.category === 'snow') cycleScore -= 70;

  cycleScore = Math.max(0, Math.min(100, cycleScore));

  activities.push({
    name: 'Cycling & Biking',
    score: cycleScore,
    rating: getRatingLabel(cycleScore),
    icon: 'Bike',
    reason: getCycleReason(windSpeed, feelsLike, condition.category),
  });

  // --- Outdoor Dining / Picnic ---
  let diningScore = 100;
  if (feelsLike < 15) diningScore -= (15 - feelsLike) * 5;
  if (feelsLike > 29) diningScore -= (feelsLike - 29) * 5;
  if (condition.category !== 'clear' && condition.category !== 'cloudy') diningScore -= 50;
  if (todayPrecipProb > 30) diningScore -= 30;
  if (windSpeed > 20) diningScore -= 25;

  diningScore = Math.max(0, Math.min(100, diningScore));

  activities.push({
    name: 'Outdoor Dining & Picnic',
    score: diningScore,
    rating: getRatingLabel(diningScore),
    icon: 'UtensilsCrossed',
    reason: getDiningReason(feelsLike, todayPrecipProb, condition.category),
  });

  // --- Hiking & Walking ---
  let hikeScore = 100;
  if (feelsLike < 2) hikeScore -= 35;
  if (feelsLike > 31) hikeScore -= 40;
  if (condition.category === 'rain') hikeScore -= 45;
  if (condition.category === 'thunderstorm') hikeScore -= 85;
  if (condition.category === 'fog') hikeScore -= 25;

  hikeScore = Math.max(0, Math.min(100, hikeScore));

  activities.push({
    name: 'Hiking & Walking',
    score: hikeScore,
    rating: getRatingLabel(hikeScore),
    icon: 'Trees',
    reason: getHikeReason(feelsLike, condition.category),
  });

  // --- Stargazing (at night) or Photography ---
  let starScore = 100;
  const cloudCover = current.cloud_cover ?? 30;
  starScore -= cloudCover * 0.8;
  if (condition.category === 'rain' || condition.category === 'snow' || condition.category === 'fog') starScore -= 60;
  if (feelsLike < -5) starScore -= 30;
  starScore = Math.max(0, Math.min(100, Math.round(starScore)));

  activities.push({
    name: 'Stargazing & Astronomy',
    score: starScore,
    rating: getRatingLabel(starScore),
    icon: 'Sparkles',
    reason: cloudCover > 50 ? 'High cloud coverage limits clear night sky visibility.' : 'Clear atmosphere with favorable sky clarity.',
  });

  // 2. Clothing & Equipment Recommendations
  const clothing = getClothingRecommendations(feelsLike, condition.category, todayPrecipProb, todayUV, windSpeed);

  // 3. Advisories & Weather Alerts
  const advisories: WeatherAdvisory[] = [];

  if (todayUV >= 7) {
    advisories.push({
      id: 'uv-high',
      title: 'High UV Index Warning',
      type: 'warning',
      description: `UV Index reaching peak ${todayUV}. Apply SPF 30+ sunscreen, wear UV sunglasses, and seek shade between 11 AM - 3 PM.`,
      icon: 'Sun',
    });
  }

  if (condition.category === 'rain' || todayPrecipProb >= 60) {
    advisories.push({
      id: 'rain-alert',
      title: 'Rain & Wet Weather Advisory',
      type: 'info',
      description: `High precipitation likelihood (${todayPrecipProb}%). Carry an umbrella and wear waterproof outerwear.`,
      icon: 'Umbrella',
    });
  }

  if (condition.category === 'thunderstorm') {
    advisories.push({
      id: 'thunderstorm-alert',
      title: 'Thunderstorm Warning',
      type: 'alert',
      description: 'Active thunderstorm conditions in area. Seek indoor shelter and avoid open fields or high altitude trees.',
      icon: 'CloudLightning',
    });
  }

  if (windSpeed >= 35) {
    advisories.push({
      id: 'wind-alert',
      title: 'High Wind Gust Advisory',
      type: 'warning',
      description: `Wind gusts up to ${Math.round(windSpeed)} km/h. Secure loose outdoor items and exercise caution when driving.`,
      icon: 'Wind',
    });
  }

  if (feelsLike <= 0) {
    advisories.push({
      id: 'freezing-alert',
      title: 'Freezing Conditions Alert',
      type: 'alert',
      description: `Freezing temperatures (${Math.round(feelsLike)}°C feels like). Risk of icy paths and frostbite on exposed skin.`,
      icon: 'Snowflake',
    });
  } else if (feelsLike >= 33) {
    advisories.push({
      id: 'heat-alert',
      title: 'Extreme Heat Warning',
      type: 'warning',
      description: `High thermal stress (${Math.round(feelsLike)}°C apparent temp). Stay hydrated and avoid heavy outdoor strain during peak heat.`,
      icon: 'Flame',
    });
  }

  if (advisories.length === 0) {
    advisories.push({
      id: 'optimal-weather',
      title: 'Pleasant Outdoor Conditions',
      type: 'success',
      description: `Weather in ${cityName} is calm and balanced. Great day to enjoy outdoor activities!`,
      icon: 'CheckCircle2',
    });
  }

  // 4. Overall Outdoor Score
  const avgActivityScore = Math.round(
    activities.reduce((acc, curr) => acc + curr.score, 0) / activities.length
  );

  let overallSummary = `Weather in ${cityName} is ideal for outdoor activities with crisp skies and pleasant thermal comfort.`;
  if (avgActivityScore < 40) {
    overallSummary = `Challenging weather in ${cityName} due to ${condition.label.toLowerCase()} conditions. Indoor activities recommended.`;
  } else if (avgActivityScore < 70) {
    overallSummary = `Moderate weather in ${cityName}. Suitable for quick outings with proper apparel.`;
  }

  return {
    outdoorScore: avgActivityScore,
    overallSummary,
    activities,
    clothing,
    advisories,
  };
}

function getRatingLabel(score: number): 'Excellent' | 'Good' | 'Moderate' | 'Poor' | 'Unfavorable' {
  if (score >= 85) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 50) return 'Moderate';
  if (score >= 30) return 'Poor';
  return 'Unfavorable';
}

function getRunReason(temp: number, cat: string, wind: number, humidity: number): string {
  if (cat === 'thunderstorm') return 'Dangerous lightning hazard; avoid outdoor running.';
  if (cat === 'rain' || cat === 'drizzle') return 'Wet conditions and slippery pavement.';
  if (temp < 0) return 'Sub-zero temperatures; thermal running gear essential.';
  if (temp > 28) return 'High heat burden; hydrate frequently and run in early morning.';
  if (temp >= 12 && temp <= 20 && wind < 20) return 'Ideal temperature and gentle breeze for running.';
  return 'Manageable conditions for a workout run.';
}

function getCycleReason(wind: number, temp: number, cat: string): string {
  if (wind > 30) return 'Strong crosswinds create unsafe riding stability.';
  if (cat === 'rain' || cat === 'snow') return 'Reduced tire traction on wet roads.';
  if (temp < 5) return 'Cold wind chill factor on descent.';
  return 'Favorable road conditions and clear path.';
}

function getDiningReason(temp: number, precipProb: number, cat: string): string {
  if (cat === 'rain' || precipProb > 50) return 'High probability of rain showers; choose covered seating.';
  if (temp < 15) return 'Cool thermal comfort; outdoor patio heaters recommended.';
  if (temp > 30) return 'Very warm outdoors; shaded seating with cool breezes advised.';
  return 'Comfortable temperature for patio or outdoor dining.';
}

function getHikeReason(temp: number, cat: string): string {
  if (cat === 'thunderstorm') return 'Severe lightning hazard on exposed trails.';
  if (cat === 'rain') return 'Muddy trail conditions and poor footing.';
  if (cat === 'fog') return 'Low trail visibility; stick to marked paths.';
  return 'Clear trail visibility and pleasant trekking climate.';
}

function getClothingRecommendations(
  feelsLike: number,
  category: string,
  precipProb: number,
  uvIndex: number,
  windSpeed: number
): ClothingRecommendation {
  const items: string[] = [];
  let summary = '';
  let type = 'Light & Comfortable';

  if (feelsLike < 0) {
    type = 'Heavy Winter Outfit';
    items.push('Thermal base layer top & bottoms', 'Heavy insulated down parka', 'Beanie hat & insulated gloves', 'Fleece-lined pants & winter boots');
    summary = 'Freezing weather. Dress in thick insulated layers to protect against frostbite.';
  } else if (feelsLike < 10) {
    type = 'Warm Outer Layer';
    items.push('Warm wool sweater or hoodie', 'Wind-resistant jacket or coat', 'Warm trousers or jeans', 'Closed footwear with warm socks');
    summary = 'Crisp, chilly weather. A warm jacket or coat is recommended.';
  } else if (feelsLike < 18) {
    type = 'Light Layering';
    items.push('Long-sleeve shirt or light fleece', 'Light spring jacket or denim coat', 'Comfortable pants or jeans');
    summary = 'Mild temperatures. Light layering allows comfortable adaptation throughout the day.';
  } else if (feelsLike < 26) {
    type = 'Comfortable Casual';
    items.push('Breathable cotton t-shirt', 'Lightweight trousers or shorts', 'Comfortable sneakers');
    summary = 'Pleasant, warm conditions. Light and breathable apparel is ideal.';
  } else {
    type = 'Breathable Hot Weather Gear';
    items.push('Ultra-light linen or moisture-wicking top', 'Breathable shorts', 'Sun hat / cap', 'Open sandals or breathable sneakers');
    summary = 'Hot weather. Wear loose, light-colored, breathable fabrics to stay cool.';
  }

  // Accessories
  if (category === 'rain' || precipProb > 40) {
    items.push('Compact umbrella or waterproof raincoat');
  }
  if (uvIndex >= 5) {
    items.push('UV400 Sunglasses', 'Broad-spectrum SPF 30+ sunscreen');
  }
  if (windSpeed > 25) {
    items.push('Windbreaker jacket');
  }

  return {
    type,
    items,
    icon: feelsLike < 10 ? 'Coat' : feelsLike > 25 ? 'Shirt' : 'Shirt',
    summary,
  };
}
