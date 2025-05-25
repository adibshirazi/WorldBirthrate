"use client"

import { useState, useEffect } from "react"
import { ComposableMap, Geographies, Geography, ZoomableGroup, Marker } from "react-simple-maps"
import { geoCentroid, geoArea } from "d3-geo"

// 2025 UN fertility rate data (births per woman)
const birthrateData: Record<string, number> = {
  Chad: 5.94,
  Somalia: 5.91,
  "Democratic Republic of the Congo": 5.9,
  "Central African Republic": 5.81,
  Niger: 5.79,
  Mali: 5.42,
  Angola: 4.95,
  Burundi: 4.68,
  Afghanistan: 4.66,
  Mozambique: 4.62,
  Mauritania: 4.56,
  Tanzania: 4.47,
  Benin: 4.42,
  Yemen: 4.41,
  Nigeria: 4.3,
  Sudan: 4.19,
  Cameroon: 4.19,
  "Ivory Coast": 4.17,
  "Côte d'Ivoire": 4.17,
  Togo: 4.07,
  Uganda: 4.06,
  Congo: 4.05,
  "Republic of the Congo": 4.05,
  Guinea: 4.04,
  "Equatorial Guinea": 4.04,
  "Burkina Faso": 4.01,
  Zambia: 3.97,
  Madagascar: 3.85,
  Ethiopia: 3.81,
  Gambia: 3.8,
  Liberia: 3.79,
  Comoros: 3.76,
  Samoa: 3.75,
  Senegal: 3.71,
  "South Sudan": 3.71,
  "Guinea-Bissau": 3.68,
  Zimbabwe: 3.62,
  Eritrea: 3.61,
  "Sierra Leone": 3.61,
  Rwanda: 3.59,
  Gabon: 3.54,
  Vanuatu: 3.53,
  Malawi: 3.53,
  "São Tomé and Príncipe": 3.53,
  Pakistan: 3.5,
  "Solomon Islands": 3.47,
  Uzbekistan: 3.45,
  Ghana: 3.3,
  Nauru: 3.25,
  Palestine: 3.19,
  Iraq: 3.17,
  Namibia: 3.17,
  Tuvalu: 3.14,
  Kenya: 3.12,
  Kiribati: 3.09,
  Tonga: 3.07,
  "Papua New Guinea": 3.03,
  Tajikistan: 2.99,
  Kazakhstan: 2.95,
  "Marshall Islands": 2.82,
  Israel: 2.75,
  Kyrgyzstan: 2.75,
  Egypt: 2.71,
  Micronesia: 2.71,
  Eswatini: 2.68,
  Algeria: 2.67,
  Botswana: 2.66,
  Syria: 2.66,
  Lesotho: 2.64,
  Turkmenistan: 2.63,
  Haiti: 2.59,
  Mongolia: 2.59,
  Djibouti: 2.58,
  Jordan: 2.57,
  "Timor-Leste": 2.56,
  Cambodia: 2.51,
  Bolivia: 2.5,
  Oman: 2.48,
  Niue: 2.46,
  Honduras: 2.45,
  Paraguay: 2.4,
  Guyana: 2.37,
  Laos: 2.36,
  "Saudi Arabia": 2.29,
  Guatemala: 2.26,
  Libya: 2.25,
  Fiji: 2.25,
  Suriname: 2.21,
  Lebanon: 2.21,
  "Dominican Republic": 2.2,
  "South Africa": 2.19,
  Morocco: 2.18,
  Nicaragua: 2.18,
  "Western Sahara": 2.15,
  Bangladesh: 2.11,
  Indonesia: 2.1,
  Monaco: 2.09,
  Panama: 2.09,
  Seychelles: 2.08,
  Myanmar: 2.08,
  Venezuela: 2.06,
  Belize: 2.01,
  "Cook Islands": 2.0,
  India: 1.94,
  Peru: 1.94,
  "Sri Lanka": 1.94,
  Nepal: 1.94,
  Vietnam: 1.88,
  Philippines: 1.88,
  Mexico: 1.87,
  Palau: 1.86,
  Tunisia: 1.8,
  Montenegro: 1.8,
  Ecuador: 1.79,
  Georgia: 1.79,
  Bahrain: 1.78,
  "North Korea": 1.77,
  "El Salvador": 1.75,
  "Saint Vincent and the Grenadines": 1.75,
  Bulgaria: 1.74,
  Moldova: 1.72,
  Armenia: 1.71,
  Brunei: 1.71,
  Romania: 1.71,
  Barbados: 1.71,
  Qatar: 1.7,
  Iran: 1.67,
  Azerbaijan: 1.67,
  "New Zealand": 1.65,
  Australia: 1.64,
  France: 1.64,
  "United States": 1.62,
  "United States of America": 1.62,
  USA: 1.62,
  Turkey: 1.62,
  Colombia: 1.62,
  Brazil: 1.6,
  Ireland: 1.6,
  Slovenia: 1.58,
  "Antigua and Barbuda": 1.58,
  Slovakia: 1.57,
  Maldives: 1.55,
  "United Kingdom": 1.54,
  Liechtenstein: 1.54,
  Malaysia: 1.53,
  Kosovo: 1.53,
  "Trinidad and Tobago": 1.52,
  Denmark: 1.52,
  Portugal: 1.52,
  "Saint Kitts and Nevis": 1.51,
  Argentina: 1.51,
  Serbia: 1.5,
  Iceland: 1.5,
  Kuwait: 1.5,
  "Bosnia and Herzegovina": 1.5,
  "Cape Verde": 1.5,
  Hungary: 1.5,
  Croatia: 1.47,
  Dominica: 1.47,
  "North Macedonia": 1.47,
  "Czech Republic": 1.47,
  Czechia: 1.47,
  Russia: 1.47,
  "Russian Federation": 1.47,
  Grenada: 1.46,
  Germany: 1.46,
  Cuba: 1.45,
  Switzerland: 1.44,
  Sweden: 1.44,
  Netherlands: 1.44,
  Bhutan: 1.44,
  Norway: 1.42,
  Luxembourg: 1.4,
  Belgium: 1.39,
  Uruguay: 1.39,
  Estonia: 1.38,
  "Saint Lucia": 1.38,
  Cyprus: 1.37,
  Bahamas: 1.36,
  Latvia: 1.35,
  Greece: 1.34,
  Jamaica: 1.34,
  Canada: 1.33,
  Albania: 1.33,
  Austria: 1.33,
  "Costa Rica": 1.31,
  Poland: 1.31,
  Finland: 1.3,
  Spain: 1.23,
  Japan: 1.23,
  Belarus: 1.23,
  Lithuania: 1.22,
  Mauritius: 1.21,
  Italy: 1.21,
  "United Arab Emirates": 1.21,
  Thailand: 1.2,
  "San Marino": 1.16,
  Chile: 1.13,
  Malta: 1.11,
  Andorra: 1.1,
  China: 1.02,
  "Vatican City": 1.0,
  Ukraine: 1.0,
  Singapore: 0.96,
  Taiwan: 0.86,
  "South Korea": 0.75,
  Korea: 0.75,
}

