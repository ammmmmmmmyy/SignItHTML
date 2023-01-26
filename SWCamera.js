var upload = $('#uploadConfirm');
var preview = $('#picturePreview');
var message = $('#pictureMessage');
var success = $('#pictureSuccess');

var videoStream;
var videoObj;
var overlayObj;

$('#pictureButton').click(function () {

    displayVideo(function (overlay) {

        // Grab elements, create settings, etc.
        var video = document.getElementById('video');

        // Get access to the camera!
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {

            try {
                navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
                    videoStream = stream;
                    video.srcObject = stream;

                    videoObj = video;

                    video.play();
                    overlay.show();

			setTimeout(function() {
				$('#video').click();
			}, 5000);
                });
            } catch (ex) {
                //console.log('nope');
            }

        } else {
            console.log('nope');
        }
    });
});

function displayVideo(callback) {
    overlayObj = $('<div>')
        .addClass('camera-overlay')
        .hide();

    var video = $('<video>')
        .attr('id', 'video')
        .attr('width', '100%')
        .attr('height', '100%')
        .prop('autoplay', true)
	.prop('controls', true);

    var cancel = $('<div>')
        .addClass('camera-cancel')
        .html('<i class="fal fa-ban"></i>');

    var snap = $('<div>')
        .addClass('camera-snap')
        .html('<i class="fal fa-camera"></i>');

    var snapContainer = $('<div>')
        .addClass('camera-snap-container')
        .append(cancel)
        .append(snap);

    var hidden = $('<div>').addClass('hidden-canvas').hide();

    overlayObj
        .append(hidden)
        .append(video)
        .append(snapContainer);

    $('html').append(overlayObj);

    $('.camera-cancel').click(function () {
        $('#pictureConfirm').hide();
        upload.hide();

        hideVideo();
    });

    $('.camera-snap').click(function () {
        var video = document.getElementById('video');

        var width = video.videoWidth;
        var height = video.videoHeight;

        var canvas = $('<canvas>')
            .attr('width', width)
            .attr('height', height);

        var canvasObj = canvas[0];
        var context = canvasObj.getContext('2d');
        context.drawImage(video, 0, 0, width, height);

        var imgURL = canvasObj.toDataURL();

        $('#pictureConfirm').show();
        success.show();
        preview.attr('src', imgURL);

        preview.css({ 'width': '100%' });

        $('#Picture').val(imgURL.split(',')[1]);

        hideVideo();

        commentField(canvasObj);
    });

    callback(overlayObj);
}


function backEvent() {
    history.pushState(null, null, document.URL);
    hideVideo();
}

function hideVideo() {
    videoStream.getTracks().forEach(function (e, i) {
        e.stop();
    });
    overlayObj.remove();
}