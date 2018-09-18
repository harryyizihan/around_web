import React from 'react';
import {
    withScriptjs,
    withGoogleMap,
    GoogleMap,
} from "react-google-maps";
import { POS_KEY } from '../constants';
import { AroundMarker } from './AroundMarker';


class AroundMap extends React.Component {
    reloadMarkers = () => {
        const mapCenter = this.map.getCenter();
        const center = { lat: mapCenter.lat(), lon: mapCenter.lng() };
        const radius = this.getRadius();
        this.props.loadNearbyPost(center, radius);
    }

    getRadius = () => {
        const center = this.map.getCenter();
        const bounds = this.map.getBounds();
        if (center && bounds) {
            const ne = bounds.getNorthEast();
            const right = new window.google.maps.LatLng(center.lat(), ne.lng());
            return 0.001 * window.google.maps.geometry.spherical.computeDistanceBetween(center, right);
        }
    }

    saveMapRef = (mapInstance) => {
        this.map = mapInstance;
        window.map = mapInstance;
    }

    render() {
        const { lat, lon } = JSON.parse(localStorage.getItem(POS_KEY));
        return (
            <GoogleMap
                defaultZoom={11}
                defaultCenter={{ lat, lng: lon }}
                ref={this.saveMapRef}
                onDragEnd={this.reloadMarkers}
                onZoomChanged={this.reloadMarkers}
            >
                {
                    this.props.posts.map((post) => <AroundMarker key={post.url} post={post}/>)
                }
            </GoogleMap>
        );
    }
}

export const WrappedAroundMap = withScriptjs(withGoogleMap(AroundMap));