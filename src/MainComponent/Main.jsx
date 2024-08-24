    import { Divider } from "@mui/material";
    import React, { useEffect, useState } from "react";
    import axios from "axios";
    import "./Main.css";
    import "./Main.js";
    import moment from "moment/moment";
    import "moment/dist/locale/ar-dz";
    export default function Main() {
    
        const [selectedCity, setSelectedCity] = useState("cairo");
        const [selectedCountry, setSelectedCountry] = useState("egypt");
        const [aladanApi, setAladanApi] = useState(0);
        const [today, setToday] = useState("");
        // const [timer, setTimer] = useState(10);
        const [nextPrayer, setNextPrayer] = useState(2);
        const [remaningTime, setRemaningTime] = useState("");
        
        const prayerList = [
            { name: "Fajr", displayName: "الفجر" },
            { name: "Dhuhr", displayName: "الظهر" },
            { name: "Asr", displayName: "العصر" },
            { name: "Maghrib", displayName: "المغرب" },
            { name: "Isha", displayName: "العشاء" },
        ];
        const onChangeCountry = (e) => {
            const valueCountry = e.target.value;
            setSelectedCountry(valueCountry);
        };
        const onChangeCity = (e) => {
            const valueCity = e.target.value;

            setSelectedCity(valueCity);
        };
        const getDataAladanApi = async () => {
            const { data } = await axios(
                `https://api.aladhan.com/v1/timingsByCity?city=${selectedCity}&country=${selectedCountry}&method=8`
            );
            setAladanApi(data.data.timings);
        };
        const timeToday = () => {
            const today = moment().format("MMMM Do YYYY, h:mm");
            setToday(today);
        };
        let momentNow ;
        //Function
        let timerCountDown = () => {
            let prayerIndex = 0
                momentNow = moment();

            if (
                momentNow.isAfter(moment(aladanApi["Fajr"], "hh:mm")) &&
                momentNow.isBefore(moment(aladanApi["Dhuhr"], "hh:mm"))
            ) {prayerIndex = 1             
                
                momentNow.isBefore(moment(aladanApi["Dhuhr"], "hh:mm"))
            } 
            else if (
                momentNow.isAfter(moment(aladanApi["Dhuhr"], "hh:mm")) &&
                momentNow.isBefore(moment(aladanApi["Asr"], "hh:mm"))
            ) {
                prayerIndex = 2

            } 
            else if (
                momentNow.isAfter(moment(aladanApi["Asr"], "hh:mm")) &&
                momentNow.isBefore(moment(aladanApi["Maghrib"], "hh:mm"))
                
            ) {
                prayerIndex = 3

            }
            else if (
                momentNow.isAfter(moment(aladanApi["Maghrib"], "hh:mm")) &&
                momentNow.isBefore(moment(aladanApi["Isha"], "hh:mm"))
            ) {
                prayerIndex = 4

            } 
            else {
                prayerIndex = 0;

            }
            setNextPrayer(prayerIndex)

            const nextPrayerObj = prayerList[nextPrayer].name;            
            const nextPrayerTime = aladanApi[nextPrayerObj] 
            const nextPrayerTimeMoment =moment(nextPrayerTime, "hh:mm")
            let remainingTime = moment(nextPrayerTime, "hh:mm").diff(momentNow)
            if (remainingTime < 0) {
                const midnightDiff = moment("23:59:59","hh:mm:ss").diff(momentNow)
                const fujrToMidnightDiff = nextPrayerTime.diff(moment("00:00:00","hh:mm:ss"))
                const totalDiff = midnightDiff + fujrToMidnightDiff
                remainingTime = totalDiff 
            }
            const durationRemainingTime = moment.duration(remainingTime)
            const hours = durationRemainingTime.hours()
            const minutes = durationRemainingTime.minutes()
            const seconds = durationRemainingTime.seconds()
            
            setRemaningTime(`${hours}: ${minutes}:${seconds}`)
        };
        

        useEffect(() => {
            getDataAladanApi();
        }, [selectedCity]);

        useEffect(() => {
            timeToday();
            let interval = setInterval(() => {
                timerCountDown()
            }, 1000);
            timeToday()

            //will unmount
            return () => {
                clearInterval(interval);
            };
        }, [aladanApi]);

        return (
            <>
                <header className=" text-center ">
                    <div className="container- vh-100 text-center ">
                        <div className="row my-4 py-3 text-white d-flex justify-content-around ms-auto me-auto inner-card">
                            <div className="col-md-5  ">
                                <div className="py-4 t-right border border-2 border-solid border-white">
                                    <p>
                                        متبقى حتى صلاة {prayerList[nextPrayer].displayName + " "}
                                    </p>
                                    <h2>{remaningTime}</h2>
                                </div>
                            </div>
                            <div className="col-md-5 ">
                                <div className="py-4 t-left border border-2 border-solid border-white ">
                                    <h2>{selectedCity}</h2>
                                    <p>{today}</p>
                                </div>
                            </div>
                        </div>
                        <Divider></Divider>
                        {/* Pictures */}
                        <div className="row py-3  d-flex justify-content-around ms-auto me-auto inner-card">
                            <div className="col-md-2  ">
                                <div className="card">
                                    <img
                                        src="./night-prayer-mosque.png"
                                        className="inner-img w-100"
                                        alt=""
                                    />
                                    <div className="card-body">
                                        <h2>العشاء</h2>
                                        <p>{aladanApi.Isha}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-2">
                                <div className="card">
                                    <img
                                        src="./sunset-prayer-mosque.png"
                                        className="inner-img w-100"
                                        alt=""
                                    />
                                    <div className="card-body">
                                        <h2>المغرب</h2>
                                        <p>{aladanApi.Maghrib}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-2">
                                <div className="card">
                                    <img
                                        src="./asr-prayer-mosque.png"
                                        className="inner-img w-100"
                                        alt=""
                                    />
                                    <div className="card-body">
                                        <h2>العصر</h2>
                                        <p>{aladanApi.Asr}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-2">
                                <div className="card">
                                    <img
                                        src="./dhhr-prayer-mosque.png"
                                        className="card-img-top"
                                        alt="..."
                                    />
                                    <div className="card-body">
                                        <h2>الظهر</h2>
                                        <p>{aladanApi.Dhuhr} </p>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-2 ">
                                <div className="card">
                                    <img
                                        src="./fajr-prayer.png"
                                        className="card-img-top"
                                        alt="..."
                                    />
                                    <div className="card-body">
                                        <h2>الفجر</h2>
                                        <p>{aladanApi.Fajr}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* select */}
                        <Divider></Divider>

                        <div className="row pt-3  d-flex justify-content-around ms-auto me-auto inner-card ">
                            <div className="col-md-4 ">
                                <select
                                    className="form-select form-select-sm my-4"
                                    aria-label=".form-select-sm example"
                                    onChange={onChangeCountry}
                                >
                                    <optgroup label="Open this select Country">
                                        <option defaultValue="Egypt">Egypt</option>
                                        <option defaultValue="UnitedArabEmirates">
                                            UnitedArabEmirates
                                        </option>
                                        <option defaultValue="Saudi Arabia">Saudi Arabia</option>
                                        <option defaultValue="Libya">Libya</option>
                                        <option defaultValue="Morocco">Morocco</option>
                                        <option defaultValue="Algeria">Algeria</option>
                                        <option defaultValue="Tunisia">Tunisia</option>
                                        <option defaultValue="Iraq">Iraq</option>
                                        <option defaultValue="Syria">Syria</option>
                                        <option defaultValue="Sudan">Sudan</option>
                                        <option defaultValue="Qatar">Qatar</option>
                                        <option defaultValue="Bahrain">Bahrain</option>
                                    </optgroup>
                                </select>

                                {/* <button id="btn-hide" className="btn btn-outline-danger m-3">
                                    Hide{" "}
                                </button>
                                <button id="btn-show" className="btn btn-outline-info m-3">
                                    Show{" "}
                                </button> */}
                            </div>
                            <div className="col-md-4 offset-">
                                <select
                                    className="form-select form-select-sm my-4"
                                    aria-label=".form-select-sm example"
                                    onChange={onChangeCity}
                                >
                                    <optgroup label="Egypt">
                                        <option defaultValue="Cairo ">Cairo</option>
                                        <option defaultValue="Alexandria">Alexandria</option>
                                        <option defaultValue="Giza">Giza</option>
                                        <option defaultValue="Port Said">Port Said</option>
                                        <option defaultValue="Suez">Suez</option>
                                        <option defaultValue="Ismailia">Ismailia</option>
                                        <option defaultValue="Tanta">Tanta</option>
                                        <option defaultValue="Mansoura">Mansoura</option>
                                        <option defaultValue="El Mahalla El Kubra">
                                            El Mahalla El Kubra
                                        </option>
                                        <option defaultValue="Asyut">Asyut</option>
                                        <option defaultValue="Sohag">Sohag</option>
                                        <option defaultValue="Qena">Qena</option>
                                        <option defaultValue="Luxor">Luxor</option>
                                        <option defaultValue="Aswan">Aswan</option>
                                        <option defaultValue="Abu Simbel">Abu Simbel</option>
                                        <option defaultValue="Sharm El-Sheikh">
                                            Sharm El-Sheikh
                                        </option>
                                        <option defaultValue="Hurghada">Hurghada</option>
                                        <option defaultValue="Marsa Alam">Marsa Alam</option>
                                        <option defaultValue="El Gouna">El Gouna</option>
                                        <option defaultValue="Ras Sedr">Ras Sedr</option>
                                        <option defaultValue="El Arish">El Arish</option>
                                        <option defaultValue="Rafah">Rafah</option>
                                        <option defaultValue="El Qantara">El Qantara</option>
                                        <option defaultValue="Sallum">Sallum</option>
                                        <option defaultValue="Mersa Matruh">Mersa Matruh</option>
                                        <option defaultValue="Siwa Oasis">Siwa Oasis</option>
                                        <option defaultValue="Bahariya Oasis">Bahariya Oasis</option>
                                        <option defaultValue="Farafra Oasis">Farafra Oasis</option>
                                        <option defaultValue="Dakhla Oasis">Dakhla Oasis</option>
                                        <option defaultValue="Kharga Oasis">Kharga Oasis</option>
                                        <option defaultValue="Abu Minqar">Abu Minqar</option>
                                        <option defaultValue="El Tor">El Tor</option>
                                        <option defaultValue="Sharm El-Sheikh">
                                            Sharm El-Sheikh
                                        </option>
                                        <option defaultValue="Saint Catherine">
                                            Saint Catherine
                                        </option>
                                        <option defaultValue="Taba">Taba</option>
                                        <option defaultValue="Nuweiba">Nuweiba</option>
                                        <option defaultValue="Taba Heights">Taba Heights</option>
                                        <option defaultValue="Dahab">Dahab</option>
                                        <option defaultValue="El Quseir">El Quseir</option>
                                        <option defaultValue="Marsa Alam">Marsa Alam</option>
                                        <option defaultValue="Abu Dabbab">Abu Dabbab</option>
                                        <option defaultValue="Wadi El Gamal">Wadi El Gamal</option>
                                        <option defaultValue="Shalateen">Shalateen</option>
                                        <option defaultValue="Halayeb">Halayeb</option>
                                        <option defaultValue="Abu Simbel">Abu Simbel</option>
                                        <option defaultValue="Toshka">Toshka</option>
                                        <option defaultValue="Darb El Arbaein">
                                            Darb El Arbaein
                                        </option>
                                        <option defaultValue="El Kharga">El Kharga</option>
                                        <option defaultValue="El Dakhla">El Dakhla</option>
                                        <option defaultValue="El Farafra">El Farafra</option>
                                        <option defaultValue="El Bahariya">El Bahariya</option>
                                        <option defaultValue="Siwa">Siwa</option>
                                        <option defaultValue="Mersa Matruh">Mersa Matruh</option>
                                        <option defaultValue="Sallum">Sallum</option>
                                        <option defaultValue="Ras Sedr">Ras Sedr</option>
                                        <option defaultValue="El Arish">El Arish</option>
                                        <option defaultValue="Rafah">Rafah</option>
                                        <option defaultValue="El Qantara">El Qantara</option>
                                        <option defaultValue="Ismailia">Ismailia</option>
                                        <option defaultValue="Suez">Suez</option>
                                        <option defaultValue="Port Said">Port Said</option>
                                    </optgroup>
                                    <optgroup label="United Arab Emirates">
                                        <option defaultValue="Abu Dhabi">Abu Dhabi</option>
                                        <option defaultValue="Dubai">Dubai</option>
                                        <option defaultValue="Sharjah">Sharjah</option>
                                        <option defaultValue="Ajman">Ajman</option>
                                        <option defaultValue="Umm Al Quwain">Umm Al Quwain</option>
                                        <option defaultValue="Ras Al Khaimah">Ras Al Khaimah</option>
                                        <option defaultValue="Fujairah">Fujairah</option>
                                    </optgroup>
                                    <optgroup label="Saudi Arabia">
                                        <option defaultValue="Riyadh">Riyadh</option>
                                        <option defaultValue="Jeddah">Jeddah</option>
                                        <option defaultValue="Mecca">Mecca</option>
                                        <option defaultValue="Medina">Medina</option>
                                        <option defaultValue="Dammam">Dammam</option>
                                        <option defaultValue="Al Khobar">Al Khobar</option>
                                        <option defaultValue="Dhahran">Dhahran</option>
                                        <option defaultValue="Jubail">Jubail</option>
                                        <option defaultValue="Taif">Taif</option>
                                        <option defaultValue="Abha">Abha</option>
                                        <option defaultValue="Khamis Mushait">Khamis Mushait</option>
                                        <option defaultValue="Najran">Najran</option>
                                        <option defaultValue="Jazan">Jazan</option>
                                        <option defaultValue="Hail">Hail</option>
                                        <option defaultValue="Tabuk">Tabuk</option>
                                        <option defaultValue="Al Bahah">Al Bahah</option>
                                        <option defaultValue="Al Jawf">Al Jawf</option>
                                        <option defaultValue="Northern Borders">
                                            Northern Borders
                                        </option>
                                    </optgroup>
                                    <optgroup label="Libya">
                                        <option defaultValue="Tripoli">Tripoli</option>
                                        <option defaultValue="Benghazi">Benghazi</option>
                                        <option defaultValue="Misrata">Misrata</option>
                                        <option defaultValue=" Sabha">Sabha</option>
                                        <option defaultValue="Tobruk">Tobruk</option>
                                        <option defaultValue="Zawiya">Zawiya</option>
                                        <option defaultValue="Zliten">Zliten</option>
                                        <option defaultValue="Ajdabiya">Ajdabiya</option>
                                        <option defaultValue="Al Bayda">Al Bayda</option>
                                        <option defaultValue="Al Marj">Al Marj</option>
                                        <option defaultValue="Derna">Derna</option>
                                        <option defaultValue="Ghat">Ghat</option>
                                        <option defaultValue="Kufra">Kufra</option>
                                        <option defaultValue="Murzuq">Murzuq</option>
                                        <option defaultValue="Nalut">Nalut</option>
                                        <option defaultValue="Sabratha">Sabratha</option>
                                        <option defaultValue="Sirte">Sirte</option>
                                        <option defaultValue="Tajura">Tajura</option>
                                        <option defaultValue="Tarhuna">Tarhuna</option>
                                        <option defaultValue="Ubari">Ubari</option>
                                    </optgroup>
                                    <optgroup label="Morocco">
                                        <option defaultValue="Rabat">Rabat</option>
                                        <option defaultValue="Casablanca">Casablanca</option>
                                        <option defaultValue="Marrakech">Marrakech</option>
                                        <option defaultValue="Fez">Fez</option>
                                        <option defaultValue="Tangier">Tangier</option>
                                        <option defaultValue="Agadir">Agadir</option>
                                        <option defaultValue="Essaouira">Essaouira</option>
                                        <option defaultValue="Meknes">Meknes</option>
                                        <option defaultValue="Oujda">Oujda</option>
                                        <option defaultValue="Nador">Nador</option>
                                    </optgroup>
                                    <optgroup label="Algeria">
                                        <option defaultValue="Algiers">Algiers</option>
                                        <option defaultValue="Oran">Oran</option>
                                        <option defaultValue="Constantine">Constantine</option>
                                        <option defaultValue="Annaba">Annaba</option>
                                        <option defaultValue="Batna">Batna</option>
                                        <option defaultValue="Biskra">Biskra</option>
                                        <option defaultValue="Blida">Blida</option>
                                        <option defaultValue="Djelfa">Djelfa</option>
                                        <option defaultValue="Ghardaia">Ghardaia</option>
                                        <option defaultValue="Jijel">Jijel</option>
                                    </optgroup>
                                    <optgroup label="Tunisia">
                                        <option defaultValue="Tunis">Tunis</option>
                                        <option defaultValue="Sfax">Sfax</option>
                                        <option defaultValue="Sousse">Sousse</option>
                                        <option defaultValue="Kairouan">Kairouan</option>
                                        <option defaultValue="Gabes">Gabes</option>
                                        <option defaultValue="Gafsa">Gafsa</option>
                                        <option defaultValue="Jendouba">Jendouba</option>
                                        <option defaultValue="Kasserine">Kasserine</option>
                                        <option defaultValue="Kef">Kef</option>
                                    </optgroup>
                                    <optgroup label="Iraq">
                                        <option defaultValue="Baghdad">Baghdad</option>
                                        <option defaultValue="Basra">Basra</option>
                                        <option defaultValue="Mosul">Mosul</option>
                                        <option defaultValue="Erbil">Erbil</option>
                                        <option defaultValue="Sulaymaniyah">Sulaymaniyah</option>
                                        <option defaultValue="Kirkuk">Kirkuk</option>
                                        <option defaultValue="Najaf">Najaf</option>
                                        <option defaultValue="Karbala">Karbala</option>
                                        <option defaultValue="Hilla">Hilla</option>
                                    </optgroup>
                                    <optgroup label="Syria">
                                        <option defaultValue="Damascus">Damascus</option>
                                        <option defaultValue="Aleppo">Aleppo</option>
                                        <option defaultValue="Homs">Homs</option>
                                        <option defaultValue="Hama">Hama</option>
                                        <option defaultValue="Latakia">Latakia</option>
                                        <option defaultValue="Tartous">Tartous</option>
                                        <option defaultValue="Deir ez-Zor">Deir ez-Zor</option>
                                        <option defaultValue="Raqqa">Raqqa</option>
                                        <option defaultValue="Hasakah">Hasakah</option>
                                    </optgroup>
                                    <optgroup label="Sudan">
                                        <option defaultValue="Khartoum">Khartoum</option>
                                        <option defaultValue="Omdurman">Omdurman</option>
                                        <option defaultValue="Port Sudan">Port Sudan</option>
                                        <option defaultValue="Nyala">Nyala</option>
                                        <option defaultValue="Kassala">Kassala</option>
                                        <option defaultValue="Gedaref">Gedaref</option>
                                        <option defaultValue="Sennar">Sennar</option>
                                        <option defaultValue="Dongola">Dongola</option>
                                        <option defaultValue="Atbara">Atbara</option>
                                    </optgroup>
                                    <optgroup label="Qatar">
                                        <option defaultValue="Doha">Doha</option>
                                        <option defaultValue="Al Wakrah">Al Wakrah</option>
                                        <option defaultValue="Al Rayyan">Al Rayyan</option>
                                        <option defaultValue="Umm Salal">Umm Salal</option>
                                        <option defaultValue="Al Khor">Al Khor</option>
                                        <option defaultValue="Al Thakira">Al Thakira</option>
                                        <option defaultValue="Dukhan">Dukhan</option>
                                        <option defaultValue="Al Shahaniya">Al Shahaniya</option>
                                        <option defaultValue="Al Jumaliyah">Al Jumaliyah</option>
                                    </optgroup>
                                    <optgroup label="Bahrain">
                                        <option defaultValue="Manama">Manama</option>
                                        <option defaultValue="Muharraq">Muharraq</option>
                                        <option defaultValue="Riffa">Riffa</option>
                                        <option defaultValue="Hamad Town">Hamad Town</option>
                                        <option defaultValue=" Isa Town">Isa Town</option>
                                        <option defaultValue="A'ali">A'ali</option>
                                        <option defaultValue="Budaiya">Budaiya</option>
                                        <option defaultValue="Jidhafs">Jidhafs</option>
                                        <option defaultValue="Sanabis">Sanabis</option>
                                    </optgroup>
                                </select>
                                {/* <button id="btn-hide-2" className="btn btn-outline-danger m-3">
                                    Hide{" "}
                                </button>
                                <button id="btn-show-2" className="btn btn-outline-info m-3">
                                    Show{" "}
                                </button> */}
                            </div>
                        </div>
                    </div>
                </header>
            </>
        );
    }
