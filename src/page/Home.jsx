import React from 'react'
import LandingPic from '../Components/Landing/LandingPic'
import Reason from '../Components/Landing/Reason'
import LessonPopular from '../Components/Landing/PopularLesson'
import Footer from '../Components/Footer/Footer'

const Home = () => {
  return (
    <>
    <LandingPic/>
    <Reason/>
    <LessonPopular/>
    </>
  )
}

export default Home