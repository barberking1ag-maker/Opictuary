import CelebrityMemorialCard from '../CelebrityMemorialCard';

export default function CelebrityMemorialCardExample() {
  return (
    <div className="p-6 grid gap-6 md:grid-cols-2 max-w-4xl">
      <CelebrityMemorialCard 
        name="Queen Elizabeth II"
        title="Queen of the United Kingdom (1926-2022)"
        charityName="The Queen's Commonwealth Trust"
        donationAmount={10}
        fanCount={125847}
        onDonate={() => console.log('Donate to unlock clicked')}
      />
      
      <CelebrityMemorialCard 
        name="Kobe Bryant"
        title="NBA Legend & Philanthropist (1978-2020)"
        charityName="Mamba & Mambacita Sports Foundation"
        donationAmount={10}
        fanCount={98432}
        isUnlocked={true}
        onView={() => console.log('View memorial clicked')}
      />
    </div>
  );
}
