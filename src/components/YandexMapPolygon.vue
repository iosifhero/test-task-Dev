<template>
  <yandex-map
    v-model="map"
    :settings="{
      location: {
        center: [37.617644, 55.755819],
        zoom: 10,
      },
    }"
  >
    <yandex-map-default-scheme-layer />
    <yandex-map-default-features-layer />

    <yandex-map-feature
      :settings="{
        style: {
          stroke: [
            {
              color: '#006efc',
              width: 4,
            },
          ],
          fill: 'rgba(56, 56, 219, 0.5)',
        },
        geometry: {
          type: 'Polygon',
          coordinates: [coordinates],
        },
      }"
    />

    <yandex-map-controls :settings="{ position: 'left top', orientation: 'horizontal' }">
      <yandex-map-control>
        <div class="p-2 flex flex-col">
          Изменить размер полигона
          <hr />
          <div class="divide-x-1">
            <button
              type="button"
              class="w-1/2 cursor-pointer"
              @click="metersMkad > -5000 && (coordinates = expandPolygon(coordinates, -1000))"
            >
              -
            </button>

            <button
              type="button"
              class="w-1/2 cursor-pointer"
              @click="metersMkad < 5000 && (coordinates = expandPolygon(coordinates, 1000))"
            >
              +
            </button>
          </div>
        </div>
      </yandex-map-control>
    </yandex-map-controls>

    <yandex-map-listener
      :settings="{
        onClick: (_, e) => {
          createPlacemark(e.coordinates);
        },
      }"
    />
    <yandex-map-default-marker
      v-if="clicks.length > 0"
      :settings="{ coordinates: clicks[clicks.length - 1] }"
    />
    <yandex-map-feature
      v-if="clicks.length && nearestPoint"
      :settings="{
        geometry: {
          type: 'LineString',
          coordinates: [clicks[clicks.length - 1], nearestPoint],
        },
        style: {
          stroke: [{ color: '#ff0000', width: 3 }],
        },
      }"
    />
  </yandex-map>

  <MapAlert
    :show="showAlert"
    :address="address"
    :distance="distance"
    @close="showAlert = false"
  />
</template>

<script setup lang="ts">
import { ref, shallowRef } from 'vue';
import {
  YandexMap,
  YandexMapDefaultSchemeLayer,
  YandexMapDefaultFeaturesLayer,
  YandexMapFeature,
  YandexMapListener,
  YandexMapControls,
  YandexMapControl,
  YandexMapDefaultMarker,
} from 'vue-yandex-maps';
import { usePolygonStore } from '@/stores/polygonStore';
import { storeToRefs } from 'pinia';
import { useClickStore } from '@/stores/clickStore';
import { buffer } from '@turf/buffer';
import { polygon as turfPolygon } from '@turf/helpers';
import type { Position } from 'geojson';
// eslint-disable-next-line object-curly-newline
import { findNearest, isPointInPolygon, getDistance, convertDistance } from 'geolib';
import type { LngLat, SearchResponse, YMap } from '@yandex/ymaps3-types';
import MapAlert from './MapAlert.vue';

const { coordinates } = storeToRefs(usePolygonStore());
const { clicks } = storeToRefs(useClickStore());

const address = ref('');
const showAlert = ref(false);
const nearestPoint = ref();
const distance = ref('');
const metersMkad = ref(0);

const getAddress = (geoObjectsArray: SearchResponse) => {
  const first = geoObjectsArray[0];
  if (!first) return 'Адрес не найден';

  const name = first.properties?.name || '';
  const description = first.properties?.description || '';

  return description ? `${description}, ${name}` : name;
};

async function createPlacemark(coords: LngLat) {
  if (!isPointInPolygon(coords, coordinates.value)) {
    clicks.value.push(coords);
    localStorage.setItem('lastClick', JSON.stringify(coords));

    nearestPoint.value = findNearest(coords, coordinates.value);
    distance.value = convertDistance(getDistance(nearestPoint.value, coords), 'km').toFixed(2);

    const rawGeoObjects = await ymaps3.search({ text: coords.toString() });
    address.value = getAddress(rawGeoObjects);

    showAlert.value = true;
  }
}

function expandPolygon(polygonCoords: LngLat[], expandDistance: number): LngLat[] {
  metersMkad.value += expandDistance;

  clicks.value.length = 0;
  showAlert.value = false;

  const turfPoly = turfPolygon([polygonCoords as Position[]]);
  const buffered = buffer(turfPoly, expandDistance, { units: 'meters' });

  if (buffered?.geometry.type === 'Polygon') {
    return buffered.geometry.coordinates[0] as LngLat[];
  }
  return polygonCoords;
}

const map = shallowRef<null | YMap>(null);
</script>
