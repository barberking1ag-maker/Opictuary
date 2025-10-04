import MemorialHero from '../MemorialHero';

export default function MemorialHeroExample() {
  return (
    <MemorialHero 
      name="Margaret Rose Johnson"
      birthDate="March 15, 1945"
      deathDate="September 28, 2024"
      onEnterCode={() => console.log('Enter code clicked')}
      onShare={() => console.log('Share clicked')}
    />
  );
}
