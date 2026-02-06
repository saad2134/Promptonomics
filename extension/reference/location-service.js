// Location and Carbon Intensity Detection Service
class LocationService {
  constructor() {
    this.config = null;
    this.userLocation = null;
    this.cacheTimeout = 24 * 60 * 60 * 1000; // 24 hours
    this.loadConfig();
  }

  async loadConfig() {
    try {
      const response = await fetch(chrome.runtime.getURL('model-config.json'));
      this.config = await response.json();
    } catch (error) {
      console.error('Failed to load model config:', error);
      this.config = {
        carbonIntensity: { defaultGlobal: 475 }
      };
    }
  }

  /**
   * Get user's location using browser geolocation API
   */
  async getUserLocation() {
    // Check cache first
    const cached = this.getCachedLocation();
    if (cached && !this.isCacheExpired(cached.timestamp)) {
      return cached.location;
    }

    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        // Fallback to IP-based location
        this.getIPLocation().then(resolve).catch(reject);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
          };
          
          // Convert coordinates to country/region
          const regionInfo = await this.getRegionFromCoords(location);
          const fullLocation = { ...location, ...regionInfo };
          
          // Cache the result
          this.cacheLocation(fullLocation);
          resolve(fullLocation);
        },
        async (error) => {
          console.warn('Geolocation failed, falling back to IP:', error);
          try {
            const ipLocation = await this.getIPLocation();
            resolve(ipLocation);
          } catch (ipError) {
            reject(ipError);
          }
        },
        {
          timeout: 10000,
          maximumAge: this.cacheTimeout
        }
      );
    });
  }

  /**
   * Fallback IP-based location detection
   */
  async getIPLocation() {
    try {
      const response = await fetch('https://ipapi.co/json/');
      if (!response.ok) throw new Error('IP API request failed');
      
      const data = await response.json();
      const location = {
        country: data.country_code,
        countryName: data.country_name,
        region: data.region_code,
        regionName: data.region_name,
        city: data.city,
        lat: data.latitude,
        lng: data.longitude,
        method: 'IP'
      };

      this.cacheLocation(location);
      return location;
    } catch (error) {
      console.warn('IP location failed, using default:', error);
      return {
        country: 'US',
        region: 'CA',
        method: 'Default'
      };
    }
  }

  /**
   * Convert coordinates to country/region using reverse geocoding
   */
  async getRegionFromCoords(coords) {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}&accept-language=en`
      );
      if (!response.ok) throw new Error('Reverse geocoding failed');
      
      const data = await response.json();
      const address = data.address || {};
      
      return {
        country: address.country_code,
        countryName: address.country,
        region: address.state_code || address.region_code,
        regionName: address.state || address.region,
        city: address.city || address.town,
        method: 'GPS'
      };
    } catch (error) {
      console.warn('Reverse geocoding failed:', error);
      return {};
    }
  }

  /**
   * Get carbon intensity for user's location
   */
  async getCarbonIntensity(location = null) {
    if (!this.config) await this.loadConfig();
    
    const loc = location || await this.getUserLocation();
    
    if (!loc) {
      return this.config.carbonIntensity.defaultGlobal;
    }

    const ci = this.config.carbonIntensity;
    
    // Try specific state/province first
    if (loc.country && loc.region) {
      const countryData = ci.regions[loc.country];
      if (countryData && countryData.states && countryData.states[loc.region]) {
        return countryData.states[loc.region];
      }
      
      if (countryData && countryData.countries && countryData.countries[loc.region]) {
        return countryData.countries[loc.region];
      }
    }

    // Try country level
    if (loc.country) {
      const countryData = ci.regions[loc.country];
      if (countryData && countryData.average) {
        return countryData.average;
      }
      
      // Check in other regions
      for (const [regionName, regionData] of Object.entries(ci.regions)) {
        if (regionName !== 'US' && regionName !== 'EU' && regionName !== 'Asia') {
          if (regionData[loc.country]) {
            return regionData[loc.country];
          }
        }
      }
    }

    // Fallback to global average
    return ci.defaultGlobal;
  }

  /**
   * Get water intensity for user's location
   */
  async getWaterIntensity(location = null) {
    if (!this.config) await this.loadConfig();
    
    const loc = location || await this.getUserLocation();
    
    if (!loc || !loc.country) {
      return this.config.waterIntensity.gridWaterIntensity.Global;
    }

    const wi = this.config.waterIntensity.gridWaterIntensity;
    
    // Try country specific
    if (wi[loc.country]) {
      return wi[loc.country];
    }

    // Try regional
    if (loc.country === 'US' && wi.US) return wi.US;
    if (['FR', 'DE', 'UK', 'SE', 'NO', 'ES', 'IT'].includes(loc.country) && wi.EU) return wi.EU;
    if (['CN', 'JP', 'KR', 'IN', 'SG'].includes(loc.country) && wi.Asia) return wi.Asia;

    // Fallback to global average
    return wi.Global;
  }

  /**
   * Get datacenter WUE for AI provider
   */
  getDatacenterWUE(provider) {
    if (!this.config) return 0.30; // default
    
    const wue = this.config.waterIntensity.datacenterWUE;
    return wue.providers[provider.toLowerCase()] || wue.default;
  }

  /**
   * Cache management
   */
  getCachedLocation() {
    const cached = localStorage.getItem('locationCache');
    return cached ? JSON.parse(cached) : null;
  }

  cacheLocation(location) {
    const cacheData = {
      location,
      timestamp: Date.now()
    };
    localStorage.setItem('locationCache', JSON.stringify(cacheData));
  }

  isCacheExpired(timestamp) {
    return Date.now() - timestamp > this.cacheTimeout;
  }

  /**
   * Get real-time carbon intensity (future enhancement)
   */
  async getRealTimeCarbonIntensity(location = null) {
    // This could integrate with ElectricityMaps or WattTime APIs
    // For now, return static data
    return this.getCarbonIntensity(location);
  }

  /**
   * Clear location cache
   */
  clearCache() {
    localStorage.removeItem('locationCache');
    this.userLocation = null;
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LocationService;
}