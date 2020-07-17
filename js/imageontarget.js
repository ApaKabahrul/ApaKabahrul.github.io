var World = {

    init: function initFn() {
        this.createOverlays();
    },

    createOverlays: function createOverlaysFn() {
        this.targetCollectionResource = new AR.TargetCollectionResource("assets/mag.wtc", {
            onError: World.onError
        });
        this.tracker = new AR.ImageTracker(this.targetCollectionResource, {
            onTargetsLoaded: World.showInfoBar,
            onError: World.onError
        });

        var imgOne = new AR.ImageResource("assets/imageOne.png", {
            onError: World.onError
        });
        var overlayOne = new AR.ImageDrawable(imgOne, 1, {
            translate: {
                x: -0.15
            }
        });

        this.logo_itera_bulet_head = new AR.ImageTrackable(this.tracker, "logo_itera_bulet_head", {
            drawables: {
                cam: overlayOne
            },
            onImageRecognized: World.hideInfoBar,
            onError: World.onError
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

World.init();