import React from 'react'
import Hero from "@/components/Hero"
import AboutSection from '@/components/AboutSection'
import Milestones from '@/components/Milestones'
import ContactCta from '@/components/ContactCta'
import Testimonials from "@/components/Testimonials"
import CardCaroursalDemo from "@/components/CardCaroursalDemo"
import FeaturedServices from "@/components/FeaturedServices"
import ProjectsShowcase from "@/components/ProjectsShowcase"
import StepsSection from "@/components/StepsSection"
import TeamSection from "@/components/TeamSection"
import {LogoCarouselDemo} from "@/components/LogoCarouselDemo"
import {AppleCardsCarouselDemo} from "@/components/AppleCardsCarouselDemo"
import Link from 'next/link'
const page = () => {
  return (
    <div>
      <div className="fixed bottom-5 z-10 right-5">
        <Link href="/contact-us#project-form">
          <button className="px-4 py-2 bg-black  text-white rounded-full shadow-md hover:bg-black  transition">
            Start Project
          </button>
        </Link>
      </div>

      
      <Hero/>
      <LogoCarouselDemo/>

      <AboutSection/>
      <FeaturedServices/>
      <Milestones/>
      <CardCaroursalDemo/>
      {/* <AppleCardsCarouselDemo/> */}
      <ProjectsShowcase/>
{/* <TeamSection/> */}
<StepsSection/>
      <Testimonials/>



      <ContactCta/>


    </div>
  )
}

export default page