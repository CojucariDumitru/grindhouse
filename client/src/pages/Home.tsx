import { Hero } from '../components/home/Hero';
import { MarqueeStrip } from '../components/home/MarqueeStrip';
import { FeaturedItems } from '../components/home/FeaturedItems';
import { StorySection } from '../components/home/StorySection';
import { GalleryStrip } from '../components/home/GalleryStrip';
import { LocationSection } from '../components/home/LocationSection';

export default function Home() {
  return (
    <>
      <Hero />
      <MarqueeStrip />
      <FeaturedItems />
      <StorySection />
      <GalleryStrip />
      <LocationSection />
    </>
  );
}
