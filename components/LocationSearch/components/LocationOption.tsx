import { Circle, CircleDot } from "lucide-react";

import { Location } from "@/types";

type LocationOptionProps = {
  location: Location;
  isActive: boolean;
  isSelected: boolean;
  onClick: () => void;
};

export const LocationOption = ({
  location,
  isActive,
  isSelected,
  onClick,
}: LocationOptionProps) => {
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
      {isSelected ? (
        <CircleDot size={16} className="mr-2 min-w-4 text-blue-500" />
      ) : (
        <Circle size={16} className="mr-2 min-w-4 text-gray-600" />
      )}
      <span className="flex grow">
        {`${location.name}${location.state ? `, ${location.state}` : ""}`}
      </span>
      <span
        className={`mx-2 w-4 max-w-4 min-w-4 fi fi-${location.country.toLowerCase()}`}
      ></span>
    </div>
  );
};
