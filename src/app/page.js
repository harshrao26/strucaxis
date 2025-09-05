import React from 'react'
import Hero from "@/components/Hero"
import AboutSection from '@/components/AboutSection'
import Milestones from '@/components/Milestones'
import ContactCta from '@/components/ContactCta'
import Testimonials from "@/components/Testimonials"
import CardCaroursalDemo from "@/components/CardCaroursalDemo"
import FeaturedServices from "@/components/FeaturedServices"
import StepsSection from "@/components/StepsSection"
import TeamSection from "@/components/TeamSection"
import {LogoCarouselDemo} from "@/components/LogoCarouselDemo"
import {AppleCardsCarouselDemo} from "@/components/AppleCardsCarouselDemo"
const page = () => {
  return (
    <div>
      
      <Hero/>
      <LogoCarouselDemo/>

      <AboutSection/>
      <FeaturedServices/>
      <Milestones/>
      <CardCaroursalDemo/>
      {/* <AppleCardsCarouselDemo/> */}
      <Testimonials/>
{/* <TeamSection/> */}
<StepsSection/>



      <ContactCta/>


    </div>
  )
}

export default page