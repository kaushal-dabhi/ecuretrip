export default function HomeTest() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">eCureTrip Medical Tourism</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white border-2 border-[#2A4049] rounded-lg p-6">
            <h3 className="text-xl font-bold text-[#2A4049] mb-3">Featured Treatments</h3>
            <p className="text-gray-600">Breast Cancer Surgical Consult</p>
            <p className="text-gray-600">Chemotherapy Day Care</p>
            <p className="text-gray-600">Pediatric Leukemia Consult</p>
          </div>
          <div className="bg-white border-2 border-[#ADC8A6] rounded-lg p-6">
            <h3 className="text-xl font-bold text-[#2A4049] mb-3">Top Doctors</h3>
            <p className="text-gray-600">Dr. Pritesh Shah - Radiology</p>
            <p className="text-gray-600">Dr. Sarah Johnson - Oncology</p>
          </div>
          <div className="bg-white border-2 border-[#2A4049] rounded-lg p-6">
            <h3 className="text-xl font-bold text-[#2A4049] mb-3">Partner Hospitals</h3>
            <p className="text-gray-600">Tata Memorial Hospital</p>
            <p className="text-gray-600">Apollo Hospitals</p>
          </div>
        </div>
      </div>
    </div>
  )
}
