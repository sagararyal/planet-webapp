/* eslint-disable no-nested-ternary */
/* eslint-disable no-underscore-dangle */
import * as turf from '@turf/turf';
import * as d3 from 'd3-ease';
import { useRouter } from 'next/router';
import React, { useRef, useState } from 'react';
import MapGL, {
  FlyToInterpolator,
  Layer,
  Marker,
  NavigationControl,
  Popup,
  Source,
  WebMercatorViewport,
} from 'react-map-gl';
import LeftIcon from '../../../../public/assets/images/icons/LeftIcon';
import RightIcon from '../../../../public/assets/images/icons/RightIcon';
import styles from '../styles/MapboxMap.module.scss';
import { Modal } from '@material-ui/core';
import ExploreInfoModal from './maps/ExploreInfoModal';
import ExploreContainer from './maps/ExploreContainer';
import PopupProject from './PopupProject';

interface mapProps {
  projects: any;
  project: any;
  showSingleProject: Boolean;
  mapboxToken: any;
  setShowProjects: Function;
  searchedProject: any;
  showProjects: any;
}
export default function MapboxMap({
  projects,
  project,
  showSingleProject,
  mapboxToken,
  setShowProjects,
  searchedProject,
  showProjects,
}: mapProps) {
  // eslint-disable-next-line no-undef
  let timer: NodeJS.Timeout;
  const router = useRouter();

  const mapRef = useRef(null);
  const exploreContainerRef = useRef(null);
  const screenWidth = window.innerWidth;
  const isMobile = screenWidth <= 767;
  const [popupData, setPopupData] = useState({ show: false });
  const [open, setOpen] = React.useState(false);
  const [siteExists, setsiteExists] = React.useState(false);
  const defaultMapCenter = isMobile ? [22.54, 9.59] : [36.96, -28.5];
  const defaultZoom = isMobile ? 1 : 1.4;
  const [singleProjectLatLong, setSingleProjectLatLong] = React.useState([
    defaultMapCenter[0],
    defaultMapCenter[1],
  ]);
  const [geoJson, setGeoJson] = React.useState(null);
  const [maxSites, setMaxSites] = React.useState();
  const [currentSite, setCurrentSite] = React.useState<null | Number>();
  const buttonRef = useRef(null);
  const popupRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const infoRef = useRef(null);

  const [mapState, setMapState] = useState({
    mapStyle: 'mapbox://styles/sagararl/ckdfyrsw80y3a1il9eqpecoc7',
    dragPan: true,
  });

  const [viewport, setViewPort] = useState({
    width: Number('100%'),
    height: Number('100%'),
    latitude: defaultMapCenter[0],
    longitude: defaultMapCenter[1],
    zoom: defaultZoom,
  });

  const [exploreExpanded, setExploreExpanded] = React.useState(false);

  const [exploreProjects, setExploreProjects] = React.useState(true);

  const [infoExpanded, setInfoExpanded] = React.useState(null);

  const [openModal, setModalOpen] = React.useState(false);
  const handleModalClose = () => {
    setModalOpen(false);
  };
  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleExploreProjectsChange = (event) => {
    setExploreProjects(event.target.checked);
    setShowProjects(event.target.checked);
    if (!event.target.checked) {
      const newViewport = {
        ...viewport,
        latitude: 36.96,
        longitude: 0,
        zoom: 1.4,
        transitionDuration: 1200,
        transitionInterpolator: new FlyToInterpolator(),
        transitionEasing: d3.easeCubic,
      };
      setViewPort(newViewport);
    } else {
      const newMapState = {
        mapStyle: 'mapbox://styles/sagararl/ckdfyrsw80y3a1il9eqpecoc7',
      };
      const newViewport = {
        ...viewport,
        latitude: defaultMapCenter[0],
        longitude: defaultMapCenter[1],
        zoom: 1.4,
        transitionDuration: 1200,
        transitionInterpolator: new FlyToInterpolator(),
        transitionEasing: d3.easeCubic,
      };
      setMapState(newMapState);
      setViewPort(newViewport);
      router.push('/', undefined, {
        shallow: true,
      });
    }
  };

  React.useEffect(() => {
    if (showSingleProject) {
      if (project) {
        setSingleProjectLatLong([
          project.coordinates.lat,
          project.coordinates.lon,
        ]);
        if (typeof project.sites !== 'undefined' && project.sites.length > 0) {
          if (project.sites[0].geometry) {
            setCurrentSite(0);
            setMaxSites(project.sites.length);
            setGeoJson({
              type: 'FeatureCollection',
              features: project.sites,
            });
            setTimeout(() => {
              setsiteExists(true);
            }, 300);
          } else {
            setsiteExists(false);
            setGeoJson(null);
            setSingleProjectLatLong([
              project.coordinates.lat,
              project.coordinates.lon,
            ]);
          }
        } else {
          setsiteExists(false);
          setGeoJson(null);
          setSingleProjectLatLong([
            project.coordinates.lat,
            project.coordinates.lon,
          ]);
        }
      }
      setExploreProjects(false);
      setShowProjects(false);
    } else {
      setExploreProjects(true);
      setShowProjects(true);
    }
  }, [showSingleProject, project]);

  React.useEffect(() => {
    if (showSingleProject) {
      if (project) {
        if (siteExists) {
          if (geoJson) {
            const bbox = turf.bbox(geoJson.features[currentSite]);
            const { longitude, latitude, zoom } = new WebMercatorViewport(
              viewport
            ).fitBounds(
              [
                [bbox[0], bbox[1]],
                [bbox[2], bbox[3]],
              ],
              {
                padding: {
                  top: 50,
                  bottom: isMobile ? 120 : 50,
                  left: isMobile ? 50 : 400,
                  right: isMobile ? 50 : 100,
                },
              }
            );
            const newMapState = {
              mapStyle: 'mapbox://styles/mapbox/satellite-v9',
            };
            const newViewport = {
              ...viewport,
              longitude,
              latitude,
              zoom,
              transitionDuration: 4000,
              transitionInterpolator: new FlyToInterpolator(),
              transitionEasing: d3.easeCubic,
            };
            setViewPort(newViewport);
            setMapState(newMapState);
          }
        } else {
          const newMapState = {
            mapStyle: 'mapbox://styles/sagararl/ckdfyrsw80y3a1il9eqpecoc7',
          };
          const newViewport = {
            ...viewport,
            longitude: singleProjectLatLong[1],
            latitude: singleProjectLatLong[0],
            zoom: 5,
            transitionDuration: 4000,
            transitionInterpolator: new FlyToInterpolator(),
            transitionEasing: d3.easeCubic,
          };
          setViewPort(newViewport);
          setMapState(newMapState);
        }
      } else {
        const newMapState = {
          mapStyle: 'mapbox://styles/sagararl/ckdfyrsw80y3a1il9eqpecoc7',
        };
        const newViewport = {
          ...viewport,
          latitude: defaultMapCenter[0],
          longitude: defaultMapCenter[1],
          zoom: 1.4,
          transitionDuration: 2400,
          transitionInterpolator: new FlyToInterpolator(),
          transitionEasing: d3.easeCubic,
        };
        setMapState(newMapState);
        setViewPort(newViewport);
      }
    }
  }, [
    project,
    showSingleProject,
    siteExists,
    geoJson,
    currentSite,
    singleProjectLatLong,
  ]);

  React.useEffect(() => {
    document.addEventListener('mousedown', (event) => {
      if (exploreExpanded) {
        if (
          exploreContainerRef &&
          !exploreContainerRef.current.contains(event.target)
        ) {
          setExploreExpanded(false);
        }
      }
    });
  });

  React.useEffect(() => {
    if (exploreExpanded) {
      setMapState({ ...mapState, dragPan: false });
    } else {
      setMapState({ ...mapState, dragPan: true });
    }
  }, [exploreExpanded]);

  const _onStateChange = (state: any) => setMapState({ ...state });

  const _onViewportChange = (view: any) => setViewPort({ ...view });

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  function goToNextProject() {
    if (currentSite < maxSites - 1) {
      setCurrentSite(currentSite + 1);
    } else {
      setCurrentSite(0);
    }
  }

  function goToPrevProject() {
    if (currentSite > 0) {
      setCurrentSite(currentSite - 1);
    } else {
      setCurrentSite(maxSites - 1);
    }
  }

  return (
    <div className={styles.mapContainer}>
      <MapGL
        ref={mapRef}
        {...mapState}
        {...viewport}
        mapboxApiAccessToken={mapboxToken}
        mapOptions={{
          customAttribution:
            '<a href="https://plant-for-the-planet.org/en/footermenu/privacy-policy">Privacy & Terms</a> <a href="https://plant-for-the-planet.org/en/footermenu/imprint">Imprint</a> <a href="mailto:support@plant-for-the-planet.org">Contact</a>',
        }}
        onViewportChange={_onViewportChange}
        onStateChange={_onStateChange}
        scrollZoom={false}
        minZoom={1}
        onClick={() => setPopupData({ ...popupData, show: false })}
        onLoad={() => setLoaded(true)}
      >
        {showSingleProject ? (
          !siteExists ? (
            <Marker
              latitude={singleProjectLatLong[0]}
              longitude={singleProjectLatLong[1]}
              offsetLeft={5}
              offsetTop={-16}
              style={{ left: '28px' }}
            >
              <div className={styles.marker} />
            </Marker>
          ) : (
            <Source id="singleProject" type="geojson" data={geoJson}>
              <Layer
                id="ploygonLayer"
                type="fill"
                source="singleProject"
                paint={{
                  'fill-color': '#fff',
                  'fill-opacity': 0.2,
                }}
              />
              <Layer
                id="ploygonOutline"
                type="line"
                source="singleProject"
                paint={{
                  'line-color': '#89b54a',
                  'line-width': 2,
                }}
              />
            </Source>
          )
        ) : null}

        {!showSingleProject &&
          exploreProjects &&
          searchedProject.map((projectMarker: any, index: any) => (
            <Marker
              key={index}
              latitude={projectMarker.geometry.coordinates[1]}
              longitude={projectMarker.geometry.coordinates[0]}
              offsetLeft={5}
              offsetTop={-16}
              style={{ left: '28px' }}
            >
              <div
                className={styles.marker}
                onClick={() =>
                  router.push('/[p]', `/${projectMarker.properties.slug}`, {
                    shallow: true,
                  })
                }
                onKeyPress={() =>
                  router.push('/[p]', `/${projectMarker.properties.slug}`, {
                    shallow: true,
                  })
                }
                role="button"
                tabIndex={0}
                onMouseOver={() => {
                  timer = setTimeout(() => {
                    setPopupData({
                      show: true,
                      lat: projectMarker.geometry.coordinates[1],
                      long: projectMarker.geometry.coordinates[0],
                      project: projectMarker,
                    });
                  }, 300);
                }}
                onMouseLeave={() => {
                  clearTimeout(timer);
                }}
                onFocus={() => {}}
              />
            </Marker>
          ))}
        {popupData.show && !isMobile && (
          <Popup
            latitude={popupData.lat}
            longitude={popupData.long}
            closeButton={false}
            closeOnClick={false}
            onClose={() => setPopupData({ ...popupData, show: false })}
            anchor="bottom"
            dynamicPosition={false}
            offsetTop={-15}
            tipSize={0}
          >
            <div
              className={styles.popupProject}
              onClick={(event) => {
                if (event.target !== buttonRef.current) {
                  if (!popupRef.current) {
                    router.push(
                      '/[p]',
                      `/${popupData.project.properties.slug}`,
                      {
                        shallow: true,
                      }
                    );
                  } else if (!popupRef.current.contains(event.target)) {
                    router.push(
                      '/[p]',
                      `/${popupData.project.properties.slug}`,
                      {
                        shallow: true,
                      }
                    );
                  }
                }
              }}
              onKeyPress={() =>
                router.push('/[p]', `/${popupData.project.properties.slug}`, {
                  shallow: true,
                })
              }
              role="button"
              tabIndex={0}
              onMouseLeave={() => {
                if (!open) {
                  setTimeout(() => {
                    setPopupData({ ...popupData, show: false });
                  }, 300);
                  handleClose();
                }
              }}
            >
              <PopupProject	              
                key={popupData.project.properties.id}	              
                project={popupData.project}	             
                buttonRef={buttonRef}	             
                popupRef={popupRef}	     
                open={open}	 
                handleOpen={handleOpen}	
                handleClose={handleClose}	
              />
            </div>
          </Popup>
        )}

        <div className={styles.mapNavigation}>
          <NavigationControl showCompass={false} />
        </div>

        <ExploreContainer 
          exploreContainerRef={exploreContainerRef} 
          setExploreExpanded={setExploreExpanded} 
          exploreExpanded={exploreExpanded} 
          isMobile={isMobile} 
          setInfoExpanded={setInfoExpanded} 
          setModalOpen={setModalOpen} 
          loaded={loaded}
          mapRef={mapRef}
          handleExploreProjectsChange={handleExploreProjectsChange}
          exploreProjects={exploreProjects}
        />

        {showSingleProject && siteExists ? (
          maxSites! > 1 ? (
            <div className={styles.projectControls}>
              <div
                onClick={goToPrevProject}
                onKeyPress={goToPrevProject}
                role="button"
                tabIndex={0}
              >
                <LeftIcon />
              </div>

              <p className={styles.projectControlText}>
                &nbsp;&nbsp;
                {project &&
                siteExists &&
                project.sites.length !== 0 &&
                geoJson.features[currentSite]
                  ? geoJson.features[currentSite].properties.name
                  : null}
                &nbsp;&nbsp;
              </p>
              <div
                onClick={goToNextProject}
                onKeyPress={goToNextProject}
                role="button"
                tabIndex={0}
              >
                <RightIcon />
              </div>
            </div>
          ) : null
        ) : null}
      </MapGL>
      {infoExpanded !== null ? (
        <Modal
          className={styles.modal}
          open={openModal}
          onClose={handleModalClose}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          <ExploreInfoModal 
            infoRef={infoRef} infoExpanded={infoExpanded} setInfoExpanded={setInfoExpanded} setModalOpen={setModalOpen} 
          />
        </Modal>
      ) : null}
    </div>
  );
}
