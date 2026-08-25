import type { LucideIcon } from "lucide-react";
import { Fan,Plug,Cable,CircuitBoard,BatteryCharging,Home} from "lucide-react";


export type ServiceOption = {
  value: string;
  label: string;
  icon: LucideIcon;
  description: string;
};

export const services: ServiceOption[] = [
  {
    value: "fan-repair-installation",
    label: "Fan repair & installation", 
    icon: Fan,
    description:
      "Fan not working, installation, replacement and fan-related electrical issues.",
  },
  {
    value: "switch-socket-repair",
    label: "Switch & socket repair",
    icon: Plug,
    description:
      "Switch replacement, Socket problem, loose/damaged switch/socket",
  },
  {
    value: "wiring",
    label: "Wiring & rewiring",
    icon: Cable,
    description:
      "Wiring issues, New wiring, Rewiring",
  },
  {
    value: "mcb-fuse",
    label: "MCB & fuse",
    icon: CircuitBoard,
    description:
      "MCB replacement, fuse issues, and electrical tripping problems.",
  },
  {
    value: "inverter",
    label: "Inverter services",
    icon: BatteryCharging,
    description:
      "Inverter installation or inverter-related electrical work.",
  },
  {
  value: "house-wiring",
  label: "House wiring services",
  icon: Home,
  description:
    "Complete house wiring installation and related electrical work.",
},
];

export const serviceOptions = services.map(
  (service) => service.label,
);

export const timeOptions = [
  "8:00 AM – 10:00 AM",
  "10:00 AM – 12:00 PM",
  "12:00 PM – 2:00 PM",
  "2:00 PM – 4:00 PM",
  "4:00 PM – 6:00 PM",
  "6:00 PM – 8:00 PM",
];

export const inspectionOptions = [
  {
    value: "no",
    label: "No, I know what needs fixing",
  },
  {
    value: "yes",
    label: "Yes, please inspect the issue",
  },
];