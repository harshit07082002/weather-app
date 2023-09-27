import React, { useEffect, useState } from 'react'
import { Card } from '@mui/material'
import weather from './assets/condition_icons/sun.png'
import Geolocation from 'react-native-geolocation-service';
import WeatherInfo from './components/WeatherInfo/WeatherInfo';
import './App.css'

const App = () => {
  const [coordinates, changeCoordinates] = useState(null);
  
  useEffect(() => {
    Geolocation.getCurrentPosition(
      (position) => {
        const obj = {lat: position.coords.latitude, long: position.coords.longitude};
        console.log(obj);
        changeCoordinates({lat: position.coords.latitude, long: position.coords.longitude})
      },
      (error) => {
        console.alert(error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
  );
  }, [])

  return (
    <>
      <div className='logo'>
        <h1 onClick={()=>{
          changeCoordinates({...coordinates});
        }}>
          Accuweather
        </h1>
        <img src={weather} alt="Weather" />
      </div>
      {coordinates && <WeatherInfo coord = {coordinates}/>}
    </>
  )
}

export default App