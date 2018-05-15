let isDown, origX, origY, rect;
let mode = 'no-paint';
let canFillSeat = true;
let isOver = false;

function fillSeat() {
    if (!canFillSeat) {
        return;
    }
    canvas.selection = false;
    mode = 'paint';
    $("#seat-btn").addClass("disable-btn");
    canFillSeat = false;
}

function saveSeat() {
    let areaCode = $("#seat-area-selector").val() - 0;
    let find = false;
    // 存储
    if (canvas.getObjects().length >= 2) {
        // let objects = canvas.getObjects();
        // let seatList = [];
        // for (let i = 0; i < objects.length; i++) {
        //     let obj = objects[i];
        //     if (obj.row === undefined && obj.column === undefined) {
        //         continue;
        //     }
        //     seatList.push({"areaCode": myAreaCode,"row": obj.row, "column": obj.column});
        // }
        // 找到了，需要更新
        console.log(venueData.seatGraphList);
        for (let i = 0; i < venueData.seatGraphList.length; i++) {
            if (venueData.seatGraphList[i]["areaCode"] === myAreaCode) {
                find = true;
                venueData.seatGraphList[i] = {
                    "areaCode": myAreaCode,
                    "seatGraph": JSON.stringify(canvas),
                };
                // 更新seatList
                for (let j = 0; j < venueData.seatList.length; j++) {
                    if (venueData.seatList[j]["areaCode"] === myAreaCode) {
                        venueData.seatList.splice(j, 1);
                    }
                }
                // venueData.seatList = venueData.seatList.concat(seatList);
                break;
            }
        }
        // 没找到，直接push
        if (!find) {
            venueData.seatGraphList.push({
                "areaCode": myAreaCode,
                "seatGraph": JSON.stringify(canvas),
            });
            // venueData.seatList = venueData.seatList.concat(seatList);
        }
    }

    // 清空画布
    myAreaCode = areaCode;
    reset();

    // 重新设置画布
    find = false;
    let json;
    for (let i = 0; i < venueData.seatGraphList.length; i++) {
        // console.log(venueData.seatList[i]["areaCode"]);
        if (venueData.seatGraphList[i]["areaCode"] === areaCode) {
            find = true;
            json = venueData.seatGraphList[i]["seatGraph"];
            break;
        }
    }
    if (find) {
        canvas.loadFromJSON(json, canvas.renderAll.bind(canvas));
        mode = 'no-paint';
        $("#seat-btn").addClass("disable-btn");
        canFillSeat = false;
        canvas.selection = true;
        isOver = true;
    }
}

function deleteSeat() {
    let activeObjects = canvas.getActiveObjects();
    let deleteList = [];
    for (let i = 0; i < activeObjects.length; i++) {
        deleteList.push({row: activeObjects[i].row, column: activeObjects[i].column});
    }
    deleteObj();
    let objects = canvas.getObjects();
    for (let j = 0; j < deleteList.length; j++) {
        // console.log(`${deleteList[j].row}  ${deleteList[j].column}`);
        for (let i = 0; i < objects.length; i++) {
            let obj = objects[i];
            if (obj.row === undefined && obj.column === undefined) {
                continue;
            }
            if (obj.rawColumn > deleteList[j].column && obj.rawRow === deleteList[j].row) {
                // console.log(obj);
                obj.column--;
            }

        }
    }

    for (let i = 0; i < objects.length; i++) {
        let obj = objects[i];
        if (obj.row !== undefined && obj.column !== undefined) {
            // console.log(obj);
            obj.rawRow = obj.row;
            obj.rawColumn = obj.column;
        }
    }

}

function reset() {
    initCanvas();
    $("#seat-btn").removeClass("disable-btn");
    canFillSeat = true;
    isOver = false;
}

canvas.on('mouse:down', function (o) {
    if (mode === 'no-paint') {
        return;
    }
    isDown = true;
    let pointer = canvas.getPointer(o.e);
    origX = pointer.x;
    origY = pointer.y;
    rect = new fabric.Rect({
        left: pointer.x,
        top: pointer.y,
        width: 1,
        height: 1,
        strokeWidth: 1,
        stroke: '#8c8c8c',
        fill: "transparent",
        selectable: false,
    });
    canvas.add(rect);
});

canvas.on('mouse:move', function (o) {
    if (mode === 'no-paint') {
        return;
    }
    if (!isDown) return;
    let pointer = canvas.getPointer(o.e);
    rect.set({width: pointer.x - origX, height: pointer.y - origY});
    canvas.renderAll();
});

canvas.on('mouse:up', function (o) {
    if (mode === 'no-paint') {
        return;
    }
    isDown = false;
    mode = 'no-paint';
    let x1 = rect.left;
    let y1 = rect.top;
    let x2 = rect.left + rect.width;
    let y2 = rect.top + rect.height;

    if (x1 > x2) {
        let x = x1;
        x1 = x2;
        x2 = x;
    }

    if (y1 > y2) {
        let y = y1;
        y1 = y2;
        y2 = y;
    }

    let row = 1, column = 1;
    for (let i = Math.floor(x1 + 1); i < x2 - 20; i = i + 30) {

        for (let j = Math.floor(y1 + 1); j < y2 - 20; j = j + 30) {
            let seat = new fabric.Seat({
                row: row,
                column: column,
                rawRow: row,
                rawColumn: column,
                areaCode: myAreaCode,
                areaName: areaCodeToName.get(myAreaCode),
                left: i,
                top: j,
                width: 20,
                height: 20,
                strokeWidth: 1,
                stroke: '#8c8c8c',
                fill: "transparent",
                selectable: true,
                lockMovementX: true,
                lockMovementY: true,
                lockScalingX: true,
                lockScalingY: true,
                lockRotation: true,
                hasControls: false,
                hoverCursor: 'default'
            });
            canvas.add(seat);
            row++;
            // console.log('row is add' + row);
        }
        row = 1;
        column++;
        // console.log('column is add' + column);
    }
    canvas.remove(rect);
    canvas.selection = true;
    isOver = true;
    // canvas.hasControls = false;
    // console.log(canvas.getObjects());

});

canvas.on('selection:created', function (ev) {
    ev.target.set({
        lockMovementX: true,
        lockMovementY: true,
        lockScalingX: true,
        lockScalingY: true,
        lockRotation: true,
        hasControls: false,
        hoverCursor: 'default'
    });
});

canvas.on('mouse:over', function (e) {
    if (!isOver) {
        return;
    }
    let row = e.target.row;
    let column = e.target.column;
    if (row === undefined || column === undefined) {
        return;
    }
    let mousePos = canvas.getPointer(e.e);
    let xOffset = $("#graph").position().left + $("#body").position().left;
    let yOffset = $("#graph").position().top + $("#body").position().top - 20;

    $("#tooltip").addClass("my-tooltip").css("top", (mousePos.y + yOffset) + "px").css("display", "block")
        .css("left", (mousePos.x + xOffset) + "px").text(`${row}排${column}座`);
    // console.log(`${$("#graph").position().top} ${$("#graph").position().left}`)
    // console.log(`${xOffset} ${yOffset}`)
});

canvas.on('mouse:out', function (e) {
    $("#tooltip").empty().removeClass("my-tooltip").css("display", "none");
});

function initCanvas() {
    canvas.clear();
    fabric.Image.fromURL('/image/stage.png', function (oImg) {
        canvas.add(oImg);
        oImg.set({top: 20, left: 440, selectable: false, hoverCursor: 'default'}).scale(0.5);
    });
    canvas.set({selection: false, hoverCursor: 'default'});
}