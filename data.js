// This file contains the data structure for the Metaphorizing function.
// It maps concepts (like qualities and values) to symbolic names
// from various domains (mythology, animals, plants, nature, etc.).
// The keys (e.g., 'strength', 'innovation') should be lowercase for easier matching.

const namingData = {
    qualities: {
        // --- Common Qualities ---
        strength: ["Lion", "Oak", "Bear", "Atlas", "Mountain", "Rock", "Iron"], // Atlas (myth)
        speed: ["Cheetah", "Falcon", "Swift", "Mercury", "Arrow", "Bolt", "Rapid"], // Mercury (myth)
        wisdom: ["Owl", "Sage", "Athena", "Oracle", "Elder", "Grove"], // Athena (myth), Sage (plant/person)
        gentle: ["Dove", "Lamb", "Willow", "Breeze", "Serene", "Lotus"], // Willow, Lotus (plants)
        agile: ["Leopard", "Cat", "Fox", "Nimble", "Sprite", "Flicker"], // Sprite (myth/nature)
        bright: ["Sun", "Star", "Nova", "Lumen", "Beacon", "Spark", "Helio"], // Nova (astronomy), Lumen (unit), Helio (prefix)
        durable: ["Oak", "Stone", "Rhino", "Forge", "Solid", "Titan"], // Oak (plant), Titan (myth)
        resilient: ["Willow", "Phoenix", "Bounce", "Root", "Spring"], // Willow (plant), Phoenix (myth)
        secure: ["Aegis", "Shield", "Anchor", "Fortress", "Guard"], // Aegis (myth)
        vibrant: ["Bloom", "Spark", "Pulse", "Zest", "Flare"],

        // Add more qualities and their corresponding symbolic names
        // Example: brave: ["Leo", "Spartan", "Valor", "Gryphon"], // Leo (lion/zodiac), Spartan (history), Gryphon (myth)
    },
    values: {
        // --- Common Values ---
        community: ["Nexus", "Herd", "Pack", "Hive", "Union", "Tribe", "Gather"], // Nexus (concept), Herd/Pack/Hive (animals)
        innovation: ["Spark", "Nova", "Ignite", "Pioneer", "Crest", "Edge", "Phoenix"], // Nova (astronomy), Phoenix (myth)
        trust: ["Anchor", "Shield", "Aegis", "Steadfast", "Core", "Root"], // Anchor (object), Aegis (myth)
        growth: ["Sprout", "Bloom", "Arbor", "Rise", "Ascend", "Flourish", "Evergreen"], // Sprout/Bloom/Arbor/Evergreen (plants)
        freedom: ["Eagle", "Wing", "Soar", "Liber", "Open", "Horizon"], // Eagle (animal)
        harmony: ["Chord", "Blend", "Unison", "Flow", "Balance", "Zen"], // Chord/Unison (music), Zen (concept)
        sustainability: ["Root", "Green", "Eco", "Willow", "Evergreen", "Cycle"], // Root/Willow/Evergreen (plants), Eco (prefix)
        integrity: ["Core", "Solid", "True", "Axis", "Bedrock"],

        // Add more values and their corresponding symbolic names
        // Example: transparency: ["Clear", "Open", "Crystal", "Vista"],
    }
    // You could potentially add other categories or mappings here too
    // Example: domain_suffixes: { tech: ["Tech", "Tek", "Logix"], finance: ["Fin", "Vest", "Cap"] }
};

// Make sure this variable is accessible globally or imported if using modules later.
// For this simple setup, a global variable is fine.
