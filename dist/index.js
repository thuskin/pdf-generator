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
// Read the JSON file
fs.readFile('./om_floors.json', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    try {
        // Parse the JSON data into an object
        const jsonData = JSON.parse(data);
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
                                    if (!uniqueCheckinWingAreas.has(areaName)) {
                                        checkinWingAreas.push(areaName);
                                        uniqueCheckinWingAreas.add(areaName);
                                        totalCheckinAreas++;
                                        if (mxGeometry) {
                                            // Ensure data exists before pushing
                                            if (!(staticCheckinAllFloor[floor][wing])) {
                                                staticCheckinAllFloor[floor][wing] = { data: [] };
                                            }
                                            staticCheckinAllFloor[floor][wing].data.push({
                                                area: areaName,
                                                cap: parseInt(obj['-cap']),
                                                mxGeometry: {
                                                    x: parseInt(mxGeometry['-x'] || '0'),
                                                    y: parseInt(mxGeometry['-y'] || '0'),
                                                    width: parseInt(mxGeometry['-width']),
                                                    height: parseInt(mxGeometry['-height']),
                                                },
                                            });
                                        }
                                    }
                                }
                                else {
                                    // Booking area
                                    if (!uniqueBookingWingAreas.has(areaName)) {
                                        bookingWingAreas.push(areaName);
                                        uniqueBookingWingAreas.add(areaName);
                                        totalBookingAreas++;
                                        if (mxGeometry) {
                                            staticBookingAllFloor[floor].data.push({
                                                area: areaName,
                                                mxGeometry: {
                                                    x: parseInt(mxGeometry['-x'] || '0'),
                                                    y: parseInt(mxGeometry['-y'] || '0'),
                                                    width: parseInt(mxGeometry['-width']),
                                                    height: parseInt(mxGeometry['-height']),
                                                },
                                            });
                                        }
                                    }
                                }
                                floorCountMap.set(floor, (floorCountMap.get(floor) || 0) + 1);
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
            // Filter out floors with empty booking data from staticBookingAllFloor
            for (const floor in staticBookingAllFloor) {
                if (staticBookingAllFloor[floor].data.length === 0) {
                    delete staticBookingAllFloor[floor];
                }
            }
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
