$('#filedrop').change(function(e) {
    fileName = e.target.files[0].name;
});

function download(file, filename) {
    var element = document.createElement('a');
    element.setAttribute('href', file);
    element.setAttribute('download', filename);
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

$("#filedrop").on("change", function() {
    var fileName = $(this).val().split("\\").pop();
    $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
    $("#trackform").submit();
});

$('#trackform').submit(function(e) {
    e.preventDefault();
    $("#progress").css("opacity", 1);
    $(".progress-footer").show();

    let formdata = new FormData(this);

    $.ajax({
        xhr: function() {
            var xhr = new window.XMLHttpRequest();
            xhr.upload.addEventListener("progress", function(evt) {
                if (evt.lengthComputable) {
                    var percentComplete = (evt.loaded / evt.total) * 100;
                    if (percentComplete == 100) {
                        $("#progress").css("width", Math.trunc(percentComplete) + "%");
                        $("#progress").attr('aria-valuenow', Math.trunc(percentComplete));
                    } else {
                        $("#progress").css("width", Math.trunc(percentComplete) + "%");
                        $("#progress").attr('aria-valuenow', Math.trunc(percentComplete));
                    }
                }
            }, false);
            return xhr;
        },
        url: '/uploads',
        type: 'POST',
        data: formdata,
        processData: false,
        contentType: false,
        error: function(err) {
            if (err.responseJSON) {
                let responsetext = err.responseJSON.error;
                alert(responsetext);
            } else {
                alert("some error occurred");
            }
        },
        success: function(result) {
            $("#uploaded-files-list .list-group-item-light").removeClass('list-group-item-light').addClass('list-group-item-info');
            $("#progress")
                .animate({ opacity: "1" }, 1500)
                .animate({ opacity: "0" }, 2000);
            $('#trackform').trigger("reset");
            var listedfiles = result.map(function(file) {
                let thishtml = `<button type="button" data-download="/uploads/download/${file.filename}/${file.originalname}" class="list-group-item list-group-item-action download-item">${file.originalname}</button>`;
                $("#uploaded-files-list").last().append(thishtml);
                return file.filename;
            });
            $(".download-item").on("click", function() {
                download($(this).attr('data-download'), $(this).text());
            });
        }
    });
});