"use client"

import { usePathname } from "next/navigation";
import Header from "/app/components/Header";
import FooterComponent from "/app/components/Footer";
import { color } from "/app/lib/colorLog";
import { useEffect, useState } from "react";
import Icon from "@mdi/react";
import { mdiCurrencyUsd, mdiController } from "@mdi/js";


export default function Steam({ params, searchParams }) {
  // color.log("green", `Search Params: ${JSON.stringify(searchParams)}`);
  const mySteamId = searchParams.id || 0
  const myRegion = searchParams.locale || "br"

  const getData = async () => {
    const dataFetch = await fetch(`https://repl.c4ldas.com.br/api/steam/game/?id=${mySteamId}&region=${myRegion}`)
    const data = await dataFetch.json()

    if (data.name === '') {
      data.name = "Cannot load user data or no game running"
      data.price = "N/A"
      data.timePlayed = "N/A"
      return data
    }
    return data
  }

  const [getDataResponse, setDataResponse] = useState(null)
  const path = usePathname();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getData();
        setDataResponse(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  },);

  const style = {
    box: {
      display: "block",
      background: `linear-gradient(90deg, rgba(0, 0, 0, 0.85) 60%, rgba(0,212,255,0) 100%), 
                  url('${getDataResponse?.header_image || ''}') center center no-repeat`,
      backgroundSize: "100%",
      borderRadius: "10px",
      minHeight: "150px",
      minWidth: "500px",
      maxWidth: "500px",
    },

    text: {
      minWidth: "55%",
      maxWidth: "55%",
      height: "100%",
      padding: "5% 0px 5% 20px", // top, right, bottom, left
      color: "white",
    },

    title: {
      fontWeight: "bold",
      fontSize: "1.4rem",
    },

    infos: {
      color: "white",
      display: "inline-flex",
      verticalAlign: "middle",
      alignItems: "center",
    },

    green: {
      color: "green",
      paddingRight: "0.5rem",
    }
  }


  return (
    <div className="container">
      <Header />
      <main className="main block">
        <h1>This is the {path} page</h1>
        {!getDataResponse && <span id="title">Loading...</span>}
        {getDataResponse && (
          <div id="box" style={style.box}>
            <div id="text" style={style.text}>
              <span id="title" style={style.title}>{getDataResponse.name}</span>
              <hr />
              <span style={style.infos}>
                <Icon path={mdiCurrencyUsd} size={1} />
                <span style={style.green}>{getDataResponse.price}</span>

                <Icon path={mdiController} size={1} />
                <span style={style.green}>{getDataResponse.timePlayed}h</span>
              </span>

            </div>
          </div>
        )}
      </main >
      <FooterComponent />
    </div >
  );
}
