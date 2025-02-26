import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, ImageBackground, ActivityIndicator, Image, Alert } from "react-native";
import { StatusBar } from 'expo-status-bar';
import { useFonts, Outfit_400Regular, Outfit_500Medium, Outfit_600SemiBold, Outfit_700Bold } from "@expo-google-fonts/outfit";
import * as Location from 'expo-location'; 
const API_KEY = process.env.EXPO_PUBLIC_WEATHER_API_KEY; 

type weather = {
  name: string;
  main: {
    temp: number,
    feels_like: number,
    temp_min: number,
    temp_max: number,
    pressure: number,
    humidity: number,
    sea_level: number,
    grnd_level: number,
  },
  sys: {
    country: string;
  },
  wind: {
    speed: number;
  },
  weather: [
    {
      main: string,
      description: string,
      icon: string,
    }
  ],
}

const App = () => {
  let [fontsLoaded] = useFonts({
    Outfit_Regular: Outfit_400Regular,
    Outfit_Medium: Outfit_500Medium,
    Outfit_SemiBold: Outfit_600SemiBold,
    Outfit_Bold: Outfit_700Bold,
  });

  const [weather, setWeather] = useState<weather | null>(null);
  const [loading, setLoading] = useState(true);

  // Konum bilgisini alma fonksiyonu
  const fetchWeather = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Konum Erişimi Engellendi", "Hava durumu için konum izni vermelisiniz.");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;
      const response = await fetch(url);
      const data = await response.json();
      setWeather(data);
    } catch (error) {
      console.error("Hata:", error);
      Alert.alert("Hata", "Hava durumu verisi alınırken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }
  if (!weather) {
    return <Text>Hava durumu bilgisi alınamadı.</Text>;
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="white" style="dark"/>
      <ImageBackground style={styles.bg} source={require('../image/bg.png')} blurRadius={60}>
        <View style={styles.textContent}>
          <View style={styles.LocationNameArea}>
            <Text style={styles.name}>{weather.name}</Text>
          </View>

       
         <Image
      style={styles.mainTempImage}
      source={
    weather.weather[0].main === "Clear" ? require('../image/main-clear.png') :
    weather.weather[0].main === "Clouds" ? require('../image/main-cloud.png') :
    weather.weather[0].main === "Rain" ? require('../image/main-rain.png') :
    weather.weather[0].main === "Snow" ? require('../image/main-snow.png') :
    weather.weather[0].main === "Thunderstorm" ? require('../image/main-thunderstorm.png') :
    weather.weather[0].main === "Drizzzle" ? require('../image/main-drizzzle.png') :
    weather.weather[0].main === "Mist" ? require('../image/main-mist.png') :
    require('../image/main-clear.png')
  }
/>

          <View style={styles.tempContainer}>
            <Text style={styles.mainTemp}>{Math.round(weather.main.temp)}</Text>
            <Text style={styles.celsius}>°</Text>
          </View>

          <Text style={styles.description}>{weather.weather[0].description}</Text> 

          <View style={styles.divider}></View>

          {/* Satır  1 */}
          <View style={styles.row}>
            {/* Hücre 1 */}
            <View style={styles.cellLeft}>
              <Image source={require('../image/humidity.png')} style={styles.icon} />
              <Text style={styles.humidity}>{weather.main.humidity}%</Text> 
              <Text style={styles.label}>Humidity</Text>
            </View>

            {/* Hücre 2 */}
            <View style={styles.cellRight}>
              <Image source={require('../image/feels-like.png')} style={styles.icon} />
              <Text style={styles.feelsLike}>{Math.round(weather.main.feels_like)}</Text> 
              <Text style={styles.label}>Feels Like</Text>
            </View>
          </View>
          
          {/* Satır 2 */}
          <View style={styles.row}>
            {/* Hücre 1 */}
            <View style={styles.cellLeft}>
              <Image source={require('../image/wind.png')} style={styles.icon} />
              <Text style={styles.windSpeed}>{Math.round(weather.wind.speed)} km/s</Text> 
              <Text style={styles.label}>Wind</Text>
            </View>

            {/* Hücre 2 */}
            <View style={styles.cellRight}>
              <Image source={require('../image/pressure.png')} style={styles.icon} />
              <Text style={styles.pressure}>{weather.main.pressure}</Text> 
              <Text style={styles.label}>Pressure</Text>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  bg: { 
    flex: 1, 
    backgroundColor:'#FFFFFF'
  },
  tempContainer: {
    flexDirection: "row",
    alignItems: "flex-start", 
    paddingTop: 12,
  },
  mainTemp: {
    fontSize: 120,
    fontFamily: 'Outfit-Medium',
    color: '#262739',
    lineHeight: 120,
    paddingTop: 10,
    justifyContent: 'center',
  },
  celsius: {
    fontSize: 66, 
    fontFamily: 'Outfit-Medium',
  },
  divider: {
    width: '100%',
    backgroundColor: '#E5EDF9',
    height: 1,
  },
  mainTempImage: {
    width: 66, 
    height: 66,
  },
  humidity: {
    fontSize: 16,
    fontFamily: 'Outfit-Bold',
    color: '#262739',
  },
  pressure: {
    fontSize: 16,
    fontFamily: 'Outfit-Bold',
    color: '#262739',
  },
  windSpeed: {
    fontSize: 16,
    fontFamily: 'Outfit-Bold',
    color: '#262739',
  },
  feelsLike: {
    fontSize: 16,
    fontFamily: 'Outfit-Bold',
    color: '#262739',
  },
  description: {
    fontSize: 18,
    fontFamily: 'Outfit-Medium',
    color: '#262739',
    marginBottom: 48,
  },
  textContent: {
    paddingTop: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: 20,
    fontFamily: 'Outfit-Medium',
  },
  LocationNameArea: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#E5EDF9', 
  },
  cellLeft: {
    flex: 1,
    paddingVertical: 28,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderColor: '#E5EDF9',
  },
  cellRight: {
    flex: 1,
    paddingVertical: 28,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#6A6B82',
    fontFamily: 'Outfit-Regular',
  },
});

export default App;
