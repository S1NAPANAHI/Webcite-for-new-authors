import React from 'react'

interface PropertyEditorProps {
  properties: Record<string, any>
  onChange: (properties: Record<string, any>) => void
}

export const PropertyEditor: React.FC<PropertyEditorProps> = ({
  properties,
  onChange
}) => {
  const handlePropertyChange = (key: string, value: any) => {
    onChange({
      ...properties,
      [key]: value
    })
  }

  const handleAddProperty = () => {
    let newKey = 'new_property'
    let i = 1
    while (properties.hasOwnProperty(newKey)) {
      newKey = `new_property_${i}`
      i++
    }
    onChange({
      ...properties,
      [newKey]: ''
    })
  }

  const handleDeleteProperty = (keyToDelete: string) => {
    const newProperties = { ...properties }
    delete newProperties[keyToDelete]
    onChange(newProperties)
  }

  return (
    <div className="space-y-3">
      {Object.entries(properties).map(([key, value]) => (
        <div key={key} className="flex items-center space-x-2">
          <input
            type="text"
            value={key}
            onChange={(e) => {
              const newKey = e.target.value
              const newProperties = { ...properties }
              newProperties[newKey] = newProperties[key]
              delete newProperties[key]
              onChange(newProperties)
            }}
            className="w-1/3 px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Key"
          />
          <input
            type="text"
            value={value}
            onChange={(e) => handlePropertyChange(key, e.target.value)}
            className="w-2/3 px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Value"
          />
          <button
            type="button"
            onClick={() => handleDeleteProperty(key)}
            className="p-1 text-red-500 hover:bg-red-100 rounded-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={handleAddProperty}
        className="w-full px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
      >
        + Add Property
      </button>
    </div>
  )
}