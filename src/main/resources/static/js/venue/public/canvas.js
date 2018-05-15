let canvas = new fabric.Canvas('c', {
    width: 960,
    height: 540
});

let _clipboard;

canvas.on('object:scaling', (e) => {
    let o = e.target;
    if (!o.strokeWidthUnscaled && o.strokeWidth) {
        o.strokeWidthUnscaled = o.strokeWidth;
    }
    if (o.strokeWidthUnscaled) {
        o.strokeWidth = o.strokeWidthUnscaled / o.scaleX;
    }
});

// 平面图--方形
fabric.AreaRect = fabric.util.createClass(fabric.Rect, {
    type: 'area-rect',

    initialize: function (element, options) {
        this.callSuper('initialize', element, options);
        options &&
        this.set('areaName', options.areaName) &&
        this.set('venueName', options.venueName) &&
        this.set('areaType', options.areaType) &&
        this.set('areaCode', options.areaCode);
    },

    toObject: function () {
        return fabric.util.object.extend(this.callSuper('toObject'), {
            areaName: this.areaName,
            venueName: this.venueName,
            areaType: this.areaType,
            areaCode: this.areaCode
        })
    }
});
fabric.AreaRect.fromObject = function (object, callback, forceAsync) {
    return fabric.Object._fromObject('AreaRect', object, callback, forceAsync);
};
fabric.AreaRect.async = true;

// 平面图--圆形
fabric.AreaCircle = fabric.util.createClass(fabric.Circle, {
    type: 'area-circle',

    initialize: function (element, options) {
        this.callSuper('initialize', element, options);
        options &&
        this.set('areaName', options.areaName) &&
        this.set('venueName', options.venueName) &&
        this.set('areaType', options.areaType) &&
        this.set('areaCode', options.areaCode);
    },

    toObject: function () {
        return fabric.util.object.extend(this.callSuper('toObject'), {
            areaName: this.areaName,
            venueName: this.venueName,
            areaType: this.areaType,
            areaCode: this.areaCode
        })
    }
});
fabric.AreaCircle.fromObject = function (object, callback, forceAsync) {
    return fabric.Object._fromObject('AreaCircle', object, callback, forceAsync);
};
fabric.AreaCircle.async = true;

// 平面图--三角形
fabric.AreaTriangle = fabric.util.createClass(fabric.Triangle, {
    type: 'area-triangle',

    initialize: function (element, options) {
        this.callSuper('initialize', element, options);
        options &&
        this.set('areaName', options.areaName) &&
        this.set('venueName', options.venueName) &&
        this.set('areaType', options.areaType) &&
        this.set('areaCode', options.areaCode);
    },

    toObject: function () {
        return fabric.util.object.extend(this.callSuper('toObject'), {
            areaName: this.areaName,
            venueName: this.venueName,
            areaType: this.areaType,
            areaCode: this.areaCode
        })
    }
});
fabric.AreaTriangle.fromObject = function (object, callback, forceAsync) {
    return fabric.Object._fromObject('AreaTriangle', object, callback, forceAsync);
};
fabric.AreaTriangle.async = true;

// 平面图--多边形
fabric.AreaPolyline = fabric.util.createClass(fabric.Polyline, {
    type: 'area-polyline',

    initialize: function (element, options) {
        this.callSuper('initialize', element, options);
        options &&
        this.set('areaName', options.areaName) &&
        this.set('venueName', options.venueName) &&
        this.set('areaType', options.areaType) &&
        this.set('areaCode', options.areaCode);
    },

    toObject: function () {
        return fabric.util.object.extend(this.callSuper('toObject'), {
            areaName: this.areaName,
            venueName: this.venueName,
            areaType: this.areaType,
            areaCode: this.areaCode
        })
    }
});
fabric.AreaPolyline.fromObject = function (object, callback) {
    callback && callback(new fabric.AreaPolyline(object.points, object));
};
fabric.AreaPolyline.async = true;

// 座位
fabric.Seat = fabric.util.createClass(fabric.Rect, {
    type: 'seat',

    initialize: function (element, options) {
        this.callSuper('initialize', element, options);
        options &&
        this.set('price', options.price) &&
        this.set('areaCode', options.areaCode) &&
        this.set('areaName', options.areaName) &&
        this.set('row', options.row) &&
        this.set('column', options.column) &&
        this.set('rawRow', options.rawRow) &&
        this.set('rawColumn', options.rawColumn);
    },

    toObject: function () {
        return fabric.util.object.extend(this.callSuper('toObject'), {
            price: this.price,
            areaCode: this.areaCode,
            areaName: this.areaName,
            row: this.row,
            column: this.column,
            rawRow: this.rawRow,
            rawColumn: this.rawColumn
        })
    }
});
fabric.Seat.fromObject = function (object, callback, forceAsync) {
    return fabric.Object._fromObject('Seat', object, callback, forceAsync);
};
fabric.Seat.async = true;

function copy() {
    canvas.getActiveObject().clone(function (cloned) {
        _clipboard = cloned;
    });
}

function paste() {
    // clone again, so you can do multiple copies.
    console.log(_clipboard);
    _clipboard.clone(function (clonedObj) {
        canvas.discardActiveObject();
        clonedObj.set({
            left: clonedObj.left + 10,
            top: clonedObj.top + 10,
            evented: true,
        });
        if (clonedObj.type === 'activeSelection') {
            // active selection needs a reference to the canvas.
            clonedObj.canvas = canvas;
            clonedObj.forEachObject(function (obj) {
                obj.areaCode = areaCode;
                areaCode++;
                canvas.add(obj);
            });
            // this should solve the unselectability
            clonedObj.setCoords();
        } else {
            clonedObj.areaCode = areaCode;
            areaCode++;
            canvas.add(clonedObj);
        }
        _clipboard.top += 10;
        _clipboard.left += 10;
        canvas.setActiveObject(clonedObj);
        canvas.requestRenderAll();
    });
    let objs = canvas.getObjects();
    for (let i = 0; i < objs.length; i++) {
        console.log(`type: ${objs[i].type} areaCode: ${objs[i].areaCode}`)
    }

}

function deleteObj() {
    let activeObjects = canvas.getActiveObjects();
    for (let i in activeObjects) {
        canvas.remove(activeObjects[i]);
    }
    canvas.discardActiveObject();
    canvas.requestRenderAll();
}

// canvas.on('mouse:over', function(e) {
//     if (e.target.type !== "seat") {
//         return;
//     }
//     let seat = e.target;
//     let positionX = seat.left + 30;
//     let positionY = seat.top + 30;
//
//     let itext = new fabric.IText(`${seat.row}排${seat.column}座`, {
//         left: positionX,
//         top: positionY
//     });
//     canvas.renderAll();
// });

// canvas.on('mouse:out', function(e) {
//     e.target.set('fill', 'green');
//     canvas.renderAll();
// });

// $(window).resize(function (){
//     if (canvas.width !== $("#body").width()) {
//         let scaleMultiplier = $("#body").width() / canvas.width;
//         let objects = canvas.getObjects();
//         for (let i in objects) {
//             objects[i].scaleX = objects[i].scaleX * scaleMultiplier;
//             objects[i].scaleY = objects[i].scaleY * scaleMultiplier;
//             objects[i].left = objects[i].left * scaleMultiplier;
//             objects[i].top = objects[i].top * scaleMultiplier;
//             objects[i].setCoords();
//         }
//
//         canvas.setWidth(canvas.getWidth() * scaleMultiplier);
//         canvas.setHeight(canvas.getHeight() * scaleMultiplier);
//         canvas.renderAll();
//         canvas.calcOffset();
//     }
// });

