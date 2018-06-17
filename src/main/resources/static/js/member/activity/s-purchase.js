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
            object.set({
            	selectable: true,
            	lockMovementX: true,
            	lockMovementY: true,
            	hasControls: false,
            	hasRotatingPoint: false,
            	selectionBackgroundColor: 'rgba(150,150,150,0.5)',
            	hoverCursor: 'default'
            });
        });
        $(sCanvas.lowerCanvasEl).next().on("click", function() {
        	var obj = sCanvas.getActiveObject();
        	var textContent = obj.areaName;
        	$("#area-type dd").each(function(index, ele) {
        		if (ele.innerHTML == textContent) {
        			ele.click();
        		}
        	});
        });
    }).fail(function (e) {
        alertWindow(e.responseText);
    })
});
