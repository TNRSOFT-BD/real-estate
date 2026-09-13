import {
    Accessibility,
    AirVent,
    ArrowUpDown,
    Baby,
    Bath,
    BedDouble,
    BellRing,
    Bike,
    BookOpen,
    Building,
    Building2,
    Bus,
    Camera,
    Car,
    Church,
    Coffee,
    Compass,
    CookingPot,
    Dog,
    DoorOpen,
    Droplets,
    Dumbbell,
    Fingerprint,
    Flame,
    Fence,
    Flower2,
    GraduationCap,
    HardHat,
    Hospital,
    Hotel,
    House,
    LandPlot,
    Landmark,
    Leaf,
    Lightbulb,
    Lock,
    Plane,
    Recycle,
    School,
    ShoppingBag,
    ShoppingCart,
    ShieldCheck,
    Snowflake,
    Sofa,
    Store,
    Sun,
    TrainFront,
    Trees,
    TreePine,
    Users,
    Utensils,
    UtensilsCrossed,
    WashingMachine,
    Waves,
    Wifi,
    Zap,
    type LucideIcon,
} from 'lucide-react';

export interface ProjectIconOption {
    value: string;
    label: string;
}

export interface ProjectIconDefinition extends ProjectIconOption {
    Icon: LucideIcon;
}

/**
 * Curated icon set used for project features and amenities. Values are the
 * lucide-react icon names so they can be resolved on both admin and public.
 */
export const projectIconDefinitions: ProjectIconDefinition[] = [
    // Lifestyle / wellness
    { value: 'Waves', label: 'Swimming pool', Icon: Waves },
    { value: 'Dumbbell', label: 'Gymnasium', Icon: Dumbbell },
    { value: 'Trees', label: 'Garden / Park', Icon: Trees },
    { value: 'TreePine', label: 'Green belt', Icon: TreePine },
    { value: 'Flower2', label: 'Landscaped garden', Icon: Flower2 },
    { value: 'Leaf', label: 'Eco friendly', Icon: Leaf },
    { value: 'Sun', label: 'Rooftop solar', Icon: Sun },
    { value: 'AirVent', label: 'Central AC', Icon: AirVent },
    { value: 'Snowflake', label: 'Air conditioning', Icon: Snowflake },
    { value: 'Lightbulb', label: 'Smart lighting', Icon: Lightbulb },
    { value: 'Sofa', label: 'Furnished', Icon: Sofa },
    { value: 'BedDouble', label: 'Guest room', Icon: BedDouble },
    { value: 'Bath', label: 'Attached bath', Icon: Bath },
    { value: 'CookingPot', label: 'Modern kitchen', Icon: CookingPot },
    { value: 'WashingMachine', label: 'Laundry', Icon: WashingMachine },
    { value: 'Droplets', label: 'Water supply', Icon: Droplets },
    { value: 'Flame', label: 'Gas supply', Icon: Flame },
    { value: 'Zap', label: 'Power backup', Icon: Zap },
    { value: 'Wifi', label: 'Wi-Fi', Icon: Wifi },

    // Building / structure
    { value: 'House', label: 'Independent house', Icon: House },
    { value: 'Building', label: 'Apartment block', Icon: Building },
    { value: 'Building2', label: 'Clubhouse', Icon: Building2 },
    { value: 'Hotel', label: 'Hotel / Serviced', Icon: Hotel },
    { value: 'Store', label: 'Retail store', Icon: Store },
    { value: 'LandPlot', label: 'Plot / Land', Icon: LandPlot },
    { value: 'Fence', label: 'Boundary wall', Icon: Fence },
    { value: 'DoorOpen', label: 'Wide entrance', Icon: DoorOpen },
    { value: 'ArrowUpDown', label: 'Elevator / Lift', Icon: ArrowUpDown },
    { value: 'HardHat', label: 'Under construction', Icon: HardHat },

    // Community / leisure
    { value: 'Users', label: 'Community hall', Icon: Users },
    { value: 'Baby', label: "Kids' play area", Icon: Baby },
    { value: 'Utensils', label: 'Restaurant', Icon: Utensils },
    { value: 'UtensilsCrossed', label: 'Food court', Icon: UtensilsCrossed },
    { value: 'Coffee', label: 'Cafe', Icon: Coffee },
    { value: 'ShoppingBag', label: 'Shopping', Icon: ShoppingBag },
    { value: 'ShoppingCart', label: 'Supermarket', Icon: ShoppingCart },
    { value: 'BookOpen', label: 'Library', Icon: BookOpen },
    { value: 'Landmark', label: 'Landmark', Icon: Landmark },

    // Security / services
    { value: 'ShieldCheck', label: 'Security / CCTV', Icon: ShieldCheck },
    { value: 'Camera', label: 'Surveillance', Icon: Camera },
    { value: 'Lock', label: 'Gated community', Icon: Lock },
    { value: 'Fingerprint', label: 'Biometric access', Icon: Fingerprint },
    { value: 'BellRing', label: 'Concierge', Icon: BellRing },
    { value: 'Recycle', label: 'Waste management', Icon: Recycle },
    { value: 'Accessibility', label: 'Accessible design', Icon: Accessibility },
    { value: 'Dog', label: 'Pet friendly', Icon: Dog },

    // Connectivity / transit / location
    { value: 'Car', label: 'Parking', Icon: Car },
    { value: 'Bus', label: 'Bus stop', Icon: Bus },
    { value: 'TrainFront', label: 'Metro / Train', Icon: TrainFront },
    { value: 'Bike', label: 'Cycling track', Icon: Bike },
    { value: 'Plane', label: 'Airport access', Icon: Plane },
    { value: 'Compass', label: 'Prime location', Icon: Compass },

    // Neighbourhood
    { value: 'Hospital', label: 'Hospital nearby', Icon: Hospital },
    { value: 'School', label: 'School nearby', Icon: School },
    { value: 'GraduationCap', label: 'University', Icon: GraduationCap },
    { value: 'Church', label: 'Place of worship', Icon: Church },
];

export const projectIconOptions: ProjectIconOption[] = projectIconDefinitions.map(({ value, label }) => ({ value, label }));

export const projectIconMap: Record<string, LucideIcon> = projectIconDefinitions.reduce<Record<string, LucideIcon>>((map, definition) => {
    map[definition.value] = definition.Icon;

    return map;
}, {});
