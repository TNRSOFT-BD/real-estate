import {
    Award,
    BadgeCheck,
    BadgeDollarSign,
    Building2,
    Car,
    Clock,
    Compass,
    CreditCard,
    Dumbbell,
    FileCheck,
    Gem,
    GraduationCap,
    Handshake,
    Headset,
    HeartHandshake,
    Hospital,
    House,
    KeyRound,
    Leaf,
    Lock,
    Mail,
    MapPin,
    Phone,
    Rocket,
    ShieldCheck,
    Smile,
    Sparkles,
    Star,
    Sun,
    Target,
    ThumbsUp,
    Trees,
    TrendingUp,
    Users,
    Wallet,
    Waves,
    Wifi,
    Wrench,
    Zap,
    type LucideIcon,
} from 'lucide-react';

export interface WhyChooseUsIconOption {
    value: string;
    label: string;
}

export interface WhyChooseUsIconDefinition extends WhyChooseUsIconOption {
    Icon: LucideIcon;
}

/**
 * Curated icon set for the homepage "Why Choose Us" features. Values are the
 * lucide-react icon names so they resolve on both the admin and the public site.
 */
export const whyChooseUsIconDefinitions: WhyChooseUsIconDefinition[] = [
    // Trust & reputation
    { value: 'ShieldCheck', label: 'Trust / security', Icon: ShieldCheck },
    { value: 'BadgeCheck', label: 'Certified quality', Icon: BadgeCheck },
    { value: 'Award', label: 'Award winning', Icon: Award },
    { value: 'Handshake', label: 'Trusted partnership', Icon: Handshake },
    { value: 'HeartHandshake', label: 'Dedicated support', Icon: HeartHandshake },
    { value: 'Headset', label: 'Customer support', Icon: Headset },
    { value: 'ThumbsUp', label: 'Satisfaction', Icon: ThumbsUp },
    { value: 'Smile', label: 'Happy clients', Icon: Smile },
    { value: 'Gem', label: 'Premium quality', Icon: Gem },
    { value: 'Star', label: 'Top rated', Icon: Star },

    // Location & construction
    { value: 'MapPin', label: 'Prime location', Icon: MapPin },
    { value: 'Compass', label: 'Location advantage', Icon: Compass },
    { value: 'Building2', label: 'Quality construction', Icon: Building2 },
    { value: 'House', label: 'Beautiful homes', Icon: House },
    { value: 'Wrench', label: 'Built to last', Icon: Wrench },
    { value: 'KeyRound', label: 'Ready to move', Icon: KeyRound },
    { value: 'FileCheck', label: 'Clear documentation', Icon: FileCheck },
    { value: 'Lock', label: 'Gated & secure', Icon: Lock },
    { value: 'Leaf', label: 'Eco friendly', Icon: Leaf },
    { value: 'Sun', label: 'Natural light', Icon: Sun },
    { value: 'Trees', label: 'Green surroundings', Icon: Trees },

    // Amenities & lifestyle
    { value: 'Waves', label: 'Swimming pool', Icon: Waves },
    { value: 'Dumbbell', label: 'Fitness centre', Icon: Dumbbell },
    { value: 'Wifi', label: 'Smart connectivity', Icon: Wifi },
    { value: 'Zap', label: 'Power backup', Icon: Zap },
    { value: 'Sparkles', label: 'Modern amenities', Icon: Sparkles },

    // Value & convenience
    { value: 'CreditCard', label: 'Flexible payment', Icon: CreditCard },
    { value: 'Wallet', label: 'Affordable plans', Icon: Wallet },
    { value: 'BadgeDollarSign', label: 'Best value', Icon: BadgeDollarSign },
    { value: 'TrendingUp', label: 'High appreciation', Icon: TrendingUp },
    { value: 'Rocket', label: 'Fast handover', Icon: Rocket },
    { value: 'Clock', label: 'On-time delivery', Icon: Clock },
    { value: 'Target', label: 'Customer focused', Icon: Target },

    // Neighbourhood
    { value: 'Users', label: 'Community living', Icon: Users },
    { value: 'GraduationCap', label: 'Schools nearby', Icon: GraduationCap },
    { value: 'Hospital', label: 'Hospitals nearby', Icon: Hospital },
    { value: 'Car', label: 'Easy parking', Icon: Car },
    { value: 'Phone', label: 'Easy to reach', Icon: Phone },
    { value: 'Mail', label: 'Responsive contact', Icon: Mail },
];

export const whyChooseUsIconOptions: WhyChooseUsIconOption[] = whyChooseUsIconDefinitions.map(({ value, label }) => ({ value, label }));

export const whyChooseUsIconMap: Record<string, LucideIcon> = whyChooseUsIconDefinitions.reduce<Record<string, LucideIcon>>((map, definition) => {
    map[definition.value] = definition.Icon;

    return map;
}, {});
