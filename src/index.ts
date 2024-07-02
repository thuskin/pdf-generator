import * as fs from 'fs';
type StaticMxGeometry = {x: number; y: number; width: number; height: number}; //Use
type StaticCheckinArea = {area: string; cap: number; mxGeometry: StaticMxGeometry}; //Use
type StaticCheckinWing = {data: StaticCheckinArea[]; image: {url: string; height: number; width: number}}; // Use

type StaticBookingArea = {area: string; mxGeometry: StaticMxGeometry};
type BookingArea = {area: string; isBooked: boolean};
type BookingFloorSummaries = {[floorKey: string]: {data: BookingArea[] | number}};

type CheckinArea = {area: string; cap: number; totalCheckins: number};
type CheckinWing = {totalCheckins: number; data: CheckinArea[]};
type CheckinFloorSummaries = {[floorKey: string]: {totalCheckins: number; [wingKey: string]: CheckinWing | number}};

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

        // Original maps to store areas grouped by FileDiagram.name
        const bookingAreasMap: Map<string, string[]> = new Map();
        const checkinAreasMap: Map<string, string[]> = new Map();

        // New maps to store unique areas (using Set) grouped by FileDiagram.name
        const uniqueBookingAreasMap: Map<string, Set<string>> = new Map();
        const uniqueCheckinAreasMap: Map<string, Set<string>> = new Map();

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
                    const bookingAreas: string[] = [];
                    const checkinAreas: string[] = [];

                    const uniqueBookingAreas: Set<string> = new Set();
                    const uniqueCheckinAreas: Set<string> = new Set();

                    diagram.mxGraphModel.root.object.forEach(obj => {
                        if (obj['-area']) {
                            const areaName = obj['-area'];
                            if (obj['-cap']) {
                                // Checkin area
                                checkinAreas.push(areaName);
                                uniqueCheckinAreas.add(areaName);
                                totalCheckinAreas++;
                            } else {
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
                } else {
                    console.error('Invalid mxGraphModel structure in diagram:', diagram);
                }
            });

            // Function to format area logs
            const logAreaDetails = (areasMap: Map<string, string[]>, title: string) => {
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
            const logUniqueAreaDetails = (uniqueAreasMap: Map<string, Set<string>>, title: string) => {
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

        } else {
            console.error('Invalid diagram structure:', mxfile);
        }

    } catch (error) {
        console.error('Error parsing JSON file:', error);
    }
});