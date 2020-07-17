var Trigger = {
    init: function initFn(){
        this.createOverlays();
    },

    createOverlays: function createOverlaysFn(){
        this.targetCollectionResource = new AR.TargetCollectionResource("assets/ mag.wtc", {
            onError: Trigger.onError
        });

        this.tracker = new AR.ImageTracker(this.targetCollectionResource, {
            onTargetsLoaded: Trigger.showInfoBar,
            onError: Trigger.onError
        });

        var imgOne = new AR.ImageResource("assets/imageOne.ong", {
            onError: Trigger.onError
        });

        var overlayOne = new AR.ImageDrawable(imgOne, 1 , {
            translate:{
                x: -0.15
            }
        });

        this.logo_itera_bulet_head = new AR.ImageTrackable(this.tracker, "logo_itera_bulet_head",{
            drawables:{
                cam: overlayOne
            },
            onImageRecognized: Trigger.hideInfoBar,
            onError: Trigger.onError
        });
    },

    onError: function onErrorFn(error) {
        alert(error);
    },

    hideInfoBar: function hideInfoBarFn() {
        document.getElementById("infoBox").style.display = "none";
    },

    showInfoBar: function worldLoadedFn() {
        document.getElementById("infoBox").style.display = "table";
    }

};

Trigger.init();