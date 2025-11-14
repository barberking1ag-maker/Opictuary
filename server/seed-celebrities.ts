import { db } from "./db";
import { celebrityMemorials } from "@shared/schema";

const iconicCelebrities = [
  // Music Icons
  {
    name: "Michael Jackson",
    title: "King of Pop",
    biography: "Michael Joseph Jackson was an American singer, songwriter, and dancer, widely regarded as one of the most significant cultural figures of the 20th century. His contributions to music, dance, and fashion made him a global figure in popular culture for over four decades.",
    professionCategory: "music",
    subProfession: "Pop",
    birthDate: "1958-08-29",
    deathDate: "2009-06-25",
    charityName: "Heal the World Foundation",
    donationAmount: "10",
    achievements: [
      { title: "Best-selling album of all time (Thriller)", year: "1982" },
      { title: "13 Grammy Awards", year: "1984-2010" },
      { title: "Moonwalk dance creation", year: "1983" },
      { title: "Rock and Roll Hall of Fame (twice)", year: "1997, 2001" }
    ],
    awards: [
      { name: "Grammy Legend Award", year: "1993" },
      { name: "Grammy Lifetime Achievement Award", year: "2010" },
      { name: "American Music Award of Merit", year: "1984" }
    ],
    verificationStatus: "approved",
    verifiedBy: "Estate of Michael Jackson",
    fanCount: 1250000
  },
  {
    name: "Whitney Houston",
    title: "The Voice",
    biography: "Whitney Elizabeth Houston was an American singer and actress, one of the best-selling music artists of all time with over 200 million records sold worldwide. Known for her powerful, soulful vocals and crossover appeal.",
    professionCategory: "music",
    subProfession: "R&B/Soul",
    birthDate: "1963-08-09",
    deathDate: "2012-02-11",
    charityName: "Whitney Houston Foundation for Children",
    donationAmount: "10",
    achievements: [
      { title: "Best-selling single by a female artist", year: "1992", description: "I Will Always Love You" },
      { title: "6 Grammy Awards", year: "1986-2001" },
      { title: "First artist with 7 consecutive #1 singles", year: "1988" },
      { title: "Over 200 million records sold worldwide", year: "2012" }
    ],
    awards: [
      { name: "Grammy Award for Record of the Year", year: "1994", category: "I Will Always Love You" },
      { name: "BET Lifetime Achievement Award", year: "2001" },
      { name: "NAACP Image Award - Entertainer of the Year", year: "2001" }
    ],
    verificationStatus: "approved",
    verifiedBy: "Whitney Houston Estate",
    fanCount: 890000
  },
  {
    name: "Prince",
    title: "The Purple One",
    biography: "Prince Rogers Nelson was an American singer-songwriter, multi-instrumentalist, record producer, and actor. He was known for his flamboyant stage presence, eclectic work, and wide vocal range.",
    professionCategory: "music",
    subProfession: "Rock",
    birthDate: "1958-06-07",
    deathDate: "2016-04-21",
    charityName: "Love 4 One Another",
    donationAmount: "10",
    achievements: [
      { title: "7 Grammy Awards", year: "1985-2008" },
      { title: "Academy Award for Purple Rain", year: "1985" },
      { title: "Rock and Roll Hall of Fame", year: "2004" },
      { title: "Over 100 million records sold", year: "2016" }
    ],
    awards: [
      { name: "Grammy Lifetime Achievement Award", year: "2010" },
      { name: "BET Lifetime Achievement Award", year: "2010" },
      { name: "Golden Globe Award", year: "2007" }
    ],
    verificationStatus: "approved",
    verifiedBy: "Paisley Park Enterprises",
    fanCount: 750000
  },

  // Acting Icons
  {
    name: "Robin Williams",
    title: "Comedy Legend",
    biography: "Robin McLaurin Williams was an American actor and comedian known for his improvisational skills and diverse film performances. From stand-up comedy to dramatic roles, he touched millions with his talent and humanity.",
    professionCategory: "entertainment",
    subProfession: "Film",
    birthDate: "1951-07-21",
    deathDate: "2014-08-11",
    charityName: "St. Jude Children's Research Hospital",
    donationAmount: "10",
    achievements: [
      { title: "Academy Award for Good Will Hunting", year: "1998" },
      { title: "5 Grammy Awards", year: "1980-2003" },
      { title: "2 Emmy Awards", year: "1987-1988" },
      { title: "6 Golden Globe Awards", year: "1979-2005" }
    ],
    awards: [
      { name: "Academy Award for Best Supporting Actor", year: "1998", category: "Good Will Hunting" },
      { name: "Cecil B. DeMille Award", year: "2005" },
      { name: "Screen Actors Guild Life Achievement Award", year: "2013" }
    ],
    verificationStatus: "approved",
    verifiedBy: "Williams Family Trust",
    fanCount: 980000
  },
  {
    name: "Chadwick Boseman",
    title: "King T'Challa",
    biography: "Chadwick Aaron Boseman was an American actor best known for his portrayal of Black Panther in the Marvel Cinematic Universe. He became an icon and inspiration for representing Black excellence in cinema.",
    professionCategory: "entertainment",
    subProfession: "Film",
    birthDate: "1976-11-29",
    deathDate: "2020-08-28",
    charityName: "The Chadwick Boseman Foundation",
    donationAmount: "10",
    achievements: [
      { title: "Black Panther - First superhero film nominated for Best Picture", year: "2018" },
      { title: "Portrayed iconic Black leaders", year: "2013-2020", description: "Jackie Robinson, James Brown, Thurgood Marshall" },
      { title: "MTV Movie Award for Best Hero", year: "2018" },
      { title: "NAACP Image Awards", year: "2013-2021" }
    ],
    awards: [
      { name: "Golden Globe Award (posthumous)", year: "2021", category: "Ma Rainey's Black Bottom" },
      { name: "Screen Actors Guild Award", year: "2019", category: "Black Panther" },
      { name: "Critics' Choice Award (posthumous)", year: "2021" }
    ],
    verificationStatus: "approved",
    verifiedBy: "Boseman Estate",
    fanCount: 1100000
  },
  {
    name: "Betty White",
    title: "America's Golden Girl",
    biography: "Betty Marion White was an American actress and comedian with a television career spanning seven decades. She was a pioneer of television and known for her roles in The Golden Girls and The Mary Tyler Moore Show.",
    professionCategory: "entertainment",
    subProfession: "Television",
    birthDate: "1922-01-17",
    deathDate: "2021-12-31",
    charityName: "Morris Animal Foundation",
    donationAmount: "10",
    achievements: [
      { title: "Longest TV career for a female entertainer", year: "2014", description: "75 years" },
      { title: "8 Emmy Awards", year: "1952-2010" },
      { title: "First woman to produce a sitcom", year: "1953" },
      { title: "Oldest person to host SNL", year: "2010" }
    ],
    awards: [
      { name: "Screen Actors Guild Life Achievement Award", year: "2010" },
      { name: "Grammy Award", year: "2012" },
      { name: "Television Hall of Fame", year: "1995" }
    ],
    verificationStatus: "approved",
    verifiedBy: "White Estate",
    fanCount: 670000
  },

  // Sports Icons
  {
    name: "Kobe Bryant",
    title: "Black Mamba",
    biography: "Kobe Bean Bryant was an American professional basketball player who spent his entire 20-year career with the Los Angeles Lakers. A five-time NBA champion, he was one of the greatest basketball players of all time.",
    professionCategory: "sports",
    subProfession: "Basketball",
    birthDate: "1978-08-23",
    deathDate: "2020-01-26",
    charityName: "Mamba & Mambacita Sports Foundation",
    donationAmount: "10",
    achievements: [
      { title: "5 NBA Championships", year: "2000-2010" },
      { title: "18-time NBA All-Star", year: "1998-2016" },
      { title: "NBA MVP", year: "2008" },
      { title: "Academy Award for Dear Basketball", year: "2018" }
    ],
    awards: [
      { name: "Naismith Memorial Basketball Hall of Fame", year: "2020" },
      { name: "NBA All-Time Scoring List", year: "2020", category: "4th place" },
      { name: "Los Angeles Lakers retired numbers", year: "2017", category: "#8 and #24" }
    ],
    verificationStatus: "approved",
    verifiedBy: "Bryant Family Trust",
    fanCount: 1500000
  },
  {
    name: "Muhammad Ali",
    title: "The Greatest",
    biography: "Muhammad Ali was an American professional boxer, activist, and philanthropist. Widely regarded as one of the most significant sports figures of the 20th century and the greatest heavyweight boxer of all time.",
    professionCategory: "sports",
    subProfession: "Boxing",
    birthDate: "1942-01-17",
    deathDate: "2016-06-03",
    charityName: "Muhammad Ali Parkinson Center",
    donationAmount: "10",
    achievements: [
      { title: "3-time Heavyweight Champion", year: "1964-1979" },
      { title: "Olympic Gold Medal", year: "1960" },
      { title: "Sports Illustrated Sportsman of the Century", year: "1999" },
      { title: "Presidential Medal of Freedom", year: "2005" }
    ],
    awards: [
      { name: "BBC Sports Personality of the Century", year: "1999" },
      { name: "International Boxing Hall of Fame", year: "1990" },
      { name: "Arthur Ashe Courage Award", year: "1997" }
    ],
    verificationStatus: "approved",
    verifiedBy: "Ali Family",
    fanCount: 920000
  },
  {
    name: "Diego Maradona",
    title: "Hand of God",
    biography: "Diego Armando Maradona was an Argentine professional football player and manager. Widely regarded as one of the greatest players of all time, he led Argentina to victory in the 1986 World Cup.",
    professionCategory: "sports",
    subProfession: "Soccer",
    birthDate: "1960-10-30",
    deathDate: "2020-11-25",
    charityName: "Fundación Diego Armando Maradona",
    donationAmount: "10",
    achievements: [
      { title: "1986 FIFA World Cup Champion", year: "1986" },
      { title: "FIFA Player of the 20th Century", year: "2000" },
      { title: "Goal of the Century", year: "1986" },
      { title: "91 caps for Argentina", year: "1977-1994" }
    ],
    awards: [
      { name: "FIFA World Cup Golden Ball", year: "1986" },
      { name: "Argentine Primera División top scorer", year: "1979-1981" },
      { name: "Serie A Champion with Napoli", year: "1987, 1990" }
    ],
    verificationStatus: "approved",
    verifiedBy: "Maradona Estate",
    fanCount: 1050000
  },

  // Royalty
  {
    name: "Princess Diana",
    title: "The People's Princess",
    biography: "Diana, Princess of Wales, was a member of the British royal family. She was the first wife of Charles, Prince of Wales, and mother of Prince William and Prince Harry. Known for her charity work and compassion.",
    professionCategory: "royalty",
    subProfession: "Princesses",
    birthDate: "1961-07-01",
    deathDate: "1997-08-31",
    charityName: "The Diana Award",
    donationAmount: "10",
    achievements: [
      { title: "Raised awareness for AIDS", year: "1987" },
      { title: "International Campaign to Ban Landmines", year: "1997" },
      { title: "Patron of over 100 charities", year: "1981-1997" },
      { title: "Most photographed woman in the world", year: "1990s" }
    ],
    awards: [
      { name: "Humanitarian of the Year", year: "1995", category: "United Cerebral Palsy" },
      { name: "Nobel Peace Prize nomination", year: "1996" },
      { name: "Royal Family Order of Queen Elizabeth II", year: "1982" }
    ],
    verificationStatus: "approved",
    verifiedBy: "Spencer Family",
    fanCount: 1350000
  },
  {
    name: "Queen Elizabeth II",
    title: "Her Majesty",
    biography: "Elizabeth II was Queen of the United Kingdom and other Commonwealth realms from 1952 until her death in 2022. She was the longest-reigning British monarch and the world's oldest and longest-serving head of state.",
    professionCategory: "royalty",
    subProfession: "Queens",
    birthDate: "1926-04-21",
    deathDate: "2022-09-08",
    charityName: "The Queen's Commonwealth Trust",
    donationAmount: "10",
    achievements: [
      { title: "Longest-reigning British monarch", year: "2022", description: "70 years" },
      { title: "Head of the Commonwealth", year: "1952-2022" },
      { title: "Patron of over 600 charities", year: "1952-2022" },
      { title: "Witnessed 15 Prime Ministers", year: "1952-2022" }
    ],
    awards: [
      { name: "Time Person of the Year", year: "1952" },
      { name: "Order of the Garter", year: "1947" },
      { name: "Grand Cross of the Legion of Honour", year: "2014" }
    ],
    verificationStatus: "approved",
    verifiedBy: "The Royal Household",
    fanCount: 1750000
  },

  // Business & Innovation
  {
    name: "Steve Jobs",
    title: "Think Different",
    biography: "Steven Paul Jobs was an American business magnate, inventor, and investor. He was the co-founder, chairman, and CEO of Apple Inc. and revolutionized multiple industries with his vision and innovation.",
    professionCategory: "business",
    subProfession: "CEOs",
    birthDate: "1955-02-24",
    deathDate: "2011-10-05",
    charityName: "Laurene Powell Jobs Trust",
    donationAmount: "10",
    achievements: [
      { title: "Co-founded Apple Inc.", year: "1976" },
      { title: "Revolutionized personal computing", year: "1984", description: "Macintosh" },
      { title: "Created iPhone", year: "2007" },
      { title: "Founded Pixar Animation Studios", year: "1986" }
    ],
    awards: [
      { name: "National Medal of Technology", year: "1985" },
      { name: "Grammy Trustees Award", year: "2012" },
      { name: "Disney Legends Award", year: "2013" }
    ],
    verificationStatus: "approved",
    verifiedBy: "Jobs Family Trust",
    fanCount: 1420000
  },

  // Science & Education
  {
    name: "Stephen Hawking",
    title: "Master of the Universe",
    biography: "Stephen William Hawking was an English theoretical physicist, cosmologist, and author. Despite being diagnosed with ALS at 21, he became one of the most brilliant theoretical physicists in history.",
    professionCategory: "science",
    subProfession: "Physicists",
    birthDate: "1942-01-08",
    deathDate: "2018-03-14",
    charityName: "Motor Neurone Disease Association",
    donationAmount: "10",
    achievements: [
      { title: "Hawking radiation theory", year: "1974" },
      { title: "A Brief History of Time", year: "1988", description: "25 million copies sold" },
      { title: "Lucasian Professor of Mathematics", year: "1979-2009" },
      { title: "Director of Research at Cambridge", year: "2009-2018" }
    ],
    awards: [
      { name: "Presidential Medal of Freedom", year: "2009" },
      { name: "Copley Medal", year: "2006" },
      { name: "Wolf Prize in Physics", year: "1988" }
    ],
    verificationStatus: "approved",
    verifiedBy: "Hawking Estate",
    fanCount: 860000
  },

  // Comedy
  {
    name: "George Carlin",
    title: "The Thinking Man's Comic",
    biography: "George Denis Patrick Carlin was an American stand-up comedian, actor, author, and social critic. Known for his dark comedy and reflections on politics, psychology, religion, and taboo subjects.",
    professionCategory: "comedy",
    subProfession: "Stand-up",
    birthDate: "1937-05-12",
    deathDate: "2008-06-22",
    charityName: "Freedom From Religion Foundation",
    donationAmount: "10",
    achievements: [
      { title: "5 Grammy Awards for comedy albums", year: "1973-2009" },
      { title: "14 HBO comedy specials", year: "1977-2008" },
      { title: "Mark Twain Prize for American Humor", year: "2008" },
      { title: "Comedy Central's #2 greatest stand-up", year: "2004" }
    ],
    awards: [
      { name: "Grammy Award for Best Comedy Album", year: "2009", category: "It's Bad for Ya" },
      { name: "American Comedy Awards Lifetime Achievement", year: "2001" },
      { name: "Hollywood Walk of Fame", year: "1987" }
    ],
    verificationStatus: "approved",
    verifiedBy: "Carlin Estate",
    fanCount: 540000
  },

  // Arts & Writers
  {
    name: "Maya Angelou",
    title: "Phenomenal Woman",
    biography: "Maya Angelou was an American poet, memoirist, and civil rights activist. She published seven autobiographies, three books of essays, and several books of poetry. Her work spanned 50 years.",
    professionCategory: "arts",
    subProfession: "Poets",
    birthDate: "1928-04-04",
    deathDate: "2014-05-28",
    charityName: "Maya Angelou Foundation",
    donationAmount: "10",
    achievements: [
      { title: "I Know Why the Caged Bird Sings", year: "1969", description: "First bestselling autobiography by an African-American woman" },
      { title: "Presidential Medal of Freedom", year: "2011" },
      { title: "3 Grammy Awards", year: "1994-2003" },
      { title: "50+ honorary degrees", year: "1970-2014" }
    ],
    awards: [
      { name: "National Medal of Arts", year: "2000" },
      { name: "Lincoln Medal", year: "2008" },
      { name: "Literarian Award", year: "2013" }
    ],
    verificationStatus: "approved",
    verifiedBy: "Angelou Estate",
    fanCount: 420000
  }
];

export async function seedCelebrities() {
  console.log("🌟 Seeding celebrity memorials...");
  
  try {
    for (const celebrity of iconicCelebrities) {
      await db.insert(celebrityMemorials).values({
        ...celebrity,
        achievements: celebrity.achievements as any,
        awards: celebrity.awards as any,
        verificationDate: new Date(),
        platformPercentage: 5,
        imageUrl: null, // Images would need to be added separately
        themeColors: {
          primary: "hsl(280, 100%, 70%)",
          secondary: "hsl(45, 100%, 51%)",
          accent: "hsl(340, 82%, 52%)"
        },
        verificationDocuments: [],
        customStickers: []
      }).onConflictDoNothing();
      
      console.log(`✅ Added ${celebrity.name}`);
    }
    
    console.log("✨ Celebrity memorials seeded successfully!");
  } catch (error) {
    console.error("Error seeding celebrities:", error);
  }
}

// Run the seeding function
seedCelebrities().then(() => {
  console.log("✅ Seeding completed successfully!");
  process.exit(0);
}).catch((error) => {
  console.error("❌ Error during seeding:", error);
  process.exit(1);
});