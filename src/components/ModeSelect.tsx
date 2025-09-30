import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

const options = [
  { id: 1, name: "Default", value: "default" },
  { id: 2, name: "Bullet Points", value: "bullets" },
  { id: 3, name: "Simplified", value: "simple" },
];

export default function ModeSelect({ mode, setMode }: { mode: string; setMode: (mode: string) => void }) {
  const selected = options.find((o) => o.value === mode);

  return (
    <Listbox value={selected} onChange={(val) => setMode(val.value)}>
      <div className="relative">
        <ListboxButton className="w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
          <span className="block">{selected?.name}</span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
          </span>
        </ListboxButton>

        <ListboxOptions className="absolute mt-1 w-full bg-white shadow-lg max-h-60 rounded-xl py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none z-10">
          {options.map((option) => (
            <ListboxOption
              key={option.id}
              value={option}
              className={({ active }) =>
                `cursor-pointer select-none relative py-2 pl-4 pr-4 ${
                  active ? "bg-blue-100 text-blue-900" : "text-gray-900"
                }`
              }
            >
              {({ selected }) => (
                <>
                  <span className={`${selected ? "font-medium" : "font-normal"} block`}>
                    {option.name}
                  </span>
                  {selected && (
                    <span className="absolute inset-y-0 right-4 flex items-center pl-2 text-blue-600">
                      <CheckIcon className="h-5 w-5" />
                    </span>
                  )}
                </>
              )}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    </Listbox>
  );
}