// Regional and development group data
const regionalData = {
  development: [
    { name: "Least developed countries", rate: 3.83 },
    { name: "Less developed regions", rate: 2.35 },
    { name: "Less developed regions, excluding China", rate: 2.61 },
    { name: "Less developed regions, excluding least developed countries", rate: 2.01 },
    { name: "More developed regions", rate: 1.46 },
  ],
  income: [
    { name: "Low-income countries", rate: 4.38 },
    { name: "Low-and-Lower-middle-income countries", rate: 2.84 },
    { name: "Low-and-middle-income countries", rate: 2.34 },
    { name: "Middle-income countries", rate: 2.09 },
    { name: "Lower-middle-income countries", rate: 2.51 },
    { name: "Upper-middle-income countries", rate: 1.48 },
    { name: "High-and-upper-middle-income countries", rate: 1.48 },
    { name: "High-income countries", rate: 1.47 },
  ],
  regions: [
    { name: "Africa", rate: 3.95 },
    { name: "Middle Africa", rate: 5.37 },
    { name: "Western Africa", rate: 4.27 },
    { name: "Eastern Africa", rate: 3.96 },
    { name: "Northern Africa", rate: 2.88 },
    { name: "Southern Africa", rate: 2.27 },
    { name: "Asia", rate: 1.87 },
    { name: "Central Asia", rate: 3.14 },
    { name: "Western Asia", rate: 2.52 },
    { name: "Southern Asia", rate: 2.18 },
    { name: "South-Eastern Asia", rate: 1.91 },
    { name: "Eastern Asia", rate: 1.03 },
    { name: "Europe", rate: 1.41 },
    { name: "Western Europe", rate: 1.5 },
    { name: "Northern Europe", rate: 1.5 },
    { name: "Eastern Europe", rate: 1.4 },
    { name: "Southern Europe", rate: 1.29 },
    { name: "Latin America and the Caribbean", rate: 1.78 },
    { name: "Northern America", rate: 1.59 },
    { name: "Oceania", rate: 2.13 },
  ],
}

