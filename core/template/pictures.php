<div id='picturesList'></div>
<div class='' style="height: 87.7vh;">
    <div class="d-flex align-items-center justify-content-center h-100">
        <label for="cameraFileInput" class='row align-items-center justify-content-center'>
            <button id="cameraButton" class="btn btn-primary"><i class="fas fa-camera"></i></button>

            <!-- The hidden file `input` for opening the native camera -->
            <input id="cameraFileInput" type="file" accept="image/*" capture="environment" hidden />
            <span class='h5 row mt-2'>Click in the button to take a picture</span>
        </label>
    </div>
</div>

<script>
    $(document).ready(function() {
        var cameraFileInput = $('#cameraFileInput');
        var cameraButton = $('#cameraButton');
        var picturesList = $('#picturesList');

        cameraButton.on('click', function(e) {
            e.preventDefault();
            cameraFileInput.click();
        });

        var pictureID = 0;
        cameraFileInput.on('change', function(e) {
            var newPicture = $("<img height=\"80\" width=\"80\" />");
            newPicture.attr("src", window.URL.createObjectURL(this.files[pictureID]))
            picturesList.append(newPicture);


            pictureID++;
        });
    });
</script>