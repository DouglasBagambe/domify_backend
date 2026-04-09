require("dotenv").config();
const mongoose = require("mongoose");
const Property = require("./models/property");

const seedDatabase = async () => {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected successfully!");

    console.log("Clearing existing properties...");
    await Property.deleteMany({});

    const types = ["apartment", "house", "villa", "commercial", "land", "studio"];
    const purposes = ["rent", "sale", "shortStay"];
    const regions = ["Central", "Western", "Eastern", "Northern"];
    const locations = [
      "Kampala, Kololo", "Kampala, Ntinda", "Wakiso, Kira", "Entebbe, Muyenga",
      "Jinja, Source of the Nile", "Mbarara, Kakoba", "Gulu, Senior Quarters"
    ];

    const generateImages = (type) => {
      const typeMap = {
        apartment: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1000", "https://images.unsplash.com/photo-1502672260266-1c1de2d9d150?q=80&w=1000"],
        house: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1000", "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1000"],
        villa: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1000", "https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=1000"],
        commercial: ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000", "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000"],
        land: ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000", "https://images.unsplash.com/photo-1524334228333-0f6db392f8a1?q=80&w=1000"],
        studio: ["https://images.unsplash.com/photo-1536376072261-38c75010e6c9?q=80&w=1000", "https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=1000"]
      };
      return typeMap[type] || typeMap["house"];
    };

    const properties = [];
    for (let i = 1; i <= 50; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      const purpose = purposes[Math.floor(Math.random() * purposes.length)];
      
      properties.push({
        title: `Premium ${type.charAt(0).toUpperCase() + type.slice(1)} exactly for ${purpose}`,
        description: `This is a beautiful ${type} located in a prime area, perfect for ${purpose}. It comes with premium amenities and is ready for immediate occupancy.`,
        location: locations[Math.floor(Math.random() * locations.length)],
        type: type,
        purpose: purpose,
        price: purpose === 'sale' ? Math.floor(Math.random() * 500) * 1000000 + 50000000 : Math.floor(Math.random() * 20) * 100000 + 500000,
        appointmentFee: 50000,
        size: {
          totalArea: Math.floor(Math.random() * 5000) + 100,
          bedrooms: type === 'land' ? 0 : Math.floor(Math.random() * 5) + 1,
          bathrooms: type === 'land' ? 0 : Math.floor(Math.random() * 4) + 1,
          parking: Math.floor(Math.random() * 4),
          dimensions: "50x100 ft",
        },
        images: generateImages(type),
        videos: [],
        tags: ["Premium", "Hot Deal", "Verified"],
        amenities: type === 'land' ? ["Water Ready", "Power Ready"] : ["WiFi", "Parking", "Security", "Air Conditioning"],
        agent: {
          name: ["Douglas Bagambe", "John Doe", "Jane Smith"][Math.floor(Math.random() * 3)],
          phone: "+256700000000",
          email: "agent@domify.com",
          photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=256",
          company: "Domify Real Estate",
          position: "Senior Agent"
        },
        isFeatured: Math.random() > 0.8, // 20% chance to be featured
        region: regions[Math.floor(Math.random() * regions.length)],
        district: "Central District",
        area: "Urban Zone"
      });
    }

    console.log("Inserting 50 properties...");
    await Property.insertMany(properties);
    console.log("Database seeded successfully!");
    
    mongoose.disconnect();
  } catch (error) {
    console.error("Error seeding database:", error);
    mongoose.disconnect();
    process.exit(1);
  }
};

seedDatabase();
