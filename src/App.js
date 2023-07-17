import mapImageSrc from './image/map.png'
import markerImageSrc from './image/marker.png'
import resetImageSrc from './image/reset.png'

import './App.css';
import {useEffect, useRef, useState} from "react";
function App() {

    const [imageSize, setImageSize] = useState({
        width: 0,
        height: 0
    })
    const [markerImageCenter, setMarkerImageCenter] = useState({
        width:0,
        height:0
    })
    const [startPosition, setStartPosition] = useState({x:0, y:0})
    const [endPosition, setEndPosition] = useState({x:0, y:0})
    const mapImageRef = useRef(null)
    const mapContainerRef = useRef(null)

    useEffect(()=>{
        const image = new Image()
        image.src = mapImageSrc
        setImageSize({width: image.width, height: image.height})
        mapContainerRef.current.style.top = "0px"
        mapContainerRef.current.style.left = "0px"

        const markerImage = new Image()
        markerImage.src = markerImageSrc
        setMarkerImageCenter({width: markerImage.width/2, height: markerImage.height})
    },[])
    useEffect(()=>{
        if(startPosition.x !== endPosition.x && startPosition.y != endPosition.y){
            const range_x = endPosition.x - startPosition.x
            const range_y = endPosition.y - startPosition.y

            const current_top = parseFloat(mapContainerRef.current.style.top.slice(0, mapContainerRef.current.style.top.length-2))
            const current_left =  parseFloat(mapContainerRef.current.style.left.slice(0, mapContainerRef.current.style.left.length-2))
            const change_top = current_top + range_y
            const change_left = current_left + range_x

            const check_top = change_top >= 0 ? 0 : change_top <= -(imageSize.height - 768)? -(imageSize.height-768) : change_top
            const check_left = change_left >= 0 ? 0: change_left <= -(imageSize.width - 1024) ? -(imageSize.width-1024) : change_left

            mapContainerRef.current.style.top = check_top + "px"
            mapContainerRef.current.style.left = check_left + "px"
        }
    },[endPosition])

    const setStartMousePositionEvent = (target) => {
        setStartPosition({x: target.nativeEvent.offsetX, y: target.nativeEvent.offsetY})
    }

    const setEndMousePositionEvent = (target) => {
        setEndPosition({x: target.nativeEvent.offsetX, y: target.nativeEvent.offsetY})
    }

    const onClickCreateMarker = (e: MouseEvent<HTMLHtmlElement>) => {
        e.preventDefault()
        const markerPosition = {x: e.nativeEvent?.offsetX, y: e.nativeEvent?.offsetY}
        if(e.target.id == 'mapImage'){
            createMarkerEvent(markerPosition)
        }
    }

    const createMarkerEvent = (position) => {
        // markerImageSrc
        const parentElement = document.getElementById('mapContainer')
        const markerElement = document.createElement('img')
        markerElement.src = markerImageSrc
        markerElement.style.position = 'absolute'
        markerElement.style.zIndex = 1
        markerElement.style.top = (position.y-markerImageCenter.height) + 'px'
        markerElement.style.left = (position.x-markerImageCenter.width) + 'px'
        markerElement.classList.add('markers')

        parentElement.appendChild(markerElement)
    }

    const removeMarkers = () => {
        const markers = document.getElementsByClassName('markers')
        while (markers.length>0){
            markers[markers.length-1].remove()
        }
    }


  return (
    <div className="App">
        <div id={'container'}>
            <img id={'resetButton'} src={resetImageSrc} onClick={removeMarkers} />
            <div ref={mapContainerRef} id={'mapContainer'}
                 onDragStart={setStartMousePositionEvent}
                 onDragEnd={setStartMousePositionEvent}
                 onDragOver={setEndMousePositionEvent}
                 onContextMenu={onClickCreateMarker}
            >
                <img ref={mapImageRef} id={'mapImage'} src={mapImageSrc} />
            </div>
        </div>
    </div>
  );
}

export default App;
