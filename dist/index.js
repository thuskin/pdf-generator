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
        // Original maps to store areas grouped by FileDiagram.name
        const bookingAreasMap = new Map();
        const checkinAreasMap = new Map();
        // New maps to store unique areas (using Set) grouped by FileDiagram.name
        const uniqueBookingAreasMap = new Map();
        const uniqueCheckinAreasMap = new Map();
        // Counters for total areas
        let totalBookingAreas = 0;
        let totalCheckinAreas = 0;
        // Counters for unique areas
        let totalUniqueBookingAreas = 0;
        let totalUniqueCheckinAreas = 0;
        const mxfile = jsonData.mxfile;
        if (mxfile && Array.isArray(mxfile.diagram)) {
            mxfile.diagram.forEach(diagram => {
                const diagramName = diagram['-name'];
                if (diagram.mxGraphModel && diagram.mxGraphModel.root && Array.isArray(diagram.mxGraphModel.root.object)) {
                    const bookingAreas = [];
                    const checkinAreas = [];
                    const uniqueBookingAreas = new Set();
                    const uniqueCheckinAreas = new Set();
                    diagram.mxGraphModel.root.object.forEach(obj => {
                        if (obj['-area']) {
                            const areaName = obj['-area'];
                            if (obj['-cap']) {
                                // Checkin area
                                checkinAreas.push(areaName);
                                uniqueCheckinAreas.add(areaName);
                                totalCheckinAreas++;
                            }
                            else {
                                // Booking area
                                bookingAreas.push(areaName);
                                uniqueBookingAreas.add(areaName);
                                totalBookingAreas++;
                            }
                        }
                    });
                    bookingAreasMap.set(diagramName, bookingAreas);
                    checkinAreasMap.set(diagramName, checkinAreas);
                    uniqueBookingAreasMap.set(diagramName, uniqueBookingAreas);
                    uniqueCheckinAreasMap.set(diagramName, uniqueCheckinAreas);
                    // Update total unique areas counters
                    totalUniqueBookingAreas += uniqueBookingAreas.size;
                    totalUniqueCheckinAreas += uniqueCheckinAreas.size;
                }
                else {
                    console.error('Invalid mxGraphModel structure in diagram:', diagram);
                }
            });
            // Function to format area logs
            const logAreaDetails = (areasMap, title) => {
                console.log(`============= ${title.toUpperCase()} AREAS =============`);
                areasMap.forEach((areas, diagramName) => {
                    console.log(`${diagramName} Areas:`);
                    areas.forEach(area => {
                        console.log(`- ${area}`);
                    });
                    console.log(`Total number of ${diagramName} areas: ${areas.length}`);
                    console.log();
                });
            };
            // Function to format unique area logs
            const logUniqueAreaDetails = (uniqueAreasMap, title) => {
                console.log(`============= UNIQUE ${title.toUpperCase()} AREAS =============`);
                uniqueAreasMap.forEach((uniqueAreas, diagramName) => {
                    console.log(`${diagramName} Unique Areas:`);
                    uniqueAreas.forEach(area => {
                        console.log(`- ${area}`);
                    });
                    console.log(`Total number of unique ${diagramName} areas: ${uniqueAreas.size}`);
                    console.log();
                });
            };
            // Logging original maps (without unique handling)
            logAreaDetails(bookingAreasMap, 'Booking');
            logAreaDetails(checkinAreasMap, 'Check-in');
            // Logging unique maps
            logUniqueAreaDetails(uniqueBookingAreasMap, 'Booking');
            logUniqueAreaDetails(uniqueCheckinAreasMap, 'Check-in');
            // Log total counts
            console.log('================ TOTAL COUNTS ================');
            console.log(`Total number of Booking areas: ${totalBookingAreas}`);
            console.log(`Total number of Check-in areas: ${totalCheckinAreas}`);
            console.log(`Total number of all areas: ${totalBookingAreas + totalCheckinAreas}`);
            // Log total unique counts
            console.log('================ TOTAL UNIQUE COUNTS ================');
            console.log(`Total number of unique Booking areas: ${totalUniqueBookingAreas}`);
            console.log(`Total number of unique Check-in areas: ${totalUniqueCheckinAreas}`);
            console.log(`Total number of all unique areas: ${totalUniqueBookingAreas + totalUniqueCheckinAreas}`);
        }
        else {
            console.error('Invalid diagram structure:', mxfile);
        }
    }
    catch (error) {
        console.error('Error parsing JSON file:', error);
    }
});
