import React from "react";

const CancelButton = ({executable}:{executable:()=>void}) => {
  return (
    <button className="flex-1 sm:flex-none sm:px-8 py-2 border-2 border-cyan-500 text-cyan-500 rounded-lg hover:bg-cyan-50 transition-colors duration-200 font-medium" onClick={()=>executable()}>
      Cancel
    </button>
  );
};

export default CancelButton;
