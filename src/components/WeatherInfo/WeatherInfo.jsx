import { Card } from '@mui/material';
import React, { useEffect, useState } from 'react'
import './WeatherInfo.css'
import axios from 'axios';
import _ from 'lodash';
import clouds from '../../assets/condition_icons/clouds.png'
import drizzle from '../../assets/condition_icons/drizzle.png'
import haze from '../../assets/condition_icons/haze.png'
import rain from '../../assets/condition_icons/rain.png'
import snow from '../../assets/condition_icons/snow.png'
import sun from '../../assets/condition_icons/sun.png'
import thunder from '../../assets/condition_icons/thunder.png'
import location from '../../assets/pin.svg'
import wind from '../../assets/wind.svg'
import humidity from '../../assets/humidity.svg'
import pressure from '../../assets/pressure.svg'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';

const WeatherInfo = (props) => {

    const [weather, setWeatherData] = useState(null);
    const [isLoading, setLoading] = useState(false);
    const [isError, setError] = useState(null);
    const [isCelcious, changeCelcious] = useState(true);
    const [search, changeSearch] = useState('');
    const [img2, setImage] = useState('');
    console.log("render")
    const changeImage = (wType) => {
        switch(wType) {
            case 'Clear': setImage(sun); break;
            case 'Haze': setImage(haze); break;
            case 'Rain': setImage(rain); break;
            case 'Snow': setImage(snow); break;
            case 'Clouds': setImage(clouds); break;
            case 'Thunder': setImage(thunder); break;
            default: setImage(drizzle); break;
        }
    }

    const fetchData = async (coord) => {
        try {
        setLoading(true);
        
        const chached_data = JSON.parse(localStorage.getItem(JSON.stringify(coord)));
        if (chached_data !== null && chached_data.expiry > new Date().getTime()) {
            console.log("Cachedd!!");
            changeImage(chached_data.weather[0].main)
            return chached_data;
        }
        
        console.log("API CALLED!!");
        const data = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${coord.lat}&lon=${coord.long}&units=Metric&appid=59d8a609251083883c0dbfab1946820d`)
        const data_copy = _.cloneDeep(data.data);
        data_copy.expiry = new Date().getTime() + 3600000;
        localStorage.setItem(JSON.stringify(coord), JSON.stringify(data_copy));
        changeImage(data.data.weather[0].main)
        return data.data;
        } catch (error) {
            console.log("error");
        }
    }
    const fetchSearchedData = async () => {
        setLoading(true);
        const data = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${search}&limit=1&appid=59d8a609251083883c0dbfab1946820d`)
        if (data.data.length == 0) {
            return;
        }
        return await fetchData({lat: data.data[0].lat, long: data.data[0].lon})
    }

    const submitHandler = (e) => {
        e.preventDefault();
        if (search.trim().length == 0) {
            return;
        }
        fetchSearchedData().then((data) => {
            setLoading(false);
            setWeatherData(data);
        }).catch(error => {
            setError(error);
            setLoading(false);
        })
    }

    const convert = (temp, celcious) => {
        if (celcious) {
            return temp+'°C';
        }
        let data = ((temp * 9/5)+32).toFixed(2);
        data += '°F'
        return data;
    }

    useEffect(() => {
        fetchData(props.coord).then(data => {
            setWeatherData(data);
            setLoading(false);
        }).catch(error => {
            setError(error);
            setLoading(false);
        })
    }, [props])
    
    return (
    <>
        <Card className='weather-data searchbox'>
            <form onSubmit={submitHandler}>
                <TextField
                id="filled-search"
                label="Search field"
                type="search"
                variant="filled"
                value={search}
                onChange={(e)=>{changeSearch(e.target.value)}}
                />
                <Button variant="outlined" onClick={submitHandler} className='search'>Search</Button>
            </form>
            <div className='contain change'>
                <Switch
                inputProps={{ 'aria-label': 'controlled' }}
                checked={!isCelcious}
                onClick={()=>{ changeCelcious(prev => !prev)}}
                />
                <p>°F</p>
            </div>
        </Card>
        {isLoading && <h1 className='loading'>Loading...</h1>}
        {!isLoading && !isError && !weather &&  <Card className='weather-data'>Sorry No Result Found !!</Card>}
        {isError && <p className='error'>{isError}</p>}
        {weather && !isLoading &&
        <Card className='weather-data'>
            <div className="name">
                <img src={location} alt="location" className='location' />
                <h2>{weather.name}</h2>
            </div>
            <div>
                <div className="contain">
                    <div className="left">
                        <p className='temp'>{convert(weather.main.temp, isCelcious)}</p>
                        <p>Feels Like {convert(weather.main.feels_like, isCelcious)}</p>
                        <p className='weather-value'>{weather.weather[0].main}</p>
                    </div>
                    <div className="right">
                        <img src={img2} alt="image" />
                    </div>
                </div>
                <p className='desc'>{weather.weather[0].description}</p>
            </div>
        </Card>
        }
        {weather && !isLoading &&
        <Card className='weather-data card2'>
            <div className="contain2">
                <div className='item'>
                    <img src={wind} alt="" />
                    <p>{weather.wind.speed} m/s</p>
                </div>
                <div className='item'>
                    <img src={humidity} alt="" />
                    <p>{weather.main.humidity}</p>
                </div>
                <div className='item'>
                    <img src={pressure} alt="" />
                    <p>{weather.main.pressure}</p>
                </div>
            </div>
        </Card>
        }
        
    </>
    )
}

export default WeatherInfo