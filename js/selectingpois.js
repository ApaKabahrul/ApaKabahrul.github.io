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

    loadPoisFromJsonData: function loadPoisFromJsonDataFn(dataPOI) {

        ArTa.markerList = [];

        ArTa.markerDrawableIdle = new AR.ImageResource("assets/marker_idle.png", {
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

        ArTa.updateStatusMessage(currentPlaceNr + ' objek ditambahkan');
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
    },

    onMarkerSelected: function onMarkerSelectedFn(marker) {

        if (ArTa.currentMarker) {
            if (ArTa.currentMarker.dataPOI.id === marker.dataPOI.id) {
                return;
            }
            ArTa.currentMarker.setDeselected(ArTa.currentMarker);
        }

        marker.setSelected(marker);
        ArTa.currentMarker = marker;
    },

    onScreenClick: function onScreenClickFn() {
        if (ArTa.currentMarker) {
            ArTa.currentMarker.setDeselected(ArTa.currentMarker);
        }
        ArTa.currentMarker = null;
    },

    requestDataFromServer: function requestDataFromServerFn(lat, lon) {
        ArTa.isRequestingData = true;
        ArTa.updateStatusMessage('Requesting tempat');

        var serverUrl = ServerInformation.POIDATA_SERVER + "?" +
            ServerInformation.POIDATA_SERVER_ARG_LAT + "=" +
            lat + "&" + ServerInformation.POIDATA_SERVER_ARG_LON + "=" +
            lon + "&" + ServerInformation.POIDATA_SERVER_ARG_NR_POIS + "=";

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
