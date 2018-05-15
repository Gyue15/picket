let sCanvas = new fabric.Canvas('sc', {
    width: 960,
    height: 540
});

$(function () {
    $.get("/api/venues/area-graphs", {
        "venue-code": getUrlParam("venueCode")
    }).done(function (data) {
        let areaGraph = data.data;
        sCanvas.loadFromJSON(areaGraph, canvas.renderAll.bind(canvas), function (o, object) {
            object.set({selectable: false, hoverCursor: 'default'});
        });
        sCanvas.selection = false;
    }).fail(function (e) {
        alertWindow(e.responseText);
    })
});