import {
  Activity,
  BicepsFlexed,
  Bike,
  BookMarked,
  Bot,
  Brain,
  Bug,
  Car,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  CodeXml,
  Dumbbell,
  Edit,
  Flame,
  Hammer,
  Hash,
  HeartPulse,
  Layers,
  Moon,
  MountainSnow,
  Plane,
  Plus,
  PlusCircle,
  ScanBox,
  Sun,
  Target,
  Trash2,
  TrendingUp,
  TriangleAlert,
  Utensils,
  Zap,
} from "lucide-react-native";

const systemIcons = {
  "chevron-down": ChevronDown,
  "chevron-right": ChevronRight,
  edit: Edit,
  plus: Plus,
  "plus-circle": PlusCircle,
  "trash-2": Trash2,
  sun: Sun,
  moon: Moon,
};

export const categoryIcons = {
  "check-circle": CheckCircle,
  hash: Hash,
  "trending-up": TrendingUp,
  activity: Activity,
  layers: Layers,
  zap: Zap,
  health: HeartPulse,
  book: BookMarked,
  brain: Brain,
  target: Target,
  "alert-triangle": TriangleAlert,
  flame: Flame,
  dumbbell: Dumbbell,
  hammer: Hammer,
  "code-xml": CodeXml,
  bug: Bug,
  mountain: MountainSnow,
  bike: Bike,
  car: Car,
  plane: Plane,
  scan: ScanBox,
  bot: Bot,
  "circle-dollar-sign": CircleDollarSign,
  utensils: Utensils,
  "biceps-flexed": BicepsFlexed,
};

export const iconMap = {
  ...systemIcons,
  ...categoryIcons,
};

export type IconName = keyof typeof iconMap;

type IconProps = {
  name: IconName;
  size?: number;
  color?: string;
};

export function Icon({ name, size = 18, color = "#000" }: IconProps) {
  const Component = iconMap[name];

  if (!Component) {
    return null;
  }

  return <Component size={size} color={color} />;
}
