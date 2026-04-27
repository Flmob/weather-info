import { History, Trash2 } from "lucide-react";

import { Location } from "@/types";

type LocationHistoryOptionProps = {
  location: Location;
  isActive: boolean;
  isSelected: boolean;
  onClick: () => void;
  onDelete: () => void;
};

export const LocationHistoryOption = ({
  location,
  isActive,
  isSelected,
  onClick,
  onDelete,
}: LocationHistoryOptionProps) => {
  return (
    <div
      className={`
        p-2 my-1 rounded-2xl cursor-pointer
        transition-colors duration-200 ease-in-out
        flex items-center place-content-between
        ${isActive ? "bg-white/10" : "hover:bg-white/10"}
      `}
      onMouseDown={onClick}
    >
      <History
        size={16}
        className={`mr-2 min-w-4 ${isSelected ? "text-blue-500" : "text-gray-600"}`}
      />

      <span className="flex grow">
        {location.name}, {location.state}
      </span>

      <span
        className={`mx-2 w-4 max-w-4 min-w-4 fi fi-${location.country.toLowerCase()}`}
      ></span>

      <Trash2
        size={16}
        className="min-w-4 text-gray-600 hover:text-red-500"
        onMouseDown={(e) => {
          e.stopPropagation();
          onDelete();
        }}
      />
    </div>
  );
};
