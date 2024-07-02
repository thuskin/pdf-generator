import * as fs from 'fs';
type StaticMxGeometry = {x: number; y: number; width: number; height: number}; //Use
type StaticCheckinArea = {area: string; cap: number; mxGeometry: StaticMxGeometry}; //Use
type StaticCheckinWing = {data: StaticCheckinArea[]; image: {url: string; height: number; width: number}}; // Use
type StaticBookingArea = {area: string; mxGeometry: StaticMxGeometry};
type StaticCheckinFloor = {[key: string]: StaticCheckinWing | number}; //Use
type StaticBookingFloor = {data: StaticBookingArea[]; floor: number};

type FileMxGeometry = {
    '-x'?: string;
    '-y'?: string;
    '-width': string;
    '-height': string;
    '-as': string;
}

type FileMxCell = {
    '-id': string;
    '-parent'?: string;
    '-value'?: string;
    '-style'?: string;
    '-vertex'?: string;
    '-edge'?: string;
    'mxGeometry'?: FileMxGeometry;
}

type FileDiagramObject = {
    '-label': string;
    '-area': string;
    '-cap'?: string;
    '-id': string;
    'mxCell': {
        '-style': string;
        '-parent': string;
        '-vertex': string;
        'mxGeometry': FileMxGeometry;
    };
}

type FileRoot = {
    'mxCell': FileMxCell[];
    'object': FileDiagramObject[];
}

type FileMxGraphModel = {
    '-dx': string;
    '-dy': string;
    '-grid': string;
    '-gridSize': string;
    '-guides': string;
    '-tooltips': string;
    '-connect': string;
    '-arrows': string;
    '-fold': string;
    '-page': string;
    '-pageScale': string;
    '-pageWidth': string;
    '-pageHeight': string;
    '-math': string;
    '-shadow': string;
    'root': FileRoot;
}

type FileDiagram = {
    '-id': string;
    '-name': string;
    'mxGraphModel': FileMxGraphModel;
}

type FileMx = {
    "mxfile": {
        '-host': string;
        '-modified': string;
        '-agent': string;
        '-etag': string;
        '-version': string;
        '-type': string;
        '-pages': string;
        'diagram': FileDiagram[];
    }
}
// Read the JSON file
fs.readFile('./om_floors.json', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    try {
        // Parse the JSON data into an object
        const jsonData = JSON.parse(data) as FileMx;

        // Maps to store check-in areas grouped by Floor and Wing
        const checkinAreasMap: Map<string, Map<string, string[]>> = new Map();
        const bookingAreasMap: Map<string, Map<string, string[]>> = new Map();
        const floorCountMap: Map<string, number> = new Map();

        // Maps to store unique areas
        const uniqueCheckinAreasMap: Map<string, Map<string, Set<string>>> = new Map();
        const uniqueBookingAreasMap: Map<string, Map<string, Set<string>>> = new Map();

        let totalCheckinAreas = 0;
        let totalBookingAreas = 0;

        let totalUniqueCheckinAreas = 0;
        let totalUniqueBookingAreas = 0;

        const mxfile = jsonData.mxfile;
        if (mxfile && Array.isArray(mxfile.diagram)) {
            mxfile.diagram.forEach((diagram) => {
                const diagramName = diagram['-name'];
                const matches = diagramName.match(/^(\d+F)\s*(\w+)?\s*(Booking)?$/);

                if (matches) {
                    const floor = matches[1];
                    const wing = matches[2] || 'General';
                    const areaType = matches[3] ? 'Booking' : 'Check-in';

                    // Initialize maps if not already
                    if (!checkinAreasMap.has(floor)) {
                        checkinAreasMap.set(floor, new Map());
                        bookingAreasMap.set(floor, new Map());
                        floorCountMap.set(floor, 0);
                        uniqueCheckinAreasMap.set(floor, new Map());
                        uniqueBookingAreasMap.set(floor, new Map());
                    }

                    const floorCheckinMap = checkinAreasMap.get(floor)!;
                    const floorBookingMap = bookingAreasMap.get(floor)!;
                    const floorUniqueCheckinMap = uniqueCheckinAreasMap.get(floor)!;
                    const floorUniqueBookingMap = uniqueBookingAreasMap.get(floor)!;

                    if (!floorCheckinMap.has(wing)) {
                        floorCheckinMap.set(wing, []);
                        floorUniqueCheckinMap.set(wing, new Set());
                    }
                    if (!floorBookingMap.has(wing)) {
                        floorBookingMap.set(wing, []);
                        floorUniqueBookingMap.set(wing, new Set());
                    }

                    const checkinWingAreas = floorCheckinMap.get(wing)!;
                    const bookingWingAreas = floorBookingMap.get(wing)!;
                    const uniqueCheckinWingAreas = floorUniqueCheckinMap.get(wing)!;
                    const uniqueBookingWingAreas = floorUniqueBookingMap.get(wing)!;

                    if (diagram.mxGraphModel && diagram.mxGraphModel.root && Array.isArray(diagram.mxGraphModel.root.object)) {
                        diagram.mxGraphModel.root.object.forEach((obj) => {
                            if (obj['-area']) {
                                const areaName = obj['-area'];
                                if (obj['-cap']) {
                                    // Check-in area
                                    checkinWingAreas.push(areaName);
                                    uniqueCheckinWingAreas.add(areaName);
                                    totalCheckinAreas++;
                                } else {
                                    // Booking area
                                    bookingWingAreas.push(areaName);
                                    uniqueBookingWingAreas.add(areaName);
                                    totalBookingAreas++;
                                }
                                floorCountMap.set(floor, (floorCountMap.get(floor) || 0) + 1);
                            }
                        });
                    } else {
                        console.error('Invalid object structure in diagram:', diagram);
                    }
                } else {
                    console.error('Invalid diagram name format:', diagramName);
                }
            });

            // Function to log areas by floor and wing
            const logAreasByFloorAndWing = (areasMap: Map<string, Map<string, string[]>>, title: string) => {
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
            const logUniqueAreasByFloorAndWing = (uniqueAreasMap: Map<string, Map<string, Set<string>>>, title: string) => {
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
            const totalUniqueCheckinAreas = Array.from(uniqueCheckinAreasMap.values())
                .reduce((total, floorMap) => total + Array.from(floorMap.values()).reduce((sum, set) => sum + set.size, 0), 0);

            const totalUniqueBookingAreas = Array.from(uniqueBookingAreasMap.values())
                .reduce((total, floorMap) => total + Array.from(floorMap.values()).reduce((sum, set) => sum + set.size, 0), 0);

            console.log(`Total Unique Check-in Areas: ${totalUniqueCheckinAreas}`);
            console.log(`Total Unique Booking Areas: ${totalUniqueBookingAreas}`);

        } else {
            console.error('Invalid diagram structure:', mxfile);
        }

    } catch (error) {
        console.error('Error parsing JSON file:', error);
    }
});







