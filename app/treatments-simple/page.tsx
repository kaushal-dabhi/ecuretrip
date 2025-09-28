export default function TreatmentsSimple() {
  const treatments = [
    {
      id: '1',
      name: 'Breast Cancer Surgical Consult',
      category: 'oncology',
      description: 'Initial consult and treatment plan',
      base_price: 15000
    },
    {
      id: '2', 
      name: 'Chemotherapy Day Care',
      category: 'oncology',
      description: 'Per cycle day care charge',
      base_price: 30000
    },
    {
      id: '3',
      name: 'Pediatric Leukemia Consult',
      category: 'pediatrics', 
      description: 'Initial pediatric hemato oncology consult',
      base_price: 18000
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-[#2A4049]">Medical Treatments</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {treatments.map((treatment) => (
            <div key={treatment.id} className="bg-white border-2 border-[#ADC8A6] rounded-lg p-6 shadow-lg">
              <div className="mb-4">
                <div className="w-full h-32 bg-gradient-to-br from-red-500 to-red-700 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-white text-4xl">🧬</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-[#2A4049] mb-2">{treatment.name}</h3>
              <p className="text-gray-600 mb-4">{treatment.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-[#2A4049]">₹{treatment.base_price.toLocaleString()}</span>
                <button className="bg-[#2A4049] text-white px-4 py-2 rounded-lg hover:bg-[#1F2F35] transition-colors">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
