import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumbs({ items = [] }) {
  if (!items || items.length === 0) return null;

  return (
    <nav className="flex items-center gap-1.5 text-xs text-[#66736B]" aria-label="Breadcrumb">
      <Link to="/dashboard" className="text-[#66736B] hover:text-[#146B45] transition flex items-center gap-1">
        <Home className="w-3.5 h-3.5" />
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            <ChevronRight className="w-3 h-3 text-[#CBD5CD] shrink-0" />
            {isLast || !item.path ? (
              <span className="font-semibold text-[#17231D] truncate max-w-[200px]">
                {item.label}
              </span>
            ) : (
              <Link to={item.path} className="hover:text-[#146B45] transition truncate max-w-[150px]">
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
