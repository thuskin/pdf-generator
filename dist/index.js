"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
function saveImageToFile(imageString, outputDirectory, fileName) {
    if (imageString === undefined) {
        console.error('Image string is undefined.');
        return undefined;
    }
    // Find the position of 'image=data:image/png,'
    const base64Prefix = 'image=data:image/png,';
    const startIndex = imageString.indexOf(base64Prefix);
    if (startIndex === -1) {
        console.error('Base64 data prefix not found in the provided string.');
        return undefined;
    }
    // Extract base64 data part after 'image=data:image/png,'
    const base64Data = imageString.substring(startIndex + base64Prefix.length);
    // Base64 to buffer
    const buffer = Buffer.from(base64Data, 'base64');
    // Ensure the output directory exists
    if (!fs.existsSync(outputDirectory)) {
        fs.mkdirSync(outputDirectory, { recursive: true });
    }
    // Construct the file path
    const filePath = path.join(outputDirectory, fileName + ".png");
    // Write the buffer to file
    fs.writeFileSync(filePath, buffer);
    console.log(`Image saved to: ${filePath}`);
    // Return the file path
    return filePath;
}
// Read the JSON file
fs.readFile('./om_floors.json', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    try {
        // Parse the JSON data into an object
        const jsonData = JSON.parse(data);
        // Set to store unique wings
        const uniqueWings = new Set();
        // Maps to store check-in areas grouped by Floor and Wing
        const checkinAreasMap = new Map();
        const bookingAreasMap = new Map();
        const floorCountMap = new Map();
        // Maps to store unique areas
        const uniqueCheckinAreasMap = new Map();
        const uniqueBookingAreasMap = new Map();
        // Structured data for StaticCheckinAllFloor and StaticBookingAllFloor
        const staticCheckinAllFloor = {};
        const staticBookingAllFloor = {};
        let totalCheckinAreas = 0;
        let totalBookingAreas = 0;
        // Parse each diagram in the JSON data
        const mxfile = jsonData.mxfile;
        if (mxfile && Array.isArray(mxfile.diagram)) {
            mxfile.diagram.forEach((diagram) => {
                const diagramName = diagram['-name'];
                const matches = diagramName.match(/^(\d+F)\s*(\w+|booking)?$/i);
                if (matches) {
                    const floor = matches[1];
                    const wing = matches[2] || 'Booking';
                    uniqueWings.add(wing);
                    // Initialize maps if not already
                    if (!checkinAreasMap.has(floor)) {
                        checkinAreasMap.set(floor, new Map());
                        bookingAreasMap.set(floor, new Map());
                        floorCountMap.set(floor, 0);
                        uniqueCheckinAreasMap.set(floor, new Map());
                        uniqueBookingAreasMap.set(floor, new Map());
                        staticCheckinAllFloor[floor] = { floor: parseInt(floor) };
                        staticBookingAllFloor[floor] = { floor: parseInt(floor), data: [] };
                    }
                    const floorCheckinMap = checkinAreasMap.get(floor);
                    const floorBookingMap = bookingAreasMap.get(floor);
                    const floorUniqueCheckinMap = uniqueCheckinAreasMap.get(floor);
                    const floorUniqueBookingMap = uniqueBookingAreasMap.get(floor);
                    if (!floorCheckinMap.has(wing)) {
                        floorCheckinMap.set(wing, []);
                        floorUniqueCheckinMap.set(wing, new Set());
                    }
                    if (!floorBookingMap.has(wing)) {
                        floorBookingMap.set(wing, []);
                        floorUniqueBookingMap.set(wing, new Set());
                    }
                    const checkinWingAreas = floorCheckinMap.get(wing);
                    const bookingWingAreas = floorBookingMap.get(wing);
                    const uniqueCheckinWingAreas = floorUniqueCheckinMap.get(wing);
                    const uniqueBookingWingAreas = floorUniqueBookingMap.get(wing);
                    if (diagram.mxGraphModel && diagram.mxGraphModel.root && Array.isArray(diagram.mxGraphModel.root.object)) {
                        diagram.mxGraphModel.root.object.forEach((obj) => {
                            var _a;
                            if (obj['-area']) {
                                const areaName = obj['-area'];
                                const mxGeometry = (_a = obj.mxCell) === null || _a === void 0 ? void 0 : _a.mxGeometry;
                                if (obj['-cap']) {
                                    // Check-in area
                                    const checkinAreaKey = `${floor}-${wing}-${areaName}`;
                                    if (!uniqueCheckinWingAreas.has(checkinAreaKey)) {
                                        checkinWingAreas.push(areaName);
                                        uniqueCheckinWingAreas.add(checkinAreaKey);
                                        totalCheckinAreas++;
                                        // Add mxGeometry to StaticCheckinAllFloor
                                        if (mxGeometry) {
                                            let existingCheckinArea = staticCheckinAllFloor[floor][wing];
                                            if (!existingCheckinArea) {
                                                existingCheckinArea = { data: [] };
                                                staticCheckinAllFloor[floor][wing] = existingCheckinArea;
                                            }
                                            existingCheckinArea.data.push({
                                                area: areaName,
                                                cap: parseInt(obj['-cap']),
                                                mxGeometry: [{
                                                        x: parseInt(mxGeometry['-x'] || '0'),
                                                        y: parseInt(mxGeometry['-y'] || '0'),
                                                        width: parseInt(mxGeometry['-width']),
                                                        height: parseInt(mxGeometry['-height']),
                                                    }],
                                            });
                                        }
                                    }
                                    else {
                                        // Area already exists, add mxGeometry to existing entry
                                        const existingCheckinArea = staticCheckinAllFloor[floor][wing].data.find(a => a.area === areaName);
                                        if (existingCheckinArea && mxGeometry) {
                                            existingCheckinArea.mxGeometry.push({
                                                x: parseInt(mxGeometry['-x'] || '0'),
                                                y: parseInt(mxGeometry['-y'] || '0'),
                                                width: parseInt(mxGeometry['-width']),
                                                height: parseInt(mxGeometry['-height']),
                                            });
                                        }
                                    }
                                }
                                else {
                                    // Booking area
                                    const bookingAreaKey = `${floor}-${wing}-${areaName}`;
                                    if (!uniqueBookingWingAreas.has(bookingAreaKey)) {
                                        bookingWingAreas.push(areaName);
                                        uniqueBookingWingAreas.add(bookingAreaKey);
                                        totalBookingAreas++;
                                        // Add mxGeometry to StaticBookingAllFloor
                                        if (mxGeometry) {
                                            (staticBookingAllFloor[floor].data).push({
                                                area: areaName,
                                                mxGeometry: [{
                                                        x: parseInt(mxGeometry['-x'] || '0'),
                                                        y: parseInt(mxGeometry['-y'] || '0'),
                                                        width: parseInt(mxGeometry['-width']),
                                                        height: parseInt(mxGeometry['-height']),
                                                    }],
                                            });
                                        }
                                    }
                                    else {
                                        // Area already exists, add mxGeometry to existing entry
                                        const existingBookingArea = staticBookingAllFloor[floor].data.find(a => a.area === areaName);
                                        if (existingBookingArea && mxGeometry) {
                                            (existingBookingArea.mxGeometry).push({
                                                x: parseInt(mxGeometry['-x'] || '0'),
                                                y: parseInt(mxGeometry['-y'] || '0'),
                                                width: parseInt(mxGeometry['-width']),
                                                height: parseInt(mxGeometry['-height']),
                                            });
                                        }
                                    }
                                }
                                floorCountMap.set(floor, (floorCountMap.get(floor) || 0) + 1);
                            }
                        });
                        diagram.mxGraphModel.root.mxCell.forEach((temp) => {
                            if (temp['-style'] !== undefined) {
                                const filePath = saveImageToFile(temp['-style'], "./images", temp['-id']);
                                if (filePath !== undefined) {
                                    console.log(`Image generated for ${floor}-${wing}`);
                                    const tempImage = {
                                        url: filePath,
                                        width: parseInt(temp.mxGeometry['-width']),
                                        height: parseInt(temp.mxGeometry['-height']),
                                    };
                                    if (wing === "Booking") {
                                        staticBookingAllFloor[floor].image = tempImage;
                                    }
                                    else {
                                        staticCheckinAllFloor[floor][wing].image = tempImage;
                                    }
                                }
                            }
                        });
                    }
                    else {
                        console.error('Invalid object structure in diagram:', diagram);
                    }
                }
                else {
                    console.error('Invalid diagram name format:', diagramName);
                }
            });
            console.log('Unique Wings:', Array.from(uniqueWings).join(', '));
            // Filter out floors with empty booking data from staticBookingAllFloor
            for (const floor in staticBookingAllFloor) {
                if (staticBookingAllFloor[floor].data.length === 0) {
                    delete staticBookingAllFloor[floor];
                }
            }
            // After populating uniqueWings, filter staticCheckinAllFloor
            const floorsToRemove = [];
            for (const floor in staticCheckinAllFloor) {
                let hasWings = false;
                for (const wing in staticCheckinAllFloor[floor]) {
                    if (uniqueWings.has(wing)) {
                        hasWings = true;
                        break;
                    }
                }
                if (!hasWings) {
                    floorsToRemove.push(floor);
                }
            }
            // Remove floors from staticCheckinAllFloor
            floorsToRemove.forEach((floor) => {
                delete staticCheckinAllFloor[floor];
            });
            // Function to log areas by floor and wing
            const logAreasByFloorAndWing = (areasMap, title) => {
                console.log(`============= ${title.toUpperCase()} AREAS BY FLOOR AND WING =============`);
                areasMap.forEach((floorMap, floor) => {
                    console.log(`Floor ${floor}:`);
                    floorMap.forEach((wingAreas, wing) => {
                        console.log(`- Wing ${wing}: ${wingAreas.join(', ')}`);
                    });
                    console.log(`Total areas for Floor ${floor}: ${floorCountMap.get(floor)}`);
                    console.log();
                });
            };
            // Function to log unique areas by floor and wing
            const logUniqueAreasByFloorAndWing = (uniqueAreasMap, title) => {
                console.log(`============= UNIQUE ${title.toUpperCase()} AREAS BY FLOOR AND WING =============`);
                uniqueAreasMap.forEach((floorMap, floor) => {
                    console.log(`Floor ${floor}:`);
                    floorMap.forEach((wingAreas, wing) => {
                        console.log(`- Wing ${wing}: ${Array.from(wingAreas).join(', ')}`);
                    });
                    console.log(`Total unique areas for Floor ${floor}: ${Array.from(floorMap.values()).reduce((sum, set) => sum + set.size, 0)}`);
                    console.log();
                });
            };
            // Logging check-in areas by floor and wing
            logAreasByFloorAndWing(checkinAreasMap, 'Check-in');
            // Logging booking areas by floor and wing
            logAreasByFloorAndWing(bookingAreasMap, 'Booking');
            // Logging total check-in and booking areas
            console.log(`Total Check-in Areas: ${totalCheckinAreas}`);
            console.log(`Total Booking Areas: ${totalBookingAreas}`);
            // Logging unique check-in areas by floor and wing
            logUniqueAreasByFloorAndWing(uniqueCheckinAreasMap, 'Check-in');
            // Logging unique booking areas by floor and wing
            logUniqueAreasByFloorAndWing(uniqueBookingAreasMap, 'Booking');
            // Calculate and log total unique areas
            const totalUniqueCheckinAreas = Array.from(uniqueCheckinAreasMap.values()).reduce((total, floorMap) => total + Array.from(floorMap.values()).reduce((sum, set) => sum + set.size, 0), 0);
            const totalUniqueBookingAreas = Array.from(uniqueBookingAreasMap.values()).reduce((total, floorMap) => total + Array.from(floorMap.values()).reduce((sum, set) => sum + set.size, 0), 0);
            console.log(`Total Unique Check-in Areas: ${totalUniqueCheckinAreas}`);
            console.log(`Total Unique Booking Areas: ${totalUniqueBookingAreas}`);
            // Log structured data for StaticCheckinAllFloor and StaticBookingAllFloor
            console.log('=== Static Check-in All Floor ===');
            console.log(staticCheckinAllFloor);
            console.log('=== Static Booking All Floor ===');
            console.log(staticBookingAllFloor);
            // Write StaticCheckinAllFloor to JSON file
            fs.writeFile('./staticCheckinAllFloor.json', JSON.stringify(staticCheckinAllFloor, null, 2), (err) => {
                if (err) {
                    console.error('Error writing StaticCheckinAllFloor to file:', err);
                }
                else {
                    console.log('StaticCheckinAllFloor has been saved to staticCheckinAllFloor.json');
                }
            });
            // Write StaticBookingAllFloor to JSON file
            fs.writeFile('./staticBookingAllFloor.json', JSON.stringify(staticBookingAllFloor, null, 2), (err) => {
                if (err) {
                    console.error('Error writing StaticBookingAllFloor to file:', err);
                }
                else {
                    console.log('StaticBookingAllFloor has been saved to staticBookingAllFloor.json');
                }
            });
        }
        else {
            console.error('Invalid diagram structure:', mxfile);
        }
    }
    catch (error) {
        console.error('Error parsing JSON file:', error);
    }
});