// Helper function to get birthrate for a country
const getBirthrate = (countryName: string | undefined): number | undefined => {
  if (!countryName || typeof countryName !== "string") {
    return undefined
  }

  // Try exact match first
  if (birthrateData[countryName]) {
    return birthrateData[countryName]
  }

  // Try some common variations
  const variations = [
    countryName.replace("The ", ""),
    countryName.replace(" of America", ""),
    countryName.replace("Republic of ", ""),
    countryName.replace("Democratic Republic of ", ""),
    countryName.replace("United States of America", "United States"),
    countryName.replace("Russian Federation", "Russia"),
    countryName.replace("Republic of Korea", "South Korea"),
    countryName.replace("Democratic People's Republic of Korea", "North Korea"),
    countryName.replace("Dem. Rep. Congo", "Democratic Republic of the Congo"),
    countryName.replace("Central African Rep.", "Central African Republic"),
    countryName.replace("Eq. Guinea", "Equatorial Guinea"),
    countryName.replace("S. Sudan", "South Sudan"),
    countryName.replace("Bosnia and Herz.", "Bosnia and Herzegovina"),
    countryName.replace("Dominican Rep.", "Dominican Republic"),
    countryName.replace("Solomon Is.", "Solomon Islands"),
    countryName.replace("Marshall Is.", "Marshall Islands"),
    countryName.replace("Côte d'Ivoire", "Ivory Coast"),
  ]

  for (const variation of variations) {
    if (birthrateData[variation]) {
      return birthrateData[variation]
    }
  }

  return undefined
}

// Function to find the largest polygon in a multipolygon geometry
const getLargestPolygon = (geometry: any) => {
  if (geometry.type === "Polygon") {
    return geometry
  }

  if (geometry.type === "MultiPolygon") {
    let largestArea = 0
    let largestPolygon = geometry.coordinates[0]

    geometry.coordinates.forEach((polygon: any) => {
      const area = geoArea({ type: "Polygon", coordinates: polygon })
      if (area > largestArea) {
        largestArea = area
        largestPolygon = polygon
      }
    })

    return { type: "Polygon", coordinates: largestPolygon }
  }

  return geometry
}

// Function to calculate better centroid
const getBetterCentroid = (geo: any): [number, number] => {
  try {
    // Get the largest polygon for multipolygon countries
    const largestPolygon = getLargestPolygon(geo.geometry)

    // Calculate centroid of the largest polygon
    const centroid = geoCentroid(largestPolygon)

    if (centroid && isFinite(centroid[0]) && isFinite(centroid[1])) {
      return [centroid[0], centroid[1]]
    }
  } catch (error) {
    console.warn("Error calculating centroid for", geo.properties?.NAME)
  }

  // Fallback to original centroid
  try {
    const fallbackCentroid = geoCentroid(geo)
    if (fallbackCentroid && isFinite(fallbackCentroid[0]) && isFinite(fallbackCentroid[1])) {
      return [fallbackCentroid[0], fallbackCentroid[1]]
    }
  } catch (error) {
    console.warn("Error with fallback centroid for", geo.properties?.NAME)
  }

  return [0, 0]
}

// Function to get font size based on country area
const getFontSize = (geo: any): number => {
  try {
    const area = geoArea(geo)
    if (area > 0.1) return 10 // Large countries
    if (area > 0.01) return 8 // Medium countries
    if (area > 0.001) return 6 // Small countries
    return 5 // Very small countries
  } catch {
    return 8 // Default size
  }
}

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"

