import React from "react";

export const Footer = (): React.ReactElement => {
  return (
    <footer className="bg-slate-800 text-white border-t border-slate-700">
      <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold">Dashboard</h3>
          <p className="text-sm text-gray-400 mt-2">
            This dashboard helps monitor device health and control status.
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Profile</h3>
          <p className="text-sm text-gray-400 mt-2">Created by Khadaffi</p>
        </div>
      </div>
      <div className="text-center text-xs text-gray-500 py-4 border-t border-slate-700">
        &copy; {new Date().getFullYear()} Device Dashboard. All rights reserved.
      </div>
    </footer>
  );
};
