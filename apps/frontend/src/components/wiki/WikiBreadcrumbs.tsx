import React from 'react'
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import { WikiItem } from '../../types/wiki'

interface WikiBreadcrumbsProps {
  item?: WikiItem
  onNavigate: (item: WikiItem) => void
}

export const WikiBreadcrumbs: React.FC<WikiBreadcrumbsProps> = ({
  item,
  onNavigate
}) => {
  // This is a simplified breadcrumb. In a real app, you'd fetch the full path
  // from the backend using a function like get_item_path.
  const breadcrumbs: WikiItem[] = []

  if (item) {
    // For now, just show the current item
    breadcrumbs.push(item)
  }

  return (
    <div className="flex items-center space-x-1 text-sm text-gray-500">
      {breadcrumbs.map((crumb, index) => (
        <React.Fragment key={crumb.id}>
          {index > 0 && <ChevronRightIcon className="w-4 h-4" />}
          <button
            onClick={() => onNavigate(crumb)}
            className="hover:text-gray-700"
          >
            {crumb.name}
          </button>
        </React.Fragment>
      ))}
    </div>
  )
}