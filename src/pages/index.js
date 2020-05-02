import React, {useEffect,useState} from 'react';
import Helmet from 'react-helmet';
import L from 'leaflet';
import {getEmojiFlag} from 'countries-list';


import Layout from 'components/Layout';
import Container from 'components/Container';
import Map from 'components/Map';

import axios from 'axios';

import Table from '../components/Table'


const LOCATION = {
  lat: 38.9072,
  lng: -77.0369
};
const CENTER = [LOCATION.lat, LOCATION.lng];
const DEFAULT_ZOOM = 2;


const IndexPage = () => {
  let dataTable= [], response;

  //const [dataState, updateDataState] = useState(null);
  const [state,updateState] = useState({response:null,dataTable:null});

  useEffect(()=>{

    //console.log('xxxy');
    const tableCreator = async () => {
      try {
        response = await axios.get('https://corona.lmao.ninja/v2/countries');
      } catch(err) {
        console.log('Failed to fetch: ' + err.message, err);
      }

      await response.data.map(async item=>{
        dataTable.push(
          {
            country: getEmojiFlag(item.countryInfo.iso2) +' '+ item.country,
            confirmed: item.cases,
            confirmed24: item.todayCases,
            death: item.deaths,
            death24: item.todayDeaths,
            recovered: item.recovered
          }
        )
      });
  
      updateState({response,dataTable});

      //console.log(state.dataTable)
    }

    tableCreator();
    console.log('use effect run')
  },[]);

  
  

  /**
   * mapEffect
   * @description Fires a callback once the page renders
   * @example Here this is and example of being used to zoom in and set a popup on load
   */

  async function mapEffect({ leafletElement:map } = {}) {
    if (!state.response){
      return;
    }
    console.log('map effect run');
    //let response;

    
  
    const {data = []} = state.response;

    console.log(data);
    //console.log(response);

    const hasData = Array.isArray(data) && data.length > 0;

    if ( !hasData ) return;

    const geoJson = {
      type: 'FeatureCollection',
      features: data.map((country = {}) => {
        const { countryInfo = {} } = country;
        const { lat, long: lng } = countryInfo;
        return {
          type: 'Feature',
          properties: {
           ...country,
          },
          geometry: {
            type: 'Point',
            coordinates: [ lng, lat ]
          }
        }
      })
    }

    console.log(geoJson);

    const geoJsonLayers = new L.GeoJSON(geoJson, {
      pointToLayer: (feature = {}, latlng) => {
        const { properties = {} } = feature;
        let updatedFormatted;
        let casesString;
    
        const {
          country,
          countryInfo,
          updated,
          cases,
          deaths,
          recovered
        } = properties
    
        casesString = `${cases}`;
    
        if ( cases > 1000 ) {
          casesString = `${casesString.slice(0, -3)}k+`
        }
    
        if ( updated ) {
          updatedFormatted = new Date(updated).toLocaleString();
        }
    
        const html = `
          <span 
            class="icon-marker" 
            style="width:${Number(cases/20000).toFixed(1)}em; height:${Number(cases/20000).toFixed(1)}em; max-width:7em; max-height:7em; min-width:3em; min-height:3em;"
          >
            <span class="icon-marker-tooltip">
              <h2>${getEmojiFlag(countryInfo.iso2) +' '+ country}</h2>
              <ul>
                <li><strong>Confirmed:</strong> ${cases}</li>
                <li><strong>Deaths:</strong> ${deaths}</li>
                <li><strong>Recovered:</strong> ${recovered}</li>
                <li><strong>Last Update:</strong> ${updatedFormatted}</li>
              </ul>
            </span>
            ${ casesString }
          </span>
        `;
    
        return L.marker( latlng, {
          icon: L.divIcon({
            className: 'icon',
            html
          }),
          riseOnHover: true
        });
      }
    });

    geoJsonLayers.addTo(map);

  }

  const mapSettings = {
    center: CENTER,
    defaultBaseMap: 'Bulent',
    zoom: DEFAULT_ZOOM,
    mapEffect
  };
console.log('xx');
  return (
    <Layout pageName="home">
      <Helmet>
        <title>Home Page</title>
      </Helmet>

      <Map {...mapSettings}>
      </Map>

      <Container type="content" className="text-center home-start">
        
        {/* <table>
          <thead>
            <tr>
              <th>
                Countheady
              </th>
              <th>
                Cases
              </th>
              <th>
                Today Cases
              </th>
              <th>
                Deaths
              </th>
              <th>
                Today Deaths
              </th>
              <th>
                Recovered
              </th>
            </tr>
          </thead>
          <tbody>
            {state.dataTable}
          </tbody>
        </table> */}

        
        {state.dataTable?
        <Table 
          headCells={[
            { id: 'country', numeric: false, disablePadding: true, label: 'Country' },
            { id: 'confirmed', numeric: true, disablePadding: false, label: 'Confirmed' },
            { id: 'confirmed24', numeric: true, disablePadding: false, label: '24 H' },
            { id: 'death', numeric: true, disablePadding: false, label: 'Death' },
            { id: 'death24', numeric: true, disablePadding: false, label: '24 H' },
            { id: 'recovered', numeric: true, disablePadding: false, label: 'Recovered' }
          ]}
          rows={state.dataTable}
        />:null}
      </Container>
    </Layout>
  );
};

export default IndexPage;
