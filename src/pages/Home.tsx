import ADNIntro from '@/components/common/Landing/AdnIntro'
import HeroSection from '@/components/common/Landing/Hero'
import OurPurpose from '@/components/common/Landing/OurPurpose'
import Volunteering from '@/components/common/Landing/Volunteering'
import LiveSection from '@/components/common/Landing/LiveSection'
import PredicasRecientes from '@/components/common/Landing/PredicasRecientes'
import SEO from '@/components/common/SEO'

export default function Home() {
  return (
    <>
      <SEO />
      <HeroSection />
      <ADNIntro />
      <Volunteering />
      <OurPurpose />
      <LiveSection />
      <PredicasRecientes />
      {/* <HistorySection /> */}
    </>
  )
}
