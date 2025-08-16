import { useState } from "react";
import { useSettings, useSetSettings } from "../hooks";
import { Link } from "react-router-dom";

export default function SettingsMenu() {
  const { data: settings } = useSettings();
  const setSettings = useSetSettings();
  const [open, setOpen] = useState(false);

  const unit = settings?.unit ?? "kg";

  return (
    <div className="relative">
      <button onClick={() => setOpen(v => !v)} className="border rounded px-3 py-1 bg-white">Settings</button>
      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white border rounded shadow p-3">
          <div className="text-sm text-gray-600 mb-2">Preferences</div>
          <div className="flex items-center justify-between mb-2">
            <div>Units</div>
            <select
              value={unit}
              onChange={e => setSettings.mutate({ unit: e.target.value as any })}
              className="border rounded px-2 py-1"
            >
              <option value="kg">kg</option>
              <option value="lb">lb</option>
            </select>
          </div>
          <Link className="text-blue-600 text-sm" to="/">Home</Link>
        </div>
      )}
    </div>
  );
}