export default function Component() {
  const [tooltipContent, setTooltipContent] = useState("")
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [showTooltip, setShowTooltip] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Trigger intro animation after component mounts
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  const getCountryColor = (birthrate: number | undefined) => {
    if (!birthrate) return "#e5e7eb" // gray for no data
    if (birthrate > 2.1) return "#16a34a" // light green
    if (birthrate > 1.9) return "#15803d" // dark green
    if (birthrate > 1.5) return "#eab308" // yellow
    if (birthrate > 1) return "#f87171" // light red
    return "#dc2626" // dark red (≤1)
  }

  const getColorCategory = (birthrate: number | undefined) => {
    if (!birthrate) return "No data"
    if (birthrate > 2.1) return "Very High (>2.1)"
    if (birthrate > 1.9) return "High (1.9-2.1)"
    if (birthrate > 1.5) return "Moderate (1.5-1.9)"
    if (birthrate > 1) return "Low (1.0-1.5)"
    return "Very Low (≤1.0)"
  }

  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex overflow-hidden">
      {/* Elegant Loading Screen */}
      <div
        className={`fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800 z-50 flex items-center justify-center transition-all duration-1500 ${
          isLoaded ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <div className="text-center text-white relative">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/10 rounded-full animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-purple-500/10 rounded-full animate-pulse animation-delay-300"></div>
            <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-green-500/10 rounded-full animate-pulse animation-delay-600"></div>
          </div>

          {/* Main Content */}
          <div className="relative z-10">
            {/* Sophisticated Spinner */}
            <div className="mb-12">
              <div className="w-24 h-24 mx-auto mb-8 relative">
                {/* Outer Ring */}
                <div className="absolute inset-0 border-2 border-gray-600/30 rounded-full"></div>
                {/* Middle Ring */}
                <div className="absolute inset-2 border-2 border-gray-500/50 rounded-full animate-spin"></div>
                {/* Inner Ring */}
                <div
                  className="absolute inset-4 border-2 border-white/80 rounded-full animate-spin"
                  style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
                ></div>
                {/* Center Dot */}
                <div className="absolute inset-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* Typography */}
            <div className="space-y-6">
              <h1 className="text-6xl font-thin mb-2 tracking-[0.2em] animate-fadeInUp bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
                WORLD
              </h1>
              <h2 className="text-4xl font-extralight tracking-[0.15em] animate-fadeInUp animation-delay-200 text-gray-300">
                BIRTHRATE MAP
              </h2>

              {/* Decorative Line */}
              <div className="flex items-center justify-center my-8 animate-fadeInUp animation-delay-400">
                <div className="h-px w-16 bg-gradient-to-r from-transparent to-white/50"></div>
                <div className="mx-4 w-2 h-2 bg-white/60 rounded-full"></div>
                <div className="h-px w-16 bg-gradient-to-l from-transparent to-white/50"></div>
              </div>

              {/* Subtitle */}
              <p className="text-sm font-light tracking-[0.3em] opacity-70 animate-fadeInUp animation-delay-600 text-gray-400">
                2025 EDITION
              </p>

              {/* Credit */}
              <div className="mt-8 animate-fadeInUp animation-delay-800">
                <p className="text-xs font-light tracking-[0.4em] opacity-60 text-gray-500 mb-2">DESIGNED BY</p>
                <p className="text-lg font-light tracking-[0.25em] bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  ASH
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`bg-white/95 backdrop-blur-sm shadow-2xl transition-all duration-500 ease-out ${
          showSidebar ? "w-72" : "w-0"
        } overflow-hidden border-r border-gray-200/50`}
      >
        <div className="p-5 h-full overflow-y-auto">
          <h3 className="text-lg font-bold mb-5 text-gray-800 animate-slideInLeft">Regional Statistics</h3>

          <div className="mb-6 animate-slideInLeft animation-delay-100">
            <h4 className="font-semibold text-xs text-gray-700 mb-2 uppercase tracking-wide">Development Groups</h4>
            {regionalData.development.map((item, index) => (
              <div
                key={index}
                className="flex justify-between text-xs mb-1.5 p-1.5 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <span className="text-gray-600">{item.name}</span>
                <span className="font-mono font-semibold" style={{ color: getCountryColor(item.rate) }}>
                  {item.rate.toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="mb-6 animate-slideInLeft animation-delay-200">
            <h4 className="font-semibold text-xs text-gray-700 mb-2 uppercase tracking-wide">Income Groups</h4>
            {regionalData.income.map((item, index) => (
              <div
                key={index}
                className="flex justify-between text-xs mb-1.5 p-1.5 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <span className="text-gray-600">{item.name}</span>
                <span className="font-mono font-semibold" style={{ color: getCountryColor(item.rate) }}>
                  {item.rate.toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="mb-6 animate-slideInLeft animation-delay-300">
            <h4 className="font-semibold text-xs text-gray-700 mb-2 uppercase tracking-wide">Regional Groups</h4>
            {regionalData.regions.map((item, index) => (
              <div
                key={index}
                className="flex justify-between text-xs mb-1.5 p-1.5 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <span className="text-gray-600">{item.name}</span>
                <span className="font-mono font-semibold" style={{ color: getCountryColor(item.rate) }}>
                  {item.rate.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <div className={`p-4 transition-all duration-800 ${isLoaded ? "animate-fadeInDown" : "opacity-0"}`}>
          <div className="flex items-center mb-3 relative">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="group relative bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 transform hover:scale-105 hover:shadow-md active:scale-95 flex items-center gap-2"
            >
              <div className="flex flex-col gap-0.5">
                <div className="w-3 h-0.5 bg-gray-500 rounded transition-all duration-200 group-hover:bg-gray-700"></div>
                <div className="w-3 h-0.5 bg-gray-500 rounded transition-all duration-200 group-hover:bg-gray-700"></div>
                <div className="w-3 h-0.5 bg-gray-500 rounded transition-all duration-200 group-hover:bg-gray-700"></div>
              </div>
              <span>{showSidebar ? "Hide" : "Show"} Regional Data</span>
            </button>

            <h1 className="absolute left-1/2 transform -translate-x-1/2 text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              World Birthrate Map 2025
            </h1>
          </div>
          <p className="text-center text-xs text-gray-600 mb-4 animate-fadeInUp animation-delay-200">
            Data from United Nations Population Division
          </p>
          <div className="flex justify-center gap-4 text-xs mb-4 animate-fadeInUp animation-delay-400">
            <div className="flex items-center gap-2 group">
              <div className="w-4 h-4 bg-green-500 rounded-md shadow-sm group-hover:scale-110 transition-transform duration-200"></div>
              <span className="font-medium">Very High &gt;2.1</span>
            </div>
            <div className="flex items-center gap-2 group">
              <div className="w-4 h-4 bg-green-700 rounded-md shadow-sm group-hover:scale-110 transition-transform duration-200"></div>
              <span className="font-medium">High 1.9-2.1</span>
            </div>
            <div className="flex items-center gap-2 group">
              <div className="w-4 h-4 bg-yellow-500 rounded-md shadow-sm group-hover:scale-110 transition-transform duration-200"></div>
              <span className="font-medium">Moderate 1.5-1.9</span>
            </div>
            <div className="flex items-center gap-2 group">
              <div className="w-4 h-4 bg-red-300 rounded-md shadow-sm group-hover:scale-110 transition-transform duration-200"></div>
              <span className="font-medium">Low 1.0-1.5</span>
            </div>
            <div className="flex items-center gap-2 group">
              <div className="w-4 h-4 bg-red-600 rounded-md shadow-sm group-hover:scale-110 transition-transform duration-200"></div>
              <span className="font-medium">Very Low ≤1.0</span>
            </div>
            <div className="flex items-center gap-2 group">
              <div className="w-4 h-4 bg-gray-300 rounded-md shadow-sm group-hover:scale-110 transition-transform duration-200"></div>
              <span className="font-medium">No data</span>
            </div>
          </div>
        </div>

        <div
          className={`relative flex-1 transition-all duration-1000 ${isLoaded ? "animate-zoomIn" : "opacity-0"}`}
          onWheel={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
          style={{ overflow: "hidden" }}
        >
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              scale: 100,
              center: [0, 20],
            }}
            width={1200}
            height={600}
            style={{ width: "100%", height: "auto" }}
          >
            <ZoomableGroup zoom={1} minZoom={0.5} maxZoom={8}>
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const countryName = geo.properties?.NAME || geo.properties?.name || geo.properties?.NAME_EN
                    const birthrate = getBirthrate(countryName)

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        onMouseEnter={(event) => {
                          setTooltipContent(
                            `${countryName || "Unknown"}: ${birthrate ? birthrate.toFixed(2) : "No data"} births per woman (${getColorCategory(birthrate)})`,
                          )
                          setShowTooltip(true)
                        }}
                        onMouseMove={(event) => {
                          const mapContainer = event.currentTarget.closest(".relative")
                          const rect = mapContainer?.getBoundingClientRect()
                          if (rect) {
                            setMousePosition({
                              x: event.clientX - rect.left,
                              y: event.clientY - rect.top,
                            })
                          }
                        }}
                        onMouseLeave={() => {
                          setTooltipContent("")
                          setShowTooltip(false)
                        }}
                        style={{
                          default: {
                            fill: getCountryColor(birthrate),
                            outline: "none",
                            stroke: "#ffffff",
                            strokeWidth: 0.5,
                          },
                          hover: {
                            fill: getCountryColor(birthrate),
                            outline: "none",
                            stroke: "#000000",
                            strokeWidth: 1,
                          },
                          pressed: {
                            fill: getCountryColor(birthrate),
                            outline: "none",
                            stroke: "#000000",
                            strokeWidth: 1,
                          },
                        }}
                      />
                    )
                  })
                }
              </Geographies>

              {/* Country labels with birthrate numbers using better centroid calculation */}
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies
                    .filter((geo) => {
                      const countryName = geo.properties?.NAME || geo.properties?.name || geo.properties?.NAME_EN
                      const birthrate = getBirthrate(countryName)
                      const area = geoArea(geo)
                      // Only show labels for countries with data and sufficient size
                      return birthrate !== undefined && area > 0.0001
                    })
                    .map((geo) => {
                      const countryName = geo.properties?.NAME || geo.properties?.name || geo.properties?.NAME_EN
                      const birthrate = getBirthrate(countryName)

                      if (!birthrate) return null

                      const coordinates = getBetterCentroid(geo)
                      const fontSize = getFontSize(geo)

                      return (
                        <Marker key={`${geo.rsmKey}-marker`} coordinates={coordinates}>
                          <text
                            textAnchor="middle"
                            dominantBaseline="middle"
                            style={{
                              fontFamily: "system-ui",
                              fontSize: `${fontSize}px`,
                              fontWeight: "bold",
                              fill: "#000000",
                              pointerEvents: "none",
                              stroke: "#ffffff",
                              strokeWidth: "2px",
                              paintOrder: "stroke fill",
                            }}
                          >
                            {birthrate.toFixed(1)}
                          </text>
                        </Marker>
                      )
                    })
                }
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>

          {showTooltip && tooltipContent && (
            <div
              className="absolute bg-black/90 backdrop-blur-sm text-white px-3 py-2 rounded-lg shadow-2xl text-xs pointer-events-none z-50 transition-all duration-100 ease-out border border-white/10"
              style={{
                left: mousePosition.x + 15,
                top: mousePosition.y - 50,
                maxWidth: "250px",
                wordWrap: "break-word",
                overflowWrap: "break-word",
                whiteSpace: "normal",
                lineHeight: "1.4",
              }}
            >
              <div className="break-words">{tooltipContent}</div>
              <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/90"></div>
            </div>
          )}
        </div>

        <div
          className={`p-4 text-center text-xs text-gray-600 transition-all duration-1000 ${
            isLoaded ? "animate-fadeInUp animation-delay-600" : "opacity-0"
          }`}
        >
          <p>Use mouse wheel to zoom, click and drag to pan the map</p>
          <p className="mt-1 font-medium">
            World average: 2.24 births per woman | Replacement level: 2.1 births per woman
          </p>
          <p className="mt-4 text-gray-500">
            © 2025 ASH. Licensed under the GNU Affero General Public License v3.0.
          </p>
        </div>

      </div>

      <style jsx>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes zoomIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .animate-fadeInDown {
          animation: fadeInDown 0.8s ease-out forwards;
        }

        .animate-slideInLeft {
          animation: slideInLeft 0.6s ease-out forwards;
        }

        .animate-zoomIn {
          animation: zoomIn 1s ease-out forwards;
        }

        .animation-delay-100 {
          animation-delay: 0.1s;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-300 {
          animation-delay: 0.3s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }

        .animation-delay-600 {
          animation-delay: 0.6s;
        }
      `}</style>
    </div>
  )
}
