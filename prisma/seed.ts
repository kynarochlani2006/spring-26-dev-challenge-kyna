import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient();

const products = [
  {
    name: "HAVIT HV-G92 Gamepad",
    price: 160,
    imageUrl:
      "/assets/air-zoom-pegasus-37-9a8c07ab-fb12-40ab-ad5c-ed21ce63aaf9.png",
    rating: 4.8,
    reviews: 88,
    category: "Women",
  },
  {
    name: "HAVIT HV-G92 Gamepad",
    price: 160,
    imageUrl:
      "/assets/Maroon-d96f3d53-140d-4bf1-93ac-f867bffda2a1.png",
    rating: 4.8,
    reviews: 88,
    category: "Men",
  },
  {
    name: "HAVIT HV-G92 Gamepad",
    price: 160,
    imageUrl:
      "/assets/air-max-90-flyease-31be8905-ecb7-4de5-a555-2a761100071d.png",
    rating: 4.7,
    reviews: 88,
    category: "Kids",
  },
  {
    name: "HAVIT HV-G92 Gamepad",
    price: 960,
    oldPrice: 1160,
    imageUrl:
      "/assets/cosmic-unity-d03f394b-428f-4790-bceb-eeaa3c3a7f42.png",
    rating: 4.8,
    reviews: 75,
    tag: "-35%",
    category: "Classics",
  },
  {
    name: "HAVIT HV-G92 Gamepad",
    price: 160,
    imageUrl:
      "/assets/air-max-90-flyease-31be8905-ecb7-4de5-a555-2a761100071d.png",
    rating: 4.6,
    reviews: 88,
    category: "Sport",
  },
  {
    name: "HAVIT HV-G92 Gamepad",
    price: 960,
    oldPrice: 1160,
    imageUrl:
      "/assets/cosmic-unity-d03f394b-428f-4790-bceb-eeaa3c3a7f42.png",
    rating: 4.8,
    reviews: 75,
    tag: "-35%",
    category: "Sale",
  },
  {
    name: "HAVIT HV-G92 Gamepad",
    price: 160,
    imageUrl:
      "/assets/Maroon-d96f3d53-140d-4bf1-93ac-f867bffda2a1.png",
    rating: 4.8,
    reviews: 88,
    category: "Women",
  },
  {
    name: "HAVIT HV-G92 Gamepad",
    price: 960,
    oldPrice: 1160,
    imageUrl:
      "/assets/air-zoom-pegasus-37-9a8c07ab-fb12-40ab-ad5c-ed21ce63aaf9.png",
    rating: 4.8,
    reviews: 75,
    tag: "-35%",
    category: "Men",
  },
];

async function main() {
  await prisma.product.deleteMany();
  await prisma.product.createMany({ data: products });
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
