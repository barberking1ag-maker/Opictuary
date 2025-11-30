import { db } from "./db";
import { celebrityMemorials } from "@shared/schema";

async function seed() {
  const celebrities = [
    {
      name: "Queen Elizabeth II",
      title: "Queen of the United Kingdom (1926-2022)",
      charityName: "The Queen's Commonwealth Trust",
      donationAmount: "10",
      platformPercentage: 5,
    },
    {
      name: "Kobe Bryant",
      title: "NBA Legend & Philanthropist (1978-2020)",
      charityName: "Mamba & Mambacita Sports Foundation",
      donationAmount: "10",
      platformPercentage: 5,
    },
    {
      name: "David Bowie",
      title: "Music Icon & Cultural Pioneer (1947-2016)",
      charityName: "Save the Children",
      donationAmount: "10",
      platformPercentage: 5,
    },
    {
      name: "Ruth Bader Ginsburg",
      title: "Supreme Court Justice (1933-2020)",
      charityName: "American Civil Liberties Union",
      donationAmount: "10",
      platformPercentage: 5,
    },
    {
      name: "Robin Williams",
      title: "Actor & Comedian (1951-2014)",
      charityName: "St. Jude Children's Research Hospital",
      donationAmount: "10",
      platformPercentage: 5,
    },
    {
      name: "Princess Diana",
      title: "Princess of Wales (1961-1997)",
      charityName: "The Diana Award",
      donationAmount: "10",
      platformPercentage: 5,
    }
  ];

  for (const celebrity of celebrities) {
    await db.insert(celebrityMemorials).values(celebrity).onConflictDoNothing();
  }

  console.log("Seed completed successfully");
  process.exit(0);
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
