import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api"

export default function Map(){

const center = {
lat:-3.3869,
lng:36.6829
}

return(

<LoadScript googleMapsApiKey="YOUR_GOOGLE_MAP_KEY">

<GoogleMap
mapContainerStyle={{width:"100%",height:"400px"}}
center={center}
zoom={12}
>

<Marker position={center} />

</GoogleMap>

</LoadScript>

)

}