var ServerInformation = {
    POIDATA_SERVER: "https://apakabahrul.github.io/wikitude/dataPOI.json",
    POIDATA_SERVER_ARG_LAT: "lat",
    POIDATA_SERVER_ARG_LON: "lon",
    POIDATA_SERVER_ARG_NR_POIS: "nrPois"
};
var ArTa = {
    isRequestingData: false,
    initiallyLoadedData: false,

    markerDrawableIdle: null,
    markerDrawableSelected: null,
    markerDrawableDirectionIndicator: null,

    markerList: [],

    currentMarker: null,

    locationUpdaterCounter: 0,
    locationUpdaterMeter: 5,

    loadPoisFromJsonData: function loadPoisFromJsonDataFn(dataPOI) {
        RadarPOI.show();

        ArTa.markerList = [];

        ArTa.markerDrawableIdle = new AR.ImageResource("assets/marker_idle_small.png", {
            onError: ArTa.onError
        });
        ArTa.markerDrawableSelected = new AR.ImageResource("assets/marker_selected.png", {
            onError: ArTa.onError
        });
        ArTa.markerDrawableDirectionIndicator = new AR.ImageResource("assets/indi.png", {
            onError: ArTa.onError
        });

        for (var currentPlaceNr = 0; currentPlaceNr < dataPOI.length; currentPlaceNr++) {
            var singlePoi = {
                "id": dataPOI[currentPlaceNr].id,
                "latitude": parseFloat(dataPOI[currentPlaceNr].latitude),
                "longitude": parseFloat(dataPOI[currentPlaceNr].longitude),
                "title": dataPOI[currentPlaceNr].name,
                "description": dataPOI[currentPlaceNr].description
            };

            ArTa.markerList.push(new Marker(singlePoi));
        }

        ArTa.updateDistance();
        ArTa.updateStatusMessage(currentPlaceNr + ' objek ditambahkan');
    },

    updateDistance: function updateDistanceToUserValuesFn(){
        for (var i=0; i< ArTa.markerList.length; i++){
            ArTa.markerList[i].distanceToUser = ArTa.markerList[i].markerObject.locations[0].distanceToUser();
        }
    },

    updateStatusMessage: function updateStatusMessageFn(message, isWarning) {

        var themeToUse = isWarning ? "e" : "c";
        var iconToUse = isWarning ? "alert" : "info";

        $("#status-message").html(message);
        $("#popupInfoButton").buttonMarkup({
            theme: themeToUse,
            icon: iconToUse
        });
    },

    locationChanged: function locationChangedFn(lat, lon) {

        if (!ArTa.initiallyLoadedData) {
            ArTa.requestDataFromServer(lat, lon);
            ArTa.initiallyLoadedData = true;
        }

        else if (ArTa.locationUpdaterCounter === 0){
            ArTa.updateDistance();
        }

        ArTa.updateDistance();

    },

    onMarkerSelected: function onMarkerSelectedFn(marker) {
        ArTa.currentMarker = marker;

        $("#detail-nama").html(marker.dataPOI.title);
        $("#detail-deskripsi").html(marker.dataPOI.description);

        if (undefined === marker.distanceToUser){
            marker.distanceToUser = marker.markerObject.locations[0].distanceToUser;
        }

        var distanceValue = (marker.distanceToUser > 999) ? ((marker.distanceToUser / 1000).toFixed(2) + " km") : (Math.round(marker.distanceToUser) + " m");

        $("#detail-jarak").html(distanceValue);

        $("#panel-poidetail").panel("open",123);
        $("#ui-panel-dismiss").unbind("mousedown");
        $("#panel-poidetail").on("panelbeforeclose", function (event, ui){
            ArTa.currentMarker.setDeselected(ArTa.currentMarker);
        });

        /*if (ArTa.currentMarker) {
            if (ArTa.currentMarker.dataPOI.id === marker.dataPOI.id) {
                return;
            }
            ArTa.currentMarker.setDeselected(ArTa.currentMarker);
        }*/

        /*marker.setSelected(marker);
        ArTa.currentMarker = marker;*/
    },

    onScreenClick: function onScreenClickFn() {

        /*if (ArTa.currentMarker) {
            ArTa.currentMarker.setDeselected(ArTa.currentMarker);
        }
        ArTa.currentMarker = null;*/
    },

    requestDataFromServer: function requestDataFromServerFn(lat, lon) {
        ArTa.isRequestingData = true;
        ArTa.updateStatusMessage('Requesting tempat');

        var serverUrl = ServerInformation.POIDATA_SERVER + "?" +
            ServerInformation.POIDATA_SERVER_ARG_LAT + "=" +
            lat + "&" + ServerInformation.POIDATA_SERVER_ARG_LON + "=" +
            lon + "&" + ServerInformation.POIDATA_SERVER_ARG_NR_POIS + "=100";

        var jqxhr = $.getJSON(serverUrl, function(data) {
            ArTa.loadPoisFromJsonData(data);
        })
            .error(function(err) {
                ArTa.updateStatusMessage("Invalid web-service response.", true);
                ArTa.isRequestingData = false;
            })
            .complete(function() {
                ArTa.isRequestingData = false;
            });
    },

    onError: function onErrorFn(error) {
        alert(error);
    }
};

AR.context.onLocationChanged = ArTa.locationChanged;

AR.context.onScreenClick = ArTa.onScreenClick;