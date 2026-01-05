import ADNIntro from '@/components/common/Landing/AdnIntro'
import HeroSection from '@/components/common/Landing/Hero'
import OurPurpose from '@/components/common/Landing/OurPurpose'
import Volunteering from '@/components/common/Landing/Volunteering'
export default function Home() {
  return (
    <>
      <HeroSection />
      <ADNIntro />
      <Volunteering />
      <OurPurpose />
      {/* <HistorySection /> */}
    </>
  )
}
